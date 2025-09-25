/**
 * Integration Tests for Complete Lobby Workflow
 * Tests end-to-end scenarios involving multiple managers working together
 */

const ChannelManager = require('../../src/managers/ChannelManager');
const PlayerManager = require('../../src/managers/PlayerManager');
const LobbyManager = require('../../src/managers/LobbyManager');
const MessageHandler = require('../../src/handlers/MessageHandler');
const { createSilentLogger } = require('../utils/TestLogger');
const { MockWebSocket, createMockClientPair } = require('../utils/MockWebSocket');
const { LOBBY_STATUS, PLAYER_ROLES, ACTIONS, EVENTS } = require('../../src/config/constants');
const {
  TestAssertions,
  TestDataGenerator,
  TestRunner,
  wait
} = require('../utils/TestHelpers');

/**
 * Test complete lobby workflow integration
 */
async function testLobbyWorkflow() {
  const logger = createSilentLogger('LobbyWorkflowTest');
  const runner = new TestRunner(logger);

  // Test 1: Complete lobby creation and joining workflow
  runner.addTest('Complete lobby creation and joining workflow', async (cleanup) => {
    // Setup integrated system
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);
    const messageHandler = new MessageHandler(logger, channelManager, playerManager, lobbyManager);

    // Create mock clients
    const { clients } = createMockClientPair(3);
    const [hostClient, playerClient, spectatorClient] = clients;

    // Initialize clients
    for (const client of clients) {
      channelManager.initClient(client);
    }

    await wait(10); // Wait for connections

    // Step 1: Host creates lobby
    const hostId = TestDataGenerator.generatePlayerId('host');
    playerManager.updatePing(hostId, hostClient);

    const createMessage = TestDataGenerator.generateWebSocketMessage(ACTIONS.CREATE_LOBBY, { hostId });
    await messageHandler.handleMessage(hostClient, createMessage);

    // Verify host received lobby created event
    TestAssertions.assertTrue(hostClient.getSentMessages().length > 0, 'Host should receive lobby created message');

    const hostResponse = JSON.parse(hostClient.getSentMessages()[0].data);
    TestAssertions.assertEquals(hostResponse.action, EVENTS.LOBBY_CREATED, 'Should receive lobby created event');

    const lobbyCode = hostResponse.payload.code;
    TestAssertions.assertNotNull(lobbyCode, 'Lobby code should be provided');

    // Step 2: Player joins lobby
    const playerId = TestDataGenerator.generatePlayerId('player');
    playerManager.updatePing(playerId, playerClient);

    const joinMessage = TestDataGenerator.generateWebSocketMessage(ACTIONS.JOIN_LOBBY, {
      playerId,
      lobbyCode,
      role: PLAYER_ROLES.PLAYER
    });

    hostClient.clearSentMessages();
    await messageHandler.handleMessage(playerClient, joinMessage);

    // Verify both clients received join event
    TestAssertions.assertTrue(playerClient.getSentMessages().length > 0, 'Player should receive join confirmation');
    TestAssertions.assertTrue(hostClient.getSentMessages().length > 0, 'Host should receive join notification');

    // The joining player receives a direct response (second message) with lobby details
    TestAssertions.assertTrue(playerClient.getSentMessages().length >= 2, 'Player should receive both broadcast and direct response');
    const playerResponse = JSON.parse(playerClient.getSentMessages()[1].data); // Direct response from MessageHandler
    TestAssertions.assertEquals(playerResponse.action, EVENTS.LOBBY_JOINED, 'Player should receive lobby joined event');
    TestAssertions.assertEquals(playerResponse.payload.lobby.status, LOBBY_STATUS.READY, 'Lobby should be ready with 2 players');

    // Step 3: Spectator joins
    const spectatorId = TestDataGenerator.generatePlayerId('spectator');
    playerManager.updatePing(spectatorId, spectatorClient);

    const spectatorJoinMessage = TestDataGenerator.generateWebSocketMessage(ACTIONS.JOIN_LOBBY, {
      playerId: spectatorId,
      lobbyCode,
      role: PLAYER_ROLES.PLAYER // Will be converted to spectator since players full
    });

    // Clear previous messages
    hostClient.clearSentMessages();
    playerClient.clearSentMessages();

    await messageHandler.handleMessage(spectatorClient, spectatorJoinMessage);

    // Verify spectator joined as spectator
    // Spectator receives both channel broadcast and direct response - use direct response (last message)
    TestAssertions.assertTrue(spectatorClient.getSentMessages().length >= 2, 'Spectator should receive both messages');
    const spectatorResponse = JSON.parse(spectatorClient.getSentMessages()[1].data); // Direct response
    TestAssertions.assertEquals(spectatorResponse.payload.role, PLAYER_ROLES.SPECTATOR, 'Should join as spectator when players full');

    // Step 4: Verify lobby state
    const lobbyInfoMessage = TestDataGenerator.generateWebSocketMessage(ACTIONS.GET_LOBBY_INFO, {
      lobbyCode,
      requesterId: hostId
    });

    hostClient.clearSentMessages();
    await messageHandler.handleMessage(hostClient, lobbyInfoMessage);

    const lobbyInfoResponse = JSON.parse(hostClient.getSentMessages()[0].data);
    TestAssertions.assertEquals(lobbyInfoResponse.payload.lobby.players.length, 2, 'Should have 2 active players');
    TestAssertions.assertEquals(lobbyInfoResponse.payload.lobby.spectators.length, 1, 'Should have 1 spectator');
    TestAssertions.assertTrue(lobbyInfoResponse.payload.isHost, 'Host should be identified correctly');
  });

  // Test 2: Match workflow with spectators
  runner.addTest('Match workflow with spectators', async (cleanup) => {
    // Setup system
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);
    const messageHandler = new MessageHandler(logger, channelManager, playerManager, lobbyManager);

    // Create and setup lobby with 2 players + 1 spectator
    const { clients } = createMockClientPair(3);
    const [hostClient, playerClient, spectatorClient] = clients;

    for (const client of clients) {
      channelManager.initClient(client);
    }

    const hostId = TestDataGenerator.generatePlayerId('host');
    const playerId = TestDataGenerator.generatePlayerId('player');
    const spectatorId = TestDataGenerator.generatePlayerId('spectator');

    playerManager.updatePing(hostId, hostClient);
    playerManager.updatePing(playerId, playerClient);
    playerManager.updatePing(spectatorId, spectatorClient);

    await wait(10);

    // Quick setup: create lobby and join players
    const lobbyResult = lobbyManager.createLobby(hostId);
    lobbyManager.joinLobby(playerId, lobbyResult.lobby.code);
    lobbyManager.joinLobby(spectatorId, lobbyResult.lobby.code, PLAYER_ROLES.SPECTATOR);

    // Subscribe all to lobby channel
    channelManager.subscribe(hostClient, `lobby_${lobbyResult.lobby.code}`);
    channelManager.subscribe(playerClient, `lobby_${lobbyResult.lobby.code}`);
    channelManager.subscribe(spectatorClient, `lobby_${lobbyResult.lobby.code}`);

    // Start match
    const startMatchMessage = TestDataGenerator.generateWebSocketMessage(ACTIONS.START_MATCH, { hostId });
    await messageHandler.handleMessage(hostClient, startMatchMessage);

    // Verify all clients received match started event
    await wait(10);
    TestAssertions.assertTrue(hostClient.getSentMessages().length > 0, 'Host should receive match started');
    TestAssertions.assertTrue(playerClient.getSentMessages().length > 0, 'Player should receive match started');
    TestAssertions.assertTrue(spectatorClient.getSentMessages().length > 0, 'Spectator should receive match started');


    // Host receives both channel broadcast and direct response - use direct response (should be last)
    const hostMessages = hostClient.getSentMessages();
    const hostMatchResponse = JSON.parse(hostMessages[hostMessages.length - 1].data);
    TestAssertions.assertEquals(hostMatchResponse.action, EVENTS.MATCH_STARTED, 'Should receive match started event');

    const matchId = hostMatchResponse.payload.match.id;
    TestAssertions.assertNotNull(matchId, 'Match ID should be provided');

    // End match with winner
    const endMatchMessage = TestDataGenerator.generateWebSocketMessage(ACTIONS.END_MATCH, {
      matchId,
      winner: hostId
    });

    // Clear previous messages
    for (const client of clients) {
      client.clearSentMessages();
    }

    await messageHandler.handleMessage(hostClient, endMatchMessage);

    // Verify all clients received match ended event
    await wait(10);
    for (const client of clients) {
      TestAssertions.assertTrue(client.getSentMessages().length > 0, 'All clients should receive match ended event');
      const message = JSON.parse(client.getSentMessages()[0].data);
      // Messages from channels have format: { channel: "lobby_code", payload: { action: "event", payload: {...} } }
      const response = message.payload;
      TestAssertions.assertEquals(response.action, EVENTS.MATCH_ENDED, 'Should receive match ended event');
      TestAssertions.assertEquals(response.payload.match.winner, hostId, 'Winner should be recorded correctly');
    }
  });

  // Test 3: Host transfer and cleanup workflow
  runner.addTest('Host transfer and cleanup workflow', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);
    const messageHandler = new MessageHandler(logger, channelManager, playerManager, lobbyManager);

    const { clients } = createMockClientPair(2);
    const [hostClient, playerClient] = clients;

    for (const client of clients) {
      channelManager.initClient(client);
    }

    const hostId = TestDataGenerator.generatePlayerId('host');
    const playerId = TestDataGenerator.generatePlayerId('player');

    playerManager.updatePing(hostId, hostClient);
    playerManager.updatePing(playerId, playerClient);

    await wait(10);

    // Create lobby and join player
    const lobbyResult = lobbyManager.createLobby(hostId);
    const lobbyCode = lobbyResult.lobby.code;
    lobbyManager.joinLobby(playerId, lobbyCode);

    // Subscribe to lobby channels
    channelManager.subscribe(hostClient, `lobby_${lobbyCode}`);
    channelManager.subscribe(playerClient, `lobby_${lobbyCode}`);

    // Host leaves (should transfer host to player)
    const leaveMessage = TestDataGenerator.generateWebSocketMessage(ACTIONS.LEAVE_LOBBY, { playerId: hostId });
    await messageHandler.handleMessage(hostClient, leaveMessage);

    // Verify host transfer
    const lobbyInfo = lobbyManager.getLobbyInfo(lobbyCode);
    TestAssertions.assertTrue(lobbyInfo.success, 'Should be able to get lobby info');
    TestAssertions.assertEquals(lobbyInfo.lobby.host, playerId, 'Host should be transferred to remaining player');
    TestAssertions.assertArrayNotContains(lobbyInfo.lobby.players, hostId, 'Original host should be removed');

    // New host (former player) leaves (should close lobby)
    const finalLeaveMessage = TestDataGenerator.generateWebSocketMessage(ACTIONS.LEAVE_LOBBY, { playerId });
    await messageHandler.handleMessage(playerClient, finalLeaveMessage);

    // Verify lobby is closed
    const finalLobbyInfo = lobbyManager.getLobbyInfo(lobbyCode);
    TestAssertions.assertFalse(finalLobbyInfo.success, 'Lobby should be closed when last player leaves');

    const stats = lobbyManager.getStats();
    TestAssertions.assertEquals(stats.totalLobbies, 0, 'Should have no active lobbies after cleanup');
  });

  // Test 4: Chat integration workflow
  runner.addTest('Chat integration workflow', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);
    const messageHandler = new MessageHandler(logger, channelManager, playerManager, lobbyManager);

    const { clients } = createMockClientPair(3);
    for (const client of clients) {
      channelManager.initClient(client);
    }

    const playerIds = TestDataGenerator.generatePlayerIds(3);
    for (let i = 0; i < 3; i++) {
      playerManager.updatePing(playerIds[i], clients[i]);
    }

    await wait(10);

    // Setup lobby with all players
    const lobbyResult = lobbyManager.createLobby(playerIds[0]);
    const lobbyCode = lobbyResult.lobby.code;
    lobbyManager.joinLobby(playerIds[1], lobbyCode);
    lobbyManager.joinLobby(playerIds[2], lobbyCode, PLAYER_ROLES.SPECTATOR);

    // Subscribe all to lobby channel
    for (const client of clients) {
      channelManager.subscribe(client, `lobby_${lobbyCode}`);
    }

    // Send chat messages
    const chatMessages = [
      'Hello everyone!',
      'Ready to play?',
      'Good luck!'
    ];

    for (let i = 0; i < chatMessages.length; i++) {
      const chatMessage = TestDataGenerator.generateWebSocketMessage(ACTIONS.LOBBY_CHAT, {
        playerId: playerIds[i],
        message: chatMessages[i]
      });

      // Clear previous messages
      for (const client of clients) {
        client.clearSentMessages();
      }

      await messageHandler.handleMessage(clients[i], chatMessage);
      await wait(10);

      // Verify all clients received the chat message
      for (const client of clients) {
        TestAssertions.assertTrue(client.getSentMessages().length > 0, `All clients should receive chat message ${i + 1}`);
        const message = JSON.parse(client.getSentMessages()[0].data);
        const response = message.payload;
        TestAssertions.assertEquals(response.action, EVENTS.LOBBY_CHAT_MESSAGE, 'Should receive chat message event');
        TestAssertions.assertEquals(response.payload.message, chatMessages[i], 'Chat message content should match');
        TestAssertions.assertEquals(response.payload.playerId, playerIds[i], 'Chat sender should be correct');
      }
    }

    // Verify chat history is stored
    const lobbyInfo = lobbyManager.getLobbyInfo(lobbyCode);
    TestAssertions.assertEquals(lobbyInfo.lobby.chatHistory.length, 3, 'All chat messages should be stored in history');

    for (let i = 0; i < chatMessages.length; i++) {
      TestAssertions.assertEquals(lobbyInfo.lobby.chatHistory[i].message, chatMessages[i], `Chat history ${i + 1} should match`);
      TestAssertions.assertEquals(lobbyInfo.lobby.chatHistory[i].playerId, playerIds[i], `Chat sender ${i + 1} should be recorded`);
    }
  });

  // Test 5: Error handling integration
  runner.addTest('Error handling integration', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);
    const messageHandler = new MessageHandler(logger, channelManager, playerManager, lobbyManager);

    const client = new MockWebSocket();
    channelManager.initClient(client);
    await wait(10);

    // Test various error scenarios through message handler
    const errorScenarios = [
      {
        name: 'Invalid JSON',
        message: '{ invalid json',
        expectedError: true
      },
      {
        name: 'Missing action',
        message: JSON.stringify({ payload: {} }),
        expectedError: true
      },
      {
        name: 'Unknown action',
        message: JSON.stringify({ action: 'unknown_action', payload: {} }),
        expectedError: true
      },
      {
        name: 'Create lobby without host ID',
        message: JSON.stringify({ action: ACTIONS.CREATE_LOBBY, payload: {} }),
        expectedError: true
      },
      {
        name: 'Join non-existent lobby',
        message: JSON.stringify({
          action: ACTIONS.JOIN_LOBBY,
          payload: { playerId: 'test', lobbyCode: 'INVALID' }
        }),
        expectedError: true
      }
    ];

    for (const scenario of errorScenarios) {
      client.clearSentMessages();

      try {
        await messageHandler.handleMessage(client, scenario.message);
      } catch (error) {
        // Some scenarios might throw, others send error responses
      }

      if (scenario.expectedError) {
        // For invalid JSON, no response is sent. For others, error responses should be sent
        if (scenario.name !== 'Invalid JSON') {
          TestAssertions.assertTrue(client.getSentMessages().length > 0,
            `${scenario.name} should send error response`);

          const response = JSON.parse(client.getSentMessages()[0].data);
          TestAssertions.assertEquals(response.action, EVENTS.ERROR,
            `${scenario.name} should send error event`);
        }
      }
    }
  });

  // Test 6: Concurrent operations integration
  runner.addTest('Concurrent operations integration', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);
    const messageHandler = new MessageHandler(logger, channelManager, playerManager, lobbyManager);

    // Create multiple lobbies concurrently
    const numLobbies = 5;
    const clients = [];
    const hostIds = [];

    for (let i = 0; i < numLobbies; i++) {
      const client = new MockWebSocket();
      channelManager.initClient(client);
      clients.push(client);

      const hostId = TestDataGenerator.generatePlayerId(`host${i}`);
      playerManager.updatePing(hostId, client);
      hostIds.push(hostId);
    }

    await wait(20);

    // Create lobbies concurrently
    const createPromises = hostIds.map((hostId, i) => {
      const message = TestDataGenerator.generateWebSocketMessage(ACTIONS.CREATE_LOBBY, { hostId });
      return messageHandler.handleMessage(clients[i], message);
    });

    await Promise.all(createPromises);

    // Verify all lobbies were created
    const stats = lobbyManager.getStats();
    TestAssertions.assertEquals(stats.totalLobbies, numLobbies, `Should have ${numLobbies} lobbies created`);
    TestAssertions.assertEquals(stats.totalPlayers, numLobbies, `Should have ${numLobbies} players (hosts)`);

    // Verify each client received their lobby creation confirmation
    for (const client of clients) {
      TestAssertions.assertTrue(client.getSentMessages().length > 0, 'Each client should receive lobby created event');
      const response = JSON.parse(client.getSentMessages()[0].data);
      TestAssertions.assertEquals(response.action, EVENTS.LOBBY_CREATED, 'Should receive lobby created event');
    }
  });

  return await runner.runAll();
}

// Export test function
module.exports = testLobbyWorkflow;

// Run tests if this file is executed directly
if (require.main === module) {
  testLobbyWorkflow().then(results => {
    process.exit(results.failed > 0 ? 1 : 0);
  }).catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}
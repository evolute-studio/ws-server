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
    playerManager.updatePing(hostClient, hostId);

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
    playerManager.updatePing(playerClient, playerId);

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
    playerManager.updatePing(spectatorClient, spectatorId);

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

  // Test 2: Role change workflow with spectators
  runner.addTest('Role change workflow with spectators', async (cleanup) => {
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

    playerManager.updatePing(hostClient, hostId);
    playerManager.updatePing(playerClient, playerId);
    playerManager.updatePing(spectatorClient, spectatorId);

    await wait(10);

    // Quick setup: create lobby and join players
    const lobbyResult = await lobbyManager.createLobby(hostClient);
    await lobbyManager.joinLobby(playerClient, lobbyResult.lobby.code);
    await lobbyManager.joinLobby(spectatorClient, lobbyResult.lobby.code, PLAYER_ROLES.SPECTATOR);

    // Subscribe all to lobby channel
    channelManager.subscribe(hostClient, `lobby_${lobbyResult.lobby.code}`);
    channelManager.subscribe(playerClient, `lobby_${lobbyResult.lobby.code}`);
    channelManager.subscribe(spectatorClient, `lobby_${lobbyResult.lobby.code}`);

    // Test role changes
    // Player changes from player to spectator
    const changeToSpectatorMessage = TestDataGenerator.generateWebSocketMessage(ACTIONS.CHANGE_ROLE, {
      playerId,
      newRole: PLAYER_ROLES.SPECTATOR
    });
    await messageHandler.handleMessage(playerClient, changeToSpectatorMessage);

    // Verify all clients received role change event
    await wait(10);
    TestAssertions.assertTrue(hostClient.getSentMessages().length > 0, 'Host should receive role change');
    TestAssertions.assertTrue(playerClient.getSentMessages().length > 0, 'Player should receive role change confirmation');
    TestAssertions.assertTrue(spectatorClient.getSentMessages().length > 0, 'Spectator should receive role change');

    // Player receives direct response confirming role change
    const playerMessages = playerClient.getSentMessages();
    const playerRoleResponse = JSON.parse(playerMessages[playerMessages.length - 1].data);
    TestAssertions.assertEquals(playerRoleResponse.action, EVENTS.ROLE_CHANGED, 'Should receive role changed event');
    TestAssertions.assertEquals(playerRoleResponse.payload.newRole, PLAYER_ROLES.SPECTATOR, 'New role should be spectator');

    // Clear previous messages and change spectator to player
    for (const client of clients) {
      client.clearSentMessages();
    }

    const changeToPlayerMessage = TestDataGenerator.generateWebSocketMessage(ACTIONS.CHANGE_ROLE, {
      playerId: spectatorId,
      newRole: PLAYER_ROLES.PLAYER
    });
    await messageHandler.handleMessage(spectatorClient, changeToPlayerMessage);

    // Verify all clients received second role change event
    await wait(10);
    for (const client of clients) {
      TestAssertions.assertTrue(client.getSentMessages().length > 0, 'All clients should receive role change event');
      const message = JSON.parse(client.getSentMessages()[0].data);
      // Messages from channels have format: { channel: "lobby_code", payload: { action: "event", payload: {...} } }
      const response = message.payload;
      TestAssertions.assertEquals(response.action, EVENTS.ROLE_CHANGED, 'Should receive role changed event');
      TestAssertions.assertEquals(response.payload.newRole, PLAYER_ROLES.PLAYER, 'New role should be player');
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

    playerManager.updatePing(hostClient, hostId);
    playerManager.updatePing(playerClient, playerId);

    await wait(10);

    // Create lobby and join player
    const lobbyResult = await lobbyManager.createLobby(hostClient);
    const lobbyCode = lobbyResult.lobby.code;
    await lobbyManager.joinLobby(playerClient, lobbyCode);

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
      playerManager.updatePing(clients[i], playerIds[i]);
    }

    await wait(10);

    // Setup lobby with all players
    const lobbyResult = await lobbyManager.createLobby(clients[0]);
    const lobbyCode = lobbyResult.lobby.code;
    await lobbyManager.joinLobby(clients[1], lobbyCode);
    await lobbyManager.joinLobby(clients[2], lobbyCode, PLAYER_ROLES.SPECTATOR);

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
      playerManager.updatePing(client, hostId);
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
/**
 * Unit Tests for LobbyManager
 * Tests lobby creation, joining, invitations, matches, and all lobby functionality
 */

const LobbyManager = require('../../src/managers/LobbyManager');
const PlayerManager = require('../../src/managers/PlayerManager');
const ChannelManager = require('../../src/managers/ChannelManager');
const { createSilentLogger } = require('../utils/TestLogger');
const { MockWebSocket, createMockClientPair } = require('../utils/MockWebSocket');
const { LOBBY_STATUS, PLAYER_ROLES, ERROR_TYPES } = require('../../src/config/constants');
const {
  TestAssertions,
  TestDataGenerator,
  TestRunner,
  wait,
  createTestPlayer,
  createTestLobby
} = require('../utils/TestHelpers');

/**
 * Test LobbyManager functionality
 */
async function testLobbyManager() {
  const logger = createSilentLogger('LobbyManagerTest');
  const runner = new TestRunner(logger);

  // Test 1: Initialization
  runner.addTest('LobbyManager initialization', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);

    TestAssertions.assertNotNull(lobbyManager, 'LobbyManager should be created');
    TestAssertions.assertTrue(lobbyManager instanceof LobbyManager, 'Should be LobbyManager instance');

    const stats = lobbyManager.getStats();
    TestAssertions.assertEquals(stats.totalLobbies, 0, 'Should start with 0 lobbies');
    TestAssertions.assertEquals(stats.totalPlayers, 0, 'Should start with 0 lobby players');
  });

  // Test 2: Lobby code generation
  runner.addTest('Lobby code generation', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);

    const codes = new Set();

    // Generate multiple codes to test uniqueness
    for (let i = 0; i < 100; i++) {
      const code = lobbyManager.generateLobbyCode();
      TestAssertions.assertEquals(code.length, 6, 'Code should be 6 characters');
      TestAssertions.assertTrue(/^[A-Z0-9]+$/.test(code), 'Code should contain only A-Z and 0-9');
      TestAssertions.assertFalse(codes.has(code), 'Codes should be unique');
      codes.add(code);
    }
  });

  // Test 3: Lobby creation
  runner.addTest('Lobby creation', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);

    const hostId = createTestPlayer(playerManager);

    const result = lobbyManager.createLobby(hostId);

    TestAssertions.assertSuccessResult(result, 'Lobby creation should succeed');
    TestAssertions.assertLobbyStructure(result.lobby, 'Created lobby should have valid structure');
    TestAssertions.assertEquals(result.lobby.host, hostId, 'Host should be set correctly');
    TestAssertions.assertEquals(result.lobby.status, LOBBY_STATUS.WAITING, 'New lobby should be in waiting status');
    TestAssertions.assertArrayContains(result.lobby.players, hostId, 'Host should be in players list');
    TestAssertions.assertEquals(result.lobby.spectators.length, 0, 'No spectators initially');

    const stats = lobbyManager.getStats();
    TestAssertions.assertEquals(stats.totalLobbies, 1, 'Should have 1 lobby after creation');
    TestAssertions.assertEquals(stats.totalPlayers, 1, 'Should have 1 player in lobbies');
  });

  // Test 4: Lobby creation validation
  runner.addTest('Lobby creation validation', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);

    const hostId = createTestPlayer(playerManager);

    // Create first lobby successfully
    const firstResult = lobbyManager.createLobby(hostId);
    TestAssertions.assertSuccessResult(firstResult, 'First lobby creation should succeed');

    // Try to create second lobby with same host (should fail)
    const secondResult = lobbyManager.createLobby(hostId);
    TestAssertions.assertErrorResult(secondResult, ERROR_TYPES.ALREADY_IN_LOBBY, 'Second lobby creation should fail');

    // Try to create lobby with offline player (should fail)
    const offlineResult = lobbyManager.createLobby('offline_player');
    TestAssertions.assertErrorResult(offlineResult, ERROR_TYPES.PLAYER_NOT_FOUND, 'Offline player lobby creation should fail');
  });

  // Test 5: Joining lobby as player
  runner.addTest('Joining lobby as player', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);

    const hostId = createTestPlayer(playerManager);
    const playerId = createTestPlayer(playerManager);

    // Create lobby
    const createResult = lobbyManager.createLobby(hostId);
    const lobbyCode = createResult.lobby.code;

    // Join as player
    const joinResult = lobbyManager.joinLobby(playerId, lobbyCode, PLAYER_ROLES.PLAYER);

    TestAssertions.assertSuccessResult(joinResult, 'Joining lobby should succeed');
    TestAssertions.assertEquals(joinResult.role, PLAYER_ROLES.PLAYER, 'Role should be player');
    TestAssertions.assertArrayContains(joinResult.lobby.players, playerId, 'Player should be in players list');
    TestAssertions.assertEquals(joinResult.lobby.status, LOBBY_STATUS.READY, 'Lobby should be ready with 2 players');

    const stats = lobbyManager.getStats();
    TestAssertions.assertEquals(stats.totalPlayers, 2, 'Should have 2 players in lobbies');
  });

  // Test 6: Joining lobby as spectator
  runner.addTest('Joining lobby as spectator', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);

    const hostId = createTestPlayer(playerManager);
    const playerId = createTestPlayer(playerManager);
    const spectatorId = createTestPlayer(playerManager);

    // Create lobby with 2 players (full)
    const createResult = lobbyManager.createLobby(hostId);
    lobbyManager.joinLobby(playerId, createResult.lobby.code, PLAYER_ROLES.PLAYER);

    // Try to join as third player (should become spectator)
    const joinResult = lobbyManager.joinLobby(spectatorId, createResult.lobby.code, PLAYER_ROLES.PLAYER);

    TestAssertions.assertSuccessResult(joinResult, 'Joining full lobby should succeed as spectator');
    TestAssertions.assertEquals(joinResult.role, PLAYER_ROLES.SPECTATOR, 'Role should be spectator when players full');
    TestAssertions.assertArrayContains(joinResult.lobby.spectators, spectatorId, 'Should be in spectators list');
    TestAssertions.assertEquals(joinResult.lobby.players.length, 2, 'Players count should remain 2');
  });

  // Test 7: Leaving lobby
  runner.addTest('Leaving lobby', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);

    const hostId = createTestPlayer(playerManager);
    const playerId = createTestPlayer(playerManager);

    // Create lobby and join
    const createResult = lobbyManager.createLobby(hostId);
    const lobbyCode = createResult.lobby.code;
    lobbyManager.joinLobby(playerId, lobbyCode);

    // Player leaves
    const leaveResult = lobbyManager.leaveLobby(playerId);

    TestAssertions.assertSuccessResult(leaveResult, 'Leaving lobby should succeed');
    TestAssertions.assertArrayNotContains(leaveResult.lobby.players, playerId, 'Player should not be in players list');
    TestAssertions.assertEquals(leaveResult.lobby.status, LOBBY_STATUS.WAITING, 'Lobby should be waiting with 1 player');

    const stats = lobbyManager.getStats();
    TestAssertions.assertEquals(stats.totalPlayers, 1, 'Should have 1 player in lobbies after leave');
  });

  // Test 8: Host leaving and transfer
  runner.addTest('Host leaving and transfer', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);

    const hostId = createTestPlayer(playerManager);
    const playerId = createTestPlayer(playerManager);

    // Create lobby and join
    const createResult = lobbyManager.createLobby(hostId);
    const lobbyCode = createResult.lobby.code;
    lobbyManager.joinLobby(playerId, lobbyCode);

    // Host leaves
    const leaveResult = lobbyManager.leaveLobby(hostId);

    TestAssertions.assertSuccessResult(leaveResult, 'Host leaving should succeed');
    TestAssertions.assertEquals(leaveResult.lobby.host, playerId, 'Host should be transferred to remaining player');
    TestAssertions.assertArrayNotContains(leaveResult.lobby.players, hostId, 'Original host should not be in players');
    TestAssertions.assertArrayContains(leaveResult.lobby.players, playerId, 'New host should remain in players');
  });

  // Test 9: Lobby closure when last player leaves
  runner.addTest('Lobby closure when last player leaves', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);

    const hostId = createTestPlayer(playerManager);

    // Create lobby
    const createResult = lobbyManager.createLobby(hostId);
    TestAssertions.assertEquals(lobbyManager.getStats().totalLobbies, 1, 'Should have 1 lobby');

    // Host leaves (only player)
    const leaveResult = lobbyManager.leaveLobby(hostId);

    TestAssertions.assertSuccessResult(leaveResult, 'Host leaving should succeed');
    TestAssertions.assertTrue(leaveResult.lobbyClosed, 'Lobby should be marked as closed');

    const stats = lobbyManager.getStats();
    TestAssertions.assertEquals(stats.totalLobbies, 0, 'Lobby should be removed when empty');
    TestAssertions.assertEquals(stats.totalPlayers, 0, 'Should have 0 players after lobby closure');
  });

  // Test 10: Invitation system
  runner.addTest('Invitation system', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);

    const hostId = createTestPlayer(playerManager);
    const targetId = createTestPlayer(playerManager);

    // Create lobby
    const createResult = lobbyManager.createLobby(hostId);

    // Send invitation
    const inviteResult = lobbyManager.invitePlayer(hostId, targetId);
    TestAssertions.assertSuccessResult(inviteResult, 'Sending invitation should succeed');

    // Accept invitation
    const acceptResult = lobbyManager.acceptInvitation(targetId, hostId, createResult.lobby.code);
    TestAssertions.assertSuccessResult(acceptResult, 'Accepting invitation should succeed');
    TestAssertions.assertArrayContains(acceptResult.lobby.players, targetId, 'Target should join lobby after accepting');
  });

  // Test 11: Invitation validation
  runner.addTest('Invitation validation', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);

    const hostId = createTestPlayer(playerManager);
    const targetId = createTestPlayer(playerManager);

    // Try to invite without lobby (should fail)
    const noLobbyInvite = lobbyManager.invitePlayer(hostId, targetId);
    TestAssertions.assertErrorResult(noLobbyInvite, ERROR_TYPES.LOBBY_NOT_FOUND, 'Invite without lobby should fail');

    // Try to invite offline player (should fail)
    lobbyManager.createLobby(hostId);
    const offlineInvite = lobbyManager.invitePlayer(hostId, 'offline_player');
    TestAssertions.assertErrorResult(offlineInvite, ERROR_TYPES.PLAYER_NOT_FOUND, 'Invite offline player should fail');

    // Try to invite player already in lobby (should fail)
    const hostTargetId = createTestPlayer(playerManager);
    lobbyManager.createLobby(hostTargetId); // Target is now in another lobby
    const alreadyInLobby = lobbyManager.invitePlayer(hostId, hostTargetId);
    TestAssertions.assertErrorResult(alreadyInLobby, ERROR_TYPES.ALREADY_IN_LOBBY, 'Invite player in lobby should fail');
  });

  // Test 12: Decline invitation
  runner.addTest('Decline invitation', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);

    const hostId = createTestPlayer(playerManager);
    const targetId = createTestPlayer(playerManager);

    // Create lobby and send invitation
    const createResult = lobbyManager.createLobby(hostId);
    lobbyManager.invitePlayer(hostId, targetId);

    // Decline invitation
    const declineResult = lobbyManager.declineInvitation(targetId, hostId, createResult.lobby.code);
    TestAssertions.assertSuccessResult(declineResult, 'Declining invitation should succeed');

    // Verify target is not in lobby
    const lobbyInfo = lobbyManager.getLobbyInfo(createResult.lobby.code);
    TestAssertions.assertArrayNotContains(lobbyInfo.lobby.players, targetId, 'Target should not be in lobby after decline');
  });

  // Test 13: Kick player functionality
  runner.addTest('Kick player functionality', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);

    const hostId = createTestPlayer(playerManager);
    const playerId = createTestPlayer(playerManager);

    // Create lobby and join
    const createResult = lobbyManager.createLobby(hostId);
    lobbyManager.joinLobby(playerId, createResult.lobby.code);

    // Host kicks player
    const kickResult = lobbyManager.kickPlayer(hostId, playerId);
    TestAssertions.assertSuccessResult(kickResult, 'Kicking player should succeed');

    // Verify player is removed
    const lobbyInfo = lobbyManager.getLobbyInfo(createResult.lobby.code);
    TestAssertions.assertArrayNotContains(lobbyInfo.lobby.players, playerId, 'Kicked player should not be in lobby');
  });

  // Test 14: Kick player validation
  runner.addTest('Kick player validation', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);

    const hostId = createTestPlayer(playerManager);
    const playerId = createTestPlayer(playerManager);

    // Create lobby and add player
    const createResult = lobbyManager.createLobby(hostId);
    lobbyManager.joinLobby(playerId, createResult.lobby.code);

    // Try to kick as non-host (should fail)
    const nonHostKick = lobbyManager.kickPlayer(playerId, hostId);
    TestAssertions.assertErrorResult(nonHostKick, ERROR_TYPES.PERMISSION_DENIED, 'Non-host kick should fail');

    // Try host kicking themselves (should fail)
    const selfKick = lobbyManager.kickPlayer(hostId, hostId);
    TestAssertions.assertErrorResult(selfKick, ERROR_TYPES.PERMISSION_DENIED, 'Host self-kick should fail');
  });

  // Test 15: Match system
  runner.addTest('Match system', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);

    const hostId = createTestPlayer(playerManager);
    const playerId = createTestPlayer(playerManager);

    // Create lobby with 2 players
    const createResult = lobbyManager.createLobby(hostId);
    const lobbyCode = createResult.lobby.code;
    lobbyManager.joinLobby(playerId, lobbyCode);

    // Start match
    const matchResult = lobbyManager.startMatch(hostId);
    TestAssertions.assertSuccessResult(matchResult, 'Starting match should succeed');
    TestAssertions.assertNotNull(matchResult.match, 'Match object should be returned');
    TestAssertions.assertArrayContains(matchResult.match.players, hostId, 'Match should include host');
    TestAssertions.assertArrayContains(matchResult.match.players, playerId, 'Match should include player');

    // Check lobby status
    const lobbyInfo = lobbyManager.getLobbyInfo(lobbyCode);
    TestAssertions.assertEquals(lobbyInfo.lobby.status, LOBBY_STATUS.IN_GAME, 'Lobby should be in game');

    // End match
    const endResult = lobbyManager.endMatch(matchResult.match.id, hostId);
    TestAssertions.assertSuccessResult(endResult, 'Ending match should succeed');
    TestAssertions.assertEquals(endResult.match.winner, hostId, 'Winner should be set correctly');
  });

  // Test 16: Match validation
  runner.addTest('Match validation', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);

    const hostId = createTestPlayer(playerManager);

    // Try to start match with only 1 player (should fail)
    lobbyManager.createLobby(hostId);
    const onePlayerMatch = lobbyManager.startMatch(hostId);
    TestAssertions.assertErrorResult(onePlayerMatch, ERROR_TYPES.LOBBY_NOT_FOUND, 'Match with 1 player should fail');

    // Try to start match as non-host (should fail)
    const playerId = createTestPlayer(playerManager);
    const nonHostMatch = lobbyManager.startMatch(playerId);
    TestAssertions.assertErrorResult(nonHostMatch, ERROR_TYPES.LOBBY_NOT_FOUND, 'Non-host match start should fail');
  });

  // Test 17: Lobby chat system
  runner.addTest('Lobby chat system', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);

    const hostId = createTestPlayer(playerManager);
    const playerId = createTestPlayer(playerManager);
    const testMessage = 'Hello lobby!';

    // Create lobby and join
    const createResult = lobbyManager.createLobby(hostId);
    const lobbyCode = createResult.lobby.code;
    lobbyManager.joinLobby(playerId, lobbyCode);

    // Send chat message
    const chatResult = lobbyManager.sendLobbyChat(hostId, testMessage);
    TestAssertions.assertSuccessResult(chatResult, 'Sending chat message should succeed');

    // Check message is stored
    const lobbyInfo = lobbyManager.getLobbyInfo(lobbyCode);
    TestAssertions.assertEquals(lobbyInfo.lobby.chatHistory.length, 1, 'Should have 1 chat message');
    TestAssertions.assertEquals(lobbyInfo.lobby.chatHistory[0].message, testMessage, 'Message should be stored correctly');
    TestAssertions.assertEquals(lobbyInfo.lobby.chatHistory[0].playerId, hostId, 'Sender should be stored correctly');
  });

  // Test 18: Get lobby information
  runner.addTest('Get lobby information', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);

    const hostId = createTestPlayer(playerManager);
    const playerId = createTestPlayer(playerManager);

    // Create lobby
    const createResult = lobbyManager.createLobby(hostId);
    const lobbyCode = createResult.lobby.code;

    // Get info as host
    const hostInfo = lobbyManager.getLobbyInfo(lobbyCode, hostId);
    TestAssertions.assertSuccessResult(hostInfo, 'Getting lobby info should succeed');
    TestAssertions.assertTrue(hostInfo.isHost, 'Host should be identified as host');
    TestAssertions.assertEquals(hostInfo.playerRole, PLAYER_ROLES.HOST, 'Host role should be correct');

    // Join and get info as player
    lobbyManager.joinLobby(playerId, lobbyCode);
    const playerInfo = lobbyManager.getLobbyInfo(lobbyCode, playerId);
    TestAssertions.assertFalse(playerInfo.isHost, 'Player should not be identified as host');
    TestAssertions.assertEquals(playerInfo.playerRole, PLAYER_ROLES.PLAYER, 'Player role should be correct');

    // Try to get info for non-existent lobby
    const noLobbyInfo = lobbyManager.getLobbyInfo('INVALID');
    TestAssertions.assertErrorResult(noLobbyInfo, ERROR_TYPES.LOBBY_NOT_FOUND, 'Invalid lobby info should fail');
  });

  // Test 19: Statistics accuracy
  runner.addTest('Statistics accuracy', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);

    // Create multiple lobbies with different statuses
    const hosts = [
      createTestPlayer(playerManager),
      createTestPlayer(playerManager),
      createTestPlayer(playerManager)
    ];

    // Create lobbies
    const lobbies = hosts.map(host => lobbyManager.createLobby(host));

    // Add players to second lobby to make it ready
    const player2 = createTestPlayer(playerManager);
    lobbyManager.joinLobby(player2, lobbies[1].lobby.code);

    // Start match in third lobby
    const player3 = createTestPlayer(playerManager);
    lobbyManager.joinLobby(player3, lobbies[2].lobby.code);
    lobbyManager.startMatch(hosts[2]);

    const stats = lobbyManager.getStats();
    TestAssertions.assertEquals(stats.totalLobbies, 3, 'Should have 3 lobbies');
    TestAssertions.assertEquals(stats.totalPlayers, 5, 'Should have 5 players total (3 hosts + 2 joined players)');
    TestAssertions.assertEquals(stats.lobbyStatuses[LOBBY_STATUS.WAITING], 1, 'Should have 1 waiting lobby');
    TestAssertions.assertEquals(stats.lobbyStatuses[LOBBY_STATUS.READY], 1, 'Should have 1 ready lobby');
    TestAssertions.assertEquals(stats.lobbyStatuses[LOBBY_STATUS.IN_GAME], 1, 'Should have 1 in-game lobby');
  });

  // Test 20: Error handling and edge cases
  runner.addTest('Error handling and edge cases', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);

    // Try operations with null/invalid inputs
    const nullLobbyCreate = lobbyManager.createLobby(null);
    TestAssertions.assertErrorResult(nullLobbyCreate, ERROR_TYPES.INVALID_PAYLOAD, 'Null host should fail');

    const emptyLobbyJoin = lobbyManager.joinLobby('', 'TESTCODE');
    TestAssertions.assertErrorResult(emptyLobbyJoin, ERROR_TYPES.INVALID_PAYLOAD, 'Empty player ID should fail');

    const invalidLobbyLeave = lobbyManager.leaveLobby('nonexistent_player');
    TestAssertions.assertErrorResult(invalidLobbyLeave, ERROR_TYPES.LOBBY_NOT_FOUND, 'Non-existent player leave should fail');

    // Test with very long message
    const longMessage = 'x'.repeat(600);
    const hostId = createTestPlayer(playerManager);
    lobbyManager.createLobby(hostId);
    const longChatResult = lobbyManager.sendLobbyChat(hostId, longMessage);
    TestAssertions.assertSuccessResult(longChatResult, 'Long message should be handled');
  });

  // Run all tests
  return await runner.runAll();
}

// Export test function
module.exports = testLobbyManager;

// Run tests if this file is executed directly
if (require.main === module) {
  testLobbyManager().then(results => {
    process.exit(results.failed > 0 ? 1 : 0);
  }).catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}
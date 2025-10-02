/**
 * Database Persistence Integration Tests
 * Tests that verify PostgreSQL integration works correctly
 * Tests lobby persistence, restoration, chat history, and invitations
 */

const LobbyManager = require('../../src/managers/LobbyManager');
const PlayerManager = require('../../src/managers/PlayerManager');
const ChannelManager = require('../../src/managers/ChannelManager');
const Lobby = require('../../src/models/Lobby');
const { getPrismaClient, disconnectPrisma } = require('../../src/utils/prisma');
const {
  saveInvitation,
  getPendingInvitations,
  updateInvitationStatus,
  cleanupExpiredInvitations
} = require('../../src/utils/invitations');
const { createSilentLogger } = require('../utils/TestLogger');
const { MockWebSocket } = require('../utils/MockWebSocket');
const {
  TestAssertions,
  TestDataGenerator,
  TestRunner,
  wait
} = require('../utils/TestHelpers');
const { LOBBY_STATUS, PLAYER_ROLES } = require('../../src/config/constants');

/**
 * Test database persistence and restoration
 */
async function testDatabasePersistence() {
  const logger = createSilentLogger('DatabasePersistenceTest');
  const runner = new TestRunner(logger);

  // Test 1: Lobby saves to database
  runner.addTest('Lobby saves to database on creation', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);
    const prisma = getPrismaClient();

    const hostClient = new MockWebSocket();
    const hostAddress = TestDataGenerator.generatePlayerId('host');
    playerManager.updatePing(hostClient, hostAddress);

    channelManager.initClient(hostClient);

    // Create lobby
    const result = await lobbyManager.createLobby(hostClient);
    TestAssertions.assertSuccessResult(result, 'Lobby creation should succeed');

    const lobbyCode = result.lobby.code;

    // Verify lobby exists in database
    const dbLobby = await prisma.lobby.findUnique({
      where: { code: lobbyCode },
      include: { players: true }
    });

    TestAssertions.assertNotNull(dbLobby, 'Lobby should exist in database');
    TestAssertions.assertEquals(dbLobby.code, lobbyCode, 'Lobby code should match');
    TestAssertions.assertEquals(dbLobby.hostAddress, hostAddress, 'Host address should match');
    TestAssertions.assertEquals(dbLobby.status, LOBBY_STATUS.WAITING, 'Status should be waiting');
    TestAssertions.assertTrue(dbLobby.players.length >= 1, 'Should have at least host in players');

    // Cleanup
    cleanup.push(async () => {
      await lobbyManager.closeLobby(lobbyCode);
    });
  });

  // Test 2: Player joins are persisted
  runner.addTest('Player joins are persisted to database', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);
    const prisma = getPrismaClient();

    const hostClient = new MockWebSocket();
    const playerClient = new MockWebSocket();
    const hostAddress = TestDataGenerator.generatePlayerId('host');
    const playerAddress = TestDataGenerator.generatePlayerId('player');

    playerManager.updatePing(hostClient, hostAddress);
    playerManager.updatePing(playerClient, playerAddress);
    channelManager.initClient(hostClient);
    channelManager.initClient(playerClient);

    // Create and join lobby
    const createResult = await lobbyManager.createLobby(hostClient);
    const lobbyCode = createResult.lobby.code;

    await lobbyManager.joinLobby(playerClient, lobbyCode);

    // Verify in database
    const dbLobby = await prisma.lobby.findUnique({
      where: { code: lobbyCode },
      include: { players: true }
    });

    TestAssertions.assertEquals(dbLobby.players.length, 2, 'Should have 2 players in database');
    const playerAddresses = dbLobby.players.map(p => p.playerAddress);
    TestAssertions.assertArrayContains(playerAddresses, hostAddress, 'Host should be in database');
    TestAssertions.assertArrayContains(playerAddresses, playerAddress, 'Player should be in database');

    // Cleanup
    cleanup.push(async () => {
      await lobbyManager.closeLobby(lobbyCode);
    });
  });

  // Test 3: Chat messages are persisted
  runner.addTest('Chat messages are saved to database', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);
    const prisma = getPrismaClient();

    const hostClient = new MockWebSocket();
    const hostAddress = TestDataGenerator.generatePlayerId('host');
    playerManager.updatePing(hostClient, hostAddress);
    channelManager.initClient(hostClient);

    // Create lobby
    const createResult = await lobbyManager.createLobby(hostClient);
    const lobbyCode = createResult.lobby.code;
    const lobby = lobbyManager.lobbies.get(lobbyCode);

    // Send chat messages
    const message1 = 'Hello world!';
    const message2 = 'Another message';

    lobbyManager.sendLobbyChat(hostClient, message1);
    await wait(50); // Wait for async save
    lobbyManager.sendLobbyChat(hostClient, message2);
    await wait(50);

    // Verify in database
    const dbMessages = await prisma.chatMessage.findMany({
      where: { lobbyId: lobby.id },
      orderBy: { timestamp: 'asc' }
    });

    TestAssertions.assertTrue(dbMessages.length >= 2, 'Should have at least 2 messages in database');
    TestAssertions.assertEquals(dbMessages[0].message, message1, 'First message should match');
    TestAssertions.assertEquals(dbMessages[0].playerAddress, hostAddress, 'Sender should match');

    // Cleanup
    cleanup.push(async () => {
      await lobbyManager.closeLobby(lobbyCode);
    });
  });

  // Test 4: Chat history loads from database
  runner.addTest('Chat history loads from database', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);
    const prisma = getPrismaClient();

    const hostClient = new MockWebSocket();
    const hostAddress = TestDataGenerator.generatePlayerId('host');
    playerManager.updatePing(hostClient, hostAddress);
    channelManager.initClient(hostClient);

    // Create lobby and send messages
    const createResult = await lobbyManager.createLobby(hostClient);
    const lobbyCode = createResult.lobby.code;
    const lobby = lobbyManager.lobbies.get(lobbyCode);

    const testMessages = ['Message 1', 'Message 2', 'Message 3'];
    for (const msg of testMessages) {
      lobbyManager.sendLobbyChat(hostClient, msg);
    }
    await wait(100); // Wait for async saves

    // Clear in-memory chat history
    lobby.chatHistory = [];

    // Load from database
    await lobby.loadChatHistory();

    TestAssertions.assertTrue(lobby.chatHistory.length >= 3, 'Should load at least 3 messages');
    TestAssertions.assertEquals(lobby.chatHistory[0].message, testMessages[0], 'First message should match');
    TestAssertions.assertEquals(lobby.chatHistory[0].playerId, hostAddress, 'Sender should match');

    // Cleanup
    cleanup.push(async () => {
      await lobbyManager.closeLobby(lobbyCode);
    });
  });

  // Test 5: Lobby deletion removes from database
  runner.addTest('Lobby deletion removes from database', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);
    const prisma = getPrismaClient();

    const hostClient = new MockWebSocket();
    const hostAddress = TestDataGenerator.generatePlayerId('host');
    playerManager.updatePing(hostClient, hostAddress);
    channelManager.initClient(hostClient);

    // Create lobby
    const createResult = await lobbyManager.createLobby(hostClient);
    const lobbyCode = createResult.lobby.code;

    // Verify it exists
    let dbLobby = await prisma.lobby.findUnique({ where: { code: lobbyCode } });
    TestAssertions.assertNotNull(dbLobby, 'Lobby should exist before deletion');

    // Close lobby
    await lobbyManager.closeLobby(lobbyCode);

    // Verify it's deleted
    dbLobby = await prisma.lobby.findUnique({ where: { code: lobbyCode } });
    TestAssertions.assertNull(dbLobby, 'Lobby should be deleted from database');
  });

  // Test 6: Invitations are persisted
  runner.addTest('Invitations are saved to database', async (cleanup) => {
    const prisma = getPrismaClient();

    const fromAddress = TestDataGenerator.generatePlayerId('from');
    const toAddress = TestDataGenerator.generatePlayerId('to');
    const lobbyCode = 'TEST01';

    // Save invitation
    const invitation = await saveInvitation(fromAddress, toAddress, lobbyCode);

    TestAssertions.assertNotNull(invitation, 'Invitation should be created');
    TestAssertions.assertEquals(invitation.fromPlayerAddress, fromAddress, 'From address should match');
    TestAssertions.assertEquals(invitation.toPlayerAddress, toAddress, 'To address should match');
    TestAssertions.assertEquals(invitation.lobbyCode, lobbyCode, 'Lobby code should match');
    TestAssertions.assertEquals(invitation.status, 'pending', 'Status should be pending');

    // Cleanup
    cleanup.push(async () => {
      await prisma.invitation.delete({ where: { id: invitation.id } });
    });
  });

  // Test 7: Get pending invitations
  runner.addTest('Get pending invitations from database', async (cleanup) => {
    const prisma = getPrismaClient();

    const toAddress = TestDataGenerator.generatePlayerId('receiver');
    const invitations = [];

    // Create multiple invitations
    for (let i = 0; i < 3; i++) {
      const fromAddress = TestDataGenerator.generatePlayerId(`sender${i}`);
      const invitation = await saveInvitation(fromAddress, toAddress, `TEST${i}`);
      invitations.push(invitation);
    }

    // Get pending invitations
    const pending = await getPendingInvitations(toAddress);

    TestAssertions.assertTrue(pending.length >= 3, 'Should have at least 3 pending invitations');

    // Cleanup
    cleanup.push(async () => {
      for (const inv of invitations) {
        await prisma.invitation.delete({ where: { id: inv.id } });
      }
    });
  });

  // Test 8: Update invitation status
  runner.addTest('Update invitation status in database', async (cleanup) => {
    const prisma = getPrismaClient();

    const fromAddress = TestDataGenerator.generatePlayerId('from');
    const toAddress = TestDataGenerator.generatePlayerId('to');
    const lobbyCode = 'TEST99';

    // Create invitation
    const invitation = await saveInvitation(fromAddress, toAddress, lobbyCode);
    TestAssertions.assertEquals(invitation.status, 'pending', 'Initial status should be pending');

    // Update to accepted
    await updateInvitationStatus(fromAddress, toAddress, lobbyCode, 'accepted');

    // Verify update
    const updated = await prisma.invitation.findFirst({
      where: {
        fromPlayerAddress: fromAddress,
        toPlayerAddress: toAddress,
        lobbyCode
      }
    });

    TestAssertions.assertEquals(updated.status, 'accepted', 'Status should be updated to accepted');

    // Cleanup
    cleanup.push(async () => {
      await prisma.invitation.delete({ where: { id: invitation.id } });
    });
  });

  // Test 9: Inactive lobbies cleanup from database
  runner.addTest('Inactive lobbies are cleaned up from database', async (cleanup) => {
    const prisma = getPrismaClient();

    // Create old lobby directly in database
    const oldLobby = await prisma.lobby.create({
      data: {
        code: 'OLD001',
        hostAddress: 'old_host',
        status: 'waiting',
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      }
    });

    // Run cleanup (with 1 hour threshold)
    const deletedCount = await Lobby.deleteInactive(60 * 60 * 1000);

    TestAssertions.assertTrue(deletedCount >= 1, 'Should delete at least 1 old lobby');

    // Verify deletion
    const found = await prisma.lobby.findUnique({ where: { code: 'OLD001' } });
    TestAssertions.assertNull(found, 'Old lobby should be deleted');
  });

  // Test 10: Server restart lobby restoration
  runner.addTest('Lobbies can be restored after server restart', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager1 = new LobbyManager(logger, playerManager, channelManager);

    const hostClient = new MockWebSocket();
    const hostAddress = TestDataGenerator.generatePlayerId('host');
    playerManager.updatePing(hostClient, hostAddress);
    channelManager.initClient(hostClient);

    // Create lobby with first manager
    const createResult = await lobbyManager1.createLobby(hostClient);
    const lobbyCode = createResult.lobby.code;

    // "Restart" - create new lobby manager
    const lobbyManager2 = new LobbyManager(logger, playerManager, channelManager);

    // Restore lobbies
    const restoredCount = await lobbyManager2.restoreLobbiesFromDatabase();

    TestAssertions.assertTrue(restoredCount >= 1, 'Should restore at least 1 lobby');

    // Load lobby from database
    const dbLobbyData = await Lobby.loadFromDatabase(lobbyCode);

    TestAssertions.assertNotNull(dbLobbyData, 'Lobby should be loadable from database');
    TestAssertions.assertEquals(dbLobbyData.code, lobbyCode, 'Lobby code should match');
    TestAssertions.assertEquals(dbLobbyData.hostAddress, hostAddress, 'Host address should be preserved');

    // Cleanup
    cleanup.push(async () => {
      await lobbyManager1.closeLobby(lobbyCode);
    });
  });

  return await runner.run();
}

// Export test suite
module.exports = testDatabasePersistence;

// Allow running standalone
if (require.main === module) {
  const logger = createSilentLogger('DatabasePersistenceTest');
  logger.info('🧪 Running Database Persistence Tests\n');

  testDatabasePersistence().then(results => {
    if (results.failed === 0) {
      logger.pass(`\n🎉 All ${results.passed} database persistence tests passed!`);
      disconnectPrisma().then(() => process.exit(0));
    } else {
      logger.fail(`\n💥 ${results.failed}/${results.total} tests failed.`);
      disconnectPrisma().then(() => process.exit(1));
    }
  }).catch(error => {
    logger.error('Test runner failed:', error);
    disconnectPrisma().then(() => process.exit(1));
  });
}

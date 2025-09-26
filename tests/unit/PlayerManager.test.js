/**
 * Unit Tests for PlayerManager
 * Tests player presence tracking, online status, and cleanup functionality
 */

const PlayerManager = require('../../src/managers/PlayerManager');
const { createSilentLogger } = require('../utils/TestLogger');
const { MockWebSocket } = require('../utils/MockWebSocket');
const {
  TestAssertions,
  TestDataGenerator,
  TestRunner,
  wait,
  createTestPlayer
} = require('../utils/TestHelpers');

/**
 * Test PlayerManager functionality
 */
async function testPlayerManager() {
  const logger = createSilentLogger('PlayerManagerTest');
  const runner = new TestRunner(logger);

  // Test 1: Initialization
  runner.addTest('PlayerManager initialization', async (cleanup) => {
    const playerManager = new PlayerManager(logger);

    TestAssertions.assertNotNull(playerManager, 'PlayerManager should be created');
    TestAssertions.assertTrue(playerManager instanceof PlayerManager, 'Should be PlayerManager instance');

    const stats = playerManager.getStats();
    TestAssertions.assertEquals(stats.totalPlayers, 0, 'Should start with 0 players');
    TestAssertions.assertEquals(stats.onlinePlayers, 0, 'Should start with 0 online players');
  });

  // Test 2: Player ping and online status
  runner.addTest('Player ping updates and online status', async (cleanup) => {
    const playerManager = new PlayerManager(logger);
    const playerAddress = TestDataGenerator.generatePlayerId();
    const mockConnection = new MockWebSocket();

    // Player should be offline initially
    TestAssertions.assertFalse(playerManager.isOnline(mockConnection), 'Player should be offline initially');

    // Update ping
    playerManager.updatePing(mockConnection, playerAddress);

    // Player should be online now
    TestAssertions.assertTrue(playerManager.isOnline(mockConnection), 'Player should be online after ping');

    // Check connection mapping (using address lookup)
    TestAssertions.assertEquals(playerManager.getClientByAddress(playerAddress), mockConnection, 'Connection should be mapped');

    // Check stats
    const stats = playerManager.getStats();
    TestAssertions.assertEquals(stats.totalPlayers, 1, 'Should have 1 total player');
    TestAssertions.assertEquals(stats.onlinePlayers, 1, 'Should have 1 online player');
  });

  // Test 3: Multiple players online status
  runner.addTest('Multiple players online status tracking', async (cleanup) => {
    const playerManager = new PlayerManager(logger);
    const playerAddresses = TestDataGenerator.generatePlayerIds(3);
    const connections = [new MockWebSocket(), new MockWebSocket()];

    // Add first two players with connections
    playerManager.updatePing(connections[0], playerAddresses[0]);
    playerManager.updatePing(connections[1], playerAddresses[1]);

    // Check individual status by connection
    TestAssertions.assertTrue(playerManager.isOnline(connections[0]), 'Player 1 should be online');
    TestAssertions.assertTrue(playerManager.isOnline(connections[1]), 'Player 2 should be online');

    // Check batch status by addresses
    const onlineStatuses = playerManager.getOnlineStatuses(playerAddresses);
    TestAssertions.assertEquals(onlineStatuses.length, 3, 'Should return 3 statuses');
    TestAssertions.assertTrue(onlineStatuses[0], 'Player 1 should be online');
    TestAssertions.assertTrue(onlineStatuses[1], 'Player 2 should be online');
    TestAssertions.assertFalse(onlineStatuses[2], 'Player 3 should be offline');

    // Check binary format
    const binaryStatuses = playerManager.getBinaryOnlineStatuses(playerAddresses);
    TestAssertions.assertEquals(binaryStatuses, '110', 'Binary status should be "110"');
  });

  // Test 4: Get online players list
  runner.addTest('Get online players list', async (cleanup) => {
    const playerManager = new PlayerManager(logger);
    const playerAddresses = TestDataGenerator.generatePlayerIds(3);
    const connections = [new MockWebSocket(), new MockWebSocket()];

    // Add players with connections
    playerManager.updatePing(connections[0], playerAddresses[0]);
    playerManager.updatePing(connections[1], playerAddresses[1]);
    // playerAddresses[2] is not added, so offline

    const onlinePlayers = playerManager.getOnlinePlayers();
    TestAssertions.assertEquals(onlinePlayers.length, 2, 'Should have 2 online players');
    TestAssertions.assertArrayContains(onlinePlayers, playerAddresses[0], 'Should contain player 1');
    TestAssertions.assertArrayContains(onlinePlayers, playerAddresses[1], 'Should contain player 2');
    TestAssertions.assertArrayNotContains(onlinePlayers, playerAddresses[2], 'Should not contain player 3');
  });

  // Test 5: Player timeout and offline detection
  runner.addTest('Player timeout and offline detection', async (cleanup) => {
    const playerManager = new PlayerManager(logger);
    const playerAddress = TestDataGenerator.generatePlayerId();
    const mockConnection = new MockWebSocket();

    // Add player with old timestamp (simulate timeout)
    const oldTimestamp = Date.now() - 7000; // 7 seconds ago
    playerManager.connectionData.set(mockConnection, {
      address: playerAddress,
      lastPing: oldTimestamp,
      connected: oldTimestamp
    });

    // Player should be considered offline
    TestAssertions.assertFalse(playerManager.isOnline(mockConnection), 'Player should be offline due to timeout');

    // Update with fresh ping
    playerManager.updatePing(mockConnection, playerAddress);

    // Player should be online now
    TestAssertions.assertTrue(playerManager.isOnline(mockConnection), 'Player should be online after fresh ping');
  });

  // Test 6: Client removal
  runner.addTest('Client removal', async (cleanup) => {
    const playerManager = new PlayerManager(logger);
    const playerAddress = TestDataGenerator.generatePlayerId();
    const mockConnection = new MockWebSocket();

    // Add player
    playerManager.updatePing(mockConnection, playerAddress);
    TestAssertions.assertTrue(playerManager.isOnline(mockConnection), 'Player should be online');

    // Remove client
    playerManager.removeClient(mockConnection);

    // Player should be offline and removed
    TestAssertions.assertFalse(playerManager.isOnline(mockConnection), 'Player should be offline after removal');
    TestAssertions.assertNull(playerManager.getClientByAddress(playerAddress), 'Connection should be removed');

    const stats = playerManager.getStats();
    TestAssertions.assertEquals(stats.totalPlayers, 0, 'Should have 0 total players after removal');
  });

  // Test 7: Connection removal
  runner.addTest('Connection removal by WebSocket', async (cleanup) => {
    const playerManager = new PlayerManager(logger);
    const playerAddress1 = TestDataGenerator.generatePlayerId();
    const playerAddress2 = TestDataGenerator.generatePlayerId();
    const connection1 = new MockWebSocket();
    const connection2 = new MockWebSocket();

    // Add players with connections
    playerManager.updatePing(connection1, playerAddress1);
    playerManager.updatePing(connection2, playerAddress2);

    TestAssertions.assertEquals(playerManager.getClientByAddress(playerAddress1), connection1, 'Player 1 connection should be mapped');
    TestAssertions.assertEquals(playerManager.getClientByAddress(playerAddress2), connection2, 'Player 2 connection should be mapped');

    // Remove connection1
    playerManager.removeConnection(connection1);

    // connection1 should be removed but connection2 should remain
    TestAssertions.assertNull(playerManager.getClientByAddress(playerAddress1), 'Player 1 connection should be removed');
    TestAssertions.assertEquals(playerManager.getClientByAddress(playerAddress2), connection2, 'Player 2 connection should remain');
  });

  // Test 8: Manual cleanup
  runner.addTest('Manual cleanup of inactive clients', async (cleanup) => {
    const playerManager = new PlayerManager(logger);
    const activePlayerAddress = TestDataGenerator.generatePlayerId();
    const inactivePlayerAddress = TestDataGenerator.generatePlayerId();
    const activeConnection = new MockWebSocket();
    const inactiveConnection = new MockWebSocket();

    // Add active player
    playerManager.updatePing(activeConnection, activePlayerAddress);

    // Add inactive player with old timestamp
    const oldTimestamp = Date.now() - 7000; // 7 seconds ago
    playerManager.connectionData.set(inactiveConnection, {
      address: inactivePlayerAddress,
      lastPing: oldTimestamp,
      connected: oldTimestamp
    });

    // Check initial state
    TestAssertions.assertTrue(playerManager.isOnline(activeConnection), 'Active player should be online');
    TestAssertions.assertFalse(playerManager.isOnline(inactiveConnection), 'Inactive player should be offline');

    let stats = playerManager.getStats();
    TestAssertions.assertEquals(stats.totalPlayers, 2, 'Should have 2 total players before cleanup');

    // Run cleanup
    playerManager.cleanupInactiveClients();

    // Check after cleanup
    stats = playerManager.getStats();
    TestAssertions.assertEquals(stats.totalPlayers, 1, 'Should have 1 total player after cleanup');
    TestAssertions.assertTrue(playerManager.isOnline(activeConnection), 'Active player should still be online');
    TestAssertions.assertFalse(playerManager.isOnline(inactiveConnection), 'Inactive player should be removed');
  });

  // Test 9: Statistics accuracy
  runner.addTest('Statistics accuracy', async (cleanup) => {
    const playerManager = new PlayerManager(logger);
    const playerAddresses = TestDataGenerator.generatePlayerIds(5);
    const connections = Array.from({ length: 5 }, () => new MockWebSocket());

    // Add 3 online players
    for (let i = 0; i < 3; i++) {
      playerManager.updatePing(connections[i], playerAddresses[i]);
    }

    // Add 2 offline players with old timestamps
    const oldTimestamp = Date.now() - 7000;
    playerManager.connectionData.set(connections[3], {
      address: playerAddresses[3],
      lastPing: oldTimestamp,
      connected: oldTimestamp
    });
    playerManager.connectionData.set(connections[4], {
      address: playerAddresses[4],
      lastPing: oldTimestamp,
      connected: oldTimestamp
    });

    const stats = playerManager.getStats();
    TestAssertions.assertEquals(stats.totalPlayers, 5, 'Should have 5 total players');
    TestAssertions.assertEquals(stats.onlinePlayers, 3, 'Should have 3 online players');
    TestAssertions.assertEquals(stats.offlinePlayers, 2, 'Should have 2 offline players');
    TestAssertions.assertTrue(stats.averagePingAge >= 0, 'Average ping age should be non-negative');
  });

  // Test 10: Edge cases and error handling
  runner.addTest('Edge cases and error handling', async (cleanup) => {
    const playerManager = new PlayerManager(logger);

    // Test with null/undefined connections
    TestAssertions.assertFalse(playerManager.isOnline(null), 'Null connection should return false');
    TestAssertions.assertFalse(playerManager.isOnline(undefined), 'Undefined connection should return false');

    // Test with empty array
    const emptyStatuses = playerManager.getOnlineStatuses([]);
    TestAssertions.assertEquals(emptyStatuses.length, 0, 'Empty array should return empty statuses');

    // Test with non-array input
    const nonArrayStatuses = playerManager.getOnlineStatuses('not-an-array');
    TestAssertions.assertEquals(nonArrayStatuses.length, 0, 'Non-array input should return empty array');

    // Test binary status with empty array
    const emptyBinary = playerManager.getBinaryOnlineStatuses([]);
    TestAssertions.assertEquals(emptyBinary, '', 'Empty array should return empty string');

    // Test getClientByAddress with invalid address
    TestAssertions.assertNull(playerManager.getClientByAddress('nonexistent'), 'Should return null for non-existent address');
    TestAssertions.assertNull(playerManager.getClientByAddress(null), 'Should return null for null address');
  });

  // Test 11: Address change protection
  runner.addTest('Address change protection', async (cleanup) => {
    const playerManager = new PlayerManager(logger);
    const originalAddress = TestDataGenerator.generatePlayerId();
    const newAddress = TestDataGenerator.generatePlayerId();
    const mockConnection = new MockWebSocket();

    // First ping with original address
    playerManager.updatePing(mockConnection, originalAddress);

    let playerData = playerManager.getPlayerData(mockConnection);
    TestAssertions.assertEquals(playerData.address, originalAddress, 'Address should be set to original value');

    // Try to change address with second ping
    playerManager.updatePing(mockConnection, newAddress);

    // Address should remain unchanged
    playerData = playerManager.getPlayerData(mockConnection);
    TestAssertions.assertEquals(playerData.address, originalAddress, 'Address should remain unchanged after change attempt');
    TestAssertions.assertNotEquals(playerData.address, newAddress, 'Address should not be changed to new value');

    // Test multiple change attempts
    const anotherAddress = TestDataGenerator.generatePlayerId();
    playerManager.updatePing(mockConnection, anotherAddress);

    playerData = playerManager.getPlayerData(mockConnection);
    TestAssertions.assertEquals(playerData.address, originalAddress, 'Address should still be original after multiple change attempts');
  });

  // Run all tests
  return await runner.runAll();
}

// Export test function for test runner
module.exports = testPlayerManager;

// Run tests if this file is executed directly
if (require.main === module) {
  testPlayerManager().then(results => {
    process.exit(results.failed > 0 ? 1 : 0);
  }).catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}
/**
 * Unit Tests for MessageHandler
 * Tests message routing, ping handling, and address change protection
 */

const MessageHandler = require('../../src/handlers/MessageHandler');
const PlayerManager = require('../../src/managers/PlayerManager');
const LobbyManager = require('../../src/managers/LobbyManager');
const ChannelManager = require('../../src/managers/ChannelManager');
const { createSilentLogger } = require('../utils/TestLogger');
const { MockWebSocket } = require('../utils/MockWebSocket');
const { ERROR_TYPES, EVENTS } = require('../../src/config/constants');
const {
  TestAssertions,
  TestDataGenerator,
  TestRunner,
  wait
} = require('../utils/TestHelpers');

/**
 * Test MessageHandler functionality
 */
async function testMessageHandler() {
  const logger = createSilentLogger('MessageHandlerTest');
  const runner = new TestRunner(logger);

  // Test 1: Initialization
  runner.addTest('MessageHandler initialization', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);
    const messageHandler = new MessageHandler(logger, channelManager, playerManager, lobbyManager);

    TestAssertions.assertNotNull(messageHandler, 'MessageHandler should be created');
    TestAssertions.assertTrue(messageHandler instanceof MessageHandler, 'Should be MessageHandler instance');
  });

  // Test 2: Ping handling with address assignment
  runner.addTest('Ping handling with address assignment', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);
    const messageHandler = new MessageHandler(logger, channelManager, playerManager, lobbyManager);

    const mockClient = new MockWebSocket();
    const playerAddress = TestDataGenerator.generatePlayerId();

    // Send first ping
    await messageHandler.handlePing(mockClient, { Address: playerAddress });

    // Check that address is assigned
    const playerData = playerManager.getPlayerData(mockClient);
    TestAssertions.assertNotNull(playerData, 'Player data should exist');
    TestAssertions.assertEquals(playerData.address, playerAddress, 'Address should be set correctly');
  });

  // Test 3: Address change protection in MessageHandler
  runner.addTest('Address change protection in MessageHandler', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);
    const messageHandler = new MessageHandler(logger, channelManager, playerManager, lobbyManager);

    const mockClient = new MockWebSocket();
    const originalAddress = TestDataGenerator.generatePlayerId();
    const newAddress = TestDataGenerator.generatePlayerId();

    let errorSent = false;
    let errorType = null;
    let errorMessage = null;

    // Mock sendError to capture error calls
    const originalSendError = messageHandler.sendError.bind(messageHandler);
    messageHandler.sendError = (client, type, message) => {
      errorSent = true;
      errorType = type;
      errorMessage = message;
      return originalSendError(client, type, message);
    };

    // Send first ping with original address
    await messageHandler.handlePing(mockClient, { Address: originalAddress });

    // Verify first ping worked
    let playerData = playerManager.getPlayerData(mockClient);
    TestAssertions.assertEquals(playerData.address, originalAddress, 'Original address should be set');
    TestAssertions.assertFalse(errorSent, 'No error should be sent for first ping');

    // Try to change address
    await messageHandler.handlePing(mockClient, { Address: newAddress });

    // Verify error was sent
    TestAssertions.assertTrue(errorSent, 'Error should be sent when trying to change address');
    TestAssertions.assertEquals(errorType, ERROR_TYPES.INVALID_ACTION, 'Error type should be INVALID_ACTION');
    TestAssertions.assertEquals(errorMessage, 'Address cannot be changed after initial connection', 'Error message should be correct');

    // Verify address didn't change
    playerData = playerManager.getPlayerData(mockClient);
    TestAssertions.assertEquals(playerData.address, originalAddress, 'Address should remain unchanged');
  });

  // Test 4: Invalid ping payload handling
  runner.addTest('Invalid ping payload handling', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const playerManager = new PlayerManager(logger);
    const lobbyManager = new LobbyManager(logger, playerManager, channelManager);
    const messageHandler = new MessageHandler(logger, channelManager, playerManager, lobbyManager);

    const mockClient = new MockWebSocket();

    let errorSent = false;
    let errorType = null;

    // Mock sendError to capture error calls
    messageHandler.sendError = (client, type, message) => {
      errorSent = true;
      errorType = type;
    };

    // Test with missing Address
    await messageHandler.handlePing(mockClient, {});

    TestAssertions.assertTrue(errorSent, 'Error should be sent for missing Address');
    TestAssertions.assertEquals(errorType, ERROR_TYPES.INVALID_PAYLOAD, 'Error type should be INVALID_PAYLOAD');

    // Reset for next test
    errorSent = false;
    errorType = null;

    // Test with null payload
    await messageHandler.handlePing(mockClient, null);

    TestAssertions.assertTrue(errorSent, 'Error should be sent for null payload');
    TestAssertions.assertEquals(errorType, ERROR_TYPES.INVALID_PAYLOAD, 'Error type should be INVALID_PAYLOAD');
  });

  // Run all tests
  return await runner.runAll();
}

// Export test function for test runner
module.exports = testMessageHandler;

// Run tests if this file is executed directly
if (require.main === module) {
  testMessageHandler().then(results => {
    process.exit(results.failed > 0 ? 1 : 0);
  }).catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}
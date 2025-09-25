/**
 * Unit Tests for ChannelManager
 * Tests channel subscriptions, message publishing, and client management
 */

const ChannelManager = require('../../src/managers/ChannelManager');
const { createSilentLogger } = require('../utils/TestLogger');
const { MockWebSocket, createMockClientPair } = require('../utils/MockWebSocket');
const {
  TestAssertions,
  TestDataGenerator,
  TestRunner,
  wait
} = require('../utils/TestHelpers');

/**
 * Test ChannelManager functionality
 */
async function testChannelManager() {
  const logger = createSilentLogger('ChannelManagerTest');
  const runner = new TestRunner(logger);

  // Test 1: Initialization
  runner.addTest('ChannelManager initialization', async (cleanup) => {
    const channelManager = new ChannelManager(logger);

    TestAssertions.assertNotNull(channelManager, 'ChannelManager should be created');
    TestAssertions.assertTrue(channelManager instanceof ChannelManager, 'Should be ChannelManager instance');

    const stats = channelManager.getStats();
    TestAssertions.assertEquals(stats.totalChannels, 0, 'Should start with 0 channels');
    TestAssertions.assertEquals(stats.totalClients, 0, 'Should start with 0 clients');
  });

  // Test 2: Client initialization
  runner.addTest('Client initialization', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const client = new MockWebSocket();

    channelManager.initClient(client);

    const clientChannels = channelManager.getClientChannels(client);
    TestAssertions.assertTrue(clientChannels instanceof Set, 'Client channels should be a Set');
    TestAssertions.assertEquals(clientChannels.size, 0, 'New client should have no channel subscriptions');

    const stats = channelManager.getStats();
    TestAssertions.assertEquals(stats.totalClients, 1, 'Should have 1 client after init');
  });

  // Test 3: Channel subscription
  runner.addTest('Channel subscription', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const client = new MockWebSocket();
    const channelName = 'test_channel';

    channelManager.initClient(client);

    // Subscribe to channel
    const success = channelManager.subscribe(client, channelName);
    TestAssertions.assertTrue(success, 'Subscription should succeed');

    // Check client channels
    const clientChannels = channelManager.getClientChannels(client);
    TestAssertions.assertTrue(clientChannels.has(channelName), 'Client should be subscribed to channel');

    // Check channel clients
    const channelClients = channelManager.getChannelClients(channelName);
    TestAssertions.assertTrue(channelClients.has(client), 'Channel should contain the client');

    const stats = channelManager.getStats();
    TestAssertions.assertEquals(stats.totalChannels, 1, 'Should have 1 channel');
    TestAssertions.assertEquals(stats.totalConnections, 1, 'Should have 1 connection');
  });

  // Test 4: Multiple clients and channels
  runner.addTest('Multiple clients and channels', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const { clients } = createMockClientPair(3);
    const channels = ['channel1', 'channel2', 'channel3'];

    // Initialize clients
    for (const client of clients) {
      channelManager.initClient(client);
    }

    // Subscribe clients to different channels
    channelManager.subscribe(clients[0], channels[0]); // client0 -> channel1
    channelManager.subscribe(clients[0], channels[1]); // client0 -> channel2
    channelManager.subscribe(clients[1], channels[0]); // client1 -> channel1
    channelManager.subscribe(clients[2], channels[2]); // client2 -> channel3

    // Check subscriptions
    TestAssertions.assertEquals(channelManager.getClientChannels(clients[0]).size, 2, 'Client 0 should have 2 subscriptions');
    TestAssertions.assertEquals(channelManager.getClientChannels(clients[1]).size, 1, 'Client 1 should have 1 subscription');
    TestAssertions.assertEquals(channelManager.getClientChannels(clients[2]).size, 1, 'Client 2 should have 1 subscription');

    TestAssertions.assertEquals(channelManager.getChannelClients(channels[0]).size, 2, 'Channel 1 should have 2 clients');
    TestAssertions.assertEquals(channelManager.getChannelClients(channels[1]).size, 1, 'Channel 2 should have 1 client');
    TestAssertions.assertEquals(channelManager.getChannelClients(channels[2]).size, 1, 'Channel 3 should have 1 client');

    const stats = channelManager.getStats();
    TestAssertions.assertEquals(stats.totalChannels, 3, 'Should have 3 channels');
    TestAssertions.assertEquals(stats.totalClients, 3, 'Should have 3 clients');
    TestAssertions.assertEquals(stats.totalConnections, 4, 'Should have 4 total connections');
  });

  // Test 5: Channel unsubscription
  runner.addTest('Channel unsubscription', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const client = new MockWebSocket();
    const channelName = 'test_channel';

    channelManager.initClient(client);
    channelManager.subscribe(client, channelName);

    // Verify subscription
    TestAssertions.assertTrue(channelManager.getClientChannels(client).has(channelName), 'Should be subscribed initially');

    // Unsubscribe
    const success = channelManager.unsubscribe(client, channelName);
    TestAssertions.assertTrue(success, 'Unsubscription should succeed');

    // Verify unsubscription
    TestAssertions.assertFalse(channelManager.getClientChannels(client).has(channelName), 'Should not be subscribed after unsubscribe');
    TestAssertions.assertEquals(channelManager.getChannelClients(channelName).size, 0, 'Channel should be empty');

    const stats = channelManager.getStats();
    TestAssertions.assertEquals(stats.totalChannels, 0, 'Empty channels should be cleaned up');
  });

  // Test 6: Message publishing
  runner.addTest('Message publishing', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const { clients } = createMockClientPair(2);
    const channelName = 'broadcast_channel';
    const testPayload = { message: 'Hello subscribers!' };

    // Initialize and subscribe clients
    for (const client of clients) {
      channelManager.initClient(client);
      channelManager.subscribe(client, channelName);
    }

    // Wait for WebSocket connections to be ready
    await wait(10);

    // Publish message
    const sentCount = channelManager.publish(channelName, testPayload);

    TestAssertions.assertEquals(sentCount, 2, 'Message should be sent to 2 clients');

    // Check that both clients received the message
    for (const client of clients) {
      const sentMessages = client.getSentMessages();
      TestAssertions.assertEquals(sentMessages.length, 1, 'Client should receive 1 message');

      const receivedMessage = JSON.parse(sentMessages[0].data);
      TestAssertions.assertEquals(receivedMessage.channel, channelName, 'Message should have correct channel');
      TestAssertions.assertEquals(receivedMessage.payload.message, testPayload.message, 'Message should have correct payload');
    }
  });

  // Test 7: Direct client messaging
  runner.addTest('Direct client messaging', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const client = new MockWebSocket();
    const action = 'test_action';
    const payload = { data: 'test data' };

    channelManager.initClient(client);

    // Wait for connection to be ready
    await wait(10);

    // Send direct message
    const success = channelManager.sendToClient(client, action, payload);
    TestAssertions.assertTrue(success, 'Direct message should be sent successfully');

    // Check message was received
    const sentMessages = client.getSentMessages();
    TestAssertions.assertEquals(sentMessages.length, 1, 'Client should receive 1 message');

    const receivedMessage = JSON.parse(sentMessages[0].data);
    TestAssertions.assertEquals(receivedMessage.action, action, 'Message should have correct action');
    TestAssertions.assertEquals(receivedMessage.payload.data, payload.data, 'Message should have correct payload');
  });

  // Test 8: Client cleanup and removal
  runner.addTest('Client cleanup and removal', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const { clients } = createMockClientPair(2);
    const channelName = 'cleanup_test_channel';

    // Initialize and subscribe clients
    for (const client of clients) {
      channelManager.initClient(client);
      channelManager.subscribe(client, channelName);
    }

    // Verify initial state
    TestAssertions.assertEquals(channelManager.getChannelClients(channelName).size, 2, 'Channel should have 2 clients');

    // Remove one client
    channelManager.removeClient(clients[0]);

    // Verify cleanup
    TestAssertions.assertEquals(channelManager.getChannelClients(channelName).size, 1, 'Channel should have 1 client after cleanup');
    TestAssertions.assertFalse(channelManager.getChannelClients(channelName).has(clients[0]), 'Removed client should not be in channel');
    TestAssertions.assertTrue(channelManager.getChannelClients(channelName).has(clients[1]), 'Remaining client should still be in channel');

    const stats = channelManager.getStats();
    TestAssertions.assertEquals(stats.totalClients, 1, 'Should have 1 client after removal');

    // Remove second client
    channelManager.removeClient(clients[1]);

    // Channel should be cleaned up
    const finalStats = channelManager.getStats();
    TestAssertions.assertEquals(finalStats.totalChannels, 0, 'Empty channels should be cleaned up');
    TestAssertions.assertEquals(finalStats.totalClients, 0, 'Should have 0 clients after all removed');
  });

  // Test 9: Publishing to non-existent channel
  runner.addTest('Publishing to non-existent channel', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const nonExistentChannel = 'non_existent_channel';
    const payload = { message: 'test' };

    const sentCount = channelManager.publish(nonExistentChannel, payload);
    TestAssertions.assertEquals(sentCount, 0, 'Should not send to non-existent channel');
  });

  // Test 10: Publishing with client exclusion
  runner.addTest('Publishing with client exclusion', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const { clients } = createMockClientPair(3);
    const channelName = 'exclusion_test_channel';
    const payload = { message: 'broadcast test' };

    // Initialize and subscribe all clients
    for (const client of clients) {
      channelManager.initClient(client);
      channelManager.subscribe(client, channelName);
    }

    // Wait for connections
    await wait(10);

    // Publish excluding the first client
    const sentCount = channelManager.publish(channelName, payload, clients[0]);

    TestAssertions.assertEquals(sentCount, 2, 'Should send to 2 clients (excluding 1)');

    // Check messages
    TestAssertions.assertEquals(clients[0].getSentMessages().length, 0, 'Excluded client should not receive message');
    TestAssertions.assertEquals(clients[1].getSentMessages().length, 1, 'Client 2 should receive message');
    TestAssertions.assertEquals(clients[2].getSentMessages().length, 1, 'Client 3 should receive message');
  });

  // Test 11: Error handling and edge cases
  runner.addTest('Error handling and edge cases', async (cleanup) => {
    const channelManager = new ChannelManager(logger);
    const client = new MockWebSocket();

    // Test subscribing without initialization
    const subscribeWithoutInit = channelManager.subscribe(client, 'test');
    TestAssertions.assertFalse(subscribeWithoutInit, 'Subscribe should fail without client init');

    // Initialize client properly
    channelManager.initClient(client);

    // Test with empty channel name
    const emptyChannelSubscribe = channelManager.subscribe(client, '');
    TestAssertions.assertTrue(emptyChannelSubscribe, 'Empty channel name should be allowed');

    // Test unsubscribing from non-existent channel
    const unsubscribeNonExistent = channelManager.unsubscribe(client, 'non_existent');
    TestAssertions.assertTrue(unsubscribeNonExistent, 'Unsubscribe from non-existent should not fail');

    // Test getting channels for non-initialized client
    const newClient = new MockWebSocket();
    const noChannels = channelManager.getClientChannels(newClient);
    TestAssertions.assertEquals(noChannels.size, 0, 'Non-initialized client should have empty channels');

    // Test direct message to closed WebSocket
    client.close();
    await wait(10);
    const failedSend = channelManager.sendToClient(client, 'test', {});
    TestAssertions.assertFalse(failedSend, 'Sending to closed client should fail');
  });

  // Run all tests
  return await runner.runAll();
}

// Export test function
module.exports = testChannelManager;

// Run tests if this file is executed directly
if (require.main === module) {
  testChannelManager().then(results => {
    process.exit(results.failed > 0 ? 1 : 0);
  }).catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}
const WebSocket = require('ws');

/**
 * Manages WebSocket channel subscriptions and message publishing
 */
class ChannelManager {
  constructor(logger) {
    this.logger = logger;
    this.channels = new Map(); // channelName -> Set of WebSocket clients
    this.clientChannels = new Map(); // WebSocket client -> Set of channelNames
  }

  /**
   * Initialize client connection
   * @param {WebSocket} client - WebSocket client
   */
  initClient(client) {
    this.clientChannels.set(client, new Set());
  }

  /**
   * Subscribe client to a channel
   * @param {WebSocket} client - WebSocket client
   * @param {string} channelName - Channel to subscribe to
   * @returns {boolean} Success status
   */
  subscribe(client, channelName) {
    try {
      // Create channel if it doesn't exist
      if (!this.channels.has(channelName)) {
        this.channels.set(channelName, new Set());
      }

      // Add client to channel
      this.channels.get(channelName).add(client);

      // Track channel for client
      this.clientChannels.get(client).add(channelName);

      this.logger.info(`Client subscribed to channel: ${channelName}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to subscribe to channel ${channelName}:`, error);
      return false;
    }
  }

  /**
   * Unsubscribe client from a channel
   * @param {WebSocket} client - WebSocket client
   * @param {string} channelName - Channel to unsubscribe from
   * @returns {boolean} Success status
   */
  unsubscribe(client, channelName) {
    try {
      if (this.channels.has(channelName)) {
        this.channels.get(channelName).delete(client);

        // Remove empty channels
        if (this.channels.get(channelName).size === 0) {
          this.channels.delete(channelName);
        }
      }

      if (this.clientChannels.has(client)) {
        this.clientChannels.get(client).delete(channelName);
      }

      this.logger.info(`Client unsubscribed from channel: ${channelName}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to unsubscribe from channel ${channelName}:`, error);
      return false;
    }
  }

  /**
   * Publish message to all subscribers of a channel
   * @param {string} channelName - Channel to publish to
   * @param {Object} payload - Message payload
   * @param {WebSocket} excludeClient - Optional client to exclude from broadcast
   * @returns {number} Number of clients message was sent to
   */
  publish(channelName, payload, excludeClient = null) {
    if (!this.channels.has(channelName)) {
      this.logger.warn(`Attempted to publish to non-existent channel: ${channelName}`);
      return 0;
    }

    const message = JSON.stringify({ channel: channelName, payload });
    let sentCount = 0;

    for (const client of this.channels.get(channelName)) {
      if (client === excludeClient) continue;

      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(message);
          sentCount++;
        } catch (error) {
          this.logger.error('Error sending message to client:', error);
          // Remove client from channel if sending fails
          this.removeClient(client);
        }
      }
    }

    this.logger.info(`Published message to channel ${channelName}, reached ${sentCount} clients`);
    return sentCount;
  }

  /**
   * Send message directly to a specific client
   * @param {WebSocket} client - Target client
   * @param {string} action - Message action/type
   * @param {Object} payload - Message payload
   * @returns {boolean} Success status
   */
  sendToClient(client, action, payload) {
    if (!client || client.readyState !== WebSocket.OPEN) {
      return false;
    }

    try {
      const message = JSON.stringify({ action, payload });
      client.send(message);
      return true;
    } catch (error) {
      this.logger.error('Error sending message to client:', error);
      return false;
    }
  }

  /**
   * Get all channels a client is subscribed to
   * @param {WebSocket} client - WebSocket client
   * @returns {Set<string>} Set of channel names
   */
  getClientChannels(client) {
    return this.clientChannels.get(client) || new Set();
  }

  /**
   * Get all clients subscribed to a channel
   * @param {string} channelName - Channel name
   * @returns {Set<WebSocket>} Set of WebSocket clients
   */
  getChannelClients(channelName) {
    return this.channels.get(channelName) || new Set();
  }

  /**
   * Remove client from all channels and cleanup
   * @param {WebSocket} client - WebSocket client to remove
   */
  removeClient(client) {
    if (!this.clientChannels.has(client)) {
      return;
    }

    // Remove client from all subscribed channels
    const subscribedChannels = this.clientChannels.get(client);
    for (const channelName of subscribedChannels) {
      if (this.channels.has(channelName)) {
        this.channels.get(channelName).delete(client);

        // Remove empty channels
        if (this.channels.get(channelName).size === 0) {
          this.channels.delete(channelName);
        }
      }
    }

    // Remove client tracking
    this.clientChannels.delete(client);

    this.logger.info(`Removed client from ${subscribedChannels.size} channels`);
  }

  /**
   * Get server statistics
   * @returns {Object} Statistics object
   */
  getStats() {
    let totalConnections = 0;
    for (const clients of this.channels.values()) {
      totalConnections += clients.size;
    }

    return {
      totalChannels: this.channels.size,
      totalClients: this.clientChannels.size,
      totalConnections: totalConnections,
      channels: Array.from(this.channels.keys()).map(name => ({
        name,
        subscribers: this.channels.get(name).size
      }))
    };
  }
}

module.exports = ChannelManager;
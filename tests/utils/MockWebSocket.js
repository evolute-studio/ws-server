/**
 * Mock WebSocket implementation for testing
 * Simulates WebSocket behavior without actual network connections
 */

const EventEmitter = require('events');

/**
 * Mock WebSocket Client
 */
class MockWebSocket extends EventEmitter {
  constructor(id = null) {
    super();
    this.id = id || `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.readyState = MockWebSocket.CONNECTING;
    this.sentMessages = [];
    this.closed = false;
    this.closeCode = null;
    this.closeReason = null;

    // Simulate connection after a short delay
    setTimeout(() => {
      if (!this.closed) {
        this.readyState = MockWebSocket.OPEN;
        this.emit('open');
      }
    }, 1);
  }

  // WebSocket constants
  static get CONNECTING() { return 0; }
  static get OPEN() { return 1; }
  static get CLOSING() { return 2; }
  static get CLOSED() { return 3; }

  /**
   * Send message (mock implementation)
   * @param {string} data - Message to send
   */
  send(data) {
    if (this.readyState !== MockWebSocket.OPEN) {
      throw new Error(`WebSocket is not open. ReadyState: ${this.readyState}`);
    }

    const message = {
      data: data,
      timestamp: Date.now()
    };

    this.sentMessages.push(message);

    // For testing - we can simulate message echo or responses
    if (this.autoEcho) {
      setTimeout(() => {
        this.emit('message', data);
      }, 1);
    }
  }

  /**
   * Close connection (mock implementation)
   * @param {number} code - Close code
   * @param {string} reason - Close reason
   */
  close(code = 1000, reason = '') {
    if (this.closed) return;

    this.readyState = MockWebSocket.CLOSING;
    this.closeCode = code;
    this.closeReason = reason;

    setTimeout(() => {
      this.readyState = MockWebSocket.CLOSED;
      this.closed = true;
      this.emit('close', code, reason);
    }, 1);
  }

  /**
   * Simulate receiving a message from server
   * @param {string} data - Message data
   */
  simulateMessage(data) {
    if (this.readyState === MockWebSocket.OPEN) {
      this.emit('message', data);
    }
  }

  /**
   * Simulate connection error
   * @param {Error} error - Error object
   */
  simulateError(error) {
    this.emit('error', error);
  }

  /**
   * Get all sent messages
   * @returns {Array} Array of sent messages
   */
  getSentMessages() {
    return [...this.sentMessages];
  }

  /**
   * Get last sent message
   * @returns {Object|null} Last message or null
   */
  getLastSentMessage() {
    return this.sentMessages.length > 0 ? this.sentMessages[this.sentMessages.length - 1] : null;
  }

  /**
   * Clear sent messages history
   */
  clearSentMessages() {
    this.sentMessages = [];
  }

  /**
   * Check if specific message was sent
   * @param {string} messageData - Message to look for
   * @returns {boolean} True if message was sent
   */
  hasSentMessage(messageData) {
    return this.sentMessages.some(msg => msg.data === messageData);
  }

  /**
   * Find sent messages by partial content
   * @param {string} searchContent - Content to search for
   * @returns {Array} Matching messages
   */
  findSentMessages(searchContent) {
    return this.sentMessages.filter(msg => msg.data.includes(searchContent));
  }

  /**
   * Enable auto-echo mode (messages sent are echoed back)
   */
  enableAutoEcho() {
    this.autoEcho = true;
  }

  /**
   * Disable auto-echo mode
   */
  disableAutoEcho() {
    this.autoEcho = false;
  }
}

/**
 * Mock WebSocket Server for testing
 */
class MockWebSocketServer extends EventEmitter {
  constructor() {
    super();
    this.clients = new Set();
    this.connectionCount = 0;
  }

  /**
   * Simulate new client connection
   * @param {string} clientId - Optional client ID
   * @returns {MockWebSocket} Mock client connection
   */
  simulateConnection(clientId = null) {
    const client = new MockWebSocket(clientId);
    this.clients.add(client);
    this.connectionCount++;

    client.on('close', () => {
      this.clients.delete(client);
    });

    // Emit connection event
    setTimeout(() => {
      this.emit('connection', client);
    }, 2);

    return client;
  }

  /**
   * Get all connected clients
   * @returns {Set} Set of connected clients
   */
  getClients() {
    return new Set(this.clients);
  }

  /**
   * Get client by ID
   * @param {string} clientId - Client ID to find
   * @returns {MockWebSocket|null} Client or null
   */
  getClientById(clientId) {
    for (const client of this.clients) {
      if (client.id === clientId) {
        return client;
      }
    }
    return null;
  }

  /**
   * Broadcast message to all clients
   * @param {string} message - Message to broadcast
   */
  broadcast(message) {
    for (const client of this.clients) {
      if (client.readyState === MockWebSocket.OPEN) {
        client.simulateMessage(message);
      }
    }
  }

  /**
   * Close all connections
   */
  closeAll() {
    for (const client of this.clients) {
      client.close(1001, 'Server shutdown');
    }
  }

  /**
   * Get server statistics
   * @returns {Object} Server stats
   */
  getStats() {
    return {
      totalConnections: this.connectionCount,
      activeConnections: this.clients.size,
      clients: Array.from(this.clients).map(client => ({
        id: client.id,
        readyState: client.readyState,
        sentMessagesCount: client.sentMessages.length
      }))
    };
  }
}

/**
 * Factory function to create connected client pairs for testing
 * @param {number} count - Number of client pairs to create
 * @returns {Array} Array of {server, clients} objects
 */
function createMockClientPair(count = 2) {
  const server = new MockWebSocketServer();
  const clients = [];

  for (let i = 0; i < count; i++) {
    const client = server.simulateConnection(`test_client_${i + 1}`);
    clients.push(client);
  }

  return { server, clients };
}

/**
 * Helper to wait for WebSocket events in tests
 * @param {MockWebSocket} socket - Socket to wait for
 * @param {string} event - Event name to wait for
 * @param {number} timeout - Timeout in ms
 * @returns {Promise} Promise that resolves when event occurs
 */
function waitForSocketEvent(socket, event, timeout = 1000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout waiting for ${event} event`));
    }, timeout);

    socket.once(event, (...args) => {
      clearTimeout(timer);
      resolve(args);
    });
  });
}

module.exports = {
  MockWebSocket,
  MockWebSocketServer,
  createMockClientPair,
  waitForSocketEvent
};
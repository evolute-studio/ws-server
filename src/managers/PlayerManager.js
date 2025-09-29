const { TIMEOUTS } = require('../config/constants');

/**
 * Manages player presence tracking and online status
 * Uses WebSocket connections as unique player identifiers for security
 */
class PlayerManager {
  constructor(logger) {
    this.logger = logger;
    this.connectionData = new Map(); // WebSocket -> { address, lastPing, connected, verified, registrationTime }

    // Start automatic cleanup
    this.startCleanupInterval();
  }

  /**
   * Register player with signature verification
   * @param {WebSocket} client - Player's WebSocket connection
   * @param {string} address - Player's Starknet address
   * @param {string} signature - Player's signature
   * @param {string} publicKey - Player's public key
   * @param {number} timestamp - Registration timestamp
   * @returns {Object} Registration result
   */
  registerPlayer(client, address, signature, publicKey, timestamp) {
    const existing = this.connectionData.get(client);

    if (existing && existing.verified) {
      return {
        success: false,
        error: 'ALREADY_REGISTERED',
        message: 'Player is already registered and verified'
      };
    }

    const now = Date.now();
    this.connectionData.set(client, {
      address,
      lastPing: now,
      connected: now,
      verified: true,
      registrationTime: now,
      signature,
      publicKey
    });

    this.logger.info(`Player registered and verified: ${address}`);
    return {
      success: true,
      address,
      verified: true
    };
  }

  /**
   * Check if player is registered and verified
   * @param {WebSocket} client - Player's WebSocket connection
   * @returns {boolean} True if player is registered and verified
   */
  isPlayerVerified(client) {
    const data = this.connectionData.get(client);
    return data && data.verified === true;
  }

  /**
   * Update player's ping data
   * @param {WebSocket} client - Player's WebSocket connection
   * @param {string} address - Player's address for display purposes (only set on first ping)
   */
  updatePing(client, address = null) {
    const now = Date.now();
    const existing = this.connectionData.get(client);

    if (existing) {
      // Client already exists - only update ping, keep original address
      existing.lastPing = now;
      this.logger.debug(`Updated ping for existing client with address ${existing.address}`);

      // Log warning if client tries to change address
      if (address && address !== existing.address) {
        this.logger.warn(`Client ${existing.address} attempted to change address to ${address} - rejected`);
      }
    } else {
      // New client - set initial address
      const finalAddress = address || 'unknown';
      this.connectionData.set(client, {
        address: finalAddress,
        lastPing: now,
        connected: now
      });
      this.logger.info(`New client connected with address ${finalAddress}`);
    }
  }

  /**
   * Check if client is currently online
   * @param {WebSocket} client - WebSocket connection
   * @returns {boolean} True if client is online
   */
  isOnline(client) {
    const data = this.connectionData.get(client);
    if (!data || !data.lastPing) return false;

    const now = Date.now();
    const isOnline = now - data.lastPing < TIMEOUTS.PLAYER_TIMEOUT;

    this.logger.debug(`Client ${data.address}: lastPing=${data.lastPing}, now=${now}, diff=${now - data.lastPing}ms, online=${isOnline}`);

    return isOnline;
  }

  /**
   * Get online status for multiple players by address
   * @param {string[]} addresses - Array of player addresses
   * @returns {boolean[]} Array of online statuses
   */
  getOnlineStatuses(addresses) {
    if (!Array.isArray(addresses)) {
      this.logger.warn('getOnlineStatuses called with non-array:', addresses);
      return [];
    }

    const statuses = addresses.map(address => {
      // Find client by address
      let isOnline = false;
      for (const [client, data] of this.connectionData.entries()) {
        if (data.address === address) {
          isOnline = this.isOnline(client);
          break;
        }
      }
      this.logger.debug(`Address ${address}: online=${isOnline}`);
      return isOnline;
    });

    return statuses;
  }

  /**
   * Get binary string representation of online statuses
   * @param {string[]} addresses - Array of player addresses
   * @returns {string} Binary string (1=online, 0=offline)
   */
  getBinaryOnlineStatuses(addresses) {
    const statuses = this.getOnlineStatuses(addresses);
    return statuses.map(status => status ? '1' : '0').join('');
  }

  /**
   * Get player data by WebSocket connection
   * @param {WebSocket} client - WebSocket connection
   * @returns {Object|null} Player data or null
   */
  getPlayerData(client) {
    return this.connectionData.get(client) || null;
  }

  /**
   * Get client by address
   * @param {string} address - Player address
   * @returns {WebSocket|null} WebSocket connection or null
   */
  getClientByAddress(address) {
    for (const [client, data] of this.connectionData.entries()) {
      if (data.address === address) {
        return client;
      }
    }
    return null;
  }

  /**
   * Get player's WebSocket connection (legacy compatibility)
   * @param {string} playerId - Player identifier (address)
   * @returns {WebSocket|null} Player's connection or null
   */
  getPlayerConnection(playerId) {
    return this.getClientByAddress(playerId);
  }

  /**
   * Get all online players
   * @returns {string[]} Array of online player addresses
   */
  getOnlinePlayers() {
    const now = Date.now();
    const onlinePlayers = [];

    for (const [client, data] of this.connectionData.entries()) {
      if (data.lastPing && now - data.lastPing < TIMEOUTS.PLAYER_TIMEOUT) {
        onlinePlayers.push(data.address);
      }
    }

    return onlinePlayers;
  }

  /**
   * Get all online clients
   * @returns {WebSocket[]} Array of online WebSocket connections
   */
  getOnlineClients() {
    const now = Date.now();
    const onlineClients = [];

    for (const [client, data] of this.connectionData.entries()) {
      if (data.lastPing && now - data.lastPing < TIMEOUTS.PLAYER_TIMEOUT) {
        onlineClients.push(client);
      }
    }

    return onlineClients;
  }

  /**
   * Remove client from tracking
   * @param {WebSocket} client - WebSocket connection
   */
  removeClient(client) {
    const data = this.connectionData.get(client);
    const hadClient = this.connectionData.has(client);
    this.connectionData.delete(client);

    if (hadClient && data) {
      this.logger.info(`Removed client from tracking: ${data.address}`);
    }
  }

  /**
   * Remove connection when client disconnects
   * @param {WebSocket} connection - WebSocket connection
   */
  removeConnection(connection) {
    this.removeClient(connection);
  }

  /**
   * Clean up inactive clients
   */
  cleanupInactiveClients() {
    const now = Date.now();
    const clientsToRemove = [];

    for (const [client, data] of this.connectionData.entries()) {
      if (data.lastPing && now - data.lastPing >= TIMEOUTS.PLAYER_TIMEOUT) {
        clientsToRemove.push({ client, address: data.address });
      }
    }

    for (const { client, address } of clientsToRemove) {
      this.removeClient(client);
      this.logger.info(`Cleaned up inactive client: ${address}`);
    }

    if (clientsToRemove.length > 0) {
      this.logger.info(`Cleanup completed: removed ${clientsToRemove.length} inactive clients`);
    }
  }

  /**
   * Start automatic cleanup interval
   */
  startCleanupInterval() {
    setInterval(() => {
      this.cleanupInactiveClients();
    }, TIMEOUTS.PLAYER_TIMEOUT);

    this.logger.info(`Started client cleanup interval: ${TIMEOUTS.PLAYER_TIMEOUT}ms`);
  }

  /**
   * Get player manager statistics
   * @returns {Object} Statistics object
   */
  getStats() {
    const now = Date.now();
    const totalClients = this.connectionData.size;
    const onlineClients = this.getOnlineClients().length;

    // Calculate average ping age
    let totalPingAge = 0;
    let clientsWithPing = 0;
    for (const data of this.connectionData.values()) {
      if (data.lastPing) {
        totalPingAge += now - data.lastPing;
        clientsWithPing++;
      }
    }
    const avgPingAge = clientsWithPing > 0 ? Math.round(totalPingAge / clientsWithPing) : 0;

    return {
      totalPlayers: totalClients,
      onlinePlayers: onlineClients,
      offlinePlayers: totalClients - onlineClients,
      totalConnections: totalClients,
      averagePingAge: avgPingAge,
      playerTimeout: TIMEOUTS.PLAYER_TIMEOUT
    };
  }

  /**
   * Get detailed client info (for debugging)
   * @returns {Object} Detailed client information
   */
  getDetailedStats() {
    const now = Date.now();
    const clients = [];

    for (const [client, data] of this.connectionData.entries()) {
      const pingAge = data.lastPing ? now - data.lastPing : null;
      const isOnline = data.lastPing ? pingAge < TIMEOUTS.PLAYER_TIMEOUT : false;

      clients.push({
        address: data.address,
        lastPing: data.lastPing,
        connected: data.connected,
        pingAge,
        isOnline,
        clientConnected: client.readyState === 1
      });
    }

    return {
      ...this.getStats(),
      clients: clients.sort((a, b) => (a.pingAge || Infinity) - (b.pingAge || Infinity))
    };
  }
}

module.exports = PlayerManager;
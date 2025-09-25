const { TIMEOUTS } = require('../config/constants');

/**
 * Manages player presence tracking and online status
 */
class PlayerManager {
  constructor(logger) {
    this.logger = logger;
    this.playerLastPing = new Map(); // playerId -> timestamp
    this.playerConnections = new Map(); // playerId -> WebSocket connection

    // Start automatic cleanup
    this.startCleanupInterval();
  }

  /**
   * Update player's last ping timestamp
   * @param {string} playerId - Player identifier
   * @param {WebSocket} connection - Player's WebSocket connection
   */
  updatePing(playerId, connection = null) {
    const now = Date.now();
    this.playerLastPing.set(playerId, now);

    if (connection) {
      this.playerConnections.set(playerId, connection);
    }

    this.logger.debug(`Updated ping for player ${playerId}`);
  }

  /**
   * Check if player is currently online
   * @param {string} playerId - Player identifier
   * @returns {boolean} True if player is online
   */
  isOnline(playerId) {
    const lastPing = this.playerLastPing.get(playerId);
    if (!lastPing) return false;

    const now = Date.now();
    const isOnline = now - lastPing < TIMEOUTS.PLAYER_TIMEOUT;

    this.logger.debug(`Player ${playerId}: lastPing=${lastPing}, now=${now}, diff=${now - lastPing}ms, online=${isOnline}`);

    return isOnline;
  }

  /**
   * Get online status for multiple players
   * @param {string[]} playerIds - Array of player identifiers
   * @returns {boolean[]} Array of online statuses
   */
  getOnlineStatuses(playerIds) {
    if (!Array.isArray(playerIds)) {
      this.logger.warn('getOnlineStatuses called with non-array:', playerIds);
      return [];
    }

    const statuses = playerIds.map(playerId => {
      const isOnline = this.isOnline(playerId);
      this.logger.debug(`Player ${playerId}: online=${isOnline}`);
      return isOnline;
    });

    return statuses;
  }

  /**
   * Get binary string representation of online statuses
   * @param {string[]} playerIds - Array of player identifiers
   * @returns {string} Binary string (1=online, 0=offline)
   */
  getBinaryOnlineStatuses(playerIds) {
    const statuses = this.getOnlineStatuses(playerIds);
    return statuses.map(status => status ? '1' : '0').join('');
  }

  /**
   * Get player's WebSocket connection
   * @param {string} playerId - Player identifier
   * @returns {WebSocket|null} Player's connection or null
   */
  getPlayerConnection(playerId) {
    return this.playerConnections.get(playerId) || null;
  }

  /**
   * Get all online players
   * @returns {string[]} Array of online player IDs
   */
  getOnlinePlayers() {
    const now = Date.now();
    const onlinePlayers = [];

    for (const [playerId, lastPing] of this.playerLastPing.entries()) {
      if (now - lastPing < TIMEOUTS.PLAYER_TIMEOUT) {
        onlinePlayers.push(playerId);
      }
    }

    return onlinePlayers;
  }

  /**
   * Remove player from tracking
   * @param {string} playerId - Player identifier
   */
  removePlayer(playerId) {
    const hadPlayer = this.playerLastPing.has(playerId);
    this.playerLastPing.delete(playerId);
    this.playerConnections.delete(playerId);

    if (hadPlayer) {
      this.logger.info(`Removed player from tracking: ${playerId}`);
    }
  }

  /**
   * Remove connection mapping when client disconnects
   * @param {WebSocket} connection - WebSocket connection
   */
  removeConnection(connection) {
    // Find and remove the player with this connection
    for (const [playerId, conn] of this.playerConnections.entries()) {
      if (conn === connection) {
        this.playerConnections.delete(playerId);
        this.logger.debug(`Removed connection mapping for player: ${playerId}`);
        break;
      }
    }
  }

  /**
   * Clean up inactive players
   */
  cleanupInactivePlayers() {
    const now = Date.now();
    const playersToRemove = [];

    for (const [playerId, lastPing] of this.playerLastPing.entries()) {
      if (now - lastPing >= TIMEOUTS.PLAYER_TIMEOUT) {
        playersToRemove.push(playerId);
      }
    }

    for (const playerId of playersToRemove) {
      this.removePlayer(playerId);
      this.logger.info(`Cleaned up inactive player: ${playerId}`);
    }

    if (playersToRemove.length > 0) {
      this.logger.info(`Cleanup completed: removed ${playersToRemove.length} inactive players`);
    }
  }

  /**
   * Start automatic cleanup interval
   */
  startCleanupInterval() {
    setInterval(() => {
      this.cleanupInactivePlayers();
    }, TIMEOUTS.PLAYER_TIMEOUT);

    this.logger.info(`Started player cleanup interval: ${TIMEOUTS.PLAYER_TIMEOUT}ms`);
  }

  /**
   * Get player manager statistics
   * @returns {Object} Statistics object
   */
  getStats() {
    const now = Date.now();
    const totalPlayers = this.playerLastPing.size;
    const onlinePlayers = this.getOnlinePlayers().length;
    const totalConnections = this.playerConnections.size;

    // Calculate average ping age
    let totalPingAge = 0;
    for (const lastPing of this.playerLastPing.values()) {
      totalPingAge += now - lastPing;
    }
    const avgPingAge = totalPlayers > 0 ? Math.round(totalPingAge / totalPlayers) : 0;

    return {
      totalPlayers,
      onlinePlayers,
      offlinePlayers: totalPlayers - onlinePlayers,
      totalConnections,
      averagePingAge: avgPingAge,
      playerTimeout: TIMEOUTS.PLAYER_TIMEOUT
    };
  }

  /**
   * Force cleanup and get detailed player info (for debugging)
   * @returns {Object} Detailed player information
   */
  getDetailedStats() {
    const now = Date.now();
    const players = [];

    for (const [playerId, lastPing] of this.playerLastPing.entries()) {
      const pingAge = now - lastPing;
      const isOnline = pingAge < TIMEOUTS.PLAYER_TIMEOUT;
      const hasConnection = this.playerConnections.has(playerId);

      players.push({
        playerId,
        lastPing,
        pingAge,
        isOnline,
        hasConnection
      });
    }

    return {
      ...this.getStats(),
      players: players.sort((a, b) => a.pingAge - b.pingAge)
    };
  }
}

module.exports = PlayerManager;
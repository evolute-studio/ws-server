const { LOBBY_STATUS, LOBBY_CONFIG } = require('../config/constants');

/**
 * Lobby data structure with clearly defined fields
 * Uses WebSocket connections as player identifiers for security
 */
class Lobby {
  /**
   * Create a new lobby
   * @param {string} code - Unique lobby code
   * @param {WebSocket} hostClient - Host WebSocket connection
   * @param {PlayerManager} playerManager - PlayerManager instance for getting display addresses
   */
  constructor(code, hostClient, playerManager = null) {
    // Required fields
    this.code = code;                    // Unique 6-character lobby code
    this.host = hostClient;              // WebSocket connection of the lobby host
    this.players = [hostClient];         // Array of active player WebSocket connections (max 2 for 1v1)
    this.spectators = [];                // Array of spectator WebSocket connections (max 10)
    this.status = LOBBY_STATUS.WAITING;  // Current lobby status (waiting/ready)
    this.created = Date.now();           // Timestamp when lobby was created
    this.lastActivity = Date.now();      // Timestamp of last activity
    this.chatHistory = [];               // Array of chat message objects

    // Match-related (for blockchain integration)
    this.currentMatch = null;            // Current match ID (if any)

    // Helper reference for getting display information
    this.playerManager = playerManager;
  }

  /**
   * Get display address for a client
   * @param {WebSocket} client - WebSocket connection
   * @returns {string} Display address or 'unknown'
   */
  getClientAddress(client) {
    if (!this.playerManager) return 'unknown';
    const data = this.playerManager.getPlayerData(client);
    return data ? data.address : 'unknown';
  }

  /**
   * Get total number of members (players + spectators)
   * @returns {number} Total member count
   */
  getTotalMembers() {
    return this.players.length + this.spectators.length;
  }

  /**
   * Check if lobby has available player slots
   * @returns {boolean} True if player slots available
   */
  hasPlayerSlots() {
    return this.players.length < LOBBY_CONFIG.MAX_PLAYERS;
  }

  /**
   * Check if lobby has available spectator slots
   * @returns {boolean} True if spectator slots available
   */
  hasSpectatorSlots() {
    return this.spectators.length < LOBBY_CONFIG.MAX_SPECTATORS;
  }

  /**
   * Check if a client is a member of this lobby
   * @param {WebSocket} client - WebSocket connection to check
   * @returns {boolean} True if client is in lobby
   */
  hasMember(client) {
    return this.players.includes(client) || this.spectators.includes(client);
  }

  /**
   * Check if a client is the host
   * @param {WebSocket} client - WebSocket connection to check
   * @returns {boolean} True if client is the host
   */
  isHost(client) {
    return this.host === client;
  }

  /**
   * Get client role in lobby
   * @param {WebSocket} client - WebSocket connection
   * @returns {string|null} Player role or null if not in lobby
   */
  getPlayerRole(client) {
    const { PLAYER_ROLES } = require('../config/constants');
    if (this.players.includes(client)) return PLAYER_ROLES.PLAYER;
    if (this.spectators.includes(client)) return PLAYER_ROLES.SPECTATOR;
    return null;
  }

  /**
   * Add a chat message to history (keeps last 50 messages)
   * @param {WebSocket} client - Sender WebSocket connection
   * @param {string} message - Chat message
   * @returns {Object} Chat message object
   */
  addChatMessage(client, message) {
    const chatMessage = {
      playerId: this.getClientAddress(client),
      message: message.trim(),
      timestamp: Date.now()
    };

    this.chatHistory.push(chatMessage);
    if (this.chatHistory.length > 50) {
      this.chatHistory = this.chatHistory.slice(-50);
    }

    this.updateActivity();
    return chatMessage;
  }

  /**
   * Update last activity timestamp
   */
  updateActivity() {
    this.lastActivity = Date.now();
  }

  /**
   * Update lobby status based on player count
   */
  updateStatus() {
    if (this.players.length === LOBBY_CONFIG.MAX_PLAYERS) {
      this.status = LOBBY_STATUS.READY;
    } else {
      this.status = LOBBY_STATUS.WAITING;
    }
    this.updateActivity();
  }

  /**
   * Add client to lobby
   * @param {WebSocket} client - WebSocket connection to add
   * @param {string} role - Role to add as ('player' or 'spectator')
   * @returns {boolean} True if successfully added
   */
  addPlayer(client, role) {
    const { PLAYER_ROLES } = require('../config/constants');

    if (this.hasMember(client)) return false;

    if (role === PLAYER_ROLES.PLAYER) {
      if (!this.hasPlayerSlots()) return false;
      this.players.push(client);
    } else if (role === PLAYER_ROLES.SPECTATOR) {
      if (!this.hasSpectatorSlots()) return false;
      this.spectators.push(client);
    } else {
      return false;
    }

    this.updateStatus();
    return true;
  }

  /**
   * Remove client from lobby
   * @param {WebSocket} client - WebSocket connection to remove
   * @returns {Object} Result with success status and role removed
   */
  removePlayer(client) {
    const { PLAYER_ROLES } = require('../config/constants');

    let removedRole = null;

    const playerIndex = this.players.indexOf(client);
    if (playerIndex !== -1) {
      this.players.splice(playerIndex, 1);
      removedRole = PLAYER_ROLES.PLAYER;
    }

    const spectatorIndex = this.spectators.indexOf(client);
    if (spectatorIndex !== -1) {
      this.spectators.splice(spectatorIndex, 1);
      removedRole = PLAYER_ROLES.SPECTATOR;
    }

    if (removedRole) {
      this.updateStatus();
      return { success: true, role: removedRole };
    }

    return { success: false, role: null };
  }

  /**
   * Change client role between player and spectator
   * @param {WebSocket} client - WebSocket connection
   * @param {string} newRole - New role
   * @returns {Object} Result with success status
   */
  changePlayerRole(client, newRole) {
    const { PLAYER_ROLES } = require('../config/constants');

    const currentRole = this.getPlayerRole(client);
    if (!currentRole || currentRole === newRole) {
      return { success: false, message: 'Invalid role change request' };
    }

    // Check if new role slot is available
    if (newRole === PLAYER_ROLES.PLAYER && !this.hasPlayerSlots()) {
      return { success: false, message: 'No player slots available' };
    }
    if (newRole === PLAYER_ROLES.SPECTATOR && !this.hasSpectatorSlots()) {
      return { success: false, message: 'No spectator slots available' };
    }

    // Remove from current role array
    this.removePlayer(client);

    // Add to new role array
    if (this.addPlayer(client, newRole)) {
      return { success: true, newRole };
    }

    // If failed, try to restore to original role (should not happen)
    this.addPlayer(client, currentRole);
    return { success: false, message: 'Failed to change role' };
  }

  /**
   * Transfer host to another client
   * @param {WebSocket} newHostClient - New host WebSocket connection
   * @returns {boolean} True if successful
   */
  transferHost(newHostClient) {
    if (!this.players.includes(newHostClient)) return false;
    this.host = newHostClient;
    this.updateActivity();
    return true;
  }

  /**
   * Get sanitized lobby data for client
   * @returns {Object} Sanitized lobby object
   */
  toClientData() {
    return {
      code: this.code,
      host: this.getClientAddress(this.host),
      players: this.players.map(client => this.getClientAddress(client)),
      spectators: this.spectators.map(client => this.getClientAddress(client)),
      status: this.status,
      created: this.created,
      lastActivity: this.lastActivity,
      currentMatch: this.currentMatch,
      chatHistory: [...this.chatHistory]
    };
  }

  /**
   * Check if lobby is inactive
   * @param {number} timeoutMs - Timeout in milliseconds
   * @returns {boolean} True if inactive
   */
  isInactive(timeoutMs) {
    return Date.now() - this.lastActivity >= timeoutMs;
  }
}

module.exports = Lobby;
const { LOBBY_STATUS, LOBBY_CONFIG } = require('../config/constants');

/**
 * Lobby data structure with clearly defined fields
 */
class Lobby {
  /**
   * Create a new lobby
   * @param {string} code - Unique lobby code
   * @param {string} hostId - Host player ID
   */
  constructor(code, hostId) {
    // Required fields
    this.code = code;                    // Unique 6-character lobby code
    this.host = hostId;                  // Player ID of the lobby host
    this.players = [hostId];             // Array of active player IDs (max 2 for 1v1)
    this.spectators = [];                // Array of spectator player IDs (max 10)
    this.status = LOBBY_STATUS.WAITING;  // Current lobby status (waiting/ready)
    this.created = Date.now();           // Timestamp when lobby was created
    this.lastActivity = Date.now();      // Timestamp of last activity
    this.chatHistory = [];               // Array of chat message objects

    // Match-related (for blockchain integration)
    this.currentMatch = null;            // Current match ID (if any)
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
   * Check if a player is a member of this lobby
   * @param {string} playerId - Player ID to check
   * @returns {boolean} True if player is in lobby
   */
  hasMember(playerId) {
    return this.players.includes(playerId) || this.spectators.includes(playerId);
  }

  /**
   * Check if a player is the host
   * @param {string} playerId - Player ID to check
   * @returns {boolean} True if player is the host
   */
  isHost(playerId) {
    return this.host === playerId;
  }

  /**
   * Get player role in lobby
   * @param {string} playerId - Player ID
   * @returns {string|null} Player role or null if not in lobby
   */
  getPlayerRole(playerId) {
    const { PLAYER_ROLES } = require('../config/constants');
    if (this.players.includes(playerId)) return PLAYER_ROLES.PLAYER;
    if (this.spectators.includes(playerId)) return PLAYER_ROLES.SPECTATOR;
    return null;
  }

  /**
   * Add a chat message to history (keeps last 50 messages)
   * @param {string} playerId - Sender player ID
   * @param {string} message - Chat message
   * @returns {Object} Chat message object
   */
  addChatMessage(playerId, message) {
    const chatMessage = {
      playerId,
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
   * Add player to lobby
   * @param {string} playerId - Player ID to add
   * @param {string} role - Role to add as ('player' or 'spectator')
   * @returns {boolean} True if successfully added
   */
  addPlayer(playerId, role) {
    const { PLAYER_ROLES } = require('../config/constants');

    if (this.hasMember(playerId)) return false;

    if (role === PLAYER_ROLES.PLAYER) {
      if (!this.hasPlayerSlots()) return false;
      this.players.push(playerId);
    } else if (role === PLAYER_ROLES.SPECTATOR) {
      if (!this.hasSpectatorSlots()) return false;
      this.spectators.push(playerId);
    } else {
      return false;
    }

    this.updateStatus();
    return true;
  }

  /**
   * Remove player from lobby
   * @param {string} playerId - Player ID to remove
   * @returns {Object} Result with success status and role removed
   */
  removePlayer(playerId) {
    const { PLAYER_ROLES } = require('../config/constants');

    let removedRole = null;

    const playerIndex = this.players.indexOf(playerId);
    if (playerIndex !== -1) {
      this.players.splice(playerIndex, 1);
      removedRole = PLAYER_ROLES.PLAYER;
    }

    const spectatorIndex = this.spectators.indexOf(playerId);
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
   * Change player role between player and spectator
   * @param {string} playerId - Player ID
   * @param {string} newRole - New role
   * @returns {Object} Result with success status
   */
  changePlayerRole(playerId, newRole) {
    const { PLAYER_ROLES } = require('../config/constants');

    const currentRole = this.getPlayerRole(playerId);
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
    this.removePlayer(playerId);

    // Add to new role array
    if (this.addPlayer(playerId, newRole)) {
      return { success: true, newRole };
    }

    // If failed, try to restore to original role (should not happen)
    this.addPlayer(playerId, currentRole);
    return { success: false, message: 'Failed to change role' };
  }

  /**
   * Transfer host to another player
   * @param {string} newHostId - New host player ID
   * @returns {boolean} True if successful
   */
  transferHost(newHostId) {
    if (!this.players.includes(newHostId)) return false;
    this.host = newHostId;
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
      host: this.host,
      players: [...this.players],
      spectators: [...this.spectators],
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
const {
  TIMEOUTS,
  LOBBY_CONFIG,
  PLAYER_ROLES,
  LOBBY_STATUS,
  EVENTS,
  ERROR_TYPES
} = require('../config/constants');
const Lobby = require('../models/Lobby');

/**
 * Manages lobby system: creation, joining, invitations, matches
 */
class LobbyManager {
  constructor(logger, playerManager, channelManager) {
    this.logger = logger;
    this.playerManager = playerManager;
    this.channelManager = channelManager;

    this.lobbies = new Map(); // lobbyCode -> lobby object
    this.playerLobbies = new Map(); // playerId -> lobbyCode
    this.lobbyInvitations = new Map(); // targetPlayerId -> Set of invitations
    this.lobbyMatches = new Map(); // matchId -> match object

    // Start cleanup intervals
    this.startCleanupIntervals();
  }

  /**
   * Generate unique lobby code
   * @returns {string} 6-character lobby code
   */
  generateLobbyCode() {
    let code;
    do {
      code = '';
      for (let i = 0; i < LOBBY_CONFIG.CODE_LENGTH; i++) {
        const randomIndex = Math.floor(Math.random() * LOBBY_CONFIG.CODE_CHARSET.length);
        code += LOBBY_CONFIG.CODE_CHARSET[randomIndex];
      }
    } while (this.lobbies.has(code));

    return code;
  }

  /**
   * Create new lobby
   * @param {string} hostId - Host player ID
   * @returns {Object} Result object with lobby info or error
   */
  createLobby(hostId) {
    try {
      // Validate host ID
      if (!hostId || typeof hostId !== 'string' || hostId.trim() === '') {
        return {
          success: false,
          error: ERROR_TYPES.INVALID_PAYLOAD,
          message: 'Valid host ID is required'
        };
      }

      // Check if player is already in a lobby
      if (this.playerLobbies.has(hostId)) {
        return {
          success: false,
          error: ERROR_TYPES.ALREADY_IN_LOBBY,
          message: 'Player is already in a lobby'
        };
      }

      // Check if player is online
      if (!this.playerManager.isOnline(hostId)) {
        return {
          success: false,
          error: ERROR_TYPES.PLAYER_NOT_FOUND,
          message: 'Host player is not online'
        };
      }

      const code = this.generateLobbyCode();
      const lobby = new Lobby(code, hostId);

      this.lobbies.set(code, lobby);
      this.playerLobbies.set(hostId, code);

      // Subscribe host to lobby channel
      const hostConnection = this.playerManager.getPlayerConnection(hostId);
      if (hostConnection) {
        this.channelManager.subscribe(hostConnection, `lobby_${code}`);
      }

      this.logger.info(`Lobby created: ${code} by ${hostId}`);

      return {
        success: true,
        lobby: lobby.toClientData(),
        event: EVENTS.LOBBY_CREATED
      };

    } catch (error) {
      this.logger.error('Error creating lobby:', error);
      return {
        success: false,
        error: ERROR_TYPES.LOBBY_NOT_FOUND,
        message: 'Failed to create lobby'
      };
    }
  }

  /**
   * Join lobby by code
   * @param {string} playerId - Player ID
   * @param {string} lobbyCode - Lobby code to join
   * @param {string} role - Role to join as ('player' or 'spectator')
   * @returns {Object} Result object
   */
  joinLobby(playerId, lobbyCode, role = PLAYER_ROLES.PLAYER) {
    try {
      // Validate player ID
      if (!playerId || typeof playerId !== 'string' || playerId.trim() === '') {
        return {
          success: false,
          error: ERROR_TYPES.INVALID_PAYLOAD,
          message: 'Valid player ID is required'
        };
      }

      // Validate lobby code
      if (!lobbyCode || typeof lobbyCode !== 'string' || lobbyCode.trim() === '') {
        return {
          success: false,
          error: ERROR_TYPES.INVALID_PAYLOAD,
          message: 'Valid lobby code is required'
        };
      }

      // Check if player is already in a lobby
      if (this.playerLobbies.has(playerId)) {
        return {
          success: false,
          error: ERROR_TYPES.ALREADY_IN_LOBBY,
          message: 'Player is already in a lobby'
        };
      }

      // Check if player is online
      if (!this.playerManager.isOnline(playerId)) {
        return {
          success: false,
          error: ERROR_TYPES.PLAYER_NOT_FOUND,
          message: 'Player is not online'
        };
      }

      const lobby = this.lobbies.get(lobbyCode);
      if (!lobby) {
        return {
          success: false,
          error: ERROR_TYPES.LOBBY_NOT_FOUND,
          message: 'Lobby not found'
        };
      }

      // Check capacity based on role
      if (role === PLAYER_ROLES.PLAYER) {
        if (!lobby.hasPlayerSlots()) {
          // Try to join as spectator instead
          role = PLAYER_ROLES.SPECTATOR;
        }
      }

      if (role === PLAYER_ROLES.SPECTATOR) {
        if (!lobby.hasSpectatorSlots()) {
          return {
            success: false,
            error: ERROR_TYPES.LOBBY_FULL,
            message: 'Lobby is full'
          };
        }
      }

      // Add player using Lobby class method
      if (!lobby.addPlayer(playerId, role)) {
        return {
          success: false,
          error: ERROR_TYPES.LOBBY_FULL,
          message: 'Failed to add player to lobby'
        };
      }

      this.playerLobbies.set(playerId, lobbyCode);

      // Subscribe player to lobby channel
      const playerConnection = this.playerManager.getPlayerConnection(playerId);
      if (playerConnection) {
        this.channelManager.subscribe(playerConnection, `lobby_${lobbyCode}`);
      }

      // Notify all lobby members
      this.broadcastToLobby(lobbyCode, EVENTS.LOBBY_JOINED, {
        playerId,
        role,
        lobby: lobby.toClientData()
      });

      this.logger.info(`Player ${playerId} joined lobby ${lobbyCode} as ${role}`);

      return {
        success: true,
        lobby: lobby.toClientData(),
        role,
        event: EVENTS.LOBBY_JOINED
      };

    } catch (error) {
      this.logger.error('Error joining lobby:', error);
      return {
        success: false,
        error: ERROR_TYPES.LOBBY_NOT_FOUND,
        message: 'Failed to join lobby'
      };
    }
  }

  /**
   * Leave lobby
   * @param {string} playerId - Player ID
   * @returns {Object} Result object
   */
  leaveLobby(playerId) {
    try {
      const lobbyCode = this.playerLobbies.get(playerId);
      if (!lobbyCode) {
        return {
          success: false,
          error: ERROR_TYPES.LOBBY_NOT_FOUND,
          message: 'Player is not in any lobby'
        };
      }

      const lobby = this.lobbies.get(lobbyCode);
      if (!lobby) {
        // Clean up orphaned player mapping
        this.playerLobbies.delete(playerId);
        return {
          success: false,
          error: ERROR_TYPES.LOBBY_NOT_FOUND,
          message: 'Lobby not found'
        };
      }

      // Remove player from lobby
      const removeResult = lobby.removePlayer(playerId);
      if (!removeResult.success) {
        return {
          success: false,
          error: ERROR_TYPES.PLAYER_NOT_FOUND,
          message: 'Player not found in lobby'
        };
      }
      // const wasPlayer = removeResult.role === PLAYER_ROLES.PLAYER;  // Not used here

      this.playerLobbies.delete(playerId);

      // Unsubscribe from lobby channel
      const playerConnection = this.playerManager.getPlayerConnection(playerId);
      if (playerConnection) {
        this.channelManager.unsubscribe(playerConnection, `lobby_${lobbyCode}`);
      }

      // Handle host leaving
      if (lobby.isHost(playerId)) {
        if (lobby.players.length > 0) {
          // Transfer host to first remaining player
          lobby.host = lobby.players[0];
          this.logger.info(`Host transferred to ${lobby.host} in lobby ${lobbyCode}`);
        } else {
          // No players left, close lobby
          this.closeLobby(lobbyCode);
          return {
            success: true,
            event: EVENTS.LOBBY_LEFT,
            lobbyClosed: true
          };
        }
      }

      // Update lobby status
      if (lobby.players.length < LOBBY_CONFIG.MAX_PLAYERS && lobby.status === LOBBY_STATUS.READY) {
        lobby.status = LOBBY_STATUS.WAITING;
      }

      // Notify remaining lobby members
      this.broadcastToLobby(lobbyCode, EVENTS.LOBBY_LEFT, {
        playerId,
        role: removeResult.role,
        lobby: this.sanitizeLobbyForClient(lobby)
      });

      this.logger.info(`Player ${playerId} left lobby ${lobbyCode}`);

      return {
        success: true,
        event: EVENTS.LOBBY_LEFT,
        lobby: this.sanitizeLobbyForClient(lobby)
      };

    } catch (error) {
      this.logger.error('Error leaving lobby:', error);
      return {
        success: false,
        error: ERROR_TYPES.LOBBY_NOT_FOUND,
        message: 'Failed to leave lobby'
      };
    }
  }

  /**
   * Get lobby information
   * @param {string} lobbyCode - Lobby code
   * @param {string} requesterId - Player requesting the info
   * @returns {Object} Result object with lobby info
   */
  getLobbyInfo(lobbyCode, requesterId = null) {
    const lobby = this.lobbies.get(lobbyCode);
    if (!lobby) {
      return {
        success: false,
        error: ERROR_TYPES.LOBBY_NOT_FOUND,
        message: 'Lobby not found'
      };
    }

    return {
      success: true,
      lobby: this.sanitizeLobbyForClient(lobby),
      isHost: requesterId === lobby.host,
      playerRole: this.getPlayerRole(requesterId, lobby)
    };
  }

  /**
   * Send invitation to player
   * @param {string} fromPlayerId - Inviting player ID
   * @param {string} targetPlayerId - Target player ID
   * @returns {Object} Result object
   */
  invitePlayer(fromPlayerId, targetPlayerId) {
    try {
      const lobbyCode = this.playerLobbies.get(fromPlayerId);
      if (!lobbyCode) {
        return {
          success: false,
          error: ERROR_TYPES.LOBBY_NOT_FOUND,
          message: 'Inviter is not in any lobby'
        };
      }

      const lobby = this.lobbies.get(lobbyCode);
      if (!lobby) {
        return {
          success: false,
          error: ERROR_TYPES.LOBBY_NOT_FOUND,
          message: 'Lobby not found'
        };
      }

      // Check if target player is online
      if (!this.playerManager.isOnline(targetPlayerId)) {
        return {
          success: false,
          error: ERROR_TYPES.PLAYER_NOT_FOUND,
          message: 'Target player is not online'
        };
      }

      // Check if target is already in a lobby
      if (this.playerLobbies.has(targetPlayerId)) {
        return {
          success: false,
          error: ERROR_TYPES.ALREADY_IN_LOBBY,
          message: 'Target player is already in a lobby'
        };
      }

      const invitation = {
        fromPlayerId,
        fromPlayerName: fromPlayerId, // Could be enhanced with actual names
        lobbyCode,
        timestamp: Date.now()
      };

      // Add invitation
      if (!this.lobbyInvitations.has(targetPlayerId)) {
        this.lobbyInvitations.set(targetPlayerId, new Set());
      }
      this.lobbyInvitations.get(targetPlayerId).add(invitation);

      // Send invitation to target player
      const targetConnection = this.playerManager.getPlayerConnection(targetPlayerId);
      if (targetConnection) {
        this.channelManager.sendToClient(targetConnection, EVENTS.INVITATION_RECEIVED, {
          invitation: {
            ...invitation,
            lobbyInfo: lobby.toClientData()
          }
        });
      }

      this.logger.info(`Invitation sent from ${fromPlayerId} to ${targetPlayerId} for lobby ${lobbyCode}`);

      return {
        success: true,
        event: EVENTS.INVITATION_RECEIVED
      };

    } catch (error) {
      this.logger.error('Error sending invitation:', error);
      return {
        success: false,
        error: ERROR_TYPES.INVITATION_NOT_FOUND,
        message: 'Failed to send invitation'
      };
    }
  }

  /**
   * Accept invitation
   * @param {string} playerId - Player accepting invitation
   * @param {string} fromPlayerId - Original inviter
   * @param {string} lobbyCode - Lobby code
   * @returns {Object} Result object
   */
  acceptInvitation(playerId, fromPlayerId, lobbyCode) {
    try {
      const invitations = this.lobbyInvitations.get(playerId);
      if (!invitations) {
        return {
          success: false,
          error: ERROR_TYPES.INVITATION_NOT_FOUND,
          message: 'No invitations found'
        };
      }

      // Find the specific invitation
      let invitation = null;
      for (const inv of invitations) {
        if (inv.fromPlayerId === fromPlayerId && inv.lobbyCode === lobbyCode) {
          invitation = inv;
          break;
        }
      }

      if (!invitation) {
        return {
          success: false,
          error: ERROR_TYPES.INVITATION_NOT_FOUND,
          message: 'Invitation not found'
        };
      }

      // Remove the invitation
      invitations.delete(invitation);
      if (invitations.size === 0) {
        this.lobbyInvitations.delete(playerId);
      }

      // Join the lobby
      const joinResult = this.joinLobby(playerId, lobbyCode, PLAYER_ROLES.PLAYER);

      if (joinResult.success) {
        // Notify inviter
        const inviterConnection = this.playerManager.getPlayerConnection(fromPlayerId);
        if (inviterConnection) {
          this.channelManager.sendToClient(inviterConnection, EVENTS.INVITATION_ACCEPTED, {
            playerId,
            lobbyCode
          });
        }
      }

      return joinResult;

    } catch (error) {
      this.logger.error('Error accepting invitation:', error);
      return {
        success: false,
        error: ERROR_TYPES.INVITATION_NOT_FOUND,
        message: 'Failed to accept invitation'
      };
    }
  }

  /**
   * Decline invitation
   * @param {string} playerId - Player declining invitation
   * @param {string} fromPlayerId - Original inviter
   * @param {string} lobbyCode - Lobby code
   * @returns {Object} Result object
   */
  declineInvitation(playerId, fromPlayerId, lobbyCode) {
    try {
      const invitations = this.lobbyInvitations.get(playerId);
      if (!invitations) {
        return {
          success: false,
          error: ERROR_TYPES.INVITATION_NOT_FOUND,
          message: 'No invitations found'
        };
      }

      // Find and remove the specific invitation
      let found = false;
      for (const inv of invitations) {
        if (inv.fromPlayerId === fromPlayerId && inv.lobbyCode === lobbyCode) {
          invitations.delete(inv);
          found = true;
          break;
        }
      }

      if (!found) {
        return {
          success: false,
          error: ERROR_TYPES.INVITATION_NOT_FOUND,
          message: 'Invitation not found'
        };
      }

      if (invitations.size === 0) {
        this.lobbyInvitations.delete(playerId);
      }

      // Notify inviter
      const inviterConnection = this.playerManager.getPlayerConnection(fromPlayerId);
      if (inviterConnection) {
        this.channelManager.sendToClient(inviterConnection, EVENTS.INVITATION_DECLINED, {
          playerId,
          lobbyCode
        });
      }

      this.logger.info(`Invitation declined by ${playerId} from ${fromPlayerId} for lobby ${lobbyCode}`);

      return {
        success: true,
        event: EVENTS.INVITATION_DECLINED
      };

    } catch (error) {
      this.logger.error('Error declining invitation:', error);
      return {
        success: false,
        error: ERROR_TYPES.INVITATION_NOT_FOUND,
        message: 'Failed to decline invitation'
      };
    }
  }

  /**
   * Kick player from lobby (host only)
   * @param {string} hostId - Host player ID
   * @param {string} targetPlayerId - Player to kick
   * @returns {Object} Result object
   */
  kickPlayer(hostId, targetPlayerId) {
    try {
      const lobbyCode = this.playerLobbies.get(hostId);
      if (!lobbyCode) {
        return {
          success: false,
          error: ERROR_TYPES.LOBBY_NOT_FOUND,
          message: 'Host is not in any lobby'
        };
      }

      const lobby = this.lobbies.get(lobbyCode);
      if (!lobby || !lobby.isHost(hostId)) {
        return {
          success: false,
          error: ERROR_TYPES.PERMISSION_DENIED,
          message: 'Only lobby host can kick players'
        };
      }

      if (!lobby.hasMember(targetPlayerId)) {
        return {
          success: false,
          error: ERROR_TYPES.PLAYER_NOT_FOUND,
          message: 'Player not found in lobby'
        };
      }

      if (targetPlayerId === hostId) {
        return {
          success: false,
          error: ERROR_TYPES.PERMISSION_DENIED,
          message: 'Host cannot kick themselves'
        };
      }

      // Remove player
      lobby.removePlayer(targetPlayerId);

      this.playerLobbies.delete(targetPlayerId);

      // Unsubscribe kicked player
      const targetConnection = this.playerManager.getPlayerConnection(targetPlayerId);
      if (targetConnection) {
        this.channelManager.unsubscribe(targetConnection, `lobby_${lobbyCode}`);
        this.channelManager.sendToClient(targetConnection, EVENTS.PLAYER_KICKED, {
          lobbyCode,
          kickedBy: hostId
        });
      }

      // Notify remaining lobby members
      this.broadcastToLobby(lobbyCode, EVENTS.PLAYER_KICKED, {
        kickedPlayerId: targetPlayerId,
        kickedBy: hostId,
        lobby: lobby.toClientData()
      });

      this.logger.info(`Player ${targetPlayerId} kicked from lobby ${lobbyCode} by ${hostId}`);

      return {
        success: true,
        event: EVENTS.PLAYER_KICKED
      };

    } catch (error) {
      this.logger.error('Error kicking player:', error);
      return {
        success: false,
        error: ERROR_TYPES.PERMISSION_DENIED,
        message: 'Failed to kick player'
      };
    }
  }

  /**
   * Change player role between player and spectator
   * @param {string} playerId - Player ID requesting role change
   * @param {string} newRole - New role (player or spectator)
   * @returns {Object} Result object
   */
  changeRole(playerId, newRole) {
    try {
      // Validate role (only player and spectator are allowed)
      if (newRole !== PLAYER_ROLES.PLAYER && newRole !== PLAYER_ROLES.SPECTATOR) {
        return {
          success: false,
          error: ERROR_TYPES.INVALID_PAYLOAD,
          message: 'Invalid role specified. Only player and spectator roles are allowed'
        };
      }

      const lobbyCode = this.playerLobbies.get(playerId);
      if (!lobbyCode) {
        return {
          success: false,
          error: ERROR_TYPES.LOBBY_NOT_FOUND,
          message: 'Player is not in any lobby'
        };
      }

      const lobby = this.lobbies.get(lobbyCode);
      if (!lobby) {
        return {
          success: false,
          error: ERROR_TYPES.LOBBY_NOT_FOUND,
          message: 'Lobby not found'
        };
      }

      // Use Lobby class method to change role
      const changeResult = lobby.changePlayerRole(playerId, newRole);
      if (!changeResult.success) {
        return {
          success: false,
          error: ERROR_TYPES.INVALID_PAYLOAD,
          message: changeResult.message
        };
      }

      // Broadcast role change to all lobby members
      this.broadcastToLobby(lobbyCode, EVENTS.ROLE_CHANGED, {
        playerId,
        newRole: changeResult.newRole,
        lobby: lobby.toClientData()
      });

      this.logger.info(`Player ${playerId} changed role to ${changeResult.newRole} in lobby ${lobbyCode}`);

      return {
        success: true,
        newRole: changeResult.newRole,
        lobby: lobby.toClientData(),
        event: EVENTS.ROLE_CHANGED
      };

    } catch (error) {
      this.logger.error('Error changing role:', error);
      return {
        success: false,
        error: ERROR_TYPES.UNKNOWN_ERROR,
        message: 'Failed to change role'
      };
    }
  }

  /**
   * Send chat message to lobby
   * @param {string} playerId - Sender player ID
   * @param {string} message - Chat message
   * @returns {Object} Result object
   */
  sendLobbyChat(playerId, message) {
    try {
      const lobbyCode = this.playerLobbies.get(playerId);
      if (!lobbyCode) {
        return {
          success: false,
          error: ERROR_TYPES.LOBBY_NOT_FOUND,
          message: 'Player is not in any lobby'
        };
      }

      const lobby = this.lobbies.get(lobbyCode);
      if (!lobby) {
        return {
          success: false,
          error: ERROR_TYPES.LOBBY_NOT_FOUND,
          message: 'Lobby not found'
        };
      }

      // Add chat message using Lobby class method
      const chatMessage = lobby.addChatMessage(playerId, message);

      // Broadcast to all lobby members
      this.broadcastToLobby(lobbyCode, EVENTS.LOBBY_CHAT_MESSAGE, chatMessage);

      return {
        success: true,
        event: EVENTS.LOBBY_CHAT_MESSAGE
      };

    } catch (error) {
      this.logger.error('Error sending lobby chat:', error);
      return {
        success: false,
        error: ERROR_TYPES.LOBBY_NOT_FOUND,
        message: 'Failed to send chat message'
      };
    }
  }
  
  /**
   * Close lobby and clean up
   * @param {string} lobbyCode - Lobby code
   */
  closeLobby(lobbyCode) {
    const lobby = this.lobbies.get(lobbyCode);
    if (!lobby) return;

    // Remove all players from lobby mapping
    const allMembers = [...lobby.players, ...lobby.spectators];
    for (const playerId of allMembers) {
      this.playerLobbies.delete(playerId);

      // Unsubscribe from lobby channel
      const connection = this.playerManager.getPlayerConnection(playerId);
      if (connection) {
        this.channelManager.unsubscribe(connection, `lobby_${lobbyCode}`);
      }
    }

    // Clean up match if exists
    if (lobby.currentMatch) {
      this.lobbyMatches.delete(lobby.currentMatch);
    }

    this.lobbies.delete(lobbyCode);
    this.logger.info(`Lobby ${lobbyCode} closed`);
  }

  /**
   * Broadcast message to all lobby members
   * @param {string} lobbyCode - Lobby code
   * @param {string} event - Event type
   * @param {Object} payload - Message payload
   */
  broadcastToLobby(lobbyCode, event, payload) {
    this.channelManager.publish(`lobby_${lobbyCode}`, {
      action: event,
      payload
    });
  }

  /**
   * Get player role in lobby (deprecated - use lobby.getPlayerRole instead)
   * @param {string} playerId - Player ID
   * @param {Object} lobby - Lobby object
   * @returns {string} Player role
   */
  getPlayerRole(playerId, lobby) {
    return lobby.getPlayerRole(playerId);
  }

  /**
   * Update lobby status based on player count (deprecated - Lobby class handles this)
   * @param {Object} lobby - Lobby object
   */
  updateLobbyStatus(lobby) {
    lobby.updateStatus();
  }

  /**
   * Sanitize lobby object for client (deprecated - use lobby.toClientData instead)
   * @param {Object} lobby - Full lobby object
   * @returns {Object} Sanitized lobby object
   */
  sanitizeLobbyForClient(lobby) {
    return lobby.toClientData();
  }

  /**
   * Clean up expired invitations
   */
  cleanupInvitations() {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [playerId, invitations] of this.lobbyInvitations.entries()) {
      const validInvitations = new Set();

      for (const invitation of invitations) {
        if (now - invitation.timestamp < TIMEOUTS.INVITATION_TIMEOUT) {
          validInvitations.add(invitation);
        } else {
          cleanedCount++;
        }
      }

      if (validInvitations.size === 0) {
        this.lobbyInvitations.delete(playerId);
      } else {
        this.lobbyInvitations.set(playerId, validInvitations);
      }
    }

    if (cleanedCount > 0) {
      this.logger.info(`Cleaned up ${cleanedCount} expired invitations`);
    }
  }

  /**
   * Clean up inactive lobbies
   */
  cleanupLobbies() {
    const lobbiesToClose = [];

    for (const [lobbyCode, lobby] of this.lobbies.entries()) {
      if (lobby.isInactive(TIMEOUTS.LOBBY_TIMEOUT)) {
        lobbiesToClose.push(lobbyCode);
      }
    }

    for (const lobbyCode of lobbiesToClose) {
      this.closeLobby(lobbyCode);
      this.logger.info(`Closed inactive lobby: ${lobbyCode}`);
    }

    return lobbiesToClose.length;
  }

  /**
   * Start cleanup intervals
   */
  startCleanupIntervals() {
    // Clean up invitations every minute
    setInterval(() => {
      this.cleanupInvitations();
    }, 60000);

    // Clean up lobbies every 2 minutes
    setInterval(() => {
      this.cleanupLobbies();
    }, 120000);

    this.logger.info('Started lobby cleanup intervals');
  }

  /**
   * Get lobby manager statistics
   * @returns {Object} Statistics object
   */
  getStats() {
    const totalLobbies = this.lobbies.size;
    const totalPlayers = this.playerLobbies.size;
    const totalInvitations = Array.from(this.lobbyInvitations.values())
      .reduce((sum, invitations) => sum + invitations.size, 0);
    const totalMatches = this.lobbyMatches.size;

    const lobbyStatuses = {};
    for (const status of Object.values(LOBBY_STATUS)) {
      lobbyStatuses[status] = 0;
    }

    for (const lobby of this.lobbies.values()) {
      lobbyStatuses[lobby.status]++;
    }

    return {
      totalLobbies,
      totalPlayers,
      totalInvitations,
      totalMatches,
      lobbyStatuses,
      avgPlayersPerLobby: totalLobbies > 0 ? (totalPlayers / totalLobbies).toFixed(2) : 0
    };
  }
}

module.exports = LobbyManager;
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
 * Manages lobby system: creation, joining, invitations
 * Uses WebSocket connections as unique player identifiers for security
 */
class LobbyManager {
  constructor(logger, playerManager, channelManager) {
    this.logger = logger;
    this.playerManager = playerManager;
    this.channelManager = channelManager;

    this.lobbies = new Map(); // lobbyCode -> lobby object
    this.clientLobbies = new Map(); // WebSocket -> lobbyCode
    this.clientInvitations = new Map(); // WebSocket -> Set of invitations
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
   * @param {WebSocket} hostClient - Host WebSocket connection
   * @returns {Object} Result object with lobby info or error
   */
  createLobby(hostClient) {
    try {
      // Validate host client
      if (!hostClient) {
        return {
          success: false,
          error: ERROR_TYPES.INVALID_PAYLOAD,
          message: 'Valid host client is required'
        };
      }

      // Check if client is already in a lobby
      if (this.clientLobbies.has(hostClient)) {
        return {
          success: false,
          error: ERROR_TYPES.ALREADY_IN_LOBBY,
          message: 'Client is already in a lobby'
        };
      }

      // Check if client is online
      if (!this.playerManager.isOnline(hostClient)) {
        return {
          success: false,
          error: ERROR_TYPES.PLAYER_NOT_FOUND,
          message: 'Host client is not online'
        };
      }

      const code = this.generateLobbyCode();
      const lobby = new Lobby(code, hostClient, this.playerManager);

      this.lobbies.set(code, lobby);
      this.clientLobbies.set(hostClient, code);

      // Subscribe host to lobby channel
      this.channelManager.subscribe(hostClient, `lobby_${code}`);

      const hostAddress = this.playerManager.getPlayerData(hostClient)?.address || 'unknown';
      this.logger.info(`Lobby created: ${code} by ${hostAddress}`);

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
   * @param {WebSocket} client - WebSocket connection
   * @param {string} lobbyCode - Lobby code to join
   * @param {string} role - Role to join as ('player' or 'spectator')
   * @returns {Object} Result object
   */
  joinLobby(client, lobbyCode, role = PLAYER_ROLES.PLAYER) {
    try {
      // Validate client
      if (!client) {
        return {
          success: false,
          error: ERROR_TYPES.INVALID_PAYLOAD,
          message: 'Valid client is required'
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

      // Check if client is already in a lobby
      if (this.clientLobbies.has(client)) {
        return {
          success: false,
          error: ERROR_TYPES.ALREADY_IN_LOBBY,
          message: 'Client is already in a lobby'
        };
      }

      // Check if client is online
      if (!this.playerManager.isOnline(client)) {
        return {
          success: false,
          error: ERROR_TYPES.PLAYER_NOT_FOUND,
          message: 'Client is not online'
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

      // Add client using Lobby class method
      if (!lobby.addPlayer(client, role)) {
        return {
          success: false,
          error: ERROR_TYPES.LOBBY_FULL,
          message: 'Failed to add client to lobby'
        };
      }

      this.clientLobbies.set(client, lobbyCode);

      // Subscribe client to lobby channel
      this.channelManager.subscribe(client, `lobby_${lobbyCode}`);

      // Notify all lobby members
      const clientAddress = this.playerManager.getPlayerData(client)?.address || 'unknown';
      this.broadcastToLobby(lobbyCode, EVENTS.LOBBY_JOINED, {
        playerId: clientAddress,
        role,
        lobby: lobby.toClientData()
      });

      this.logger.info(`Client ${clientAddress} joined lobby ${lobbyCode} as ${role}`);

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
   * @param {WebSocket} client - WebSocket connection
   * @returns {Object} Result object
   */
  leaveLobby(client) {
    try {
      const lobbyCode = this.clientLobbies.get(client);
      if (!lobbyCode) {
        return {
          success: false,
          error: ERROR_TYPES.LOBBY_NOT_FOUND,
          message: 'Client is not in any lobby'
        };
      }

      const lobby = this.lobbies.get(lobbyCode);
      if (!lobby) {
        // Clean up orphaned client mapping
        this.clientLobbies.delete(client);
        return {
          success: false,
          error: ERROR_TYPES.LOBBY_NOT_FOUND,
          message: 'Lobby not found'
        };
      }

      // Remove client from lobby
      const removeResult = lobby.removePlayer(client);
      if (!removeResult.success) {
        return {
          success: false,
          error: ERROR_TYPES.PLAYER_NOT_FOUND,
          message: 'Client not found in lobby'
        };
      }

      this.clientLobbies.delete(client);

      // Unsubscribe from lobby channel
      this.channelManager.unsubscribe(client, `lobby_${lobbyCode}`);

      // Handle host leaving
      if (lobby.isHost(client)) {
        if (lobby.players.length > 0) {
          // Transfer host to first remaining player
          lobby.transferHost(lobby.players[0]);
          const newHostAddress = lobby.getClientAddress(lobby.host);
          this.logger.info(`Host transferred to ${newHostAddress} in lobby ${lobbyCode}`);
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

      // Notify remaining lobby members
      const clientAddress = this.playerManager.getPlayerData(client)?.address || 'unknown';
      this.broadcastToLobby(lobbyCode, EVENTS.LOBBY_LEFT, {
        playerId: clientAddress,
        role: removeResult.role,
        lobby: lobby.toClientData()
      });

      this.logger.info(`Client ${clientAddress} left lobby`);

      return {
        success: true,
        event: EVENTS.LOBBY_LEFT,
        lobby: lobby.toClientData()
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
   * @param {WebSocket} requesterClient - Client requesting the info
   * @returns {Object} Result object with lobby info
   */
  getLobbyInfo(lobbyCode, requesterClient = null) {
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
      lobby: lobby.toClientData(),
      isHost: requesterClient ? lobby.isHost(requesterClient) : false,
      playerRole: requesterClient ? lobby.getPlayerRole(requesterClient) : null
    };
  }

  /**
   * Send invitation to player (by address)
   * @param {WebSocket} fromClient - Inviting client
   * @param {string} targetPlayerAddress - Target player address
   * @returns {Object} Result object
   */
  invitePlayer(fromClient, targetPlayerAddress) {
    try {
      const lobbyCode = this.clientLobbies.get(fromClient);
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

      // Find target client by address
      const targetClient = this.playerManager.getClientByAddress(targetPlayerAddress);
      if (!targetClient) {
        return {
          success: false,
          error: ERROR_TYPES.PLAYER_NOT_FOUND,
          message: 'Target player is not online'
        };
      }

      // Check if target is already in a lobby
      if (this.clientLobbies.has(targetClient)) {
        return {
          success: false,
          error: ERROR_TYPES.ALREADY_IN_LOBBY,
          message: 'Target player is already in a lobby'
        };
      }

      const fromPlayerAddress = this.playerManager.getPlayerData(fromClient)?.address || 'unknown';
      const invitation = {
        fromPlayerId: fromPlayerAddress,
        fromPlayerName: fromPlayerAddress, // Could be enhanced with actual names
        lobbyCode,
        timestamp: Date.now()
      };

      // Add invitation
      if (!this.clientInvitations.has(targetClient)) {
        this.clientInvitations.set(targetClient, new Set());
      }
      this.clientInvitations.get(targetClient).add(invitation);

      // Send invitation to target player
      this.channelManager.sendToClient(targetClient, EVENTS.INVITATION_RECEIVED, {
        invitation: {
          ...invitation,
          lobbyInfo: lobby.toClientData()
        }
      });

      this.logger.info(`Invitation sent from ${fromPlayerAddress} to ${targetPlayerAddress} for lobby ${lobbyCode}`);

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
   * @param {WebSocket} client - Client accepting invitation
   * @param {string} fromPlayerAddress - Original inviter address
   * @param {string} lobbyCode - Lobby code
   * @returns {Object} Result object
   */
  acceptInvitation(client, fromPlayerAddress, lobbyCode) {
    try {
      const invitations = this.clientInvitations.get(client);
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
        if (inv.fromPlayerId === fromPlayerAddress && inv.lobbyCode === lobbyCode) {
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
        this.clientInvitations.delete(client);
      }

      // Join the lobby
      const joinResult = this.joinLobby(client, lobbyCode, PLAYER_ROLES.PLAYER);

      if (joinResult.success) {
        // Notify inviter
        const inviterClient = this.playerManager.getClientByAddress(fromPlayerAddress);
        if (inviterClient) {
          const accepterAddress = this.playerManager.getPlayerData(client)?.address || 'unknown';
          this.channelManager.sendToClient(inviterClient, EVENTS.INVITATION_ACCEPTED, {
            playerId: accepterAddress,
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
   * @param {WebSocket} client - Client declining invitation
   * @param {string} fromPlayerAddress - Original inviter address
   * @param {string} lobbyCode - Lobby code
   * @returns {Object} Result object
   */
  declineInvitation(client, fromPlayerAddress, lobbyCode) {
    try {
      const invitations = this.clientInvitations.get(client);
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
        if (inv.fromPlayerId === fromPlayerAddress && inv.lobbyCode === lobbyCode) {
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
        this.clientInvitations.delete(client);
      }

      // Notify inviter
      const inviterClient = this.playerManager.getClientByAddress(fromPlayerAddress);
      if (inviterClient) {
        const declinerAddress = this.playerManager.getPlayerData(client)?.address || 'unknown';
        this.channelManager.sendToClient(inviterClient, EVENTS.INVITATION_DECLINED, {
          playerId: declinerAddress,
          lobbyCode
        });
      }

      const declinerAddress = this.playerManager.getPlayerData(client)?.address || 'unknown';
      this.logger.info(`Invitation declined by ${declinerAddress} from ${fromPlayerAddress} for lobby ${lobbyCode}`);

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
   * @param {WebSocket} hostClient - Host client
   * @param {string} targetPlayerAddress - Player address to kick
   * @returns {Object} Result object
   */
  kickPlayer(hostClient, targetPlayerAddress) {
    try {
      const lobbyCode = this.clientLobbies.get(hostClient);
      if (!lobbyCode) {
        return {
          success: false,
          error: ERROR_TYPES.LOBBY_NOT_FOUND,
          message: 'Host is not in any lobby'
        };
      }

      const lobby = this.lobbies.get(lobbyCode);
      if (!lobby || !lobby.isHost(hostClient)) {
        return {
          success: false,
          error: ERROR_TYPES.PERMISSION_DENIED,
          message: 'Only lobby host can kick players'
        };
      }

      // Find target client by address
      const targetClient = this.playerManager.getClientByAddress(targetPlayerAddress);
      if (!targetClient || !lobby.hasMember(targetClient)) {
        return {
          success: false,
          error: ERROR_TYPES.PLAYER_NOT_FOUND,
          message: 'Player not found in lobby'
        };
      }

      const hostAddress = this.playerManager.getPlayerData(hostClient)?.address || 'unknown';
      if (targetPlayerAddress === hostAddress) {
        return {
          success: false,
          error: ERROR_TYPES.PERMISSION_DENIED,
          message: 'Host cannot kick themselves'
        };
      }

      // Remove player
      lobby.removePlayer(targetClient);
      this.clientLobbies.delete(targetClient);

      // Unsubscribe kicked player
      this.channelManager.unsubscribe(targetClient, `lobby_${lobbyCode}`);
      this.channelManager.sendToClient(targetClient, EVENTS.PLAYER_KICKED, {
        lobbyCode,
        kickedBy: hostAddress
      });

      // Notify remaining lobby members
      this.broadcastToLobby(lobbyCode, EVENTS.PLAYER_KICKED, {
        kickedPlayerId: targetPlayerAddress,
        kickedBy: hostAddress,
        lobby: lobby.toClientData()
      });

      this.logger.info(`Player ${targetPlayerAddress} kicked from lobby ${lobbyCode} by ${hostAddress}`);

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
   * @param {WebSocket} client - Client requesting role change
   * @param {string} newRole - New role (player or spectator)
   * @returns {Object} Result object
   */
  changeRole(client, newRole) {
    try {
      // Validate role (only player and spectator are allowed)
      if (newRole !== PLAYER_ROLES.PLAYER && newRole !== PLAYER_ROLES.SPECTATOR) {
        return {
          success: false,
          error: ERROR_TYPES.INVALID_PAYLOAD,
          message: 'Invalid role specified. Only player and spectator roles are allowed'
        };
      }

      const lobbyCode = this.clientLobbies.get(client);
      if (!lobbyCode) {
        return {
          success: false,
          error: ERROR_TYPES.LOBBY_NOT_FOUND,
          message: 'Client is not in any lobby'
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
      const changeResult = lobby.changePlayerRole(client, newRole);
      if (!changeResult.success) {
        return {
          success: false,
          error: ERROR_TYPES.INVALID_PAYLOAD,
          message: changeResult.message
        };
      }

      // Broadcast role change to all lobby members
      const clientAddress = this.playerManager.getPlayerData(client)?.address || 'unknown';
      this.broadcastToLobby(lobbyCode, EVENTS.ROLE_CHANGED, {
        playerId: clientAddress,
        newRole: changeResult.newRole,
        lobby: lobby.toClientData()
      });

      this.logger.info(`Client ${clientAddress} changed role to ${changeResult.newRole} in lobby ${lobbyCode}`);

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
   * @param {WebSocket} client - Sender client
   * @param {string} message - Chat message
   * @returns {Object} Result object
   */
  sendLobbyChat(client, message) {
    try {
      const lobbyCode = this.clientLobbies.get(client);
      if (!lobbyCode) {
        return {
          success: false,
          error: ERROR_TYPES.LOBBY_NOT_FOUND,
          message: 'Client is not in any lobby'
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
      const chatMessage = lobby.addChatMessage(client, message);

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

    // Remove all clients from lobby mapping
    const allMembers = [...lobby.players, ...lobby.spectators];
    for (const client of allMembers) {
      this.clientLobbies.delete(client);

      // Unsubscribe from lobby channel
      this.channelManager.unsubscribe(client, `lobby_${lobbyCode}`);
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
   * @param {WebSocket} client - WebSocket connection
   * @param {Object} lobby - Lobby object
   * @returns {string} Player role
   */
  getPlayerRole(client, lobby) {
    return lobby.getPlayerRole(client);
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

    for (const [client, invitations] of this.clientInvitations.entries()) {
      const validInvitations = new Set();

      for (const invitation of invitations) {
        if (now - invitation.timestamp < TIMEOUTS.INVITATION_TIMEOUT) {
          validInvitations.add(invitation);
        } else {
          cleanedCount++;
        }
      }

      if (validInvitations.size === 0) {
        this.clientInvitations.delete(client);
      } else {
        this.clientInvitations.set(client, validInvitations);
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
   * Handle client disconnect - remove from all lobbies and clean up
   * @param {WebSocket} client - Disconnecting client
   */
  handleClientDisconnect(client) {
    try {
      // Find and remove client from any lobby they're in
      const lobbyCode = this.clientLobbies.get(client);
      if (lobbyCode) {
        this.leaveLobby(client);
      }

      // Remove any invitations for this client
      this.clientInvitations.delete(client);

      const clientData = this.playerManager.getPlayerData(client);
      const address = clientData ? clientData.address : 'unknown';
      this.logger.info(`Client ${address} disconnected and cleaned up from lobbies`);

    } catch (error) {
      this.logger.error('Error during client disconnect cleanup:', error);
    }
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
    const totalClients = this.clientLobbies.size;
    const totalInvitations = Array.from(this.clientInvitations.values())
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
      totalPlayers: totalClients,
      totalInvitations,
      totalMatches,
      lobbyStatuses,
      avgPlayersPerLobby: totalLobbies > 0 ? (totalClients / totalLobbies).toFixed(2) : 0
    };
  }
}

module.exports = LobbyManager;
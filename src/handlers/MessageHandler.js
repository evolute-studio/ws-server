const { ACTIONS, EVENTS, ERROR_TYPES } = require('../config/constants');
const { validateMessage, createErrorResponse, createSuccessResponse } = require('../utils/helpers');

/**
 * Central message handler that routes WebSocket messages to appropriate managers
 */
class MessageHandler {
  constructor(logger, channelManager, playerManager, lobbyManager) {
    this.logger = logger;
    this.channelManager = channelManager;
    this.playerManager = playerManager;
    this.lobbyManager = lobbyManager;

    // Bind methods to preserve context
    this.handleMessage = this.handleMessage.bind(this);
  }

  /**
   * Main message handler - routes messages to appropriate handlers
   * @param {WebSocket} client - WebSocket client
   * @param {string} rawMessage - Raw message string
   */
  async handleMessage(client, rawMessage) {
    try {
      // Parse message
      const data = JSON.parse(rawMessage);

      // Validate message structure
      const validation = validateMessage(data);
      if (!validation.isValid) {
        this.sendError(client, ERROR_TYPES.INVALID_PAYLOAD, validation.error);
        return;
      }

      const { action, channel, payload } = data;

      this.logger.debug(`Handling action: ${action}`, payload);

      // Route to appropriate handler
      switch (action) {
        // Channel Management Actions
        case ACTIONS.SUBSCRIBE:
          return this.handleSubscribe(client, channel);

        case ACTIONS.UNSUBSCRIBE:
          return this.handleUnsubscribe(client, channel);

        case ACTIONS.PUBLISH:
          return this.handlePublish(client, channel, payload);

        // Player Management Actions
        case ACTIONS.PING:
          return this.handlePing(client, payload);

        case ACTIONS.CHECK_ONLINE:
          return this.handleCheckOnline(client, payload);

        // Lobby Management Actions
        case ACTIONS.CREATE_LOBBY:
          return this.handleCreateLobby(client, payload);

        case ACTIONS.JOIN_LOBBY:
          return this.handleJoinLobby(client, payload);

        case ACTIONS.LEAVE_LOBBY:
          return this.handleLeaveLobby(client, payload);

        case ACTIONS.GET_LOBBY_INFO:
          return this.handleGetLobbyInfo(client, payload);

        case ACTIONS.KICK_PLAYER:
          return this.handleKickPlayer(client, payload);

        case ACTIONS.CHANGE_ROLE:
          return this.handleChangeRole(client, payload);

        // Invitation Actions
        case ACTIONS.INVITE_PLAYER:
          return this.handleInvitePlayer(client, payload);

        case ACTIONS.ACCEPT_INVITATION:
          return this.handleAcceptInvitation(client, payload);

        case ACTIONS.DECLINE_INVITATION:
          return this.handleDeclineInvitation(client, payload);

        // Chat Actions
        case ACTIONS.LOBBY_CHAT:
          return this.handleLobbyChat(client, payload);

        default:
          this.logger.warn(`Unknown action: ${action}`);
          this.sendError(client, ERROR_TYPES.INVALID_ACTION, `Unknown action: ${action}`);
      }

    } catch (parseError) {
      this.logger.error('Error parsing message:', parseError);
      this.sendError(client, ERROR_TYPES.INVALID_PAYLOAD, 'Invalid JSON message');
    }
  }

  // Channel Management Handlers

  handleSubscribe(client, channel) {
    if (!channel) {
      return this.sendError(client, ERROR_TYPES.INVALID_PAYLOAD, 'Channel name required');
    }

    const success = this.channelManager.subscribe(client, channel);
    if (success) {
      this.logger.debug(`Client subscribed to ${channel}`);
    }
  }

  handleUnsubscribe(client, channel) {
    if (!channel) {
      return this.sendError(client, ERROR_TYPES.INVALID_PAYLOAD, 'Channel name required');
    }

    const success = this.channelManager.unsubscribe(client, channel);
    if (success) {
      this.logger.debug(`Client unsubscribed from ${channel}`);
    }
  }

  handlePublish(client, channel, payload) {
    if (!channel) {
      return this.sendError(client, ERROR_TYPES.INVALID_PAYLOAD, 'Channel name required');
    }

    const sentCount = this.channelManager.publish(channel, payload);
    this.logger.debug(`Published to ${channel}, reached ${sentCount} clients`);
  }

  // Player Management Handlers

  handlePing(client, payload) {
    try {
      const pingData = typeof payload === 'string' ? JSON.parse(payload) : payload;

      if (!pingData || !pingData.Address) {
        return this.sendError(client, ERROR_TYPES.INVALID_PAYLOAD, 'Player Address required in ping');
      }

      // Check if client is trying to change address
      const existingData = this.playerManager.getPlayerData(client);
      if (existingData && existingData.address !== pingData.Address) {
        return this.sendError(client, ERROR_TYPES.INVALID_ACTION, 'Address cannot be changed after initial connection');
      }

      this.playerManager.updatePing(client, pingData.Address);
      this.logger.debug(`Ping received from player ${pingData.Address}`);

    } catch (error) {
      this.logger.error('Error handling ping:', error);
      this.sendError(client, ERROR_TYPES.INVALID_PAYLOAD, 'Invalid ping data format');
    }
  }

  handleCheckOnline(client, payload) {
    try {
      const playersData = typeof payload === 'string' ? JSON.parse(payload) : payload;

      if (!playersData || !Array.isArray(playersData.players)) {
        return this.sendError(client, ERROR_TYPES.INVALID_PAYLOAD, 'Players array required');
      }

      const binaryStatuses = this.playerManager.getBinaryOnlineStatuses(playersData.players);

      this.channelManager.sendToClient(client, EVENTS.ONLINE_STATUS, binaryStatuses);
      this.logger.debug(`Online status check completed for ${playersData.players.length} players`);

    } catch (error) {
      this.logger.error('Error handling online check:', error);
      this.sendError(client, ERROR_TYPES.INVALID_PAYLOAD, 'Invalid online check data format');
    }
  }

  // Lobby Management Handlers

  handleCreateLobby(client, payload) {
    // No need to validate hostId from payload - we use client connection as ID
    const result = this.lobbyManager.createLobby(client);

    if (result.success) {
      this.channelManager.sendToClient(client, EVENTS.LOBBY_CREATED, result.lobby);
      const clientAddress = this.playerManager.getPlayerData(client)?.address || 'unknown';
      this.logger.info(`Lobby created by ${clientAddress}: ${result.lobby.code}`);
    } else {
      this.sendError(client, result.error, result.message);
    }
  }

  handleJoinLobby(client, payload) {
    if (!payload || !payload.lobbyCode) {
      return this.sendError(client, ERROR_TYPES.INVALID_PAYLOAD, 'Lobby code required');
    }

    const result = this.lobbyManager.joinLobby(client, payload.lobbyCode, payload.role);

    if (result.success) {
      this.channelManager.sendToClient(client, EVENTS.LOBBY_JOINED, {
        lobby: result.lobby,
        role: result.role
      });
      const clientAddress = this.playerManager.getPlayerData(client)?.address || 'unknown';
      this.logger.info(`Client ${clientAddress} joined lobby ${payload.lobbyCode}`);
    } else {
      this.sendError(client, result.error, result.message);
    }
  }

  handleLeaveLobby(client, payload) {
    // No need to validate playerId from payload - we use client connection as ID
    const result = this.lobbyManager.leaveLobby(client);

    if (result.success) {
      const response = { success: true };
      if (result.lobbyClosed) {
        response.lobbyClosed = true;
      } else if (result.lobby) {
        response.lobby = result.lobby;
      }

      this.channelManager.sendToClient(client, EVENTS.LOBBY_LEFT, response);
      const clientAddress = this.playerManager.getPlayerData(client)?.address || 'unknown';
      this.logger.info(`Client ${clientAddress} left lobby`);
    } else {
      this.sendError(client, result.error, result.message);
    }
  }

  handleGetLobbyInfo(client, payload) {
    if (!payload || !payload.lobbyCode) {
      return this.sendError(client, ERROR_TYPES.INVALID_PAYLOAD, 'Lobby code required');
    }

    const result = this.lobbyManager.getLobbyInfo(payload.lobbyCode, client);

    if (result.success) {
      this.channelManager.sendToClient(client, EVENTS.LOBBY_INFO, {
        lobby: result.lobby,
        isHost: result.isHost,
        playerRole: result.playerRole
      });
    } else {
      this.sendError(client, result.error, result.message);
    }
  }

  handleKickPlayer(client, payload) {
    if (!payload || !payload.targetPlayerId) {
      return this.sendError(client, ERROR_TYPES.INVALID_PAYLOAD, 'Target player ID (address) required');
    }

    const result = this.lobbyManager.kickPlayer(client, payload.targetPlayerId);

    if (result.success) {
      this.channelManager.sendToClient(client, EVENTS.PLAYER_KICKED, { success: true });
      const clientAddress = this.playerManager.getPlayerData(client)?.address || 'unknown';
      this.logger.info(`Player ${payload.targetPlayerId} kicked by ${clientAddress}`);
    } else {
      this.sendError(client, result.error, result.message);
    }
  }

  handleChangeRole(client, payload) {
    if (!payload || !payload.newRole) {
      return this.sendError(client, ERROR_TYPES.INVALID_PAYLOAD, 'New role required');
    }

    const result = this.lobbyManager.changeRole(client, payload.newRole);

    if (result.success) {
      this.channelManager.sendToClient(client, EVENTS.ROLE_CHANGED, {
        newRole: result.newRole,
        lobby: result.lobby
      });
      const clientAddress = this.playerManager.getPlayerData(client)?.address || 'unknown';
      this.logger.info(`Client ${clientAddress} changed role to ${result.newRole}`);
    } else {
      this.sendError(client, result.error, result.message);
    }
  }

  // Invitation Handlers

  handleInvitePlayer(client, payload) {
    if (!payload || !payload.targetPlayerId) {
      return this.sendError(client, ERROR_TYPES.INVALID_PAYLOAD, 'Target player ID (address) required');
    }

    const result = this.lobbyManager.invitePlayer(client, payload.targetPlayerId);

    if (result.success) {
      this.channelManager.sendToClient(client, EVENTS.INVITATION_RECEIVED, { success: true });
      const clientAddress = this.playerManager.getPlayerData(client)?.address || 'unknown';
      this.logger.info(`Invitation sent from ${clientAddress} to ${payload.targetPlayerId}`);
    } else {
      this.sendError(client, result.error, result.message);
    }
  }

  handleAcceptInvitation(client, payload) {
    if (!payload || !payload.fromPlayerId || !payload.lobbyCode) {
      return this.sendError(client, ERROR_TYPES.INVALID_PAYLOAD, 'From player ID (address) and lobby code required');
    }

    const result = this.lobbyManager.acceptInvitation(
      client,
      payload.fromPlayerId,
      payload.lobbyCode
    );

    if (result.success) {
      this.channelManager.sendToClient(client, EVENTS.LOBBY_JOINED, {
        lobby: result.lobby,
        role: result.role
      });
      const clientAddress = this.playerManager.getPlayerData(client)?.address || 'unknown';
      this.logger.info(`Invitation accepted by ${clientAddress}`);
    } else {
      this.sendError(client, result.error, result.message);
    }
  }

  handleDeclineInvitation(client, payload) {
    if (!payload || !payload.fromPlayerId || !payload.lobbyCode) {
      return this.sendError(client, ERROR_TYPES.INVALID_PAYLOAD, 'From player ID (address) and lobby code required');
    }

    const result = this.lobbyManager.declineInvitation(
      client,
      payload.fromPlayerId,
      payload.lobbyCode
    );

    if (result.success) {
      this.channelManager.sendToClient(client, EVENTS.INVITATION_DECLINED, { success: true });
      const clientAddress = this.playerManager.getPlayerData(client)?.address || 'unknown';
      this.logger.info(`Invitation declined by ${clientAddress}`);
    } else {
      this.sendError(client, result.error, result.message);
    }
  }

  // Chat Handlers

  handleLobbyChat(client, payload) {
    if (!payload || !payload.message) {
      return this.sendError(client, ERROR_TYPES.INVALID_PAYLOAD, 'Message required');
    }

    const result = this.lobbyManager.sendLobbyChat(client, payload.message);

    if (result.success) {
      // Chat message is broadcast by LobbyManager, no need to send individual response
      const clientAddress = this.playerManager.getPlayerData(client)?.address || 'unknown';
      this.logger.debug(`Chat message sent by ${clientAddress}`);
    } else {
      this.sendError(client, result.error, result.message);
    }
  }

  // Helper Methods

  /**
   * Send error response to client
   * @param {WebSocket} client - WebSocket client
   * @param {string} errorType - Error type
   * @param {string} message - Error message
   */
  sendError(client, errorType, message) {
    const errorResponse = createErrorResponse(errorType, message);
    this.channelManager.sendToClient(client, EVENTS.ERROR, errorResponse);
    this.logger.warn(`Sent error to client: ${errorType} - ${message}`);
  }

  /**
   * Handle client disconnection
   * @param {WebSocket} client - Disconnecting client
   */
  handleClientDisconnect(client) {
    try {
      // Remove from player connections
      this.playerManager.removeConnection(client);

      // Remove from channel subscriptions
      this.channelManager.removeClient(client);

      // Remove client from any lobby they're in
      this.lobbyManager.handleClientDisconnect(client);

      const clientData = this.playerManager.getPlayerData(client);
      const address = clientData ? clientData.address : 'unknown';
      this.logger.info(`Client ${address} disconnected and cleaned up`);

    } catch (error) {
      this.logger.error('Error during client disconnect cleanup:', error);
    }
  }

  /**
   * Get handler statistics
   * @returns {Object} Statistics object
   */
  getStats() {
    return {
      channelStats: this.channelManager.getStats(),
      playerStats: this.playerManager.getStats(),
      lobbyStats: this.lobbyManager.getStats()
    };
  }
}

module.exports = MessageHandler;
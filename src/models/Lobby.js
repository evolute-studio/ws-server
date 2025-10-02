const { LOBBY_STATUS, LOBBY_CONFIG, PLAYER_ROLES } = require('../config/constants');
const { getPrismaClient } = require('../utils/prisma');

/**
 * Lobby data structure with clearly defined fields
 * Uses WebSocket connections as player identifiers for security
 * Syncs with PostgreSQL database for persistence
 */
class Lobby {
  /**
   * Create a new lobby
   * @param {string} code - Unique lobby code
   * @param {WebSocket} hostClient - Host WebSocket connection
   * @param {PlayerManager} playerManager - PlayerManager instance for getting display addresses
   * @param {string} id - Database ID (optional, for loaded lobbies)
   */
  constructor(code, hostClient, playerManager = null, id = null) {
    console.log('[Lobby constructor] Creating lobby', {
      code,
      hasHostClient: !!hostClient,
      hasPlayerManager: !!playerManager,
      id
    });

    // Database fields
    this.id = id;                        // UUID from database
    this.code = code;                    // Unique 6-character lobby code
    this.status = LOBBY_STATUS.WAITING;  // Current lobby status (waiting/ready)
    this.created = Date.now();           // Timestamp when lobby was created
    this.lastActivity = Date.now();      // Timestamp of last activity
    this.currentMatch = null;            // Current match ID (if any)

    console.log('[Lobby constructor] Database fields set', {
      id: this.id,
      code: this.code,
      status: this.status,
      created: this.created
    });

    // In-memory fields (WebSocket connections)
    this.host = hostClient;              // WebSocket connection of the lobby host
    this.players = [hostClient];         // Array of active player WebSocket connections (max 2 for 1v1)
    this.spectators = [];                // Array of spectator WebSocket connections (max 10)
    this.chatHistory = [];               // Array of chat message objects (loaded from DB)

    console.log('[Lobby constructor] In-memory fields set', {
      hasHost: !!this.host,
      playersCount: this.players.length,
      spectatorsCount: this.spectators.length
    });

    // Helper reference for getting display information
    this.playerManager = playerManager;

    // Track if lobby needs to be saved to DB
    this._isDirty = false;

    console.log('[Lobby constructor] Lobby instance created successfully');
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

    // Save chat message to database asynchronously (fire and forget)
    if (this.id) {
      this.saveChatMessage(chatMessage).catch(err => {
        console.error('Failed to save chat message to database:', err);
      });
    }

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

  /**
   * Mark lobby as dirty (needs to be saved)
   */
  markDirty() {
    this._isDirty = true;
  }

  /**
   * Save lobby to database
   * @returns {Promise<Object>} Database lobby object
   */
  async save() {
    console.log('[Lobby.save] Starting save operation', {
      hasId: !!this.id,
      code: this.code,
      playersCount: this.players.length,
      spectatorsCount: this.spectators.length
    });

    const prisma = getPrismaClient();
    console.log('[Lobby.save] Got Prisma client', { hasPrisma: !!prisma });

    const hostAddress = this.getClientAddress(this.host);
    console.log('[Lobby.save] Got host address', { hostAddress });

    try {
      if (!this.id) {
        console.log('[Lobby.save] Creating NEW lobby in database');

        // Prepare player data
        const playerData = this.players.map(client => {
          const address = this.getClientAddress(client);
          console.log('[Lobby.save] Player data:', { address, role: PLAYER_ROLES.PLAYER });
          return {
            playerAddress: address,
            role: PLAYER_ROLES.PLAYER
          };
        });

        const spectatorData = this.spectators.map(client => {
          const address = this.getClientAddress(client);
          console.log('[Lobby.save] Spectator data:', { address, role: PLAYER_ROLES.SPECTATOR });
          return {
            playerAddress: address,
            role: PLAYER_ROLES.SPECTATOR
          };
        });

        const allPlayers = playerData.concat(spectatorData);
        console.log('[Lobby.save] All players data prepared', { count: allPlayers.length });

        const createData = {
          code: this.code,
          hostAddress,
          status: this.status,
          created: new Date(this.created),
          lastActivity: new Date(this.lastActivity),
          currentMatch: this.currentMatch,
          players: {
            create: allPlayers
          }
        };

        console.log('[Lobby.save] Create data prepared', {
          code: createData.code,
          hostAddress: createData.hostAddress,
          status: createData.status,
          playersToCreate: allPlayers.length
        });

        console.log('[Lobby.save] Calling prisma.lobby.create...');
        const lobby = await prisma.lobby.create({
          data: createData,
          include: {
            players: true,
            chatMessages: true
          }
        });

        console.log('[Lobby.save] Lobby created in database', {
          id: lobby.id,
          code: lobby.code,
          playersInDb: lobby.players.length
        });

        this.id = lobby.id;
        this._isDirty = false;
        return lobby;
      } else {
        console.log('[Lobby.save] UPDATING existing lobby in database', { id: this.id });

        // Prepare player data
        const playerData = this.players.map(client => ({
          playerAddress: this.getClientAddress(client),
          role: PLAYER_ROLES.PLAYER
        }));

        const spectatorData = this.spectators.map(client => ({
          playerAddress: this.getClientAddress(client),
          role: PLAYER_ROLES.SPECTATOR
        }));

        const allPlayers = playerData.concat(spectatorData);
        console.log('[Lobby.save] Update data prepared', {
          playersToCreate: allPlayers.length
        });

        const lobby = await prisma.lobby.update({
          where: { id: this.id },
          data: {
            hostAddress,
            status: this.status,
            lastActivity: new Date(this.lastActivity),
            currentMatch: this.currentMatch,
            players: {
              deleteMany: {},
              create: allPlayers
            }
          },
          include: {
            players: true,
            chatMessages: true
          }
        });

        console.log('[Lobby.save] Lobby updated in database', {
          id: lobby.id,
          playersInDb: lobby.players.length
        });

        this._isDirty = false;
        return lobby;
      }
    } catch (error) {
      console.error('[Lobby.save] ERROR saving lobby:', error);
      console.error('[Lobby.save] Error details:', {
        message: error.message,
        code: error.code,
        meta: error.meta,
        stack: error.stack
      });
      throw new Error(`Failed to save lobby: ${error.message}`);
    }
  }

  /**
   * Save chat message to database
   * @param {Object} chatMessage - Chat message object
   * @returns {Promise<Object>} Database chat message
   */
  async saveChatMessage(chatMessage) {
    if (!this.id) {
      throw new Error('Cannot save chat message: lobby not saved to database');
    }

    const prisma = getPrismaClient();

    try {
      const dbMessage = await prisma.chatMessage.create({
        data: {
          lobbyId: this.id,
          playerAddress: chatMessage.playerId,
          message: chatMessage.message,
          timestamp: new Date(chatMessage.timestamp)
        }
      });

      return dbMessage;
    } catch (error) {
      throw new Error(`Failed to save chat message: ${error.message}`);
    }
  }

  /**
   * Load chat history from database
   * @param {number} limit - Maximum number of messages to load (default: 50)
   * @returns {Promise<Array>} Array of chat messages
   */
  async loadChatHistory(limit = 50) {
    if (!this.id) {
      return [];
    }

    const prisma = getPrismaClient();

    try {
      const messages = await prisma.chatMessage.findMany({
        where: { lobbyId: this.id },
        orderBy: { timestamp: 'desc' },
        take: limit
      });

      // Convert to client format and reverse (oldest first)
      this.chatHistory = messages.reverse().map(msg => ({
        playerId: msg.playerAddress,
        message: msg.message,
        timestamp: msg.timestamp.getTime()
      }));

      return this.chatHistory;
    } catch (error) {
      throw new Error(`Failed to load chat history: ${error.message}`);
    }
  }

  /**
   * Delete lobby from database
   * @returns {Promise<void>}
   */
  async delete() {
    if (!this.id) {
      return;
    }

    const prisma = getPrismaClient();

    try {
      await prisma.lobby.delete({
        where: { id: this.id }
      });

      this.id = null;
    } catch (error) {
      throw new Error(`Failed to delete lobby: ${error.message}`);
    }
  }

  /**
   * Load lobby from database by code
   * @param {string} code - Lobby code
   * @param {PlayerManager} playerManager - PlayerManager instance
   * @returns {Promise<Object|null>} Database lobby object or null
   */
  static async loadFromDatabase(code, playerManager = null) {
    const prisma = getPrismaClient();

    try {
      const dbLobby = await prisma.lobby.findUnique({
        where: { code },
        include: {
          players: true,
          chatMessages: {
            orderBy: { timestamp: 'desc' },
            take: 50
          }
        }
      });

      if (!dbLobby) {
        return null;
      }

      return {
        id: dbLobby.id,
        code: dbLobby.code,
        hostAddress: dbLobby.hostAddress,
        status: dbLobby.status,
        created: dbLobby.created.getTime(),
        lastActivity: dbLobby.lastActivity.getTime(),
        currentMatch: dbLobby.currentMatch,
        players: dbLobby.players.filter(p => p.role === 'player'),
        spectators: dbLobby.players.filter(p => p.role === 'spectator'),
        chatMessages: dbLobby.chatMessages.reverse().map(msg => ({
          playerId: msg.playerAddress,
          message: msg.message,
          timestamp: msg.timestamp.getTime()
        }))
      };
    } catch (error) {
      throw new Error(`Failed to load lobby from database: ${error.message}`);
    }
  }

  /**
   * Get all active lobbies from database
   * @param {number} inactiveThresholdMs - Threshold for considering lobby inactive
   * @returns {Promise<Array>} Array of database lobby objects
   */
  static async getAllActive(inactiveThresholdMs) {
    const prisma = getPrismaClient();
    const cutoffTime = new Date(Date.now() - inactiveThresholdMs);

    try {
      const lobbies = await prisma.lobby.findMany({
        where: {
          lastActivity: {
            gte: cutoffTime
          }
        },
        include: {
          players: true,
          chatMessages: {
            orderBy: { timestamp: 'desc' },
            take: 50
          }
        }
      });

      return lobbies.map(dbLobby => ({
        id: dbLobby.id,
        code: dbLobby.code,
        hostAddress: dbLobby.hostAddress,
        status: dbLobby.status,
        created: dbLobby.created.getTime(),
        lastActivity: dbLobby.lastActivity.getTime(),
        currentMatch: dbLobby.currentMatch,
        players: dbLobby.players.filter(p => p.role === 'player'),
        spectators: dbLobby.players.filter(p => p.role === 'spectator'),
        chatMessages: dbLobby.chatMessages.reverse().map(msg => ({
          playerId: msg.playerAddress,
          message: msg.message,
          timestamp: msg.timestamp.getTime()
        }))
      }));
    } catch (error) {
      throw new Error(`Failed to get active lobbies: ${error.message}`);
    }
  }

  /**
   * Delete inactive lobbies from database
   * @param {number} inactiveThresholdMs - Threshold for considering lobby inactive
   * @returns {Promise<number>} Number of deleted lobbies
   */
  static async deleteInactive(inactiveThresholdMs) {
    const prisma = getPrismaClient();
    const cutoffTime = new Date(Date.now() - inactiveThresholdMs);

    try {
      const result = await prisma.lobby.deleteMany({
        where: {
          lastActivity: {
            lt: cutoffTime
          }
        }
      });

      return result.count;
    } catch (error) {
      throw new Error(`Failed to delete inactive lobbies: ${error.message}`);
    }
  }
}

module.exports = Lobby;
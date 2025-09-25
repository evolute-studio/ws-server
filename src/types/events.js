/**
 * Type definitions and data structures for WebSocket events
 * This file documents the expected structure of messages and events
 */

/**
 * Base message structure for incoming messages
 * @typedef {Object} IncomingMessage
 * @property {string} action - The action to perform
 * @property {string} [channel] - Channel name (for channel actions)
 * @property {*} [payload] - Message payload
 */

/**
 * Base response structure for outgoing messages
 * @typedef {Object} OutgoingMessage
 * @property {string} action - The event type
 * @property {*} payload - Event payload
 * @property {number} timestamp - Unix timestamp
 */

/**
 * Player ping data structure
 * @typedef {Object} PingPayload
 * @property {string} Address - Player address/ID
 */

/**
 * Online check request structure
 * @typedef {Object} OnlineCheckPayload
 * @property {string[]} players - Array of player IDs to check
 */

/**
 * Lobby creation payload
 * @typedef {Object} CreateLobbyPayload
 * @property {string} hostId - Host player ID
 */

/**
 * Lobby join payload
 * @typedef {Object} JoinLobbyPayload
 * @property {string} playerId - Joining player ID
 * @property {string} lobbyCode - Lobby code to join
 * @property {string} [role] - Role to join as ('player' or 'spectator')
 */

/**
 * Invitation payload
 * @typedef {Object} InvitationPayload
 * @property {string} fromPlayerId - Inviting player ID
 * @property {string} targetPlayerId - Target player ID
 */

/**
 * Lobby chat message payload
 * @typedef {Object} ChatMessagePayload
 * @property {string} playerId - Sender player ID
 * @property {string} message - Chat message content
 */

/**
 * Complete lobby data structure
 * @typedef {Object} Lobby
 * @property {string} code - Unique lobby code
 * @property {string} host - Host player ID
 * @property {string[]} players - Active players array
 * @property {string[]} spectators - Spectators array
 * @property {string} status - Lobby status (waiting/ready/in_game/finished)
 * @property {number} created - Creation timestamp
 * @property {number} lastActivity - Last activity timestamp
 * @property {string|null} currentMatch - Current match ID
 * @property {ChatMessage[]} chatHistory - Chat message history
 */

/**
 * Chat message structure
 * @typedef {Object} ChatMessage
 * @property {string} playerId - Sender player ID
 * @property {string} message - Message content
 * @property {number} timestamp - Message timestamp
 */

/**
 * Match data structure
 * @typedef {Object} Match
 * @property {string} id - Unique match ID
 * @property {string} lobbyCode - Associated lobby code
 * @property {string[]} players - Match players
 * @property {string} status - Match status
 * @property {number} startTime - Match start timestamp
 * @property {number|null} endTime - Match end timestamp
 * @property {string|null} winner - Winner player ID
 */

/**
 * Invitation data structure
 * @typedef {Object} Invitation
 * @property {string} fromPlayerId - Inviting player ID
 * @property {string} fromPlayerName - Inviting player name
 * @property {string} lobbyCode - Target lobby code
 * @property {number} timestamp - Invitation timestamp
 */

/**
 * Event payload structures for outgoing events
 */
const EventPayloads = {
  /**
   * Online status response
   * @typedef {Object} OnlineStatusPayload
   * @property {string} binaryStatus - Binary string of online statuses
   */
  OnlineStatus: {
    binaryStatus: 'string' // '1' for online, '0' for offline
  },

  /**
   * Lobby created event
   * @typedef {Object} LobbyCreatedPayload
   * @property {Lobby} lobby - Created lobby information
   */
  LobbyCreated: {
    lobby: 'Lobby'
  },

  /**
   * Player joined lobby event
   * @typedef {Object} LobbyJoinedPayload
   * @property {string} playerId - Joined player ID
   * @property {string} role - Player role
   * @property {Lobby} lobby - Updated lobby information
   */
  LobbyJoined: {
    playerId: 'string',
    role: 'string',
    lobby: 'Lobby'
  },

  /**
   * Player left lobby event
   * @typedef {Object} LobbyLeftPayload
   * @property {string} playerId - Left player ID
   * @property {string} role - Player role
   * @property {Lobby} lobby - Updated lobby information
   */
  LobbyLeft: {
    playerId: 'string',
    role: 'string',
    lobby: 'Lobby'
  },

  /**
   * Lobby info response
   * @typedef {Object} LobbyInfoPayload
   * @property {Lobby} lobby - Lobby information
   * @property {boolean} isHost - Whether requester is host
   * @property {string|null} playerRole - Requester's role in lobby
   */
  LobbyInfo: {
    lobby: 'Lobby',
    isHost: 'boolean',
    playerRole: 'string|null'
  },

  /**
   * Player kicked event
   * @typedef {Object} PlayerKickedPayload
   * @property {string} kickedPlayerId - Kicked player ID
   * @property {string} kickedBy - Host player ID
   * @property {Lobby} lobby - Updated lobby information
   */
  PlayerKicked: {
    kickedPlayerId: 'string',
    kickedBy: 'string',
    lobby: 'Lobby'
  },

  /**
   * Invitation received event
   * @typedef {Object} InvitationReceivedPayload
   * @property {Invitation} invitation - Invitation details
   * @property {Lobby} lobbyInfo - Target lobby information
   */
  InvitationReceived: {
    invitation: 'Invitation',
    lobbyInfo: 'Lobby'
  },

  /**
   * Invitation accepted event
   * @typedef {Object} InvitationAcceptedPayload
   * @property {string} playerId - Accepting player ID
   * @property {string} lobbyCode - Lobby code
   */
  InvitationAccepted: {
    playerId: 'string',
    lobbyCode: 'string'
  },

  /**
   * Invitation declined event
   * @typedef {Object} InvitationDeclinedPayload
   * @property {string} playerId - Declining player ID
   * @property {string} lobbyCode - Lobby code
   */
  InvitationDeclined: {
    playerId: 'string',
    lobbyCode: 'string'
  },

  /**
   * Match started event
   * @typedef {Object} MatchStartedPayload
   * @property {Object} match - Match information
   * @property {string} match.id - Match ID
   * @property {string[]} match.players - Match players
   * @property {number} match.startTime - Start timestamp
   * @property {Lobby} lobby - Updated lobby information
   */
  MatchStarted: {
    match: {
      id: 'string',
      players: 'string[]',
      startTime: 'number'
    },
    lobby: 'Lobby'
  },

  /**
   * Match ended event
   * @typedef {Object} MatchEndedPayload
   * @property {Object} match - Match information
   * @property {string} match.id - Match ID
   * @property {string[]} match.players - Match players
   * @property {number} match.startTime - Start timestamp
   * @property {number} match.endTime - End timestamp
   * @property {string|null} match.winner - Winner player ID
   * @property {number} match.duration - Match duration in ms
   * @property {Lobby} lobby - Updated lobby information
   */
  MatchEnded: {
    match: {
      id: 'string',
      players: 'string[]',
      startTime: 'number',
      endTime: 'number',
      winner: 'string|null',
      duration: 'number'
    },
    lobby: 'Lobby'
  },

  /**
   * Lobby chat message event
   * @typedef {Object} LobbyChatMessagePayload
   * @property {string} playerId - Sender player ID
   * @property {string} message - Message content
   * @property {number} timestamp - Message timestamp
   */
  LobbyChatMessage: {
    playerId: 'string',
    message: 'string',
    timestamp: 'number'
  },

  /**
   * Error event
   * @typedef {Object} ErrorPayload
   * @property {string} error - Error type
   * @property {string} message - Error message
   * @property {number} timestamp - Error timestamp
   * @property {*} [details] - Additional error details
   */
  Error: {
    error: 'string',
    message: 'string',
    timestamp: 'number',
    details: 'any'
  }
};

/**
 * Message validation schemas
 */
const MessageSchemas = {
  ping: {
    required: ['payload'],
    payload: {
      required: ['Address'],
      Address: 'string'
    }
  },

  check_online: {
    required: ['payload'],
    payload: {
      required: ['players'],
      players: 'array'
    }
  },

  create_lobby: {
    required: ['payload'],
    payload: {
      required: ['hostId'],
      hostId: 'string'
    }
  },

  join_lobby: {
    required: ['payload'],
    payload: {
      required: ['playerId', 'lobbyCode'],
      playerId: 'string',
      lobbyCode: 'string',
      role: 'string' // optional
    }
  },

  leave_lobby: {
    required: ['payload'],
    payload: {
      required: ['playerId'],
      playerId: 'string'
    }
  },

  get_lobby_info: {
    required: ['payload'],
    payload: {
      required: ['lobbyCode'],
      lobbyCode: 'string',
      requesterId: 'string' // optional
    }
  },

  invite_player: {
    required: ['payload'],
    payload: {
      required: ['fromPlayerId', 'targetPlayerId'],
      fromPlayerId: 'string',
      targetPlayerId: 'string'
    }
  },

  accept_invitation: {
    required: ['payload'],
    payload: {
      required: ['playerId', 'fromPlayerId', 'lobbyCode'],
      playerId: 'string',
      fromPlayerId: 'string',
      lobbyCode: 'string'
    }
  },

  decline_invitation: {
    required: ['payload'],
    payload: {
      required: ['playerId', 'fromPlayerId', 'lobbyCode'],
      playerId: 'string',
      fromPlayerId: 'string',
      lobbyCode: 'string'
    }
  },

  kick_player: {
    required: ['payload'],
    payload: {
      required: ['hostId', 'targetPlayerId'],
      hostId: 'string',
      targetPlayerId: 'string'
    }
  },

  lobby_chat: {
    required: ['payload'],
    payload: {
      required: ['playerId', 'message'],
      playerId: 'string',
      message: 'string'
    }
  },

  start_match: {
    required: ['payload'],
    payload: {
      required: ['hostId'],
      hostId: 'string'
    }
  },

  end_match: {
    required: ['payload'],
    payload: {
      required: ['matchId'],
      matchId: 'string',
      winner: 'string' // optional
    }
  }
};

module.exports = {
  EventPayloads,
  MessageSchemas
};
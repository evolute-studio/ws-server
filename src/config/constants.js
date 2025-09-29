/**
 * Configuration constants for WebSocket server
 */

// Server Configuration
const SERVER_CONFIG = {
  DEFAULT_PORT: process.env.WS_PORT || 7021,
  HOST: process.env.WS_HOST || 'localhost'
};

// Timeout Settings (in milliseconds)
const TIMEOUTS = {
  PLAYER_TIMEOUT: 6000,        // 6 seconds before considering player offline
  LOBBY_TIMEOUT: 300000,       // 5 minutes of inactivity before lobby cleanup
  INVITATION_TIMEOUT: 60000,   // 1 minute for invitation to expire
  MATCH_TIMEOUT: 1800000       // 30 minutes maximum match duration
};

// Lobby Configuration
const LOBBY_CONFIG = {
  CODE_LENGTH: 6,              // Length of lobby codes
  MAX_PLAYERS: 2,              // Maximum active players in lobby (for 1v1)
  MAX_SPECTATORS: 10,          // Maximum spectators allowed
  CODE_CHARSET: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' // Characters for lobby codes
};

// Player Roles
const PLAYER_ROLES = {
  PLAYER: 'player',
  SPECTATOR: 'spectator'
};

// Lobby Status
const LOBBY_STATUS = {
  WAITING: 'waiting',          // Waiting for players
  READY: 'ready'               // Ready to start (2 players) - matches handled on blockchain
};

// Message Actions
const ACTIONS = {
  // Channel Actions
  SUBSCRIBE: 'subscribe',
  UNSUBSCRIBE: 'unsubscribe',
  PUBLISH: 'publish',

  // Player Actions
  REGISTER: 'register',
  PING: 'ping',
  CHECK_ONLINE: 'check_online',

  // Lobby Actions
  CREATE_LOBBY: 'create_lobby',
  JOIN_LOBBY: 'join_lobby',
  LEAVE_LOBBY: 'leave_lobby',
  GET_LOBBY_INFO: 'get_lobby_info',
  KICK_PLAYER: 'kick_player',
  CHANGE_ROLE: 'change_role',

  // Invitation Actions
  INVITE_PLAYER: 'invite_player',
  ACCEPT_INVITATION: 'accept_invitation',
  DECLINE_INVITATION: 'decline_invitation',

  // Chat Actions
  LOBBY_CHAT: 'lobby_chat'
};

// Event Types (outgoing to clients)
const EVENTS = {
  // Player Events
  REGISTRATION_SUCCESS: 'registration_success',
  ONLINE_STATUS: 'online_status',

  // Lobby Events
  LOBBY_CREATED: 'lobby_created',
  LOBBY_JOINED: 'lobby_joined',
  LOBBY_LEFT: 'lobby_left',
  LOBBY_INFO: 'lobby_info',
  PLAYER_KICKED: 'player_kicked',
  ROLE_CHANGED: 'role_changed',

  // Invitation Events
  INVITATION_RECEIVED: 'invitation_received',
  INVITATION_ACCEPTED: 'invitation_accepted',
  INVITATION_DECLINED: 'invitation_declined',

  // Chat Events
  LOBBY_CHAT_MESSAGE: 'lobby_chat_message',

  // Error Events
  ERROR: 'error'
};

// Error Types
const ERROR_TYPES = {
  INVALID_ACTION: 'invalid_action',
  INVALID_PAYLOAD: 'invalid_payload',
  PLAYER_NOT_FOUND: 'player_not_found',
  LOBBY_NOT_FOUND: 'lobby_not_found',
  LOBBY_FULL: 'lobby_full',
  PERMISSION_DENIED: 'permission_denied',
  ALREADY_IN_LOBBY: 'already_in_lobby',
  INVITATION_NOT_FOUND: 'invitation_not_found',
  MATCH_ERROR: 'match_error',
  SIGNATURE_VERIFICATION_FAILED: 'signature_verification_failed',
  TIMESTAMP_EXPIRED: 'timestamp_expired',
  ALREADY_REGISTERED: 'already_registered',
  NOT_REGISTERED: 'not_registered'
};

module.exports = {
  SERVER_CONFIG,
  TIMEOUTS,
  LOBBY_CONFIG,
  PLAYER_ROLES,
  LOBBY_STATUS,
  ACTIONS,
  EVENTS,
  ERROR_TYPES
};
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node.js WebSocket server for Evolute Kingdom: Mage Duel - a real-time multiplayer blockchain game. The server provides lobby systems, player presence tracking, matchmaking, and real-time communication using a modular architecture.

## Commands

### Development
- `npm start` - Start the WebSocket server (runs on port 7021)
- `node server.js` - Alternative way to start the server

### Environment Variables
- `WS_PORT` - WebSocket server port (default: 7021)
- `WS_HOST` - Server host (default: localhost)
- `LOG_LEVEL` - Logging level: error/warn/info/debug (default: info)

### Dependencies
- `npm install` - Install dependencies (only `ws` WebSocket library)

## Modular Architecture

### Project Structure
```
ws-server/
├── server.js                 # Main server entry point
├── src/
│   ├── config/
│   │   └── constants.js       # Configuration constants
│   ├── managers/
│   │   ├── ChannelManager.js  # Channel subscriptions
│   │   ├── PlayerManager.js   # Player presence tracking
│   │   └── LobbyManager.js    # Lobby system
│   ├── handlers/
│   │   └── MessageHandler.js  # Message routing
│   ├── utils/
│   │   ├── logger.js          # Logging system
│   │   └── helpers.js         # Utility functions
│   └── types/
│       └── events.js          # Event definitions
```

### Core Managers

**ChannelManager** (`src/managers/ChannelManager.js`)
- Manages WebSocket channel subscriptions
- Methods: `subscribe()`, `unsubscribe()`, `publish()`, `sendToClient()`
- Handles client cleanup and channel broadcasting

**PlayerManager** (`src/managers/PlayerManager.js`)
- Tracks player online presence via ping system
- Methods: `updatePing()`, `isOnline()`, `getOnlineStatuses()`
- Automatic cleanup of inactive players (6-second timeout)

**LobbyManager** (`src/managers/LobbyManager.js`)
- Full lobby system implementation
- Features: lobby creation, joining, invitations, matches, chat
- Methods: `createLobby()`, `joinLobby()`, `invitePlayer()`, `startMatch()`
- Supports 1v1 matches with unlimited spectators

**MessageHandler** (`src/handlers/MessageHandler.js`)
- Routes all incoming WebSocket messages
- Validates message format and delegates to appropriate managers
- Handles all lobby, player, and channel actions

### Message Protocol

The server maintains **full backward compatibility** with existing API while adding new lobby features.

**Existing Actions (unchanged):**
```json
{
  "action": "subscribe|unsubscribe|publish|ping|check_online",
  "channel": "channel_name",
  "payload": "message_data"
}
```

**New Lobby Actions:**
- `create_lobby` - Create new lobby (returns 6-char code)
- `join_lobby` - Join lobby by code
- `leave_lobby` - Leave current lobby
- `invite_player` - Send lobby invitation
- `accept_invitation`/`decline_invitation` - Handle invitations
- `start_match` - Begin 1v1 match (host only)
- `end_match` - Complete match with optional winner
- `lobby_chat` - Send chat message to lobby
- `kick_player` - Remove player from lobby (host only)

### Lobby System Features

**Lobby Structure:**
- 6-character unique codes (A-Z, 0-9)
- Host system with permission controls
- Player roles: Host, Player (max 2), Spectator (unlimited)
- Status tracking: waiting → ready → in_game → finished
- Built-in chat system with message history

**Match System:**
- 1v1 matches between lobby players
- Match tracking with start/end times
- Winner reporting system
- Spectator support during matches

**Invitation System:**
- Send invitations to offline/online players
- Accept/decline workflow
- Automatic cleanup of expired invitations (1-minute timeout)

### Configuration

All constants are centralized in `src/config/constants.js`:
- Server settings, timeouts, lobby limits
- Action types, event types, error types
- Player roles and lobby statuses

### Logging

Advanced logging system with color-coded output:
- Levels: error, warn, info, debug
- Context-specific loggers for different components
- Statistics logging every 5 minutes

### Error Handling

- Comprehensive error types and messages
- Graceful degradation on client disconnect
- Automatic cleanup of orphaned resources
- Rate limiting and validation helpers

## Development Notes

- All existing API endpoints remain unchanged for backward compatibility
- New lobby features are additive, not replacing existing functionality
- Server supports graceful shutdown with client notification
- Statistics and monitoring built-in
- Ukrainian comments have been replaced with English documentation
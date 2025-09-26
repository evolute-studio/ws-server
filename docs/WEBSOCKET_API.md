# WebSocket API Documentation

## Server Connection

### Basic Information
- **URL**: `ws://localhost:7021`
- **Protocol**: WebSocket
- **Message Format**: JSON

### Message Structure

All messages from client must have the following structure:

```javascript
{
  "action": "action_name",
  "payload": { /* action data */ }
}
```

Server responds in the following format:

```javascript
{
  "event": "event_name",
  "data": { /* event data */ }
}
```

## 🔒 Security

### Identity System
- Server uses WebSocket connection as unique player identifier
- Client CANNOT impersonate other players
- Player address is fixed on first PING and cannot be changed

### Required First PING
```javascript
// REQUIRED first message after connection
{
  "action": "ping",
  "payload": {
    "Address": "0x1234567890abcdef..." // Your wallet address
  }
}
```

⚠️ **IMPORTANT**: Address cannot be changed after first ping. Attempting to change address will result in error.

---

## 📤 Client Actions

### Player Management

#### `PING` - Heartbeat
**Description**: Required heartbeat to maintain connection

```javascript
// Send
{
  "action": "ping",
  "payload": {
    "Address": "0x1234567890abcdef..."
  }
}
```

- Send every 5 seconds
- First ping establishes your address
- Address cannot be changed after first ping

#### `CHECK_ONLINE` - Check Online Status
**Description**: Check which players are currently online

```javascript
// Send
{
  "action": "check_online",
  "payload": {
    "players": ["0x123...", "0x456...", "0x789..."]
  }
}

// Response
{
  "event": "online_status",
  "data": "101" // Binary string: 1=online, 0=offline
}
```

### Lobby Management

#### `CREATE_LOBBY` - Create Lobby
**Description**: Create new lobby (you become host)

```javascript
// Send
{
  "action": "create_lobby",
  "payload": {} // Empty payload
}

// Success Response
{
  "event": "lobby_created",
  "data": {
    "code": "ABC123",
    "host": "0x123...",
    "players": ["0x123..."],
    "spectators": [],
    "status": "waiting",
    "created": 1640995200000,
    "lastActivity": 1640995200000,
    "chatHistory": []
  }
}
```

#### `JOIN_LOBBY` - Join Lobby
**Description**: Join existing lobby

```javascript
// Send
{
  "action": "join_lobby",
  "payload": {
    "lobbyCode": "ABC123",
    "role": "player" // or "spectator"
  }
}

// Success Response
{
  "event": "lobby_joined",
  "data": {
    "lobby": { /* lobby object */ },
    "role": "player"
  }
}
```

**Roles:**
- `"player"` - active player (max 2)
- `"spectator"` - spectator (max 10)

#### `LEAVE_LOBBY` - Leave Lobby
**Description**: Leave current lobby

```javascript
// Send
{
  "action": "leave_lobby",
  "payload": {} // Empty payload
}

// Success Response
{
  "event": "lobby_left",
  "data": {
    "success": true,
    "lobbyClosed": false // true if lobby was closed
  }
}
```

#### `GET_LOBBY_INFO` - Get Lobby Info
**Description**: Get current lobby information

```javascript
// Send
{
  "action": "get_lobby_info",
  "payload": {
    "lobbyCode": "ABC123"
  }
}

// Success Response
{
  "event": "lobby_info",
  "data": {
    "lobby": { /* lobby object */ },
    "isHost": true,
    "playerRole": "player"
  }
}
```

#### `KICK_PLAYER` - Kick Player (Host only)
**Description**: Remove player from lobby

```javascript
// Send (host only)
{
  "action": "kick_player",
  "payload": {
    "targetPlayerId": "0x456..." // Player address to kick
  }
}

// Success Response
{
  "event": "player_kicked",
  "data": {
    "success": true
  }
}
```

#### `CHANGE_ROLE` - Change Role
**Description**: Switch between player and spectator roles

```javascript
// Send
{
  "action": "change_role",
  "payload": {
    "newRole": "spectator" // "player" or "spectator"
  }
}

// Success Response
{
  "event": "role_changed",
  "data": {
    "newRole": "spectator",
    "lobby": { /* updated lobby */ }
  }
}
```

### Invitations

#### `INVITE_PLAYER` - Invite Player
**Description**: Invite player to your lobby

```javascript
// Send
{
  "action": "invite_player",
  "payload": {
    "targetPlayerId": "0x456..." // Player address
  }
}

// Success Response
{
  "event": "invitation_received",
  "data": {
    "success": true
  }
}
```

#### `ACCEPT_INVITATION` - Accept Invitation
**Description**: Accept lobby invitation

```javascript
// Send
{
  "action": "accept_invitation",
  "payload": {
    "fromPlayerId": "0x123...", // Sender address
    "lobbyCode": "ABC123"
  }
}

// Success Response
{
  "event": "lobby_joined",
  "data": {
    "lobby": { /* lobby object */ },
    "role": "player"
  }
}
```

#### `DECLINE_INVITATION` - Decline Invitation
**Description**: Decline lobby invitation

```javascript
// Send
{
  "action": "decline_invitation",
  "payload": {
    "fromPlayerId": "0x123...", // Sender address
    "lobbyCode": "ABC123"
  }
}

// Success Response
{
  "event": "invitation_declined",
  "data": {
    "success": true
  }
}
```

### Chat

#### `LOBBY_CHAT` - Lobby Chat Message
**Description**: Send message to lobby chat

```javascript
// Send
{
  "action": "lobby_chat",
  "payload": {
    "message": "Hello everyone!"
  }
}

// All lobby members receive
{
  "event": "lobby_chat_message",
  "data": {
    "playerId": "0x123...",
    "message": "Hello everyone!",
    "timestamp": 1640995200000
  }
}
```

### Channels (Advanced functionality)

#### `SUBSCRIBE` - Subscribe to Channel
```javascript
{
  "action": "subscribe",
  "channel": "global_chat" // channel name
}
```

#### `UNSUBSCRIBE` - Unsubscribe from Channel
```javascript
{
  "action": "unsubscribe",
  "channel": "global_chat"
}
```

#### `PUBLISH` - Publish to Channel
```javascript
{
  "action": "publish",
  "channel": "global_chat",
  "payload": { "message": "Hello world!" }
}
```

---

## 📥 Server Events

### Lobby Events
- `lobby_created` - Lobby created
- `lobby_joined` - Joined lobby
- `lobby_left` - Left lobby
- `lobby_info` - Lobby information
- `player_kicked` - Player kicked
- `role_changed` - Role changed

### Invitation Events
- `invitation_received` - Invitation received
- `invitation_accepted` - Invitation accepted
- `invitation_declined` - Invitation declined

### Chat Events
- `lobby_chat_message` - Lobby chat message

### Player Events
- `online_status` - Player online status

### Error Events
- `error` - Error occurred

---

## 📊 Data Structures

### Lobby Object
```javascript
{
  "code": "ABC123",           // Lobby code (6 characters)
  "host": "0x123...",         // Host address
  "players": ["0x123..."],    // Player addresses array (max 2)
  "spectators": [],           // Spectator addresses array (max 10)
  "status": "waiting",        // "waiting" or "ready"
  "created": 1640995200000,   // Creation timestamp
  "lastActivity": 1640995200000, // Last activity timestamp
  "chatHistory": [            // Chat history (last 50 messages)
    {
      "playerId": "0x123...",
      "message": "Hello!",
      "timestamp": 1640995200000
    }
  ],
  "currentMatch": null        // Current match ID (if any)
}
```

### Player Roles
- `"player"` - Active player (participates in match)
- `"spectator"` - Spectator (watches match)

### Lobby Status
- `"waiting"` - Waiting for players (less than 2 players)
- `"ready"` - Ready to start (2 players)

---

## ❌ Error Handling

### Error Format
```javascript
{
  "event": "error",
  "data": {
    "success": false,
    "error": "error_type",
    "message": "Human readable error message",
    "timestamp": 1640995200000
  }
}
```

### Error Types
- `invalid_action` - Unknown action
- `invalid_payload` - Invalid payload
- `player_not_found` - Player not found
- `lobby_not_found` - Lobby not found
- `lobby_full` - Lobby is full
- `permission_denied` - No permission
- `already_in_lobby` - Already in lobby
- `invitation_not_found` - Invitation not found
- `match_error` - Match error

---

## 🔧 Limits and Restrictions

### Lobby Limits
- **Max players**: 2
- **Max spectators**: 10
- **Lobby code length**: 6 characters (A-Z, 0-9)

### Timeouts
- **Player timeout**: 6 seconds (after last ping)
- **Lobby timeout**: 5 minutes of inactivity
- **Invitation timeout**: 1 minute to respond

### Message Limits
- **Max chat message length**: 500 characters
- **Chat history**: last 50 messages
- **Rate limiting**: 10 requests per second per client

---

## 💡 Usage Examples

### Complete Lobby Creation Workflow

```javascript
const ws = new WebSocket('ws://localhost:7021');

ws.onopen = () => {
  // 1. Required first ping
  ws.send(JSON.stringify({
    action: 'ping',
    payload: { Address: '0x1234567890abcdef' }
  }));

  // 2. Create lobby
  ws.send(JSON.stringify({
    action: 'create_lobby',
    payload: {}
  }));
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);

  if (message.event === 'lobby_created') {
    console.log('Lobby created:', message.data.code);
    // Share lobby code with friends
  } else if (message.event === 'lobby_joined') {
    console.log('Player joined:', message.data.lobby.players);
  } else if (message.event === 'lobby_chat_message') {
    console.log('Chat:', message.data.playerId, message.data.message);
  }
};

// Heartbeat every 5 seconds
setInterval(() => {
  ws.send(JSON.stringify({
    action: 'ping',
    payload: { Address: '0x1234567890abcdef' }
  }));
}, 5000);
```

### Joining Lobby

```javascript
// Join as player
ws.send(JSON.stringify({
  action: 'join_lobby',
  payload: {
    lobbyCode: 'ABC123',
    role: 'player'
  }
}));

// Join as spectator
ws.send(JSON.stringify({
  action: 'join_lobby',
  payload: {
    lobbyCode: 'ABC123',
    role: 'spectator'
  }
}));
```

### Invitation System

```javascript
// Host invites player
ws.send(JSON.stringify({
  action: 'invite_player',
  payload: {
    targetPlayerId: '0x456...'
  }
}));

// Invited player accepts
ws.send(JSON.stringify({
  action: 'accept_invitation',
  payload: {
    fromPlayerId: '0x123...',
    lobbyCode: 'ABC123'
  }
}));
```

### Chat

```javascript
// Send message to lobby
ws.send(JSON.stringify({
  action: 'lobby_chat',
  payload: {
    message: 'Ready to play!'
  }
}));

// Handle incoming messages
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.event === 'lobby_chat_message') {
    displayChatMessage(msg.data.playerId, msg.data.message);
  }
};
```

---

## 🛡️ Security and Best Practices

### Required Rules
1. **Always send ping** every 5 seconds
2. **First ping** sets your address forever
3. **Handle errors** properly
4. **Don't rely on client validation** - server validates everything

### Recommendations
- Use reconnect logic when connection drops
- Cache lobby information locally
- Show connection status to user
- Handle all possible events and errors

### Don'ts
- ❌ Don't change address after first ping
- ❌ Don't send actions without ping
- ❌ Don't rely on client-side checks
- ❌ Don't ignore error handling

---

## 🚀 TypeScript Interfaces

```typescript
// Base types
interface WebSocketMessage {
  action: string;
  payload?: any;
}

interface WebSocketEvent {
  event: string;
  data: any;
}

// Actions
type PlayerAction = 'ping' | 'check_online';
type LobbyAction = 'create_lobby' | 'join_lobby' | 'leave_lobby' |
                  'get_lobby_info' | 'kick_player' | 'change_role';
type InvitationAction = 'invite_player' | 'accept_invitation' | 'decline_invitation';
type ChatAction = 'lobby_chat';

// Events
type PlayerEvent = 'online_status';
type LobbyEvent = 'lobby_created' | 'lobby_joined' | 'lobby_left' |
                 'lobby_info' | 'player_kicked' | 'role_changed';
type InvitationEvent = 'invitation_received' | 'invitation_accepted' | 'invitation_declined';
type ChatEvent = 'lobby_chat_message';
type ErrorEvent = 'error';

// Data structures
interface Lobby {
  code: string;
  host: string;
  players: string[];
  spectators: string[];
  status: 'waiting' | 'ready';
  created: number;
  lastActivity: number;
  chatHistory: ChatMessage[];
  currentMatch?: string;
}

interface ChatMessage {
  playerId: string;
  message: string;
  timestamp: number;
}

type PlayerRole = 'player' | 'spectator';
type LobbyStatus = 'waiting' | 'ready';
```

---

## ❓ FAQ

**Q: Is ping required?**
A: Yes, ping is required every 5-6 seconds. Without it, server will disconnect you.

**Q: Can I change player address?**
A: No, address is fixed on first ping and cannot be changed.

**Q: What happens when host disconnects?**
A: Host is automatically transferred to another player. If no players remain, lobby closes.

**Q: How many lobbies can I create?**
A: One player can only be in one lobby at a time.

**Q: How does invitation system work?**
A: Only host can invite. Invitations expire after 1 minute.

---

*Documentation updated on 26.09.2025*
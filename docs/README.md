# WebSocket Server Documentation

## 🚀 Quick Start

### Connection
```javascript
const ws = new WebSocket('ws://localhost:7021');

// REQUIRED first ping with your address
ws.onopen = () => {
  ws.send(JSON.stringify({
    action: 'ping',
    payload: { Address: 'your_wallet_address_here' }
  }));
};
```

### Create Lobby
```javascript
ws.send(JSON.stringify({
  action: 'create_lobby',
  payload: {}
}));
```

### Join Lobby
```javascript
ws.send(JSON.stringify({
  action: 'join_lobby',
  payload: {
    lobbyCode: 'ABC123',
    role: 'player' // or 'spectator'
  }
}));
```

### Heartbeat (required!)
```javascript
setInterval(() => {
  ws.send(JSON.stringify({
    action: 'ping',
    payload: { Address: 'your_wallet_address_here' }
  }));
}, 5000);
```

## 📚 Full Documentation

**[→ Complete WebSocket API Documentation](./WEBSOCKET_API.md)**

## 🔒 Key Security Features

- ✅ **WebSocket-based identification** - impossible to impersonate other players
- ✅ **Fixed address** - address cannot be changed after first ping
- ✅ **Automatic validation** - server validates all actions
- ✅ **Rate limiting** - protection against spam

## 📊 Main Limitations

- **Max players per lobby**: 2
- **Max spectators**: 10
- **Ping timeout**: 6 seconds
- **Chat message length**: 500 characters

## 🔗 Links

- [WebSocket API Documentation](./WEBSOCKET_API.md) - Complete API reference
- [Code Examples](./WEBSOCKET_API.md#-examples) - Ready-to-use examples
- [TypeScript Interfaces](./WEBSOCKET_API.md#-typescript-interfaces) - Types for TS

---

*Documentation created on 26.09.2025*
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
console.log('WebSocket server started on ws://localhost:8080');

const channels = new Map(); // channelName -> Set of clients
const clientChannels = new Map(); // client -> Set of channelNames
const playerLastPing = new Map(); // playerId -> timestamp

const PLAYER_TIMEOUT = 6000; // 6 seconds timeout

function cleanupInactivePlayers() {
    const now = Date.now();
    for (const [playerId, lastPing] of playerLastPing.entries()) {
        if (now - lastPing >= PLAYER_TIMEOUT) {
            playerLastPing.delete(playerId);
            console.log(`Cleaned up inactive player: ${playerId}`);
        }
    }
}

// Запускаємо очищення кожні PLAYER_TIMEOUT мілісекунд
setInterval(cleanupInactivePlayers, PLAYER_TIMEOUT);

function isPlayerOnline(playerId) {
    const lastPing = playerLastPing.get(playerId);
    const now = Date.now();
    console.log(`Checking player ${playerId}: lastPing=${lastPing}, now=${now}, diff=${now - lastPing}ms`);
    if (!lastPing) return false;
    return Date.now() - lastPing < PLAYER_TIMEOUT;
}

wss.on('connection', (ws) => {
  console.log('Client connected');

  clientChannels.set(ws, new Set());

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      const { action, channel, payload } = data;

      switch (action) {
        case 'subscribe':
          if (!channels.has(channel)) channels.set(channel, new Set());
          channels.get(channel).add(ws);
          clientChannels.get(ws).add(channel);
          console.log(`Client subscribed to ${channel}`);
          break;

        case 'unsubscribe':
          if (channels.has(channel)) {
            channels.get(channel).delete(ws);
            clientChannels.get(ws).delete(channel);
            console.log(`Client unsubscribed from ${channel}`);
          }
          break;

        case 'publish':
          if (channels.has(channel)) {
            const msg = JSON.stringify({ channel, payload });
            for (const client of channels.get(channel)) {
              if (client.readyState === WebSocket.OPEN) {
                client.send(msg);
              }
            }
            console.log(`Message in channel ${channel}:`, payload);
          }
          break;

        case 'ping':
          const pingData = typeof payload === 'string' ? JSON.parse(payload) : payload;
          if (pingData && pingData.Address) {
            playerLastPing.set(pingData.Address, Date.now());
            console.log(`Received ping from player ${pingData.Address}`);
          }
          break;

        case 'check_online':
          console.log('Received check_online request with payload:', payload);
          const playersData = typeof payload === 'string' ? JSON.parse(payload) : payload;
          console.log('Parsed players data:', playersData);
          
          if (playersData && Array.isArray(playersData.players)) {
            console.log('Checking online status for players:', playersData.players);
            const statuses = playersData.players.map(playerId => {
              const isOnline = isPlayerOnline(playerId);
              console.log(`Player ${playerId}: last ping = ${playerLastPing.get(playerId)}, is online = ${isOnline}`);
              return isOnline;
            });
            console.log('Final statuses:', statuses);
            ws.send(JSON.stringify({
              action: 'online_status',
              payload: {
                statuses: statuses
              }
            }));
            console.log(`Sent online status response:`, statuses);
          } else {
            console.warn('Invalid payload for check_online, expected {players: string[]} but got:', playersData);
          }
          break;

        default:
          console.warn('Unknown action:', action);
      }
    } catch (err) {
      console.error('Error processing message:', err);
    }
  });

  ws.on('close', () => {
    // Очистити всі підписки
    for (const channel of clientChannels.get(ws)) {
      channels.get(channel)?.delete(ws);
    }
    clientChannels.delete(ws);
    console.log('Client disconnected');
  });
});

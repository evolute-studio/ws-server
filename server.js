const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
console.log('WebSocket server started on ws://localhost:8080');

const channels = new Map(); // channelName -> Set of clients
const clientChannels = new Map(); // client -> Set of channelNames

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


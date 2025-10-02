/**
 * Main WebSocket server for Evolute Kingdom: Mage Duel
 * Modular architecture with separate managers for different responsibilities
 */

const WebSocket = require('ws');

// Import configuration
const { SERVER_CONFIG } = require('./src/config/constants');

// Import managers
const Logger = require('./src/utils/logger');
const ChannelManager = require('./src/managers/ChannelManager');
const PlayerManager = require('./src/managers/PlayerManager');
const LobbyManager = require('./src/managers/LobbyManager');
const MessageHandler = require('./src/handlers/MessageHandler');
const { disconnectPrisma } = require('./src/utils/prisma');

/**
 * Main server class
 */
class EvoluteWebSocketServer {
  constructor() {
    this.logger = new Logger('EvoluteWS', process.env.LOG_LEVEL || 'debug');
    this.server = null;
    this.messageHandler = null;

    // Initialize managers
    this.initializeManagers();

    // Setup graceful shutdown
    this.setupGracefulShutdown();
  }

  /**
   * Initialize all managers
   */
  initializeManagers() {
    this.logger.info('Initializing managers...');

    // Initialize managers in dependency order
    this.channelManager = new ChannelManager(this.logger);
    this.playerManager = new PlayerManager(this.logger);
    this.lobbyManager = new LobbyManager(this.logger, this.playerManager, this.channelManager);
    this.messageHandler = new MessageHandler(
      this.logger,
      this.channelManager,
      this.playerManager,
      this.lobbyManager
    );

    this.logger.info('All managers initialized successfully');
  }

  /**
   * Start the WebSocket server
   */
  async start() {
    try {
      const port = SERVER_CONFIG.DEFAULT_PORT;
      this.server = new WebSocket.Server({
        port,
        perMessageDeflate: false // Disable compression for better performance
      });

      this.logger.info(`WebSocket server starting on ws://${SERVER_CONFIG.HOST}:${port}`);

      // Handle new connections
      this.server.on('connection', (ws, req) => {
        this.handleConnection(ws, req);
      });

      // Handle server events
      this.server.on('error', (error) => {
        this.logger.error('WebSocket server error:', error);
      });

      this.server.on('listening', async () => {
        this.logger.info(`WebSocket server successfully started on port ${port}`);
        this.logServerInfo();

        // Restore lobbies from database
        try {
          const restoredCount = await this.lobbyManager.restoreLobbiesFromDatabase();
          if (restoredCount > 0) {
            this.logger.info(`Restored ${restoredCount} lobbies from database`);
          }
        } catch (error) {
          this.logger.error('Error restoring lobbies from database:', error);
        }
      });

      // Log statistics periodically (every 5 minutes)
      setInterval(() => {
        this.logStatistics();
      }, 5 * 60 * 1000);

    } catch (error) {
      this.logger.error('Failed to start WebSocket server:', error);
      process.exit(1);
    }
  }

  /**
   * Handle new WebSocket connection
   * @param {WebSocket} ws - WebSocket connection
   * @param {IncomingMessage} req - HTTP request object
   */
  handleConnection(ws, req) {
    const clientIP = req.socket.remoteAddress;
    this.logger.info(`New client connected from ${clientIP}`);

    // Initialize client with channel manager
    this.channelManager.initClient(ws);

    // Set up message handler
    ws.on('message', (message) => {
      this.messageHandler.handleMessage(ws, message);
    });

    // Handle client disconnection
    ws.on('close', (code, reason) => {
      this.logger.info(`Client disconnected: ${code} - ${reason}`);
      this.messageHandler.handleClientDisconnect(ws);
    });

    // Handle WebSocket errors
    ws.on('error', (error) => {
      this.logger.error('WebSocket connection error:', error);
    });

    // Send welcome message (optional)
    try {
      ws.send(JSON.stringify({
        action: 'connected',
        payload: {
          message: 'Connected to Evolute Kingdom WebSocket Server',
          timestamp: Date.now(),
          serverVersion: '2.0.0'
        }
      }));
    } catch (error) {
      this.logger.warn('Failed to send welcome message:', error);
    }
  }

  /**
   * Log server information
   */
  logServerInfo() {
    this.logger.info('=== Server Information ===');
    this.logger.info(`Host: ${SERVER_CONFIG.HOST}`);
    this.logger.info(`Port: ${SERVER_CONFIG.DEFAULT_PORT}`);
    this.logger.info(`Node.js Version: ${process.version}`);
    this.logger.info(`Platform: ${process.platform}`);
    this.logger.info(`PID: ${process.pid}`);
    this.logger.info('========================');
  }

  /**
   * Log server statistics
   */
  logStatistics() {
    try {
      const stats = this.messageHandler.getStats();

      this.logger.info('=== Server Statistics ===');
      this.logger.info(`Connected clients: ${stats.channelStats.totalClients}`);
      this.logger.info(`Active channels: ${stats.channelStats.totalChannels}`);
      this.logger.info(`Online players: ${stats.playerStats.onlinePlayers}`);
      this.logger.info(`Total tracked players: ${stats.playerStats.totalPlayers}`);
      this.logger.info(`Active lobbies: ${stats.lobbyStats.totalLobbies}`);
      this.logger.info(`Players in lobbies: ${stats.lobbyStats.totalPlayers}`);
      this.logger.info(`Active matches: ${stats.lobbyStats.totalMatches}`);
      this.logger.info(`Memory usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
      this.logger.info('=========================');
    } catch (error) {
      this.logger.error('Error logging statistics:', error);
    }
  }

  /**
   * Gracefully shutdown the server
   */
  async shutdown() {
    this.logger.info('Starting graceful shutdown...');

    if (this.server) {
      // Close server to new connections
      this.server.close(() => {
        this.logger.info('WebSocket server closed');
      });

      // Notify all connected clients
      this.server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          try {
            client.send(JSON.stringify({
              action: 'server_shutdown',
              payload: {
                message: 'Server is shutting down',
                timestamp: Date.now()
              }
            }));
            client.close(1000, 'Server shutdown');
          } catch (error) {
            this.logger.warn('Error notifying client of shutdown:', error);
          }
        }
      });
    }

    // Disconnect from database
    try {
      this.logger.info('Disconnecting from database...');
      await disconnectPrisma();
      this.logger.info('Database connection closed');
    } catch (error) {
      this.logger.error('Error disconnecting from database:', error);
    }

    // Give clients time to disconnect gracefully
    setTimeout(() => {
      this.logger.info('Graceful shutdown completed');
      process.exit(0);
    }, 2000);
  }

  /**
   * Setup graceful shutdown handlers
   */
  setupGracefulShutdown() {
    // Handle various shutdown signals
    const shutdownSignals = ['SIGINT', 'SIGTERM', 'SIGUSR2'];

    shutdownSignals.forEach((signal) => {
      process.on(signal, () => {
        this.logger.info(`Received ${signal}, initiating graceful shutdown...`);
        this.shutdown();
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      this.logger.error('Uncaught Exception:', error);
      this.shutdown();
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      this.logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      this.shutdown();
    });
  }
}

// Create and start the server
const server = new EvoluteWebSocketServer();
server.start();

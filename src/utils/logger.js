/**
 * Simple console logger with different levels
 */
class Logger {
  constructor(name = 'WebSocketServer', level = 'info') {
    this.name = name;
    this.setLevel(level);
    this.colors = {
      reset: '\x1b[0m',
      bright: '\x1b[1m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      cyan: '\x1b[36m',
      white: '\x1b[37m'
    };
  }

  setLevel(level) {
    const levels = { error: 0, warn: 1, info: 2, debug: 3 };
    this.level = levels[level] !== undefined ? levels[level] : 2;
  }

  formatMessage(level, message, ...args) {
    const timestamp = new Date().toISOString();
    const formattedMessage = typeof message === 'string' ? message : JSON.stringify(message);
    const argsString = args.length > 0 ? ' ' + args.map(arg =>
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ') : '';

    return `${timestamp} [${this.name}] ${level.toUpperCase()}: ${formattedMessage}${argsString}`;
  }

  error(message, ...args) {
    if (this.level >= 0) {
      const formatted = this.formatMessage('error', message, ...args);
      console.error(`${this.colors.red}${formatted}${this.colors.reset}`);
    }
  }

  warn(message, ...args) {
    if (this.level >= 1) {
      const formatted = this.formatMessage('warn', message, ...args);
      console.warn(`${this.colors.yellow}${formatted}${this.colors.reset}`);
    }
  }

  info(message, ...args) {
    if (this.level >= 2) {
      const formatted = this.formatMessage('info', message, ...args);
      console.log(`${this.colors.green}${formatted}${this.colors.reset}`);
    }
  }

  debug(message, ...args) {
    if (this.level >= 3) {
      const formatted = this.formatMessage('debug', message, ...args);
      console.log(`${this.colors.cyan}${formatted}${this.colors.reset}`);
    }
  }

  // Convenience methods for specific contexts
  lobby(message, ...args) {
    this.info(`[LOBBY] ${message}`, ...args);
  }

  player(message, ...args) {
    this.info(`[PLAYER] ${message}`, ...args);
  }

  channel(message, ...args) {
    this.info(`[CHANNEL] ${message}`, ...args);
  }

  match(message, ...args) {
    this.info(`[MATCH] ${message}`, ...args);
  }
}

module.exports = Logger;
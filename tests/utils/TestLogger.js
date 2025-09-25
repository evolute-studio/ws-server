/**
 * Test Logger - Special logger for testing environment
 * Provides control over output levels and log collection for verification
 */

class TestLogger {
  constructor(name = 'TestSuite', level = 'error', collectLogs = false) {
    this.name = name;
    this.setLevel(level);
    this.collectLogs = collectLogs;
    this.logs = []; // Collected logs for verification

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
    this.level = levels[level] !== undefined ? levels[level] : 0;
  }

  formatMessage(level, message, ...args) {
    const timestamp = new Date().toISOString();
    const formattedMessage = typeof message === 'string' ? message : JSON.stringify(message);
    const argsString = args.length > 0 ? ' ' + args.map(arg =>
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ') : '';

    const logEntry = {
      timestamp,
      level,
      logger: this.name,
      message: formattedMessage + argsString
    };

    // Collect logs if enabled
    if (this.collectLogs) {
      this.logs.push(logEntry);
    }

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

  // Special test methods
  test(message, ...args) {
    const formatted = this.formatMessage('test', message, ...args);
    console.log(`${this.colors.magenta}${formatted}${this.colors.reset}`);
  }

  pass(message, ...args) {
    const formatted = this.formatMessage('pass', message, ...args);
    console.log(`${this.colors.green}✅ ${formatted}${this.colors.reset}`);
  }

  fail(message, ...args) {
    const formatted = this.formatMessage('fail', message, ...args);
    console.log(`${this.colors.red}❌ ${formatted}${this.colors.reset}`);
  }

  // Test utility methods
  getLogs(level = null) {
    if (!level) return this.logs;
    return this.logs.filter(log => log.level === level);
  }

  clearLogs() {
    this.logs = [];
  }

  hasLog(message, level = null) {
    return this.logs.some(log =>
      log.message.includes(message) &&
      (level === null || log.level === level)
    );
  }

  // Silent mode for tests that don't need output
  enableSilentMode() {
    this.originalLevel = this.level;
    this.level = -1; // Below error level
  }

  disableSilentMode() {
    this.level = this.originalLevel || 0;
  }

  // Create a child logger for specific test modules
  createChildLogger(childName) {
    return new TestLogger(`${this.name}:${childName}`, 'error', this.collectLogs);
  }
}

// Create silent logger instance for tests that need quiet operation
function createSilentLogger(name = 'Silent') {
  const logger = new TestLogger(name, 'error', false);
  logger.enableSilentMode();
  return logger;
}

// Create collecting logger for tests that need to verify log output
function createCollectingLogger(name = 'Collector', level = 'debug') {
  return new TestLogger(name, level, true);
}

module.exports = TestLogger;
module.exports.createSilentLogger = createSilentLogger;
module.exports.createCollectingLogger = createCollectingLogger;
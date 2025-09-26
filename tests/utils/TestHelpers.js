/**
 * Test Helpers - Common utilities for testing
 * Provides assertions, data generators, and cleanup functions
 */

const { LOBBY_STATUS, PLAYER_ROLES, MATCH_STATUS } = require('../../src/config/constants');

/**
 * Custom assertions for testing
 */
class TestAssertions {
  static assertEquals(actual, expected, message = '') {
    if (actual !== expected) {
      throw new Error(`Assertion failed${message ? ': ' + message : ''}\nExpected: ${expected}\nActual: ${actual}`);
    }
  }

  static assertNotEquals(actual, notExpected, message = '') {
    if (actual === notExpected) {
      throw new Error(`Assertion failed${message ? ': ' + message : ''}\nExpected NOT: ${notExpected}\nActual: ${actual}`);
    }
  }

  static assertTrue(condition, message = '') {
    if (!condition) {
      throw new Error(`Assertion failed${message ? ': ' + message : ''}\nExpected: true\nActual: false`);
    }
  }

  static assertFalse(condition, message = '') {
    if (condition) {
      throw new Error(`Assertion failed${message ? ': ' + message : ''}\nExpected: false\nActual: true`);
    }
  }

  static assertNull(value, message = '') {
    if (value !== null) {
      throw new Error(`Assertion failed${message ? ': ' + message : ''}\nExpected: null\nActual: ${value}`);
    }
  }

  static assertNotNull(value, message = '') {
    if (value === null) {
      throw new Error(`Assertion failed${message ? ': ' + message : ''}\nExpected: not null\nActual: null`);
    }
  }

  static assertArrayContains(array, item, message = '') {
    if (!Array.isArray(array) || !array.includes(item)) {
      throw new Error(`Assertion failed${message ? ': ' + message : ''}\nArray does not contain: ${item}\nArray: ${JSON.stringify(array)}`);
    }
  }

  static assertArrayNotContains(array, item, message = '') {
    if (Array.isArray(array) && array.includes(item)) {
      throw new Error(`Assertion failed${message ? ': ' + message : ''}\nArray should not contain: ${item}\nArray: ${JSON.stringify(array)}`);
    }
  }

  static assertObjectHasProperty(obj, property, message = '') {
    if (!obj || typeof obj !== 'object' || !(property in obj)) {
      throw new Error(`Assertion failed${message ? ': ' + message : ''}\nObject does not have property: ${property}\nObject: ${JSON.stringify(obj)}`);
    }
  }

  static assertThrows(fn, expectedErrorType = null, message = '') {
    try {
      fn();
      throw new Error(`Assertion failed${message ? ': ' + message : ''}\nExpected function to throw an error, but it didn't`);
    } catch (error) {
      if (expectedErrorType && !(error instanceof expectedErrorType)) {
        throw new Error(`Assertion failed${message ? ': ' + message : ''}\nExpected error type: ${expectedErrorType.name}\nActual error type: ${error.constructor.name}`);
      }
    }
  }

  static assertLobbyStructure(lobby, message = '') {
    const requiredProps = ['code', 'host', 'players', 'spectators', 'status', 'created', 'lastActivity'];
    for (const prop of requiredProps) {
      this.assertObjectHasProperty(lobby, prop, `${message} - Missing lobby property: ${prop}`);
    }

    this.assertTrue(Array.isArray(lobby.players), `${message} - players should be array`);
    this.assertTrue(Array.isArray(lobby.spectators), `${message} - spectators should be array`);
    this.assertTrue(Object.values(LOBBY_STATUS).includes(lobby.status), `${message} - invalid lobby status`);
  }

  static assertSuccessResult(result, message = '') {
    this.assertObjectHasProperty(result, 'success', message);
    this.assertTrue(result.success, `${message} - Expected success=true but got ${result.success}`);
  }

  static assertErrorResult(result, expectedErrorType = null, message = '') {
    this.assertObjectHasProperty(result, 'success', message);
    this.assertFalse(result.success, `${message} - Expected success=false but got ${result.success}`);

    if (expectedErrorType) {
      this.assertObjectHasProperty(result, 'error', message);
      this.assertEquals(result.error, expectedErrorType, `${message} - Wrong error type`);
    }
  }
}

/**
 * Test data generators
 */
class TestDataGenerator {
  static generatePlayerId(prefix = 'player') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  }

  static generatePlayerIds(count, prefix = 'player') {
    return Array.from({ length: count }, () => this.generatePlayerId(prefix));
  }

  static generateLobbyCode() {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return code;
  }

  static generateChatMessage(playerId = null, customText = null) {
    return {
      playerId: playerId || this.generatePlayerId(),
      message: customText || `Test message ${Date.now()}`,
      timestamp: Date.now()
    };
  }

  static generateInvitation(fromPlayerId = null, targetPlayerId = null, lobbyCode = null) {
    return {
      fromPlayerId: fromPlayerId || this.generatePlayerId('inviter'),
      targetPlayerId: targetPlayerId || this.generatePlayerId('invitee'),
      lobbyCode: lobbyCode || this.generateLobbyCode(),
      timestamp: Date.now()
    };
  }

  static generateWebSocketMessage(action, payload = {}, channel = null) {
    const message = { action, payload };
    if (channel) message.channel = channel;
    return JSON.stringify(message);
  }
}

/**
 * Test cleanup utilities
 */
class TestCleanup {
  constructor() {
    this.cleanupFunctions = [];
  }

  /**
   * Add cleanup function to be called after test
   * @param {Function} fn - Cleanup function
   */
  addCleanup(fn) {
    this.cleanupFunctions.push(fn);
  }

  /**
   * Run all cleanup functions
   */
  async cleanup() {
    for (const fn of this.cleanupFunctions) {
      try {
        await fn();
      } catch (error) {
        console.error('Cleanup function failed:', error);
      }
    }
    this.cleanupFunctions = [];
  }

  /**
   * Clear all stored cleanup functions without running them
   */
  clear() {
    this.cleanupFunctions = [];
  }
}

/**
 * Test execution utilities
 */
class TestRunner {
  constructor(logger) {
    this.logger = logger;
    this.tests = [];
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      errors: []
    };
  }

  /**
   * Add test case
   * @param {string} name - Test name
   * @param {Function} testFn - Test function
   * @param {Object} options - Test options
   */
  addTest(name, testFn, options = {}) {
    this.tests.push({
      name,
      fn: testFn,
      timeout: options.timeout || 5000,
      skip: options.skip || false,
      only: options.only || false
    });
  }

  /**
   * Run all tests
   * @returns {Object} Test results
   */
  async runAll() {
    this.results = { total: 0, passed: 0, failed: 0, errors: [] };

    // Filter tests (handle 'only' flag)
    let testsToRun = this.tests.filter(test => !test.skip);
    const onlyTests = testsToRun.filter(test => test.only);
    if (onlyTests.length > 0) {
      testsToRun = onlyTests;
    }

    this.logger.info(`\n🧪 Running ${testsToRun.length} tests...\n`);

    for (const test of testsToRun) {
      await this.runSingleTest(test);
    }

    this.printSummary();
    return this.results;
  }

  /**
   * Run a single test
   * @param {Object} test - Test object
   */
  async runSingleTest(test) {
    this.results.total++;
    const cleanup = new TestCleanup();

    try {
      this.logger.test(`Running: ${test.name}`);

      // Set timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Test timeout')), test.timeout)
      );

      // Run test with timeout
      await Promise.race([
        test.fn(cleanup),
        timeoutPromise
      ]);

      this.logger.pass(`${test.name}`);
      this.results.passed++;

    } catch (error) {
      this.logger.fail(`${test.name}: ${error.message}`);
      this.results.failed++;
      this.results.errors.push({
        test: test.name,
        error: error.message,
        stack: error.stack
      });
    } finally {
      await cleanup.cleanup();
    }
  }

  /**
   * Print test summary
   */
  printSummary() {
    this.logger.info(`\n📊 Test Results:`);
    this.logger.info(`Total: ${this.results.total}`);
    this.logger.info(`Passed: ${this.results.passed}`);
    this.logger.info(`Failed: ${this.results.failed}`);

    if (this.results.failed > 0) {
      this.logger.error(`\n❌ Failed Tests:`);
      for (const error of this.results.errors) {
        this.logger.error(`  - ${error.test}: ${error.error}`);
      }
    } else {
      this.logger.pass(`\n🎉 All tests passed!`);
    }
  }
}

/**
 * Wait utility for async tests
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after delay
 */
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create test player with WebSocket connection and address
 * @param {PlayerManager} playerManager - Player manager instance
 * @param {string} address - Player address (optional, auto-generated if not provided)
 * @param {MockWebSocket} connection - Mock connection (optional, auto-generated if not provided)
 * @returns {MockWebSocket} WebSocket connection
 */
function createTestPlayer(playerManager, address = null, connection = null) {
  const client = connection || new (require('./MockWebSocket')).MockWebSocket();
  const playerAddress = address || TestDataGenerator.generatePlayerId();
  playerManager.updatePing(client, playerAddress);
  return client;
}

/**
 * Create test lobby with players
 * @param {LobbyManager} lobbyManager - Lobby manager instance
 * @param {PlayerManager} playerManager - Player manager instance
 * @param {MockWebSocket} hostClient - Host WebSocket connection (optional)
 * @param {Array} additionalPlayers - Additional player addresses to add
 * @returns {Object} Lobby creation result with host client
 */
async function createTestLobby(lobbyManager, playerManager, hostClient = null, additionalPlayers = []) {
  const host = hostClient || createTestPlayer(playerManager);
  const createResult = lobbyManager.createLobby(host);

  if (!createResult.success) {
    throw new Error(`Failed to create test lobby: ${createResult.message}`);
  }

  // Add additional players by address
  for (const playerAddress of additionalPlayers) {
    const client = createTestPlayer(playerManager, playerAddress);
    const joinResult = lobbyManager.joinLobby(client, createResult.lobby.code);
    if (!joinResult.success) {
      throw new Error(`Failed to add player ${playerAddress} to test lobby: ${joinResult.message}`);
    }
  }

  // Return result with host client reference
  return {
    ...createResult,
    hostClient: host
  };
}

module.exports = {
  TestAssertions,
  TestDataGenerator,
  TestCleanup,
  TestRunner,
  wait,
  createTestPlayer,
  createTestLobby
};
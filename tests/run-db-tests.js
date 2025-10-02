/**
 * Database Persistence Test Runner
 * Run separately from unit tests as they take longer
 */

const TestLogger = require('./utils/TestLogger');
const { disconnectPrisma } = require('../src/utils/prisma');
const testDatabasePersistence = require('./integration/database-persistence.test');

async function runDatabaseTests() {
  const logger = new TestLogger('DatabaseTestRunner', 'info');

  logger.info('🗄️  Running Database Persistence Tests');
  logger.info('======================================\n');

  try {
    const results = await testDatabasePersistence();

    logger.info('\n🏁 Database Test Results');
    logger.info('=======================');
    logger.info(`Total Tests: ${results.total}`);
    logger.info(`Passed: ${results.passed}`);
    logger.info(`Failed: ${results.failed}`);

    if (results.failed === 0) {
      logger.pass('\n🎉 ALL DATABASE TESTS PASSED!');
    } else {
      logger.fail(`\n💥 ${results.failed} DATABASE TESTS FAILED`);
    }

    await disconnectPrisma();
    process.exit(results.failed > 0 ? 1 : 0);
  } catch (error) {
    logger.error('Database tests failed:', error);
    await disconnectPrisma();
    process.exit(1);
  }
}

runDatabaseTests();

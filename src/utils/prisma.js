const { PrismaClient } = require('../../generated/prisma');

/**
 * Prisma Client singleton instance
 * Ensures only one instance is created across the application
 */
let prisma;

function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient({
      log: process.env.LOG_LEVEL === 'debug' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
    });
  }
  return prisma;
}

/**
 * Disconnect Prisma Client gracefully
 */
async function disconnectPrisma() {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
  }
}

module.exports = {
  getPrismaClient,
  disconnectPrisma
};
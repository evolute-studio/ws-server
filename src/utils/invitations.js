const { getPrismaClient } = require('./prisma');
const { TIMEOUTS } = require('../config/constants');

/**
 * Save invitation to database
 * @param {string} fromPlayerAddress - Inviter address
 * @param {string} toPlayerAddress - Invitee address
 * @param {string} lobbyCode - Lobby code
 * @returns {Promise<Object>} Database invitation object
 */
async function saveInvitation(fromPlayerAddress, toPlayerAddress, lobbyCode) {
  const prisma = getPrismaClient();

  try {
    const invitation = await prisma.invitation.create({
      data: {
        fromPlayerAddress,
        toPlayerAddress,
        lobbyCode,
        status: 'pending'
      }
    });

    return invitation;
  } catch (error) {
    throw new Error(`Failed to save invitation: ${error.message}`);
  }
}

/**
 * Get pending invitations for a player
 * @param {string} playerAddress - Player address
 * @returns {Promise<Array>} Array of invitations
 */
async function getPendingInvitations(playerAddress) {
  const prisma = getPrismaClient();

  try {
    const invitations = await prisma.invitation.findMany({
      where: {
        toPlayerAddress: playerAddress,
        status: 'pending'
      },
      orderBy: {
        timestamp: 'desc'
      }
    });

    return invitations;
  } catch (error) {
    throw new Error(`Failed to get pending invitations: ${error.message}`);
  }
}

/**
 * Update invitation status
 * @param {string} fromPlayerAddress - Inviter address
 * @param {string} toPlayerAddress - Invitee address
 * @param {string} lobbyCode - Lobby code
 * @param {string} status - New status ('accepted', 'declined', 'expired')
 * @returns {Promise<Object>} Updated invitation
 */
async function updateInvitationStatus(fromPlayerAddress, toPlayerAddress, lobbyCode, status) {
  const prisma = getPrismaClient();

  try {
    const invitation = await prisma.invitation.updateMany({
      where: {
        fromPlayerAddress,
        toPlayerAddress,
        lobbyCode,
        status: 'pending'
      },
      data: {
        status
      }
    });

    return invitation;
  } catch (error) {
    throw new Error(`Failed to update invitation status: ${error.message}`);
  }
}

/**
 * Clean up expired invitations
 * @returns {Promise<number>} Number of expired invitations
 */
async function cleanupExpiredInvitations() {
  const prisma = getPrismaClient();
  const cutoffTime = new Date(Date.now() - TIMEOUTS.INVITATION_TIMEOUT);

  try {
    // First mark as expired
    const updateResult = await prisma.invitation.updateMany({
      where: {
        status: 'pending',
        timestamp: {
          lt: cutoffTime
        }
      },
      data: {
        status: 'expired'
      }
    });

    return updateResult.count;
  } catch (error) {
    throw new Error(`Failed to cleanup expired invitations: ${error.message}`);
  }
}

/**
 * Delete old invitations (keep for 24 hours after expiry/decline)
 * @returns {Promise<number>} Number of deleted invitations
 */
async function deleteOldInvitations() {
  const prisma = getPrismaClient();
  const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours

  try {
    const result = await prisma.invitation.deleteMany({
      where: {
        status: {
          in: ['expired', 'declined', 'accepted']
        },
        timestamp: {
          lt: cutoffTime
        }
      }
    });

    return result.count;
  } catch (error) {
    throw new Error(`Failed to delete old invitations: ${error.message}`);
  }
}

module.exports = {
  saveInvitation,
  getPendingInvitations,
  updateInvitationStatus,
  cleanupExpiredInvitations,
  deleteOldInvitations
};
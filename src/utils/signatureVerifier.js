const { hash, ec, typedData } = require('starknet');

/**
 * Starknet signature verification utility
 * Supports verification using both high-level and low-level methods
 */
class SignatureVerifier {
  constructor(logger) {
    this.logger = logger;
  }

  /**
   * Verify Starknet signature using hash.computeHashOnElements and typedData.verifyMessage
   * @param {string[]} message - Array of message elements to hash
   * @param {string} signature - Signature to verify
   * @param {string} publicKey - Public key for verification
   * @returns {boolean} True if signature is valid
   */
  verifySignatureHighLevel(message, signature, publicKey) {
    try {
      const msgHash = hash.computeHashOnElements(message);
      const isValid = typedData.verifyMessage(msgHash, signature, publicKey);

      this.logger.debug(`High-level signature verification: ${isValid}`, {
        messageHash: msgHash,
        publicKey,
        signatureValid: isValid
      });

      return isValid;
    } catch (error) {
      this.logger.error('High-level signature verification failed:', error);
      return false;
    }
  }

  /**
   * Verify Starknet signature using low-level ec.starkCurve.verify
   * @param {string} signature - Signature to verify
   * @param {string} messageHash - Pre-computed message hash
   * @param {string} publicKey - Public key for verification
   * @returns {boolean} True if signature is valid
   */
  verifySignatureLowLevel(signature, messageHash, publicKey) {
    try {
      const isValid = ec.starkCurve.verify(signature, messageHash, publicKey);

      this.logger.debug(`Low-level signature verification: ${isValid}`, {
        messageHash,
        publicKey,
        signatureValid: isValid
      });

      return isValid;
    } catch (error) {
      this.logger.error('Low-level signature verification failed:', error);
      return false;
    }
  }

  /**
   * Create authentication message for player registration
   * @param {string} address - Player's Starknet address
   * @param {number} timestamp - Registration timestamp
   * @returns {string[]} Message array for hashing
   */
  createAuthMessage(address, timestamp) {
    return [
      'EVOLUTE_KINGDOM_AUTH',
      address,
      timestamp.toString()
    ];
  }

  /**
   * Verify player registration signature
   * @param {string} address - Player's Starknet address
   * @param {string} signature - Player's signature
   * @param {string} publicKey - Player's public key
   * @param {number} timestamp - Registration timestamp
   * @param {number} maxAgeMs - Maximum age of timestamp in milliseconds (default: 5 minutes)
   * @returns {Object} Verification result with success flag and details
   */
  verifyPlayerRegistration(address, signature, publicKey, timestamp, maxAgeMs = 300000) {
    try {
      // Check timestamp validity
      const now = Date.now();
      const timestampAge = now - timestamp;

      if (timestampAge > maxAgeMs) {
        return {
          success: false,
          error: 'TIMESTAMP_EXPIRED',
          message: `Signature timestamp too old: ${timestampAge}ms > ${maxAgeMs}ms`
        };
      }

      if (timestamp > now + 60000) { // Allow 1 minute future tolerance
        return {
          success: false,
          error: 'TIMESTAMP_FUTURE',
          message: 'Signature timestamp is too far in the future'
        };
      }

      // Create authentication message
      const authMessage = this.createAuthMessage(address, timestamp);

      // Verify signature using high-level method
      const isValidHighLevel = this.verifySignatureHighLevel(authMessage, signature, publicKey);

      if (!isValidHighLevel) {
        this.logger.warn(`Signature verification failed for address ${address}`);
        return {
          success: false,
          error: 'INVALID_SIGNATURE',
          message: 'Signature verification failed'
        };
      }

      this.logger.info(`Successfully verified registration for address ${address}`);
      return {
        success: true,
        address,
        timestamp,
        verified: true
      };

    } catch (error) {
      this.logger.error('Player registration verification error:', error);
      return {
        success: false,
        error: 'VERIFICATION_ERROR',
        message: error.message
      };
    }
  }

}

module.exports = SignatureVerifier;
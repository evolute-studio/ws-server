/**
 * Utility helper functions
 */

/**
 * Validate that a string is a valid player ID format
 * @param {string} playerId - Player ID to validate
 * @returns {boolean} True if valid
 */
function isValidPlayerId(playerId) {
  return typeof playerId === 'string' &&
         playerId.length > 0 &&
         playerId.length <= 100 &&
         /^[a-zA-Z0-9_-]+$/.test(playerId);
}

/**
 * Validate that a string is a valid lobby code format
 * @param {string} lobbyCode - Lobby code to validate
 * @returns {boolean} True if valid
 */
function isValidLobbyCode(lobbyCode) {
  return typeof lobbyCode === 'string' &&
         lobbyCode.length === 6 &&
         /^[A-Z0-9]+$/.test(lobbyCode);
}

/**
 * Sanitize chat message
 * @param {string} message - Chat message to sanitize
 * @returns {string} Sanitized message
 */
function sanitizeChatMessage(message) {
  if (typeof message !== 'string') return '';

  return message
    .trim()
    .substring(0, 500) // Limit length
    .replace(/[<>]/g, ''); // Remove potential HTML tags
}

/**
 * Generate a random string of specified length
 * @param {number} length - Length of string to generate
 * @param {string} charset - Characters to use
 * @returns {string} Random string
 */
function generateRandomString(length, charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));

  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

/**
 * Format duration in milliseconds to readable string
 * @param {number} ms - Duration in milliseconds
 * @returns {string} Formatted duration
 */
function formatDuration(ms) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Create a safe error response object
 * @param {string} errorType - Error type from ERROR_TYPES
 * @param {string} message - Error message
 * @param {Object} details - Additional error details
 * @returns {Object} Error response object
 */
function createErrorResponse(errorType, message, details = {}) {
  return {
    success: false,
    error: errorType,
    message,
    timestamp: Date.now(),
    ...details
  };
}

/**
 * Create a success response object
 * @param {Object} data - Response data
 * @param {string} event - Event type
 * @returns {Object} Success response object
 */
function createSuccessResponse(data = {}, event = null) {
  const response = {
    success: true,
    timestamp: Date.now(),
    ...data
  };

  if (event) {
    response.event = event;
  }

  return response;
}

/**
 * Validate WebSocket message structure
 * @param {Object} data - Parsed message data
 * @returns {Object} Validation result with isValid flag and error message
 */
function validateMessage(data) {
  if (!data || typeof data !== 'object') {
    return { isValid: false, error: 'Message must be a valid JSON object' };
  }

  if (typeof data.action !== 'string' || data.action.length === 0) {
    return { isValid: false, error: 'Message must have a valid action field' };
  }

  // payload is optional, but if present should be serializable
  if (data.payload !== undefined) {
    try {
      JSON.stringify(data.payload);
    } catch (error) {
      return { isValid: false, error: 'Payload must be serializable' };
    }
  }

  return { isValid: true };
}

/**
 * Rate limiter for WebSocket connections
 */
class RateLimiter {
  constructor(maxRequests = 10, windowMs = 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map(); // client -> [timestamps]
  }

  isAllowed(clientId) {
    const now = Date.now();
    const clientRequests = this.requests.get(clientId) || [];

    // Remove old requests outside the window
    const validRequests = clientRequests.filter(timestamp =>
      now - timestamp < this.windowMs
    );

    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(clientId, validRequests);

    return true;
  }

  cleanup() {
    const now = Date.now();
    for (const [clientId, requests] of this.requests.entries()) {
      const validRequests = requests.filter(timestamp =>
        now - timestamp < this.windowMs
      );

      if (validRequests.length === 0) {
        this.requests.delete(clientId);
      } else {
        this.requests.set(clientId, validRequests);
      }
    }
  }
}

module.exports = {
  isValidPlayerId,
  isValidLobbyCode,
  sanitizeChatMessage,
  generateRandomString,
  deepClone,
  formatDuration,
  createErrorResponse,
  createSuccessResponse,
  validateMessage,
  RateLimiter
};
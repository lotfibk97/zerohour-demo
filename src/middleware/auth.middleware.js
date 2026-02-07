/**
 * Authentication Middleware
 * Single Responsibility: Bearer token validation
 */

const config = require('../config');

/**
 * Validates admin Bearer token from Authorization header
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {Function} next - Next middleware
 */
const validateAdminToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      error: 'Authorization header required. Use: Authorization: Bearer DEMO_ADMIN_TOKEN'
    });
  }

  // Parse Bearer token
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      error: 'Invalid authorization format. Use: Authorization: Bearer <token>'
    });
  }

  const token = parts[1];
  if (token !== config.adminToken) {
    return res.status(401).json({
      error: 'Invalid admin token.'
    });
  }

  next();
};

module.exports = {
  validateAdminToken
};

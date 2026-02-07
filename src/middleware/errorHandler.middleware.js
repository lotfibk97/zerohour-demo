/**
 * Error Handler Middleware
 * Single Responsibility: Centralized error handling
 */

/**
 * Global error handler
 * @param {Error} err - Error object
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {Function} next - Next middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${err.message}`);

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: err.message,
      type: 'validation_error'
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    type: 'server_error'
  });
};

/**
 * Not found handler
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: `Route not found: ${req.method} ${req.path}`,
    type: 'not_found'
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};

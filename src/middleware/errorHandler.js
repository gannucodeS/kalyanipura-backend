const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const env = require('../config/env');

const errorHandler = (err, req, res, _next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';
    error = new ApiError(statusCode, message);
  }

  if (error.name === 'CastError') {
    error = ApiError.badRequest('Invalid ID format');
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue).join(', ');
    error = ApiError.conflict(`Duplicate value for: ${field}`);
  }

  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((e) => e.message);
    error = ApiError.badRequest('Validation failed', errors);
  }

  if (error.name === 'JsonWebTokenError') {
    error = ApiError.unauthorized('Invalid token');
  }

  if (error.name === 'TokenExpiredError') {
    error = ApiError.unauthorized('Token expired');
  }

  const statusCode = error.statusCode || 500;

  if (!env.isProduction) {
    logger.error(`${statusCode} - ${error.message}`, {
      stack: error.stack,
      url: req.originalUrl,
      method: req.method,
    });
  } else if (statusCode >= 500) {
    logger.error(`${statusCode} - ${error.message}`, {
      url: req.originalUrl,
      method: req.method,
    });
  }

  const response = {
    success: false,
    message: error.message || 'Internal server error',
    ...(error.errors.length && { errors: error.errors }),
    ...(!env.isProduction && { stack: error.stack }),
  };

  res.status(statusCode).json(response);
};

module.exports = errorHandler;

const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const env = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',

  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/kalyanipura-church',

  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  adminEmail: process.env.ADMIN_EMAIL || 'admin@kalyanipurachurch.org',
  adminPassword: process.env.ADMIN_PASSWORD || 'ChangeMe123!',
  jwtSecret: process.env.JWT_SECRET || 'change-this-secret-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',

  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  authRateLimitMax: parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10) || 10,

  logLevel: process.env.LOG_LEVEL || 'debug',
  logDir: process.env.LOG_DIR || 'logs',
};

module.exports = env;

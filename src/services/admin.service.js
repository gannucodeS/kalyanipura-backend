const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

class AdminService {
  constructor() {
    this.hashedPassword = null;
  }

  async _ensureHash() {
    if (this.hashedPassword) return this.hashedPassword;
    if (env.adminPassword.startsWith('$2')) {
      this.hashedPassword = env.adminPassword;
    } else {
      this.hashedPassword = await bcrypt.hash(env.adminPassword, 12);
    }
    return this.hashedPassword;
  }

  async login(email, password) {
    if (email !== env.adminEmail) {
      logger.warn(`Login attempt with invalid email: ${email}`);
      throw ApiError.unauthorized('Invalid email or password');
    }

    const hash = await this._ensureHash();
    const isMatch = await bcrypt.compare(password, hash);
    if (!isMatch) {
      logger.warn(`Failed login attempt for: ${email}`);
      throw ApiError.unauthorized('Invalid email or password');
    }

    const token = jwt.sign(
      { email: env.adminEmail },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn },
    );

    logger.info(`Admin logged in: ${email}`);
    return { token, email: env.adminEmail };
  }

  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, env.jwtSecret);
      return decoded;
    } catch (error) {
      throw ApiError.unauthorized('Invalid or expired token');
    }
  }
}

module.exports = new AdminService();

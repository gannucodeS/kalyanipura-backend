const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const env = require('../config/env');

const securityHeaders = helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
});

const logger = require('../utils/logger');
const normalizeOrigin = (url) => url?.replace(/\/+$/, '');
const corsMiddleware = cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      normalizeOrigin(env.clientUrl),
      'https://kalyanipura-backend.onrender.com',
    ];
    if (env.isDevelopment) {
      allowedOrigins.push('http://localhost:5173', 'http://localhost:5000');
    }
    if (!origin || allowedOrigins.includes(normalizeOrigin(origin))) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
});

const sanitize = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`Sanitized ${key} in ${req.originalUrl}`);
  },
});

const preventParamPollution = hpp({
  whitelist: ['page', 'limit', 'sort', 'search', 'category', 'frequency', 'topic', 'isApproved'],
});

const removePoweredBy = (req, res, next) => {
  res.removeHeader('X-Powered-By');
  next();
};

const requestSizeLimit = express.json({ limit: '10kb' });

module.exports = {
  securityHeaders,
  corsMiddleware,
  sanitize,
  preventParamPollution,
  removePoweredBy,
  requestSizeLimit,
};

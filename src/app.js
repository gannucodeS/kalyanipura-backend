const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const path = require('path');
const env = require('./config/env');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const {
  securityHeaders,
  corsMiddleware,
  sanitize,
  preventParamPollution,
  removePoweredBy,
  requestSizeLimit,
} = require('./middleware/security');
const apiRoutes = require('./routes/index');
const adminPanelRoutes = require('./routes/adminPanel.routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(compression());
app.use(securityHeaders);
app.use(corsMiddleware);
app.use(removePoweredBy);
app.use(requestSizeLimit);
app.use(cookieParser());
app.use(sanitize);
app.use(preventParamPollution);

app.use(express.urlencoded({ extended: true, limit: '10kb' }));

if (env.isDevelopment) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: { write: (message) => logger.http(message.trim()) },
  }));
}

app.use('/admin', adminPanelRoutes);
app.use('/api/v1', apiRoutes);

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(errorHandler);

module.exports = app;

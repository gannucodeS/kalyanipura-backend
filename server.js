const app = require('./src/app');
const { env, connectDB } = require('./src/config');
const logger = require('./src/utils/logger');

let server;

const startServer = async () => {
  try {
    await connectDB();

    await require('./src/utils/seed')();
    logger.info('Database seeded (if empty)');

    server = app.listen(env.port, () => {
      logger.info(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
      logger.info(`API: http://localhost:${env.port}/api/v1`);
      logger.info(`Admin: http://localhost:${env.port}/admin`);
      logger.info(`Health: http://localhost:${env.port}/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

const gracefulShutdown = (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed');
      try {
        await require('mongoose').disconnect();
        logger.info('MongoDB disconnected');
        process.exit(0);
      } catch (err) {
        logger.error('Error during shutdown:', err);
        process.exit(1);
      }
    });

    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 30000);
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

startServer();

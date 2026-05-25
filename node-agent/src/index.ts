import dotenv from 'dotenv';
import pino from 'pino';
import { NodeAgent } from './core/node-agent';
import { ApiClient } from './api/api-client';
import { LXCManager } from './lxc/lxc-manager';
import { SystemMonitor } from './monitoring/system-monitor';
import { VpsHandler } from './vps/vps-handler';

dotenv.config();

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
});

/**
 * ARVEX CLOUD NODE AGENT
 * Manages LXC/LXD containers on physical nodes
 */
async function bootstrap() {
  try {
    logger.info('🚀 Starting ARVEX Node Agent...');
    logger.info(`📍 Node ID: ${process.env.NODE_ID}`);
    logger.info(`🔗 API Server: ${process.env.API_URL}`);

    // Initialize core components
    const apiClient = new ApiClient(
      process.env.API_URL || 'http://localhost:3000',
      process.env.NODE_ID || 'node-001',
      process.env.NODE_SECRET || 'secret'
    );

    const lxcManager = new LXCManager(logger);
    const systemMonitor = new SystemMonitor(logger);
    const vpsHandler = new VpsHandler(lxcManager, apiClient, logger);

    // Initialize Node Agent
    const agent = new NodeAgent(
      apiClient,
      lxcManager,
      systemMonitor,
      vpsHandler,
      logger
    );

    // Start the agent
    await agent.initialize();
    await agent.start();

    logger.info('✅ Node Agent is running');

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('📴 SIGTERM received, shutting down gracefully...');
      await agent.shutdown();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      logger.info('📴 SIGINT received, shutting down gracefully...');
      await agent.shutdown();
      process.exit(0);
    });
  } catch (error) {
    logger.error('❌ Failed to start Node Agent:', error);
    process.exit(1);
  }
}

bootstrap();

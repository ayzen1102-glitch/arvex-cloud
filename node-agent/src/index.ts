import 'dotenv/config';
import { NodeAgent } from './agent';
import { Logger } from './utils/logger';

const logger = new Logger('NodeAgent');

async function bootstrap() {
  try {
    logger.info('🚀 Starting ARVEX Node Agent...');
    
    const agent = new NodeAgent();
    await agent.initialize();
    await agent.start();
    
    logger.info('✅ Node Agent started successfully');
  } catch (error) {
    logger.error('Failed to start Node Agent:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

bootstrap();

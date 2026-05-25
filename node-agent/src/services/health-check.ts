import { ApiClient } from '../utils/api-client';
import { Logger } from '../utils/logger';

export class HealthCheck {
  private logger = new Logger('HealthCheck');
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private lastHeartbeat: Date | null = null;

  constructor(private apiClient: ApiClient) {}

  startHeartbeat(interval: number = 30000): void {
    this.heartbeatInterval = setInterval(async () => {
      try {
        await this.apiClient.sendHeartbeat({
          nodeId: process.env.NODE_AGENT_ID,
          timestamp: new Date().toISOString(),
          status: 'healthy',
        });
        this.lastHeartbeat = new Date();
      } catch (error) {
        this.logger.error('Heartbeat failed', error);
      }
    }, interval);

    this.logger.info(`Heartbeat started (interval: ${interval}ms)`);
  }

  stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
      this.logger.info('Heartbeat stopped');
    }
  }

  getLastHeartbeat(): Date | null {
    return this.lastHeartbeat;
  }
}

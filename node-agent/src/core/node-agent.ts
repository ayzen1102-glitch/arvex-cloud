import pino from 'pino';
import { ApiClient } from '../api/api-client';
import { LXCManager } from '../lxc/lxc-manager';
import { SystemMonitor } from '../monitoring/system-monitor';
import { VpsHandler } from '../vps/vps-handler';
import * as cron from 'node-cron';

export class NodeAgent {
  private apiClient: ApiClient;
  private lxcManager: LXCManager;
  private systemMonitor: SystemMonitor;
  private vpsHandler: VpsHandler;
  private logger: pino.Logger;
  private tasks: cron.ScheduledTask[] = [];
  private isRunning = false;

  constructor(
    apiClient: ApiClient,
    lxcManager: LXCManager,
    systemMonitor: SystemMonitor,
    vpsHandler: VpsHandler,
    logger: pino.Logger
  ) {
    this.apiClient = apiClient;
    this.lxcManager = lxcManager;
    this.systemMonitor = systemMonitor;
    this.vpsHandler = vpsHandler;
    this.logger = logger;
  }

  async initialize(): Promise<void> {
    this.logger.info('🔧 Initializing Node Agent components...');

    try {
      // Initialize LXD connection
      await this.lxcManager.initialize();
      this.logger.info('✅ LXD connection established');

      // Check LXD status
      const lxdStatus = await this.lxcManager.getLxdStatus();
      this.logger.info('📊 LXD Status:', lxdStatus);

      // Get system info
      const sysInfo = await this.systemMonitor.getSystemInfo();
      this.logger.info('🖥️ System Info:', sysInfo);

      // Register node with API
      await this.registerNode();
      this.logger.info('✅ Node registered with API server');
    } catch (error) {
      this.logger.error('❌ Initialization failed:', error);
      throw error;
    }
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('⚠️ Node Agent is already running');
      return;
    }

    this.isRunning = true;
    this.logger.info('🎯 Starting scheduled tasks...');

    // Heartbeat - every 10 seconds
    this.tasks.push(
      cron.schedule('*/10 * * * * *', async () => {
        try {
          await this.sendHeartbeat();
        } catch (error) {
          this.logger.error('❌ Heartbeat failed:', error);
        }
      })
    );

    // System stats report - every 15 seconds
    this.tasks.push(
      cron.schedule('*/15 * * * * *', async () => {
        try {
          await this.reportStats();
        } catch (error) {
          this.logger.error('❌ Stats report failed:', error);
        }
      })
    );

    // Container sync - every 30 seconds
    this.tasks.push(
      cron.schedule('*/30 * * * * *', async () => {
        try {
          await this.syncContainers();
        } catch (error) {
          this.logger.error('❌ Container sync failed:', error);
        }
      })
    );

    // Cleanup old logs - every 6 hours
    this.tasks.push(
      cron.schedule('0 */6 * * *', async () => {
        try {
          await this.lxcManager.cleanupOldLogs();
        } catch (error) {
          this.logger.error('❌ Cleanup failed:', error);
        }
      })
    );

    this.logger.info('✅ All scheduled tasks started');
  }

  private async registerNode(): Promise<void> {
    const systemInfo = await this.systemMonitor.getSystemInfo();
    const containers = await this.lxcManager.listContainers();

    const nodeData = {
      nodeId: process.env.NODE_ID,
      nodeName: process.env.NODE_NAME,
      cpuCores: systemInfo.cpuCores,
      totalMemoryGB: systemInfo.totalMemoryGB,
      totalStorageGB: systemInfo.totalStorageGB,
      osType: systemInfo.osType,
      osVersion: systemInfo.osVersion,
      lxdVersion: systemInfo.lxdVersion,
      currentContainers: containers.length,
      status: 'online',
      timestamp: new Date().toISOString(),
    };

    await this.apiClient.post('/api/nodes/register', nodeData);
  }

  private async sendHeartbeat(): Promise<void> {
    const uptime = process.uptime();
    const memory = process.memoryUsage();

    const heartbeat = {
      nodeId: process.env.NODE_ID,
      timestamp: new Date().toISOString(),
      status: 'online',
      uptime,
      processMemory: {
        heapUsed: Math.round(memory.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memory.heapTotal / 1024 / 1024),
        external: Math.round(memory.external / 1024 / 1024),
      },
    };

    await this.apiClient.post('/api/nodes/heartbeat', heartbeat);
  }

  private async reportStats(): Promise<void> {
    const stats = await this.systemMonitor.getStats();
    const containers = await this.lxcManager.listContainers();

    const containerStats = await Promise.all(
      containers.map(async (container) => {
        const stats = await this.lxcManager.getContainerStats(container);
        return {
          name: container,
          ...stats,
        };
      })
    );

    const report = {
      nodeId: process.env.NODE_ID,
      timestamp: new Date().toISOString(),
      systemStats: stats,
      containers: containerStats,
    };

    await this.apiClient.post('/api/nodes/stats', report);
  }

  private async syncContainers(): Promise<void> {
    const containers = await this.lxcManager.listContainers();
    this.logger.debug(`📦 Syncing ${containers.length} containers`);

    const containerInfo = await Promise.all(
      containers.map(async (name) => {
        const info = await this.lxcManager.getContainerInfo(name);
        return info;
      })
    );

    const syncData = {
      nodeId: process.env.NODE_ID,
      timestamp: new Date().toISOString(),
      containers: containerInfo,
    };

    await this.apiClient.post('/api/nodes/sync', syncData);
  }

  async shutdown(): Promise<void> {
    this.logger.info('🛑 Shutting down Node Agent...');
    this.isRunning = false;

    // Stop all cron tasks
    this.tasks.forEach((task) => task.stop());
    this.logger.info('✅ Scheduled tasks stopped');

    // Send offline status
    try {
      await this.apiClient.post('/api/nodes/status', {
        nodeId: process.env.NODE_ID,
        status: 'offline',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.error('❌ Failed to send offline status:', error);
    }

    this.logger.info('✅ Node Agent shut down complete');
  }
}

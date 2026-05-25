import express from 'express';
import { LXCManager } from './managers/lxc-manager';
import { SystemMonitor } from './managers/system-monitor';
import { ApiClient } from './utils/api-client';
import { Logger } from './utils/logger';
import { HealthCheck } from './services/health-check';
import { VpsHandler } from './services/vps-handler';

export class NodeAgent {
  private app = express();
  private logger = new Logger('NodeAgent');
  private lxcManager: LXCManager;
  private systemMonitor: SystemMonitor;
  private apiClient: ApiClient;
  private healthCheck: HealthCheck;
  private vpsHandler: VpsHandler;
  private port = parseInt(process.env.NODE_AGENT_PORT || '8085', 10);

  constructor() {
    this.apiClient = new ApiClient();
    this.lxcManager = new LXCManager();
    this.systemMonitor = new SystemMonitor();
    this.healthCheck = new HealthCheck(this.apiClient);
    this.vpsHandler = new VpsHandler(this.lxcManager, this.apiClient);
  }

  async initialize(): Promise<void> {
    this.setupMiddleware();
    this.setupRoutes();
    await this.lxcManager.initialize();
    this.logger.info('NodeAgent initialized successfully');
  }

  private setupMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    // Authentication middleware
    this.app.use((req, res, next) => {
      const token = req.headers['authorization']?.split(' ')[1];
      if (token !== process.env.NODE_AGENT_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      next();
    });
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        nodeId: process.env.NODE_AGENT_ID,
        timestamp: new Date().toISOString(),
      });
    });

    // System stats
    this.app.get('/stats', async (req, res) => {
      try {
        const stats = await this.systemMonitor.getSystemStats();
        res.json(stats);
      } catch (error) {
        res.status(500).json({ error: 'Failed to get stats' });
      }
    });

    // VPS Management Routes
    this.app.post('/vps/create', async (req, res) => {
      try {
        const result = await this.vpsHandler.createVps(req.body);
        res.json(result);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    });

    this.app.post('/vps/:vpsId/start', async (req, res) => {
      try {
        const result = await this.vpsHandler.startVps(req.params.vpsId);
        res.json(result);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    });

    this.app.post('/vps/:vpsId/stop', async (req, res) => {
      try {
        const result = await this.vpsHandler.stopVps(req.params.vpsId);
        res.json(result);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    });

    this.app.post('/vps/:vpsId/restart', async (req, res) => {
      try {
        const result = await this.vpsHandler.restartVps(req.params.vpsId);
        res.json(result);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    });

    this.app.delete('/vps/:vpsId', async (req, res) => {
      try {
        const result = await this.vpsHandler.deleteVps(req.params.vpsId);
        res.json(result);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    });

    this.app.get('/vps/:vpsId/stats', async (req, res) => {
      try {
        const stats = await this.vpsHandler.getVpsStats(req.params.vpsId);
        res.json(stats);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    });

    this.app.post('/vps/:vpsId/console', async (req, res) => {
      try {
        const console = await this.vpsHandler.getConsoleAccess(req.params.vpsId);
        res.json(console);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    });
  }

  async start(): Promise<void> {
    // Start periodic health checks
    this.healthCheck.startHeartbeat();

    // Start system monitoring
    this.systemMonitor.startMonitoring();

    // Start express server
    this.app.listen(this.port, () => {
      this.logger.info(`🔥 Node Agent listening on port ${this.port}`);
    });
  }
}

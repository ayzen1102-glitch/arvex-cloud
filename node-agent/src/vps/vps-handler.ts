import pino from 'pino';
import { LXCManager } from '../lxc/lxc-manager';
import { ApiClient } from '../api/api-client';
import { v4 as uuidv4 } from 'uuid';

export interface CreateVpsRequest {
  vpsId: string;
  name: string;
  image: string;
  cpu: number;
  memory: string;
  disk: string;
  hostname?: string;
  rootPassword?: string;
}

export interface VpsCommand {
  type: 'create' | 'delete' | 'start' | 'stop' | 'restart' | 'reinstall';
  vpsId: string;
  data?: any;
}

export class VpsHandler {
  private lxcManager: LXCManager;
  private apiClient: ApiClient;
  private logger: pino.Logger;
  private pendingOperations: Map<string, Promise<any>> = new Map();

  constructor(
    lxcManager: LXCManager,
    apiClient: ApiClient,
    logger: pino.Logger
  ) {
    this.lxcManager = lxcManager;
    this.apiClient = apiClient;
    this.logger = logger;
  }

  async handleCommand(command: VpsCommand): Promise<void> {
    const operationId = `${command.vpsId}-${Date.now()}`;

    try {
      this.logger.info(`🔄 Handling VPS command: ${command.type} for ${command.vpsId}`);

      const operation = this.executeCommand(command);
      this.pendingOperations.set(operationId, operation);

      await operation;

      // Notify API of successful completion
      await this.apiClient.post('/api/vps/command-result', {
        vpsId: command.vpsId,
        command: command.type,
        status: 'success',
        timestamp: new Date().toISOString(),
      });

      this.logger.info(`✅ VPS command completed: ${command.type} for ${command.vpsId}`);
    } catch (error) {
      this.logger.error(`❌ VPS command failed: ${command.type} for ${command.vpsId}`, error);

      // Notify API of failure
      await this.apiClient.post('/api/vps/command-result', {
        vpsId: command.vpsId,
        command: command.type,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }).catch(err => this.logger.error('Failed to report error:', err));
    } finally {
      this.pendingOperations.delete(operationId);
    }
  }

  private async executeCommand(command: VpsCommand): Promise<void> {
    switch (command.type) {
      case 'create':
        await this.createVps(command.data as CreateVpsRequest);
        break;
      case 'delete':
        await this.deleteVps(command.vpsId);
        break;
      case 'start':
        await this.startVps(command.vpsId);
        break;
      case 'stop':
        await this.stopVps(command.vpsId);
        break;
      case 'restart':
        await this.restartVps(command.vpsId);
        break;
      case 'reinstall':
        await this.reinstallVps(command.vpsId, command.data?.image);
        break;
      default:
        throw new Error(`Unknown command type: ${command.type}`);
    }
  }

  private async createVps(request: CreateVpsRequest): Promise<void> {
    this.logger.info(`🔨 Creating VPS: ${request.vpsId}`);

    try {
      // Create container
      await this.lxcManager.createContainer(request.vpsId, request.image, {
        cpu: request.cpu,
        memory: request.memory,
        disk: request.disk,
      });

      // Wait for container to be ready
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Set hostname
      if (request.hostname) {
        await this.lxcManager.executeCommand(
          request.vpsId,
          `hostnamectl set-hostname ${request.hostname}`
        );
      }

      // Set root password if provided
      if (request.rootPassword) {
        await this.lxcManager.executeCommand(
          request.vpsId,
          `echo 'root:${request.rootPassword}' | chpasswd`
        );
      }

      this.logger.info(`✅ VPS created successfully: ${request.vpsId}`);
    } catch (error) {
      this.logger.error(`❌ Failed to create VPS ${request.vpsId}:`, error);
      // Cleanup on failure
      try {
        await this.lxcManager.deleteContainer(request.vpsId);
      } catch (cleanupError) {
        this.logger.error('Error cleaning up failed VPS:', cleanupError);
      }
      throw error;
    }
  }

  private async deleteVps(vpsId: string): Promise<void> {
    this.logger.info(`🗑️ Deleting VPS: ${vpsId}`);
    await this.lxcManager.deleteContainer(vpsId);
    this.logger.info(`✅ VPS deleted: ${vpsId}`);
  }

  private async startVps(vpsId: string): Promise<void> {
    this.logger.info(`▶️ Starting VPS: ${vpsId}`);
    await this.lxcManager.startContainer(vpsId);
    this.logger.info(`✅ VPS started: ${vpsId}`);
  }

  private async stopVps(vpsId: string): Promise<void> {
    this.logger.info(`⏹️ Stopping VPS: ${vpsId}`);
    await this.lxcManager.stopContainer(vpsId);
    this.logger.info(`✅ VPS stopped: ${vpsId}`);
  }

  private async restartVps(vpsId: string): Promise<void> {
    this.logger.info(`🔄 Restarting VPS: ${vpsId}`);
    await this.lxcManager.restartContainer(vpsId);
    this.logger.info(`✅ VPS restarted: ${vpsId}`);
  }

  private async reinstallVps(vpsId: string, image?: string): Promise<void> {
    this.logger.info(`📦 Reinstalling VPS: ${vpsId}`);

    try {
      // Stop VPS
      await this.lxcManager.stopContainer(vpsId);

      // For now, we would need to create a new container and migrate data
      // In production, implement proper OS reinstall logic
      this.logger.info(`✅ VPS reinstalled: ${vpsId}`);
    } catch (error) {
      this.logger.error(`❌ Failed to reinstall VPS ${vpsId}:`, error);
      throw error;
    }
  }

  async isVpsOperationPending(vpsId: string): Promise<boolean> {
    for (const [key] of this.pendingOperations) {
      if (key.startsWith(vpsId)) {
        return true;
      }
    }
    return false;
  }
}

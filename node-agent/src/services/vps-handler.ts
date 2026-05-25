import { v4 as uuidv4 } from 'uuid';
import { LXCManager, ContainerSpec } from '../managers/lxc-manager';
import { ApiClient } from '../utils/api-client';
import { Logger } from '../utils/logger';

export interface CreateVpsRequest {
  vpsId: string;
  hostname: string;
  cpu: number;
  memory: number;
  disk: number;
  os: string; // ubuntu-22.04, ubuntu-20.04, debian-12, debian-11, centos-7
  rootPassword: string;
}

export class VpsHandler {
  private logger = new Logger('VpsHandler');
  private containerNamePrefix = 'vps-';

  constructor(
    private lxcManager: LXCManager,
    private apiClient: ApiClient,
  ) {}

  async createVps(request: CreateVpsRequest): Promise<any> {
    try {
      const containerName = `${this.containerNamePrefix}${request.vpsId.substring(0, 8)}`;

      this.logger.info(`Creating VPS: ${request.vpsId}`);

      const spec: ContainerSpec = {
        name: containerName,
        image: this.mapOsToImage(request.os),
        cpu: request.cpu,
        memory: request.memory,
        disk: request.disk,
      };

      // Create LXC container
      const result = await this.lxcManager.createContainer(spec);

      // Set root password
      if (request.rootPassword) {
        await this.lxcManager.executeInContainer(
          containerName,
          `echo 'root:${request.rootPassword}' | chpasswd`,
        );
      }

      // Enable SSH
      await this.lxcManager.executeInContainer(containerName, 'apt-get update && apt-get install -y openssh-server');

      // Notify backend
      await this.apiClient.notifyVpsCreated(request.vpsId, {
        status: 'running',
        containerName,
        nodeId: process.env.NODE_AGENT_ID,
      });

      return {
        success: true,
        vpsId: request.vpsId,
        containerName,
        status: 'running',
      };
    } catch (error: any) {
      this.logger.error(`Failed to create VPS: ${error.message}`);
      await this.apiClient.notifyVpsFailed(request.vpsId, error.message);
      throw error;
    }
  }

  async startVps(vpsId: string): Promise<any> {
    try {
      const containerName = this.getContainerName(vpsId);
      await this.lxcManager.startContainer(containerName);
      await this.apiClient.updateVpsStatus(vpsId, 'running');
      return { success: true, vpsId, status: 'running' };
    } catch (error: any) {
      this.logger.error(`Failed to start VPS: ${error.message}`);
      throw error;
    }
  }

  async stopVps(vpsId: string): Promise<any> {
    try {
      const containerName = this.getContainerName(vpsId);
      await this.lxcManager.stopContainer(containerName);
      await this.apiClient.updateVpsStatus(vpsId, 'stopped');
      return { success: true, vpsId, status: 'stopped' };
    } catch (error: any) {
      this.logger.error(`Failed to stop VPS: ${error.message}`);
      throw error;
    }
  }

  async restartVps(vpsId: string): Promise<any> {
    try {
      const containerName = this.getContainerName(vpsId);
      await this.lxcManager.restartContainer(containerName);
      await this.apiClient.updateVpsStatus(vpsId, 'running');
      return { success: true, vpsId, status: 'running' };
    } catch (error: any) {
      this.logger.error(`Failed to restart VPS: ${error.message}`);
      throw error;
    }
  }

  async deleteVps(vpsId: string): Promise<any> {
    try {
      const containerName = this.getContainerName(vpsId);
      await this.lxcManager.stopContainer(containerName, true);
      await this.lxcManager.deleteContainer(containerName);
      await this.apiClient.updateVpsStatus(vpsId, 'deleted');
      return { success: true, vpsId };
    } catch (error: any) {
      this.logger.error(`Failed to delete VPS: ${error.message}`);
      throw error;
    }
  }

  async getVpsStats(vpsId: string): Promise<any> {
    try {
      const containerName = this.getContainerName(vpsId);
      const stats = await this.lxcManager.getContainerStats(containerName);
      return {
        vpsId,
        ...stats,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      this.logger.error(`Failed to get VPS stats: ${error.message}`);
      throw error;
    }
  }

  async getConsoleAccess(vpsId: string): Promise<any> {
    try {
      const containerName = this.getContainerName(vpsId);
      // For web console, generate NoVNC token
      const consoleUrl = `lxc-console://${containerName}@${process.env.NODE_AGENT_ID}`;
      return {
        vpsId,
        consoleUrl,
        type: 'lxc-console',
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      this.logger.error(`Failed to get console access: ${error.message}`);
      throw error;
    }
  }

  private getContainerName(vpsId: string): string {
    return `${this.containerNamePrefix}${vpsId.substring(0, 8)}`;
  }

  private mapOsToImage(os: string): string {
    const imageMap: Record<string, string> = {
      'ubuntu-22.04': 'ubuntu/jammy',
      'ubuntu-20.04': 'ubuntu/focal',
      'debian-12': 'debian/bookworm',
      'debian-11': 'debian/bullseye',
      'centos-7': 'centos/7',
    };
    return imageMap[os] || 'ubuntu/jammy';
  }
}

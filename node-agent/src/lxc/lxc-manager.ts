import { execSync } from 'child_process';
import pino from 'pino';

export interface ContainerStats {
  name: string;
  status: string;
  cpu: number;
  memory: number;
  disk: number;
  network: {
    bytesIn: number;
    bytesOut: number;
  };
}

export class LXCManager {
  private logger: pino.Logger;
  private lxdPath: string;

  constructor(logger: pino.Logger) {
    this.logger = logger;
    this.lxdPath = process.env.LXD_SOCKET || '/var/snap/lxd/common/lxd.sock';
  }

  async initialize(): Promise<void> {
    try {
      // Check if lxd is running
      const version = await this.executeLxcCommand('lxc version');
      this.logger.info(`✅ LXD is available: ${version.trim()}`);
    } catch (error) {
      this.logger.error('❌ LXD initialization failed:', error);
      throw new Error('LXD not available or not installed');
    }
  }

  async getLxdStatus(): Promise<any> {
    try {
      const output = await this.executeLxcCommand('lxc info');
      return this.parseLxdInfo(output);
    } catch (error) {
      this.logger.error('Error getting LXD status:', error);
      throw error;
    }
  }

  private parseLxdInfo(output: string): any {
    const lines = output.split('\n');
    const info: any = {};

    for (const line of lines) {
      if (line.includes('client version:')) {
        info.clientVersion = line.split(':')[1]?.trim();
      }
      if (line.includes('server version:')) {
        info.serverVersion = line.split(':')[1]?.trim();
      }
      if (line.includes('driver:')) {
        info.driver = line.split(':')[1]?.trim();
      }
    }

    return info;
  }

  async listContainers(): Promise<string[]> {
    try {
      const output = await this.executeLxcCommand('lxc list --format=csv -c n');
      const containers = output
        .trim()
        .split('\n')
        .filter((line) => line.length > 0);
      return containers;
    } catch (error) {
      this.logger.error('Error listing containers:', error);
      return [];
    }
  }

  async createContainer(
    name: string,
    image: string,
    config: {
      cpu: number;
      memory: string;
      disk: string;
    }
  ): Promise<void> {
    try {
      this.logger.info(`🔨 Creating container: ${name}`);

      // Launch container
      await this.executeLxcCommand(
        `lxc launch ${image} ${name} --config limits.cpu=${config.cpu} --config limits.memory=${config.memory}`
      );

      // Create storage device
      await this.executeLxcCommand(
        `lxc config device add ${name} root disk path=/ pool=default size=${config.disk}`
      );

      this.logger.info(`✅ Container created: ${name}`);
    } catch (error) {
      this.logger.error(`❌ Failed to create container ${name}:`, error);
      throw error;
    }
  }

  async deleteContainer(name: string): Promise<void> {
    try {
      this.logger.info(`🗑️ Deleting container: ${name}`);
      await this.executeLxcCommand(`lxc delete -f ${name}`);
      this.logger.info(`✅ Container deleted: ${name}`);
    } catch (error) {
      this.logger.error(`❌ Failed to delete container ${name}:`, error);
      throw error;
    }
  }

  async startContainer(name: string): Promise<void> {
    try {
      this.logger.info(`▶️ Starting container: ${name}`);
      await this.executeLxcCommand(`lxc start ${name}`);
      this.logger.info(`✅ Container started: ${name}`);
    } catch (error) {
      this.logger.error(`❌ Failed to start container ${name}:`, error);
      throw error;
    }
  }

  async stopContainer(name: string): Promise<void> {
    try {
      this.logger.info(`⏹️ Stopping container: ${name}`);
      await this.executeLxcCommand(`lxc stop ${name} -f`);
      this.logger.info(`✅ Container stopped: ${name}`);
    } catch (error) {
      this.logger.error(`❌ Failed to stop container ${name}:`, error);
      throw error;
    }
  }

  async restartContainer(name: string): Promise<void> {
    try {
      this.logger.info(`🔄 Restarting container: ${name}`);
      await this.executeLxcCommand(`lxc restart ${name}`);
      this.logger.info(`✅ Container restarted: ${name}`);
    } catch (error) {
      this.logger.error(`❌ Failed to restart container ${name}:`, error);
      throw error;
    }
  }

  async getContainerInfo(name: string): Promise<any> {
    try {
      const output = await this.executeLxcCommand(`lxc info ${name}`);
      return this.parseContainerInfo(output, name);
    } catch (error) {
      this.logger.error(`Error getting container info for ${name}:`, error);
      throw error;
    }
  }

  private parseContainerInfo(output: string, name: string): any {
    const lines = output.split('\n');
    const info: any = {
      name,
      status: 'unknown',
      pid: 0,
      memory: 0,
    };

    for (const line of lines) {
      if (line.includes('Status:')) {
        info.status = line.split(':')[1]?.trim().toLowerCase();
      }
      if (line.includes('PID:')) {
        info.pid = parseInt(line.split(':')[1]?.trim() || '0');
      }
      if (line.includes('Memory usage:')) {
        info.memory = line.split(':')[1]?.trim();
      }
    }

    return info;
  }

  async getContainerStats(name: string): Promise<ContainerStats> {
    try {
      const info = await this.getContainerInfo(name);
      // In production, would use lxc query for live stats
      return {
        name,
        status: info.status,
        cpu: 0,
        memory: 0,
        disk: 0,
        network: {
          bytesIn: 0,
          bytesOut: 0,
        },
      };
    } catch (error) {
      this.logger.error(`Error getting stats for ${name}:`, error);
      throw error;
    }
  }

  async getImageList(): Promise<string[]> {
    try {
      const output = await this.executeLxcCommand('lxc image list --format=csv -c d');
      const images = output
        .trim()
        .split('\n')
        .filter((line) => line.length > 0);
      return images;
    } catch (error) {
      this.logger.error('Error listing images:', error);
      return [];
    }
  }

  async executeCommand(container: string, command: string): Promise<string> {
    try {
      const output = await this.executeLxcCommand(`lxc exec ${container} -- ${command}`);
      return output;
    } catch (error) {
      this.logger.error(`Error executing command in ${container}:`, error);
      throw error;
    }
  }

  async cleanupOldLogs(): Promise<void> {
    try {
      this.logger.info('🧹 Cleaning up old logs...');
      // Execute cleanup command (example)
      await this.executeLxcCommand('find /var/log -name "*.log" -mtime +7 -delete');
      this.logger.info('✅ Cleanup completed');
    } catch (error) {
      this.logger.error('Cleanup error:', error);
    }
  }

  private async executeLxcCommand(command: string): Promise<string> {
    try {
      const result = execSync(command, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      return result;
    } catch (error: any) {
      throw new Error(`LXC command failed: ${error.message}`);
    }
  }
}

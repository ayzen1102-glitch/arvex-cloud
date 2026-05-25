import { execSync, exec } from 'child_process';
import { promisify } from 'util';
import { Logger } from '../utils/logger';

const execAsync = promisify(exec);

export interface ContainerSpec {
  name: string;
  image: string;
  cpu: number;
  memory: number;
  disk: number;
}

export class LXCManager {
  private logger = new Logger('LXCManager');
  private lxdSocketPath = process.env.LXD_SOCKET_PATH || '/var/snap/lxd/common/lxd.sock';

  async initialize(): Promise<void> {
    try {
      // Check if LXD is available
      const { stdout } = await execAsync('lxc version');
      this.logger.info(`LXD Version: ${stdout}`);
    } catch (error) {
      this.logger.error('LXD not available or not initialized');
      throw new Error('LXD initialization failed');
    }
  }

  async createContainer(spec: ContainerSpec): Promise<any> {
    try {
      this.logger.info(`Creating container: ${spec.name}`);

      // Pull image if not exists
      await this.ensureImageExists(spec.image);

      // Create container
      const createCmd = [
        'lxc',
        'launch',
        spec.image,
        spec.name,
        '--profile=default',
      ].join(' ');

      await execAsync(createCmd);

      // Configure resources
      await this.setResources(spec.name, spec.cpu, spec.memory, spec.disk);

      this.logger.info(`Container ${spec.name} created successfully`);
      return { success: true, name: spec.name };
    } catch (error: any) {
      this.logger.error(`Failed to create container: ${error.message}`);
      throw error;
    }
  }

  async deleteContainer(name: string): Promise<any> {
    try {
      this.logger.info(`Deleting container: ${name}`);
      await execAsync(`lxc delete ${name} --force`);
      this.logger.info(`Container ${name} deleted successfully`);
      return { success: true };
    } catch (error: any) {
      this.logger.error(`Failed to delete container: ${error.message}`);
      throw error;
    }
  }

  async startContainer(name: string): Promise<any> {
    try {
      this.logger.info(`Starting container: ${name}`);
      await execAsync(`lxc start ${name}`);
      this.logger.info(`Container ${name} started`);
      return { success: true };
    } catch (error: any) {
      this.logger.error(`Failed to start container: ${error.message}`);
      throw error;
    }
  }

  async stopContainer(name: string, force = false): Promise<any> {
    try {
      this.logger.info(`Stopping container: ${name}`);
      const cmd = force ? `lxc stop ${name} --force` : `lxc stop ${name}`;
      await execAsync(cmd);
      this.logger.info(`Container ${name} stopped`);
      return { success: true };
    } catch (error: any) {
      this.logger.error(`Failed to stop container: ${error.message}`);
      throw error;
    }
  }

  async restartContainer(name: string): Promise<any> {
    try {
      this.logger.info(`Restarting container: ${name}`);
      await execAsync(`lxc restart ${name}`);
      this.logger.info(`Container ${name} restarted`);
      return { success: true };
    } catch (error: any) {
      this.logger.error(`Failed to restart container: ${error.message}`);
      throw error;
    }
  }

  async getContainerInfo(name: string): Promise<any> {
    try {
      const { stdout } = await execAsync(`lxc info ${name} --format=json`);
      return JSON.parse(stdout);
    } catch (error: any) {
      this.logger.error(`Failed to get container info: ${error.message}`);
      throw error;
    }
  }

  async getContainerStats(name: string): Promise<any> {
    try {
      const { stdout } = await execAsync(`lxc info ${name} --format=json`);
      const info = JSON.parse(stdout);
      return {
        status: info.status,
        cpu: info.cpu?.usage || 0,
        memory: info.memory?.usage || 0,
        disk: info.disk || {},
        network: info.network || {},
        uptime: info.uptime || 0,
      };
    } catch (error: any) {
      this.logger.error(`Failed to get container stats: ${error.message}`);
      throw error;
    }
  }

  async listContainers(): Promise<any[]> {
    try {
      const { stdout } = await execAsync('lxc list --format=json');
      return JSON.parse(stdout);
    } catch (error: any) {
      this.logger.error(`Failed to list containers: ${error.message}`);
      throw error;
    }
  }

  private async setResources(
    name: string,
    cpu: number,
    memory: number,
    disk: number
  ): Promise<void> {
    try {
      // Set CPU limits
      await execAsync(`lxc config set ${name} limits.cpu=${cpu}`);

      // Set memory limits (in MB)
      await execAsync(`lxc config set ${name} limits.memory=${memory}MB`);

      // Set disk limits (in GB)
      await execAsync(
        `lxc config device add ${name} root disk pool=default path=/`
      );

      this.logger.info(`Resources set for ${name}: CPU=${cpu}, RAM=${memory}MB, Disk=${disk}GB`);
    } catch (error: any) {
      this.logger.error(`Failed to set resources: ${error.message}`);
      throw error;
    }
  }

  private async ensureImageExists(image: string): Promise<void> {
    try {
      // Check if image exists
      await execAsync(`lxc image info ${image}`);
    } catch (error) {
      // Image doesn't exist, pull it
      this.logger.info(`Pulling image: ${image}`);
      await execAsync(`lxc image copy images:${image} local: --alias=${image}`);
    }
  }

  async executeInContainer(name: string, command: string): Promise<string> {
    try {
      const { stdout } = await execAsync(`lxc exec ${name} -- bash -c "${command}"`);
      return stdout;
    } catch (error: any) {
      this.logger.error(`Failed to execute command in container: ${error.message}`);
      throw error;
    }
  }
}

import si from 'systeminformation';
import { Logger } from '../utils/logger';

export class SystemMonitor {
  private logger = new Logger('SystemMonitor');
  private monitorInterval: NodeJS.Timeout | null = null;

  async getSystemStats(): Promise<any> {
    try {
      const [cpu, mem, osInfo, disks] = await Promise.all([
        si.currentLoad(),
        si.mem(),
        si.osInfo(),
        si.diskLayout(),
      ]);

      return {
        timestamp: new Date().toISOString(),
        cpu: {
          usage: cpu.currentLoad,
          cores: cpu.cores,
          model: cpu.brand,
        },
        memory: {
          total: mem.total,
          used: mem.used,
          free: mem.free,
          usagePercent: (mem.used / mem.total) * 100,
        },
        disk: disks.map((d) => ({
          device: d.device,
          size: d.size,
          type: d.type,
        })),
        os: {
          platform: osInfo.platform,
          distro: osInfo.distro,
          release: osInfo.release,
          kernel: osInfo.kernel,
        },
      };
    } catch (error: any) {
      this.logger.error(`Failed to get system stats: ${error.message}`);
      throw error;
    }
  }

  startMonitoring(interval: number = 60000): void {
    this.monitorInterval = setInterval(async () => {
      try {
        const stats = await this.getSystemStats();
        this.logger.debug(`System stats: CPU=${stats.cpu.usage.toFixed(2)}%, RAM=${stats.memory.usagePercent.toFixed(2)}%`);
      } catch (error) {
        this.logger.error('Error during monitoring', error);
      }
    }, interval);

    this.logger.info(`System monitoring started (interval: ${interval}ms)`);
  }

  stopMonitoring(): void {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
      this.logger.info('System monitoring stopped');
    }
  }
}

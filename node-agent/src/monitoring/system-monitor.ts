import * as os from 'os';
import * as fs from 'fs';
import pino from 'pino';
import * as si from 'systeminformation';

export interface SystemStats {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkIO: {
    bytesIn: number;
    bytesOut: number;
  };
  loadAverage: number[];
  uptime: number;
  timestamp: string;
}

export class SystemMonitor {
  private logger: pino.Logger;

  constructor(logger: pino.Logger) {
    this.logger = logger;
  }

  async getSystemInfo(): Promise<any> {
    try {
      const cpuCount = os.cpus().length;
      const totalMemory = os.totalmem();
      const osType = os.type();
      const osRelease = os.release();

      const storageInfo = await this.getStorageInfo();
      const lxdVersion = await this.getLxdVersion();

      return {
        cpuCores: cpuCount,
        totalMemoryGB: Math.round(totalMemory / 1024 / 1024 / 1024),
        totalStorageGB: storageInfo,
        osType,
        osVersion: osRelease,
        lxdVersion,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error getting system info:', error);
      throw error;
    }
  }

  async getStats(): Promise<SystemStats> {
    try {
      const cpuUsage = await this.getCpuUsage();
      const memoryUsage = this.getMemoryUsage();
      const diskUsage = await this.getDiskUsage();
      const networkIO = await this.getNetworkIO();
      const loadAverage = os.loadavg();
      const uptime = os.uptime();

      return {
        cpuUsage,
        memoryUsage,
        diskUsage,
        networkIO,
        loadAverage,
        uptime,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error getting stats:', error);
      throw error;
    }
  }

  private async getCpuUsage(): Promise<number> {
    try {
      const cpuData = await si.currentLoad();
      return Math.round(cpuData.currentLoad);
    } catch (error) {
      this.logger.error('Error getting CPU usage:', error);
      return 0;
    }
  }

  private getMemoryUsage(): number {
    try {
      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const usedMemory = totalMemory - freeMemory;
      return Math.round((usedMemory / totalMemory) * 100);
    } catch (error) {
      this.logger.error('Error getting memory usage:', error);
      return 0;
    }
  }

  private async getDiskUsage(): Promise<number> {
    try {
      const diskData = await si.fsSize();
      if (diskData.length === 0) return 0;

      let totalUsed = 0;
      let totalSize = 0;

      for (const disk of diskData) {
        totalUsed += disk.used;
        totalSize += disk.size;
      }

      if (totalSize === 0) return 0;
      return Math.round((totalUsed / totalSize) * 100);
    } catch (error) {
      this.logger.error('Error getting disk usage:', error);
      return 0;
    }
  }

  private async getNetworkIO(): Promise<{ bytesIn: number; bytesOut: number }> {
    try {
      const netData = await si.networkStats();
      let bytesIn = 0;
      let bytesOut = 0;

      for (const net of netData) {
        bytesIn += net.rx_bytes;
        bytesOut += net.tx_bytes;
      }

      return { bytesIn, bytesOut };
    } catch (error) {
      this.logger.error('Error getting network IO:', error);
      return { bytesIn: 0, bytesOut: 0 };
    }
  }

  private async getStorageInfo(): Promise<number> {
    try {
      const diskData = await si.fsSize();
      let totalStorage = 0;

      for (const disk of diskData) {
        totalStorage += disk.size;
      }

      return Math.round(totalStorage / 1024 / 1024 / 1024);
    } catch (error) {
      this.logger.error('Error getting storage info:', error);
      return 0;
    }
  }

  private async getLxdVersion(): Promise<string> {
    try {
      const output = require('child_process').execSync('lxc version', {
        encoding: 'utf-8',
      });
      return output.trim().split('\n')[0] || 'unknown';
    } catch (error) {
      return 'unknown';
    }
  }
}

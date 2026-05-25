import axios, { AxiosInstance } from 'axios';
import { Logger } from './logger';

export class ApiClient {
  private client: AxiosInstance;
  private logger = new Logger('ApiClient');
  private baseUrl = process.env.BACKEND_API_URL || 'http://localhost:3000';
  private apiKey = process.env.BACKEND_API_KEY || '';

  constructor() {
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  async sendHeartbeat(data: any): Promise<void> {
    try {
      await this.client.post('/api/nodes/heartbeat', data);
    } catch (error: any) {
      this.logger.error('Heartbeat request failed', error.message);
    }
  }

  async notifyVpsCreated(vpsId: string, data: any): Promise<void> {
    try {
      await this.client.post(`/api/vps/${vpsId}/notify-created`, data);
    } catch (error: any) {
      this.logger.error('VPS creation notification failed', error.message);
    }
  }

  async notifyVpsFailed(vpsId: string, error: string): Promise<void> {
    try {
      await this.client.post(`/api/vps/${vpsId}/notify-failed`, { error });
    } catch (error: any) {
      this.logger.error('VPS failure notification failed', error.message);
    }
  }

  async updateVpsStatus(vpsId: string, status: string): Promise<void> {
    try {
      await this.client.post(`/api/vps/${vpsId}/status`, { status });
    } catch (error: any) {
      this.logger.error('VPS status update failed', error.message);
    }
  }

  async getVpsConfig(vpsId: string): Promise<any> {
    try {
      const response = await this.client.get(`/api/vps/${vpsId}/config`);
      return response.data;
    } catch (error: any) {
      this.logger.error('Get VPS config failed', error.message);
      throw error;
    }
  }
}

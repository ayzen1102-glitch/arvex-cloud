import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';

export class ApiClient {
  private client: AxiosInstance;
  private nodeId: string;
  private nodeSecret: string;
  private baseURL: string;

  constructor(baseURL: string, nodeId: string, nodeSecret: string) {
    this.baseURL = baseURL;
    this.nodeId = nodeId;
    this.nodeSecret = nodeSecret;

    this.client = axios.create({
      baseURL,
      timeout: parseInt(process.env.API_TIMEOUT || '30000'),
      headers: {
        'Content-Type': 'application/json',
        'X-Node-ID': nodeId,
      },
    });

    // Add request interceptor for signing
    this.client.interceptors.request.use((config) => {
      const timestamp = Date.now().toString();
      const signature = this.generateSignature(timestamp);

      config.headers['X-Timestamp'] = timestamp;
      config.headers['X-Signature'] = signature;

      return config;
    });
  }

  private generateSignature(timestamp: string): string {
    const message = `${this.nodeId}${timestamp}${this.nodeSecret}`;
    return crypto.createHash('sha256').update(message).digest('hex');
  }

  async get<T = any>(endpoint: string, params?: any): Promise<T> {
    try {
      const response = await this.client.get<T>(endpoint, { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await this.client.post<T>(endpoint, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async put<T = any>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await this.client.put<T>(endpoint, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async delete<T = any>(endpoint: string): Promise<T> {
    try {
      const response = await this.client.delete<T>(endpoint);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: any): void {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error(`API Error: ${error.response.status} - ${error.response.statusText}`);
        console.error('Response:', error.response.data);
      } else if (error.request) {
        console.error('No response received from API server');
      } else {
        console.error('Error setting up request:', error.message);
      }
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

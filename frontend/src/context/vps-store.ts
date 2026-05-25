'use client';

import { create } from 'zustand';
import axios from 'axios';

export interface VPS {
  id: string;
  userId: string;
  name: string;
  hostname: string;
  status: 'running' | 'stopped' | 'suspended' | 'error';
  ipAddress: string;
  ipv6?: string;
  cpu: number;
  ram: number;
  disk: number;
  os: string;
  createdAt: string;
  expiresAt: string;
  autoRenew: boolean;
  monthly_cost: number;
}

export interface VpsStats {
  cpu: number;
  memory: number;
  disk: number;
  bandwidth: number;
  uptime: number;
  timestamp: string;
}

export interface VpsState {
  vps: VPS[];
  selectedVps: VPS | null;
  stats: Map<string, VpsStats>;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchVps: () => Promise<void>;
  createVps: (data: any) => Promise<void>;
  deleteVps: (id: string) => Promise<void>;
  startVps: (id: string) => Promise<void>;
  stopVps: (id: string) => Promise<void>;
  restartVps: (id: string) => Promise<void>;
  setSelectedVps: (vps: VPS | null) => void;
  updateStats: (vpsId: string, stats: VpsStats) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const useVpsStore = create<VpsState>((set, get) => ({
  vps: [],
  selectedVps: null,
  stats: new Map(),
  isLoading: false,
  error: null,

  fetchVps: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/vps`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ vps: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createVps: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/api/vps`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({ vps: [...state.vps, response.data], isLoading: false }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteVps: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/vps/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        vps: state.vps.filter((v) => v.id !== id),
        selectedVps: state.selectedVps?.id === id ? null : state.selectedVps,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  startVps: async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/vps/${id}/start`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        vps: state.vps.map((v) => (v.id === id ? { ...v, status: 'running' } : v)),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  stopVps: async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/vps/${id}/stop`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        vps: state.vps.map((v) => (v.id === id ? { ...v, status: 'stopped' } : v)),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  restartVps: async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/vps/${id}/restart`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  setSelectedVps: (vps) => set({ selectedVps: vps }),

  updateStats: (vpsId, stats) => {
    set((state) => {
      const newStats = new Map(state.stats);
      newStats.set(vpsId, stats);
      return { stats: newStats };
    });
  },
}));

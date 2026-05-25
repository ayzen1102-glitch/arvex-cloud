'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/context/auth-store';
import { useVpsStore } from '@/context/vps-store';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import StatsGrid from '@/components/StatsGrid';
import { Loader } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockChartData = [
  { time: '00:00', cpu: 25, memory: 45, disk: 60 },
  { time: '04:00', cpu: 35, memory: 52, disk: 61 },
  { time: '08:00', cpu: 45, memory: 55, disk: 62 },
  { time: '12:00', cpu: 55, memory: 65, disk: 63 },
  { time: '16:00', cpu: 50, memory: 60, disk: 64 },
  { time: '20:00', cpu: 40, memory: 55, disk: 65 },
  { time: '23:59', cpu: 30, memory: 48, disk: 65 },
];

const VpsDetailPage = () => {
  const { user } = useAuthStore();
  const { selectedVps } = useVpsStore();
  const [isLoading, setIsLoading] = useState(false);

  if (!selectedVps) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-dark-950 flex items-center justify-center">
          <p className="text-dark-400">No VPS selected</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-dark-950 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-dark-50 mb-2">{selectedVps.name}</h1>
            <p className="text-dark-400">VPS Details & Monitoring</p>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card title="VPS Information">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-dark-400">Hostname:</span>
                  <span className="text-dark-50 font-mono">{selectedVps.hostname}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">IP Address:</span>
                  <span className="text-dark-50 font-mono">{selectedVps.ipAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">OS:</span>
                  <span className="text-dark-50">{selectedVps.os}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">Status:</span>
                  <span className={`px-2 py-1 rounded text-sm font-semibold ${
                    selectedVps.status === 'running'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {selectedVps.status}
                  </span>
                </div>
              </div>
            </Card>

            <Card title="Resource Allocation">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-dark-400 text-sm">CPU</span>
                    <span className="text-dark-50 font-semibold">{selectedVps.cpu} cores</span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-2">
                    <div
                      className="bg-brand-500 h-2 rounded-full"
                      style={{ width: '60%' }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-dark-400 text-sm">Memory</span>
                    <span className="text-dark-50 font-semibold">{selectedVps.ram}GB</span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: '45%' }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-dark-400 text-sm">Storage</span>
                    <span className="text-dark-50 font-semibold">{selectedVps.disk}GB</span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: '65%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card title="Resource Usage (Last 24h)">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Line type="monotone" dataKey="cpu" stroke="#f97316" name="CPU %" />
                  <Line type="monotone" dataKey="memory" stroke="#3b82f6" name="Memory %" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card title="Disk Usage Trend">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="disk" fill="#10b981" name="Disk %" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default VpsDetailPage;

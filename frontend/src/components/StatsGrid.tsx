'use client';

import React from 'react';
import { Activity, Zap, HardDrive, Wifi } from 'lucide-react';
import Card from './Card';
import { VpsStats } from '@/context/vps-store';

interface StatsGridProps {
  stats: VpsStats | null;
  isLoading?: boolean;
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-dark-800 rounded-lg p-4 animate-pulse h-24"></div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="flex items-center justify-between">
        <div>
          <p className="text-dark-400 text-sm">CPU Usage</p>
          <p className="text-2xl font-bold text-brand-500">{stats.cpu}%</p>
        </div>
        <Zap className="w-8 h-8 text-brand-600" />
      </Card>

      <Card className="flex items-center justify-between">
        <div>
          <p className="text-dark-400 text-sm">Memory Usage</p>
          <p className="text-2xl font-bold text-blue-500">{stats.memory}%</p>
        </div>
        <Activity className="w-8 h-8 text-blue-600" />
      </Card>

      <Card className="flex items-center justify-between">
        <div>
          <p className="text-dark-400 text-sm">Disk Usage</p>
          <p className="text-2xl font-bold text-green-500">{stats.disk}%</p>
        </div>
        <HardDrive className="w-8 h-8 text-green-600" />
      </Card>

      <Card className="flex items-center justify-between">
        <div>
          <p className="text-dark-400 text-sm">Network</p>
          <p className="text-2xl font-bold text-purple-500">{stats.bandwidth} Mbps</p>
        </div>
        <Wifi className="w-8 h-8 text-purple-600" />
      </Card>
    </div>
  );
};

export default StatsGrid;

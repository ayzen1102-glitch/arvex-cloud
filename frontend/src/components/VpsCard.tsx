'use client';

import React from 'react';
import { VPS } from '@/context/vps-store';
import { Trash2, Power, RotateCcw } from 'lucide-react';

interface VpsCardProps {
  vps: VPS;
  onStart: (id: string) => Promise<void>;
  onStop: (id: string) => Promise<void>;
  onRestart: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onClick: (vps: VPS) => void;
}

const VpsCard: React.FC<VpsCardProps> = ({
  vps,
  onStart,
  onStop,
  onRestart,
  onDelete,
  onClick,
}) => {
  const statusColor = {
    running: 'bg-green-500/20 text-green-400',
    stopped: 'bg-red-500/20 text-red-400',
    suspended: 'bg-yellow-500/20 text-yellow-400',
    error: 'bg-red-600/20 text-red-500',
  }[vps.status] || 'bg-dark-700 text-dark-400';

  return (
    <div
      onClick={() => onClick(vps)}
      className="bg-dark-800 border border-dark-700 rounded-lg p-6 hover:border-brand-500 transition cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-dark-50">{vps.name}</h3>
          <p className="text-sm text-dark-400">{vps.hostname}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
          {vps.status}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-y border-dark-700">
        <div>
          <p className="text-xs text-dark-400">CPU</p>
          <p className="text-lg font-bold text-brand-500">{vps.cpu}</p>
        </div>
        <div>
          <p className="text-xs text-dark-400">RAM</p>
          <p className="text-lg font-bold text-blue-500">{vps.ram}GB</p>
        </div>
        <div>
          <p className="text-xs text-dark-400">Disk</p>
          <p className="text-lg font-bold text-green-500">{vps.disk}GB</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-xs text-dark-400">IP: <span className="text-dark-200 font-mono">{vps.ipAddress}</span></p>
        <p className="text-xs text-dark-400">OS: <span className="text-dark-200">{vps.os}</span></p>
      </div>

      <div className="flex gap-2">
        {vps.status === 'stopped' ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStart(vps.id);
            }}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm flex items-center justify-center gap-2"
          >
            <Power className="w-4 h-4" /> Start
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStop(vps.id);
            }}
            className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded text-sm flex items-center justify-center gap-2"
          >
            <Power className="w-4 h-4" /> Stop
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRestart(vps.id);
          }}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Restart
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm('Are you sure?')) onDelete(vps.id);
          }}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" /> Delete
        </button>
      </div>
    </div>
  );
};

export default VpsCard;

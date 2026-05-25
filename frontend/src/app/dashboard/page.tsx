'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/context/auth-store';
import { useVpsStore } from '@/context/vps-store';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import VpsCard from '@/components/VpsCard';
import { Plus, Loader } from 'lucide-react';
import Link from 'next/link';

const DashboardPage = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { vps, fetchVps, startVps, stopVps, restartVps, deleteVps, setSelectedVps, isLoading } = useVpsStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (isAuthenticated) {
        await fetchVps();
      }
      setIsInitializing(false);
    };
    init();
  }, [isAuthenticated, fetchVps]);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-dark-950 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-dark-50 mb-2">Dashboard</h1>
            <p className="text-dark-400">Welcome back, {user?.username}</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <p className="text-dark-400 text-sm">Active VPS</p>
              <p className="text-3xl font-bold text-brand-500">{vps.filter(v => v.status === 'running').length}</p>
            </Card>
            <Card>
              <p className="text-dark-400 text-sm">Total VPS</p>
              <p className="text-3xl font-bold text-blue-500">{vps.length}</p>
            </Card>
            <Card>
              <p className="text-dark-400 text-sm">Monthly Cost</p>
              <p className="text-3xl font-bold text-green-500">${vps.reduce((sum, v) => sum + (v.monthly_cost || 0), 0).toFixed(2)}</p>
            </Card>
          </div>

          {/* VPS List */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-dark-50">Your VPS</h2>
            <Link
              href="/vps/create"
              className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg transition"
            >
              <Plus className="w-4 h-4" /> Create VPS
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-brand-500" />
            </div>
          ) : vps.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-dark-400 mb-4">No VPS created yet</p>
              <Link
                href="/vps/create"
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg transition"
              >
                <Plus className="w-4 h-4" /> Create your first VPS
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {vps.map((v) => (
                <VpsCard
                  key={v.id}
                  vps={v}
                  onStart={startVps}
                  onStop={stopVps}
                  onRestart={restartVps}
                  onDelete={deleteVps}
                  onClick={setSelectedVps}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;

'use client';

import React from 'react';
import { useAuthStore } from '@/context/auth-store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-dark-900 border-b border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-brand-500">🔥 ARVEX</div>
            <span className="text-sm text-dark-400">Cloud VPS</span>
          </div>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-dark-300 hover:text-brand-500">
                Dashboard
              </Link>
              <Link href="/vps" className="text-dark-300 hover:text-brand-500">
                VPS
              </Link>
              <Link href="/billing" className="text-dark-300 hover:text-brand-500">
                Billing
              </Link>
              <div className="flex items-center gap-3 border-l border-dark-700 pl-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-dark-50">{user.username}</p>
                  <p className="text-xs text-dark-400">{user.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm text-white"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-dark-300 hover:text-brand-500 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/context/auth-store';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import { Loader, AlertCircle } from 'lucide-react';

const RegisterPage = () => {
  const router = useRouter();
  const { register, isLoading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [localError, setLocalError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    try {
      await register(formData.email, formData.password, formData.username);
      router.push('/dashboard');
    } catch (err: any) {
      setLocalError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-dark-50 mb-2">Create Account</h1>
              <p className="text-dark-400">Join ARVEX Cloud VPS Platform</p>
            </div>

            {(error || localError) && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error || localError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-dark-50 placeholder-dark-400 focus:outline-none focus:border-brand-500 transition"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-dark-50 placeholder-dark-400 focus:outline-none focus:border-brand-500 transition"
                  placeholder="your_username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-dark-50 placeholder-dark-400 focus:outline-none focus:border-brand-500 transition"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-dark-50 placeholder-dark-400 focus:outline-none focus:border-brand-500 transition"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
              >
                {isLoading && <Loader className="w-4 h-4 animate-spin" />}
                {isLoading ? 'Creating account...' : 'Register'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-dark-700">
              <p className="text-dark-400 text-center">
                Already have an account?{' '}
                <Link href="/login" className="text-brand-500 hover:text-brand-400 font-semibold">
                  Login
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;

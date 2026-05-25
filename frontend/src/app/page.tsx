'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import { ArrowRight, Zap, Shield, BarChart3, Users } from 'lucide-react';
import Link from 'next/link';

const HomePage = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-dark-950">
        {/* Hero */}
        <div className="bg-gradient-to-br from-brand-600/20 to-dark-950 py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-dark-50 mb-6">
              🔥 ARVEX CLOUD
            </h1>
            <p className="text-xl text-dark-300 mb-8 max-w-2xl mx-auto">
              Production-grade VPS hosting platform with real-time monitoring, LXC containerization, and enterprise-level features
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 border border-dark-500 hover:border-brand-500 text-dark-300 hover:text-brand-400 px-8 py-3 rounded-lg text-lg font-semibold transition"
              >
                Login
              </Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="py-20 px-4 bg-dark-900/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-dark-50 mb-16">Core Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Zap, title: 'LXC/LXD Virtualization', desc: 'Ultra-fast container-based VPS' },
                { icon: BarChart3, title: 'Real-time Monitoring', desc: 'Live stats and analytics dashboard' },
                { icon: Shield, title: 'Enterprise Security', desc: 'Firewall, DDoS protection, SSL' },
                { icon: Users, title: 'Multi-user System', desc: 'Admin, User, Reseller roles' },
              ].map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <Card key={i}>
                    <Icon className="w-12 h-12 text-brand-500 mb-4" />
                    <h3 className="text-lg font-semibold text-dark-50 mb-2">{feature.title}</h3>
                    <p className="text-dark-400 text-sm">{feature.desc}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-dark-50 mb-4">Ready to host your VPS?</h2>
            <p className="text-dark-400 mb-8">Join thousands of users using ARVEX Cloud for reliable, scalable hosting</p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition"
            >
              Create Free Account <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;

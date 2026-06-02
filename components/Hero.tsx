'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const floatingVariants = {
    float: {
      y: [0, -20, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 grid-background" />
      
      <motion.div
        animate={{ y: [0, 50, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 right-10 w-96 h-96 bg-glow-purple rounded-full blur-3xl opacity-20 pointer-events-none"
      />
      
      <motion.div
        animate={{ y: [0, -50, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-0 left-10 w-96 h-96 bg-glow-cyan rounded-full blur-3xl opacity-20 pointer-events-none"
      />

      <div className="container-custom relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-500/30 bg-primary-950/30 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
              <span className="text-sm text-primary-300 font-medium">The Future of Cloud Hosting</span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="text-gradient-purple">Next Generation</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-primary-400 to-cyan-400">Cloud Infrastructure</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Experience enterprise-grade hosting with gaming-level performance. Built for creators, gamers, and businesses that refuse to compromise.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(147, 51, 234, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary group"
            >
              Launch Your Server
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary group"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-4 sm:gap-8 pt-8 border-t border-gray-800/50"
          >
            {[
              { number: '99.99%', label: 'Uptime SLA' },
              { number: '50ms', label: 'Avg Latency' },
              { number: '250+', label: 'Global Locations' },
            ].map((stat) => (
              <div key={stat.label} className="py-4">
                <div className="text-2xl sm:text-3xl font-bold text-primary-400 mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Hero Visual */}
        <motion.div
          variants={floatingVariants}
          animate="float"
          className="mt-20 relative"
        >
          <div className="relative mx-auto max-w-3xl">
            {/* Glow Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-cyan-500/20 rounded-2xl blur-3xl" />
            
            {/* Dashboard Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="relative bg-dark-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-8 shadow-2xl"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary-500" />
                  <div className="h-2 w-24 bg-gray-700 rounded" />
                </div>
                <div className="h-32 bg-gradient-to-b from-primary-950/50 to-cyan-950/50 rounded-lg border border-gray-800 flex items-center justify-center text-gray-600">
                  [Dashboard Preview]
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-dark-800 rounded-lg border border-gray-800" />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
'use client';

import { motion } from 'framer-motion';
import { Zap, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const footerLinks = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#' },
        { label: 'Pricing', href: '#' },
        { label: 'Security', href: '#' },
        { label: 'Status', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Press', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '#' },
        { label: 'API Reference', href: '#' },
        { label: 'Community', href: '#' },
        { label: 'Support', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
        { label: 'Cookies', href: '#' },
        { label: 'GDPR', href: '#' },
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <footer className="relative bg-dark-900 border-t border-gray-800/50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 grid-background opacity-50" />
      
      <div className="relative z-10">
        {/* Main Footer */}
        <div className="container-custom py-16 sm:py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-16"
          >
            {/* Brand */}
            <motion.div variants={itemVariants} className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-cyan-500 rounded-lg blur-lg opacity-60" />
                  <div className="relative bg-dark-900 rounded-lg p-2 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary-400" />
                  </div>
                </div>
                <span className="text-lg font-bold text-gradient-purple font-mono">ArveX</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Next-generation cloud hosting platform built for the future.
              </p>

              {/* Social Links */}
              <div className="flex gap-4 mt-6">
                {['Twitter', 'Discord', 'GitHub', 'LinkedIn'].map((social) => (
                  <motion.a
                    key={social}
                    href="#"
                    whileHover={{ scale: 1.1 }}
                    className="w-10 h-10 rounded-lg bg-dark-800 hover:bg-primary-600/20 border border-gray-800 hover:border-primary-500/50 flex items-center justify-center transition-smooth text-gray-400 hover:text-primary-400"
                  >
                    {social[0]}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Links */}
            {footerLinks.map((column) => (
              <motion.div key={column.title} variants={itemVariants}>
                <h4 className="font-semibold text-white mb-4">{column.title}</h4>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-primary-300 transition-smooth text-sm"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Section */}
          <motion.div
            variants={itemVariants}
            className="bg-dark-800/50 border border-gray-800 rounded-xl p-8 mb-12"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Need Help?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a
                href="mailto:support@arvexcloud.com"
                className="flex items-center gap-3 text-gray-400 hover:text-primary-300 transition-smooth"
              >
                <Mail className="w-5 h-5" />
                <span>support@arvexcloud.com</span>
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center gap-3 text-gray-400 hover:text-primary-300 transition-smooth"
              >
                <Phone className="w-5 h-5" />
                <span>+1 (234) 567-8900</span>
              </a>
            </div>
          </motion.div>

          {/* Bottom Border */}
          <div className="border-t border-gray-800/50" />
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="container-custom py-8 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-sm text-gray-500">
            © 2024 ArveX CLOUD. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <span>Designed with ❤️ for the future</span>
            <span>•</span>
            <span>Powered by Next.js 15</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
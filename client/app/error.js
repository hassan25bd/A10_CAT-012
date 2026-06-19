'use client';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/30">
          <AlertTriangle size={36} className="text-red-400" />
        </div>
        <h1 className="font-display text-2xl font-bold text-white mb-3">Something went wrong</h1>
        <p className="text-gray-400 mb-8">An unexpected error occurred. Don't worry, our team has been notified.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={reset} className="btn-primary">
            <RefreshCw size={18} /> Try Again
          </button>
          <Link href="/" className="btn-secondary">
            <Home size={18} /> Go Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-primary-600/5 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-purple-700/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-lg relative z-10"
      >
        {/* Large 404 text */}
        <div className="relative mb-8">
          <p className="font-display text-[8rem] font-bold leading-none select-none" style={{ WebkitTextStroke: '2px #7c3aed', color: 'transparent' }}>
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-primary-600/20 rounded-2xl flex items-center justify-center border border-primary-500/30">
              <BookOpen size={40} className="text-primary-400" />
            </div>
          </div>
        </div>

        <h1 className="font-display text-3xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
          Looks like this chapter doesn't exist. The page you're looking for has gone missing from our library.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary">
            <Home size={18} /> Go Home
          </Link>
          <Link href="/browse" className="btn-secondary">
            Browse Ebooks
          </Link>
        </div>

        <button onClick={() => window.history.back()} className="mt-6 flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm transition-colors mx-auto">
          <ArrowLeft size={14} /> Go back
        </button>
      </motion.div>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, Star, Users, TrendingUp, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import API from '../../lib/api';
import EbookCard from '../EbookCard';
import SkeletonCard from '../SkeletonCard';
import HeroSlider from './HeroSlider';
import GenreGrid from './GenreGrid';
import TopWriters from './TopWriters';

export default function HomePage() {
  const { data: featured = [], isLoading } = useQuery({
    queryKey: ['featured'],
    queryFn: () => API.get('/ebooks/featured').then((r) => r.data),
  });

  const stats = [
    { icon: BookOpen, label: 'Ebooks Published', value: '1,200+' },
    { icon: Users, label: 'Active Readers', value: '8,500+' },
    { icon: Star, label: 'Writer Community', value: '340+' },
    { icon: TrendingUp, label: 'Monthly Sales', value: '2,100+' },
  ];

  return (
    <div className="bg-dark-900">
      {/* Hero Section */}
      <HeroSlider />

      {/* Stats Bar */}
      <div className="bg-dark-800/50 border-y border-gray-800/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-600/20 flex items-center justify-center flex-shrink-0">
                  <stat.icon size={18} className="text-primary-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">{stat.value}</p>
                  <p className="text-gray-500 text-xs">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Ebooks */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4"
        >
          <div>
            <span className="text-primary-400 text-sm font-semibold tracking-widest uppercase">Handpicked</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mt-1">
              Featured Ebooks
            </h2>
            <p className="text-gray-400 mt-2">Discover the latest and most popular stories</p>
          </div>
          <Link href="/browse" className="flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium text-sm transition-colors group">
            View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : featured.map((ebook, i) => <EbookCard key={ebook._id} ebook={ebook} index={i} />)}
        </div>

        {!isLoading && featured.length === 0 && (
          <div className="text-center py-16">
            <BookOpen size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No featured ebooks yet. Check back soon!</p>
          </div>
        )}
      </section>

      {/* Top Writers */}
      <TopWriters />

      {/* Genre Grid */}
      <GenreGrid />

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-600/20 to-transparent pointer-events-none" />
            <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-primary-600/10 blur-2xl" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-primary-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap size={32} className="text-primary-400" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                Are you a writer?
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                Join Fable and share your stories with thousands of readers worldwide. Start publishing your ebooks today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register" className="btn-primary">
                  Start Writing <ArrowRight size={18} />
                </Link>
                <Link href="/browse" className="btn-secondary">
                  Explore First
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

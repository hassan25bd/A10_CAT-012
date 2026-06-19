'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, Zap, Sparkles } from 'lucide-react';
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

  return (
    <div>
      <HeroSlider />

      {/* Featured Ebooks */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4"
          >
            <div>
              <span className="inline-block text-indigo-600 text-xs font-bold tracking-widest uppercase mb-3 px-4 py-1.5 bg-indigo-50 rounded-full border border-indigo-100">
                Handpicked
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mt-2">
                Featured Ebooks
              </h2>
              <p className="text-slate-500 mt-3 text-lg">Discover the latest and most popular stories</p>
            </div>
            <Link href="/browse" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold text-sm transition-colors group bg-indigo-50 px-5 py-2.5 rounded-xl border border-indigo-100 hover:bg-indigo-100">
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
              <BookOpen size={48} className="text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No featured ebooks yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      <TopWriters />

      <GenreGrid />

      {/* CTA Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-[2.5rem] overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A78BFA 100%)',
            }}
          >
            {/* Background decorative circles */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/10 blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/10 blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

            {/* Floating book emoji */}
            <motion.div
              animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-8 right-12 text-6xl opacity-30 pointer-events-none hidden lg:block"
            >
              📚
            </motion.div>
            <motion.div
              animate={{ y: [10, -10, 10], rotate: [5, -5, 5] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-8 left-12 text-5xl opacity-20 pointer-events-none hidden lg:block"
            >
              ✍️
            </motion.div>

            <div className="relative z-10 p-12 md:p-16 text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur text-white text-xs font-bold px-4 py-2 rounded-full mb-6 border border-white/30">
                <Sparkles size={13} /> For Writers
              </div>

              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
                Share Your Story<br />With the World
              </h2>
              <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                Join Fable and publish your ebooks to thousands of passionate readers. Your next chapter starts here.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 text-base"
                >
                  Start Writing <ArrowRight size={18} />
                </Link>
                <Link
                  href="/browse"
                  className="inline-flex items-center justify-center gap-2 bg-white/15 border border-white/30 backdrop-blur text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/25 transition-all duration-200 text-base"
                >
                  Browse First
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

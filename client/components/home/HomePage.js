'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { BookOpen, ArrowRight, Sparkles, Library, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import API from '../../lib/api';
import EbookCard from '../EbookCard';
import SkeletonCard from '../SkeletonCard';
import GenreStrip from '../GenreStrip';
import HeroSlider from './HeroSlider';
import GenreGrid from './GenreGrid';
import TopWriters from './TopWriters';

const HOME_GENRES = ['Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Fantasy', 'Horror', 'Biography', 'Self-Help', 'History', 'Poetry', 'Thriller', 'Adventure'];

const ORBS = [
  { w: 600, h: 600, x: '-10%', y: '-20%', from: '#6366f1', to: '#8b5cf6', dur: 18 },
  { w: 500, h: 500, x: '70%',  y: '10%',  from: '#ec4899', to: '#a855f7', dur: 22 },
  { w: 400, h: 400, x: '20%',  y: '60%',  from: '#06b6d4', to: '#6366f1', dur: 26 },
  { w: 350, h: 350, x: '80%',  y: '70%',  from: '#8b5cf6', to: '#ec4899', dur: 20 },
];

export default function HomePage() {
  const router = useRouter();
  const sectionRef = useRef(null);

  const { data: featured = [], isLoading } = useQuery({
    queryKey: ['featured'],
    queryFn: () => API.get('/ebooks/featured').then((r) => r.data),
  });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const springY1 = useSpring(y1, { stiffness: 60, damping: 20 });
  const springY2 = useSpring(y2, { stiffness: 60, damping: 20 });

  return (
    <div>
      <HeroSlider />

      {/* Genre quick-nav strip */}
      <GenreStrip
        genres={HOME_GENRES}
        active=""
        onChange={(g) => router.push(g ? `/browse?genre=${g}` : '/browse')}
      />

      {/* Featured Ebooks — 3D dark section */}
      <section
        ref={sectionRef}
        className="relative py-28 overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#03040f 0%,#0d0621 40%,#060312 100%)' }}
      >
        {/* Animated gradient orbs */}
        {ORBS.map((orb, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: orb.w, height: orb.h,
              left: orb.x, top: orb.y,
              background: `radial-gradient(circle,${orb.from}30 0%,${orb.to}10 60%,transparent 80%)`,
              filter: 'blur(80px)',
            }}
            animate={{ x: [0, 30, -20, 0], y: [0, -25, 20, 0], scale: [1, 1.1, 0.95, 1] }}
            transition={{ duration: orb.dur, repeat: Infinity, ease: 'easeInOut', delay: i * 2 }}
          />
        ))}

        {/* Dot-grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle,#ffffff 1px,transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Parallax floating accent shapes */}
        <motion.div style={{ y: springY1 }}
          className="absolute top-16 right-[8%] w-24 h-24 rounded-2xl border border-indigo-500/20 pointer-events-none"
          animate={{ rotate: [0, 360] }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div style={{ y: springY2 }}
          className="absolute bottom-20 left-[6%] w-16 h-16 rounded-full border border-purple-500/20 pointer-events-none"
          animate={{ rotate: [360, 0] }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div style={{ y: springY1 }}
          className="absolute top-1/2 left-[3%] w-10 h-10 rounded-lg border border-pink-500/15 pointer-events-none"
          animate={{ rotate: [0, -360] }} transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-6"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 mb-4"
              >
                <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-indigo-400 to-purple-500" />
                <span className="text-indigo-400 text-xs font-bold tracking-[0.25em] uppercase">Handpicked For You</span>
              </motion.div>

              <h2
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-3 leading-tight"
                style={{
                  background: 'linear-gradient(135deg,#ffffff 0%,#c4b5fd 50%,#a78bfa 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Featured Ebooks
              </h2>
              <p className="text-slate-400 text-lg max-w-md">
                Discover handpicked stories across every genre, curated for passionate readers.
              </p>

              {/* Live stats bar */}
              <div className="flex items-center gap-6 mt-5">
                {[
                  { icon: Library, label: 'Books', value: '30+' },
                  { icon: TrendingUp, label: 'Genres', value: '12' },
                  { icon: Sparkles, label: 'Featured', value: '6' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon size={14} className="text-indigo-400" />
                    <span className="text-white font-bold text-sm">{value}</span>
                    <span className="text-slate-500 text-xs">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/browse"
              className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm overflow-hidden flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                boxShadow: '0 0 30px rgba(99,102,241,0.35)',
              }}
            >
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(135deg,#818cf8,#a78bfa)' }}
              />
              <span className="relative text-white">View All Books</span>
              <ArrowRight size={16} className="relative text-white group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Card grid with staggered 3D entrance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden bg-white/5 animate-pulse h-80" />
                ))
              : featured.map((ebook, i) => (
                  <motion.div
                    key={ebook._id}
                    initial={{ opacity: 0, y: 50, rotateX: 8 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.55, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                    whileHover={{ y: -6, transition: { duration: 0.25 } }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <EbookCard ebook={ebook} index={i} dark />
                  </motion.div>
                ))}
          </div>

          {!isLoading && featured.length === 0 && (
            <div className="text-center py-16">
              <BookOpen size={48} className="text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500">No featured ebooks yet. Check back soon!</p>
            </div>
          )}

          {/* Bottom fade into next section */}
          <div
            className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom,transparent,#ffffff)' }}
          />
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

'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { BookOpen, ArrowRight, Sparkles, Library, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useRef, useState, useCallback } from 'react';
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

const CTA_PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: 3 + (i * 13 + 7) % 94,
  delay: (i * 0.38) % 5.5,
  dur: 3.5 + (i * 0.55) % 5,
  size: 2 + (i % 4),
  opacity: 0.25 + (i % 4) * 0.15,
  yRange: 140 + (i * 19) % 210,
}));

const CTA_BG_ORBS = [
  { w: 540, h: 540, x: '-18%', y: '-30%', from: '#818cf8', to: '#c084fc', dur: 16 },
  { w: 430, h: 430, x: '74%',  y: '-5%',  from: '#f472b6', to: '#818cf8', dur: 21 },
  { w: 330, h: 330, x: '22%',  y: '62%',  from: '#38bdf8', to: '#818cf8', dur: 27 },
  { w: 260, h: 260, x: '60%',  y: '55%',  from: '#a78bfa', to: '#f472b6', dur: 19 },
];

function WriterCTA() {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isActive, setIsActive] = useState(false);

  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sRotX = useSpring(rotX, { stiffness: 150, damping: 25 });
  const sRotY = useSpring(rotY, { stiffness: 150, damping: 25 });

  const handleMove = useCallback((clientX, clientY) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const nx = (clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const ny = (clientY - rect.top - rect.height / 2) / (rect.height / 2);
    rotY.set(nx * 14);
    rotX.set(-ny * 8);
    setMousePos({
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    });
  }, [rotX, rotY]);

  const handleLeave = useCallback(() => {
    rotX.set(0);
    rotY.set(0);
    setIsActive(false);
  }, [rotX, rotY]);

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto" style={{ perspective: '1400px' }}>
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            rotateX: sRotX,
            rotateY: sRotY,
            transformStyle: 'preserve-3d',
            boxShadow: '0 30px 80px rgba(99,102,241,0.4), 0 8px 24px rgba(139,92,246,0.3)',
          }}
          onMouseMove={(e) => { setIsActive(true); handleMove(e.clientX, e.clientY); }}
          onMouseLeave={handleLeave}
          onTouchMove={(e) => { setIsActive(true); const t = e.touches[0]; handleMove(t.clientX, t.clientY); }}
          onTouchEnd={handleLeave}
          className="relative rounded-[2.5rem] overflow-hidden cursor-pointer select-none"
        >
          {/* Base gradient */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg,#4338ca 0%,#7c3aed 50%,#9333ea 100%)' }}
          />

          {/* Animated orbs */}
          {CTA_BG_ORBS.map((orb, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: orb.w, height: orb.h,
                left: orb.x, top: orb.y,
                background: `radial-gradient(circle,${orb.from}55 0%,${orb.to}28 55%,transparent 75%)`,
                filter: 'blur(72px)',
                mixBlendMode: 'screen',
              }}
              animate={{ x: [0, 35, -28, 0], y: [0, -28, 22, 0], scale: [1, 1.14, 0.9, 1] }}
              transition={{ duration: orb.dur, repeat: Infinity, ease: 'easeInOut', delay: i * 2.5 }}
            />
          ))}

          {/* 3D perspective grid */}
          <div
            className="absolute inset-x-0 bottom-0 h-3/4 pointer-events-none"
            style={{
              opacity: 0.07,
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px',
              transform: 'perspective(500px) rotateX(50deg) scaleY(2)',
              transformOrigin: 'bottom center',
            }}
          />

          {/* Cursor spotlight */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: isActive ? 1 : 0,
              transition: 'opacity 0.3s ease',
              background: `radial-gradient(circle 380px at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.18) 0%, transparent 70%)`,
            }}
          />

          {/* Shimmer sweep */}
          <motion.div
            className="absolute inset-y-0 w-72 pointer-events-none"
            style={{
              background: 'linear-gradient(105deg,transparent 20%,rgba(255,255,255,0.12) 50%,transparent 80%)',
              left: 0,
            }}
            animate={{ x: ['-300px', '1300px'] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', repeatDelay: 4.5 }}
          />

          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {CTA_PARTICLES.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full bg-white"
                style={{ width: p.size, height: p.size, left: `${p.x}%`, bottom: -8, opacity: 0 }}
                animate={{ y: [0, -p.yRange], opacity: [0, p.opacity, 0], scale: [0.4, 1, 0.2] }}
                transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeOut' }}
              />
            ))}
          </div>

          {/* Pulsing rings */}
          {[0, 1, 2].map((ring) => (
            <motion.div
              key={ring}
              className="absolute rounded-full border border-white/20 pointer-events-none"
              style={{
                width: 260, height: 260,
                left: '50%', top: '50%',
                marginLeft: -130, marginTop: -130,
              }}
              animate={{ scale: [1, 3.2 + ring * 0.7], opacity: [0.6, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: ring * 1.35, ease: 'easeOut' }}
            />
          ))}

          {/* Floating 3D book */}
          <motion.div
            className="absolute top-6 right-10 hidden lg:block pointer-events-none"
            animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span
              className="text-7xl block"
              style={{ filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.45))' }}
            >📚</span>
          </motion.div>

          {/* Floating writing hand */}
          <motion.div
            className="absolute bottom-6 left-10 hidden lg:block pointer-events-none"
            animate={{ y: [10, -10, 10], rotate: [8, -8, 8] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          >
            <span
              className="text-6xl block"
              style={{ filter: 'drop-shadow(0 10px 22px rgba(0,0,0,0.4))' }}
            >✍️</span>
          </motion.div>

          {/* Small floating sparkle accents */}
          {[
            { top: '18%', left: '8%', delay: 0 },
            { top: '72%', left: '88%', delay: 1.2 },
            { top: '40%', left: '92%', delay: 2.4 },
            { top: '80%', left: '15%', delay: 0.8 },
          ].map((pos, i) => (
            <motion.div
              key={i}
              className="absolute pointer-events-none text-white/40 hidden sm:block"
              style={{ top: pos.top, left: pos.left, fontSize: 10 + (i % 3) * 4 }}
              animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0.8, 0.3], rotate: [0, 180, 360] }}
              transition={{ duration: 3 + i, repeat: Infinity, delay: pos.delay, ease: 'easeInOut' }}
            >
              ✦
            </motion.div>
          ))}

          {/* Main content */}
          <div className="relative z-10 p-12 md:p-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-4 py-2 rounded-full mb-6 border border-white/30"
            >
              <motion.span
                className="inline-block"
                animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkles size={13} />
              </motion.span>
              For Writers
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight"
              style={{ textShadow: '0 4px 32px rgba(0,0,0,0.3)' }}
            >
              Share Your Story<br />With the World
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-white/85 text-lg mb-10 max-w-xl mx-auto leading-relaxed"
            >
              Join Fable and publish your ebooks to thousands of passionate readers. Your next chapter starts here.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div whileHover={{ scale: 1.07, y: -3 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 font-bold px-8 py-4 rounded-2xl text-base"
                  style={{ boxShadow: '0 8px 32px rgba(255,255,255,0.35), 0 2px 10px rgba(0,0,0,0.12)' }}
                >
                  Start Writing <ArrowRight size={18} />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.07, y: -3 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/browse"
                  className="inline-flex items-center justify-center gap-2 bg-white/15 border border-white/40 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/25 transition-colors duration-200 text-base"
                >
                  Browse First
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

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

      <WriterCTA />
    </div>
  );
}

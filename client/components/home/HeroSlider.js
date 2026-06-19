'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ArrowRight, ChevronLeft, ChevronRight, Star, Users, TrendingUp } from 'lucide-react';

const slides = [
  {
    id: 1,
    tag: 'New Arrivals',
    headline: ['Discover Stories', 'That Move You'],
    subline: 'Thousands of hand-crafted ebooks from talented writers — every genre, every mood.',
    cta: 'Browse Ebooks',
    ctaLink: '/browse',
    accent: '#6366f1',
    accentLight: '#EEF2FF',
    stack: [
      { img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&q=85', rotate: '-6deg', y: '0px',   x: '0px',   z: 3 },
      { img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=85', rotate: '3deg',  y: '48px',  x: '24px',  z: 2 },
      { img: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&q=85', rotate: '-2deg', y: '90px',  x: '-12px', z: 1 },
    ],
  },
  {
    id: 2,
    tag: 'Fan Favorites',
    headline: ['Stories That', 'Stay With You'],
    subline: 'Mystery, romance, sci-fi, fantasy — find your next obsession on Fable.',
    cta: 'Explore Genres',
    ctaLink: '/browse',
    accent: '#8b5cf6',
    accentLight: '#F5F3FF',
    stack: [
      { img: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=500&q=85', rotate: '5deg',  y: '0px',   x: '0px',   z: 3 },
      { img: 'https://images.unsplash.com/photo-1551269901-5c5e5b2cc29d?w=500&q=85', rotate: '-4deg', y: '52px',  x: '16px',  z: 2 },
      { img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&q=85', rotate: '1deg',  y: '98px',  x: '-8px',  z: 1 },
    ],
  },
  {
    id: 3,
    tag: 'For Writers',
    headline: ['Publish Your', 'Masterpiece'],
    subline: 'Join our growing community of authors. Share your voice with readers worldwide.',
    cta: 'Start Writing',
    ctaLink: '/register',
    accent: '#f59e0b',
    accentLight: '#FFFBEB',
    stack: [
      { img: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=500&q=85', rotate: '-4deg', y: '0px',   x: '0px',   z: 3 },
      { img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=85', rotate: '6deg',  y: '44px',  x: '20px',  z: 2 },
      { img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=85', rotate: '-2deg', y: '86px',  x: '-16px', z: 1 },
    ],
  },
];

const stats = [
  { icon: BookOpen,    label: 'Ebooks',       value: '1,200+' },
  { icon: Users,       label: 'Readers',      value: '8,500+' },
  { icon: Star,        label: 'Writers',      value: '340+'   },
  { icon: TrendingUp,  label: 'Monthly Sales',value: '2,100+' },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    const t = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, [autoplay]);

  const prev = () => { setAutoplay(false); setCurrent((p) => (p - 1 + slides.length) % slides.length); };
  const next = () => { setAutoplay(false); setCurrent((p) => (p + 1) % slides.length); };
  const slide = slides[current];

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-[#F8F7FF]">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-50 pointer-events-none" />

      {/* Animated colour blob */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full pointer-events-none -translate-y-1/4 translate-x-1/4"
          style={{ background: `radial-gradient(circle, ${slide.accentLight} 0%, transparent 70%)` }}
        />
      </AnimatePresence>
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-indigo-50/80 blur-3xl pointer-events-none" />

      {/* ── Main content ── */}
      <div className="relative z-10 flex-1 flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-8">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            >
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest"
                style={{ background: `${slide.accent}15`, color: slide.accent, border: `1px solid ${slide.accent}25` }}
              >
                <BookOpen size={12} /> {slide.tag}
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-display text-5xl sm:text-6xl lg:text-[4.5rem] font-bold text-slate-900 leading-[1.05] mb-6"
              >
                {slide.headline[0]}<br />
                <span style={{ color: slide.accent }}>{slide.headline[1]}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-slate-500 text-lg mb-10 leading-relaxed max-w-md"
              >
                {slide.subline}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href={slide.ctaLink}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                  style={{ background: `linear-gradient(135deg, ${slide.accent}, ${slide.accent}cc)` }}
                >
                  {slide.cta} <ArrowRight size={18} />
                </Link>
                <Link href="/register" className="btn-secondary text-base">
                  Join as Writer
                </Link>
              </motion.div>

              {/* Slide controls */}
              <div className="flex items-center gap-4 mt-12">
                <button onClick={prev} className="w-10 h-10 rounded-xl bg-white shadow-md border border-slate-100 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all">
                  <ChevronLeft size={18} />
                </button>
                <div className="flex gap-2">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setAutoplay(false); setCurrent(i); }}
                      className="h-2 rounded-full transition-all duration-400"
                      style={{ width: i === current ? '32px' : '8px', background: i === current ? slide.accent : '#CBD5E1' }}
                    />
                  ))}
                </div>
                <button onClick={next} className="w-10 h-10 rounded-xl bg-white shadow-md border border-slate-100 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all">
                  <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right — stacked cards (alfoart style) */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative" style={{ width: '260px', height: '520px' }}>
              <AnimatePresence mode="wait">
                {slide.stack.map((card, i) => (
                  <motion.div
                    key={`${slide.id}-${i}`}
                    initial={{ opacity: 0, scale: 0.85, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.6, delay: i * 0.12, ease: 'easeOut' }}
                    className="absolute left-0 right-0 overflow-hidden rounded-[28px] shadow-2xl"
                    style={{
                      top: card.y,
                      left: card.x,
                      transform: `rotate(${card.rotate})`,
                      zIndex: card.z,
                      height: '320px',
                      width: '220px',
                      animation: `float ${4.5 + i * 0.7}s ease-in-out ${i * 0.8}s infinite`,
                      boxShadow: i === 2
                        ? `0 8px 32px rgba(0,0,0,0.10)`
                        : i === 1
                        ? `0 16px 48px rgba(0,0,0,0.14)`
                        : `0 24px 60px rgba(0,0,0,0.20)`,
                    }}
                  >
                    <img
                      src={card.img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    {/* Shine overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
                    {/* Spine */}
                    <div className="absolute left-0 top-0 w-2 h-full bg-gradient-to-r from-white/25 to-transparent pointer-events-none" />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Ghost / transparent card — exactly like the reference */}
              <motion.div
                animate={{ opacity: [0.35, 0.55, 0.35] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute rounded-[28px] border-2 border-slate-200/70"
                style={{
                  width: '200px',
                  height: '300px',
                  top: '130px',
                  left: '210px',
                  background: 'rgba(255,255,255,0.5)',
                  backdropFilter: 'blur(4px)',
                  zIndex: 0,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative z-10 border-t border-indigo-100/60 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                  <stat.icon size={18} className="text-indigo-500" />
                </div>
                <div>
                  <p className="text-slate-900 font-bold text-lg leading-none">{stat.value}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

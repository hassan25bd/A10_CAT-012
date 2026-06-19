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
    books: [
      { img: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&q=80', rotate: '-8deg', z: '0px', top: '5%', right: '18%' },
      { img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&q=80', rotate: '5deg', z: '60px', top: '20%', right: '8%' },
      { img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&q=80', rotate: '-3deg', z: '120px', top: '42%', right: '22%' },
    ],
  },
  {
    id: 2,
    tag: 'Fan Favorites',
    headline: ['Stories That', 'Stay With You'],
    subline: 'Mystery, romance, sci-fi, fantasy — find your next obsession on Fable.',
    cta: 'Explore Genres',
    ctaLink: '/browse',
    accent: '#a855f7',
    books: [
      { img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&q=80', rotate: '6deg', z: '0px', top: '8%', right: '20%' },
      { img: 'https://images.unsplash.com/photo-1551269901-5c5e5b2cc29d?w=300&q=80', rotate: '-4deg', z: '60px', top: '25%', right: '9%' },
      { img: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=300&q=80', rotate: '2deg', z: '120px', top: '46%', right: '24%' },
    ],
  },
  {
    id: 3,
    tag: 'For Writers',
    headline: ['Publish Your', 'Masterpiece'],
    subline: 'Join our growing community of authors. Share your voice with thousands of readers worldwide.',
    cta: 'Start Writing',
    ctaLink: '/register',
    accent: '#f59e0b',
    books: [
      { img: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&q=80', rotate: '-6deg', z: '0px', top: '6%', right: '19%' },
      { img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80', rotate: '4deg', z: '60px', top: '22%', right: '8%' },
      { img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80', rotate: '-2deg', z: '120px', top: '44%', right: '23%' },
    ],
  },
];

const stats = [
  { icon: BookOpen, label: 'Ebooks', value: '1,200+' },
  { icon: Users, label: 'Readers', value: '8,500+' },
  { icon: Star, label: 'Writers', value: '340+' },
  { icon: TrendingUp, label: 'Monthly Sales', value: '2,100+' },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 5500);
    return () => clearInterval(timer);
  }, [autoplay]);

  const prev = () => { setAutoplay(false); setCurrent((p) => (p - 1 + slides.length) % slides.length); };
  const next = () => { setAutoplay(false); setCurrent((p) => (p + 1) % slides.length); };
  const slide = slides[current];

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-[#F8F7FF]">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-60 pointer-events-none" />

      {/* Gradient orbs */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div
            className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
            style={{ background: `radial-gradient(circle, ${slide.accent}, transparent 70%)` }}
          />
          <div
            className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] opacity-10"
            style={{ background: `radial-gradient(circle, ${slide.accent}, transparent 70%)` }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Floating particles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${4 + (i % 3) * 3}px`,
            height: `${4 + (i % 3) * 3}px`,
            left: `${5 + i * 9}%`,
            top: `${15 + (i % 4) * 18}%`,
            background: slide.accent,
            opacity: 0.15 + (i % 3) * 0.08,
          }}
          animate={{ y: [-12, 12, -12], x: [-4, 4, -4] }}
          transition={{ duration: 3.5 + i * 0.4, repeat: Infinity, delay: i * 0.25 }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-8">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="inline-flex items-center gap-2 text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest"
                style={{ background: `${slide.accent}18`, color: slide.accent, border: `1px solid ${slide.accent}30` }}
              >
                <BookOpen size={12} /> {slide.tag}
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.05] mb-6"
              >
                {slide.headline[0]}<br />
                <span style={{ color: slide.accent }}>{slide.headline[1]}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-slate-500 text-lg mb-10 leading-relaxed max-w-md"
              >
                {slide.subline}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href={slide.ctaLink}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                  style={{ background: slide.accent }}
                >
                  {slide.cta} <ArrowRight size={18} />
                </Link>
                <Link href="/register" className="btn-secondary text-base">
                  Join as Writer
                </Link>
              </motion.div>

              {/* Controls */}
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
                      style={{
                        width: i === current ? '32px' : '8px',
                        background: i === current ? slide.accent : '#CBD5E1',
                      }}
                    />
                  ))}
                </div>
                <button onClick={next} className="w-10 h-10 rounded-xl bg-white shadow-md border border-slate-100 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all">
                  <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right — 3D floating books */}
          <div className="relative h-[480px] hidden lg:block" style={{ perspective: '1200px' }}>
            <AnimatePresence mode="wait">
              {slide.books.map((book, i) => (
                <motion.div
                  key={`${slide.id}-${i}`}
                  initial={{ opacity: 0, y: 40, rotateY: -20 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.7, delay: i * 0.15, ease: 'easeOut' }}
                  className="absolute w-40 rounded-2xl overflow-hidden shadow-3d"
                  style={{
                    top: book.top,
                    right: book.right,
                    transform: `rotate(${book.rotate}) translateZ(${book.z})`,
                    transformStyle: 'preserve-3d',
                    aspectRatio: '2/3',
                    animation: `float ${4 + i * 0.8}s ease-in-out ${i * 0.6}s infinite`,
                  }}
                >
                  <img src={book.img} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                  {/* Book spine shine */}
                  <div className="absolute left-0 top-0 w-1.5 h-full bg-gradient-to-r from-white/30 to-transparent" />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Reflection */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F8F7FF] to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative z-10 border-t border-indigo-100 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
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

      {/* Scroll indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full border-2 border-slate-300 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-indigo-400" />
        </motion.div>
      </div>
    </div>
  );
}

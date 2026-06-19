'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    headline: 'Discover & Read Original Ebooks',
    subline: 'Explore thousands of hand-crafted stories from talented writers around the world.',
    bg: 'from-purple-900 via-dark-900 to-dark-900',
    accent: '#7c3aed',
    tag: 'New Arrivals',
    img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
  },
  {
    id: 2,
    headline: 'Stories That Stay With You',
    subline: 'From mystery thrillers to heartfelt romances — find your next great read on Fable.',
    bg: 'from-blue-900 via-dark-900 to-dark-900',
    accent: '#3b82f6',
    tag: 'Fan Favorites',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  },
  {
    id: 3,
    headline: 'Publish Your Masterpiece',
    subline: 'Join our growing community of writers and share your voice with the world.',
    bg: 'from-amber-900 via-dark-900 to-dark-900',
    accent: '#f59e0b',
    tag: 'For Writers',
    img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((p) => (p - 1 + slides.length) % slides.length);
  const next = () => setCurrent((p) => (p + 1) % slides.length);
  const slide = slides[current];

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className={`absolute inset-0 bg-gradient-to-r ${slide.bg}`}
        />
      </AnimatePresence>

      {/* Background image (right side) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`img-${slide.id}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.2, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 hidden lg:block"
        >
          <img src={slide.img} alt="" className="w-full h-full object-cover object-right" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/80 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-primary-400/40"
          style={{ left: `${10 + i * 12}%`, top: `${20 + (i % 3) * 25}%` }}
          animate={{ y: [-10, 10, -10], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full mb-6"
              style={{ backgroundColor: `${slide.accent}22`, color: slide.accent, border: `1px solid ${slide.accent}44` }}
            >
              <BookOpen size={14} /> {slide.tag}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            >
              {slide.headline}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-300 text-lg mb-8 leading-relaxed"
            >
              {slide.subline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/browse" className="btn-primary text-base">
                Browse Ebooks <ArrowRight size={18} />
              </Link>
              <Link href="/register" className="btn-secondary text-base">
                Join as Writer
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-12">
          <button onClick={prev} className="w-10 h-10 rounded-xl glass border border-gray-600 flex items-center justify-center text-white hover:border-primary-500 transition-all">
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-primary-400' : 'w-2 bg-gray-600'}`}
              />
            ))}
          </div>
          <button onClick={next} className="w-10 h-10 rounded-xl glass border border-gray-600 flex items-center justify-center text-white hover:border-primary-500 transition-all">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <p className="text-gray-500 text-xs">Scroll to explore</p>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full border-2 border-gray-600 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-primary-400" />
        </motion.div>
      </div>
    </div>
  );
}

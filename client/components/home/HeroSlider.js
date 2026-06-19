'use client';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen, Star, Users, TrendingUp } from 'lucide-react';

const GENRES = [
  { name: 'Fiction',   bg: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1920&q=85', color: '#60A5FA', tagline: 'Worlds built from words' },
  { name: 'Mystery',   bg: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=1920&q=85', color: '#FCD34D', tagline: 'Every clue tells a story' },
  { name: 'Romance',   bg: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=1920&q=85', color: '#F9A8D4', tagline: 'Hearts in every page' },
  { name: 'Sci-Fi',    bg: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1920&q=85', color: '#6EE7B7', tagline: 'Beyond the stars' },
  { name: 'Fantasy',   bg: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&q=85', color: '#C4B5FD', tagline: 'Magic lives between these lines' },
  { name: 'Horror',    bg: 'https://images.unsplash.com/photo-1520116468816-95b69f847357?w=1920&q=85', color: '#FCA5A5', tagline: 'Dare to turn the page' },
  { name: 'Thriller',  bg: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1920&q=85', color: '#FDBA74', tagline: 'Every second counts' },
  { name: 'Adventure', bg: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=85', color: '#86EFAC', tagline: 'The journey awaits' },
];

const STATS = [
  { icon: BookOpen,    value: '1,200+', label: 'Ebooks'       },
  { icon: Users,       value: '8,500+', label: 'Readers'      },
  { icon: Star,        value: '340+',   label: 'Writers'      },
  { icon: TrendingUp,  value: '2,100+', label: 'Monthly Sales'},
];

const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 0.8 + Math.random() * 2,
  duration: 6 + Math.random() * 10,
  delay: Math.random() * 8,
  opacity: 0.15 + Math.random() * 0.35,
}));

export default function HeroSlider() {
  const containerRef = useRef(null);
  const [active, setActive]   = useState(1);
  const [cursor, setCursor]   = useState({ x: -200, y: -200, visible: false });

  /* ── Spring-smoothed mouse tracking ── */
  const cfg = { stiffness: 30, damping: 18 };
  const mouseX = useSpring(0, cfg);
  const mouseY = useSpring(0, cfg);

  /* ── Per-layer parallax transforms ── */
  const bgX  = useTransform(mouseX, v => `${v * 0.18}px`);
  const bgY  = useTransform(mouseY, v => `${v * 0.18}px`);
  const ptX  = useTransform(mouseX, v => `${v * 0.45}px`);
  const ptY  = useTransform(mouseY, v => `${v * 0.45}px`);
  const fgX  = useTransform(mouseX, v => `${v * 0.9}px`);
  const fgY  = useTransform(mouseY, v => `${v * 0.9}px`);
  const txX  = useTransform(mouseX, v => `${v * 0.1}px`);
  const txY  = useTransform(mouseY, v => `${v * 0.1}px`);

  const onMouseMove = (e) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    mouseX.set((e.clientX / r.width  - 0.5) * 100);
    mouseY.set((e.clientY / r.height - 0.5) * 70);
    setCursor({ x: e.clientX, y: e.clientY, visible: true });
  };
  const onMouseLeave = () => {
    mouseX.set(0); mouseY.set(0);
    setCursor(c => ({ ...c, visible: false }));
  };

  const genre = GENRES[active];

  /* ── Circular genre label positions ── */
  const R = 158;
  const labelPositions = GENRES.map((g, i) => {
    const angle = (i / GENRES.length) * 360 - 90;
    const rad   = angle * Math.PI / 180;
    return { ...g, i, x: Math.cos(rad) * R, y: Math.sin(rad) * R };
  });

  /* ── Preload all genre backgrounds ── */
  useEffect(() => {
    GENRES.forEach(g => { const img = new Image(); img.src = g.bg; });
  }, []);

  return (
    <>
      {/* ─── Custom glowing cursor ─── */}
      <div
        className="fixed pointer-events-none z-[99999]"
        style={{
          left: cursor.x,
          top:  cursor.y,
          transform: 'translate(-50%, -50%)',
          opacity: cursor.visible ? 1 : 0,
          transition: 'opacity 0.2s',
        }}
      >
        <div
          className="w-5 h-5 rounded-full"
          style={{
            background: genre.color,
            boxShadow: `0 0 18px 4px ${genre.color}70`,
            mixBlendMode: 'screen',
          }}
        />
      </div>

      <section
        ref={containerRef}
        className="relative w-full min-h-screen overflow-hidden flex flex-col"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ cursor: 'none' }}
      >
        {/* ══ LAYER 1 — Background image (slowest) ══ */}
        <motion.div
          className="absolute pointer-events-none"
          style={{ x: bgX, y: bgY, inset: '-10%', width: '120%', height: '120%' }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={genre.bg}
              src={genre.bg}
              alt=""
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1,  scale: 1    }}
              exit={{    opacity: 0              }}
              transition={{ duration: 1.1, ease: 'easeInOut' }}
            />
          </AnimatePresence>
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b  from-black/60 via-black/20 to-black/75 pointer-events-none z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r  from-black/25 via-transparent to-black/25 pointer-events-none z-[1]" />
        {/* Colour tint that matches active genre */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="absolute inset-0 pointer-events-none z-[1]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.08 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{ background: genre.color }}
          />
        </AnimatePresence>

        {/* ══ LAYER 2 — Floating particles (medium speed) ══ */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-[2]"
          style={{ x: ptX, y: ptY }}
        >
          {PARTICLES.map(p => (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-white"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
              animate={{ y: [0, -50, 0], opacity: [0, p.opacity, 0] }}
              transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </motion.div>

        {/* ══ LAYER 3 — Foreground decorative text (fast parallax) ══ */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-[3] hidden lg:block"
          style={{ x: fgX, y: fgY }}
        >
          <p className="absolute top-24 left-24 text-white/10 text-xs tracking-[0.4em] font-semibold uppercase">Est. 2024</p>
          <p className="absolute top-24 right-10  text-white/10 text-xs tracking-[0.3em] uppercase">Read · Discover · Write</p>
          <p className="absolute bottom-32 left-24 text-white/8  text-xs tracking-[0.5em] uppercase rotate-90 origin-left">Fable</p>
        </motion.div>

        {/* ══ LAYER 4 — Left sidebar ══ */}
        <motion.div
          className="absolute left-7 top-1/2 -translate-y-1/2 z-[10] hidden lg:flex flex-col items-center gap-4"
          style={{ x: ptX, y: ptY }}
        >
          <p
            className="text-white/30 text-[10px] tracking-[0.4em] font-medium uppercase"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Your Reading Journey
          </p>
          <div className="w-px h-10 bg-white/15 mx-auto" />
          {['f', '𝕏', 'in', '@'].map((ic, i) => (
            <a
              key={i}
              href="#"
              className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-white/35 hover:text-white hover:border-white/50 transition-all text-[10px] font-bold"
            >
              {ic}
            </a>
          ))}
        </motion.div>

        {/* ══ LAYER 5 — Central content (subtle parallax) ══ */}
        <motion.div
          className="relative flex-1 flex flex-col items-center justify-center text-center z-[10] px-6 py-32"
          style={{ x: txX, y: txY }}
        >
          {/* ── Circular genre wheel ── */}
          <div className="relative mb-6" style={{ width: 380, height: 380 }}>

            {/* Slowly-spinning dashed ring */}
            <motion.svg
              viewBox="0 0 380 380"
              className="absolute inset-0 w-full h-full pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
            >
              <circle cx="190" cy="190" r="158" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1"   strokeDasharray="4 14" />
              <circle cx="190" cy="190" r="128" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            </motion.svg>

            {/* Genre labels — wrapper div holds position, motion.button handles hover */}
            {labelPositions.map(({ name, color, x, y, i: idx }) => {
              const isActive = active === idx;
              return (
                <div
                  key={name}
                  className="absolute"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top:  `calc(50% + ${y}px)`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <motion.button
                    onClick={() => setActive(idx)}
                    whileHover={{ scale: 1.25 }}
                    whileTap={{ scale: 0.95 }}
                    className="font-black tracking-[0.18em] uppercase whitespace-nowrap px-2 py-1 rounded-lg transition-colors duration-300"
                    style={{
                      fontSize: 13,
                      color: isActive ? color : 'rgba(255,255,255,0.50)',
                      textShadow: isActive ? `0 0 22px ${color}` : 'none',
                      background: isActive ? `${color}15` : 'transparent',
                      border: `1px solid ${isActive ? color + '40' : 'transparent'}`,
                    }}
                  >
                    {name}
                  </motion.button>
                </div>
              );
            })}

            {/* ── Central premium badge ── */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 0.75, rotate: -8 }}
                  animate={{ opacity: 1, scale: 1,    rotate: 0  }}
                  exit={{    opacity: 0, scale: 1.15, rotate: 8  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="relative"
                >
                  {/* Outer glow pulse */}
                  <motion.div
                    animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.15, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -inset-4 rounded-[22px]"
                    style={{ background: genre.color, filter: 'blur(16px)' }}
                  />
                  {/* Badge */}
                  <div
                    className="relative w-20 h-20 rounded-[20px] flex items-center justify-center overflow-hidden"
                    style={{
                      background: 'linear-gradient(155deg,#1e1b4b 0%,#3730a3 38%,#4f46e5 65%,#7c3aed 100%)',
                      boxShadow: `0 8px 32px rgba(79,70,229,0.6), 0 0 0 1px rgba(255,255,255,0.1) inset`,
                      border: `2px solid ${genre.color}50`,
                    }}
                  >
                    <div className="absolute top-0 inset-x-0 h-10 rounded-t-[20px]"
                      style={{ background: 'linear-gradient(180deg,rgba(255,255,255,0.15) 0%,transparent 100%)' }} />
                    <svg width="42" height="42" viewBox="0 0 21 21" fill="none">
                      <rect x="3.5" y="2.5"  width="4"    height="16"  rx="1.8" fill="white"/>
                      <rect x="3.5" y="2.5"  width="14"   height="4"   rx="1.8" fill="white"/>
                      <rect x="3.5" y="11"   width="9.5"  height="3.2" rx="1.5" fill="rgba(255,255,255,0.82)"/>
                      <rect x="5"   y="19.2" width="8"    height="1.2" rx="0.6" fill="rgba(255,255,255,0.22)"/>
                      <rect x="5.5" y="17.8" width="6.5"  height="1"   rx="0.5" fill="rgba(255,255,255,0.14)"/>
                    </svg>
                    <div className="absolute bottom-0 inset-x-0 h-8"
                      style={{ background: 'linear-gradient(0deg,rgba(0,0,0,0.3) 0%,transparent 100%)' }} />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Micro tagline */}
          <p className="text-white/40 text-[10px] font-bold tracking-[0.45em] uppercase mb-3">
            A Digital Library Experience
          </p>

          {/* Main title */}
          <h1
            className="font-display font-black italic text-white leading-none mb-3 select-none"
            style={{
              fontSize: 'clamp(52px, 9vw, 96px)',
              textShadow: '0 4px 40px rgba(0,0,0,0.7)',
            }}
          >
            Fable
          </h1>

          {/* Genre tagline — changes with active */}
          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0  }}
              exit={{    opacity: 0, y: -12}}
              transition={{ duration: 0.4 }}
              className="text-sm font-medium tracking-[0.3em] uppercase mb-8 italic"
              style={{ color: genre.color, textShadow: `0 0 20px ${genre.color}50` }}
            >
              {genre.tagline}
            </motion.p>
          </AnimatePresence>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Link
                  href={`/browse?genre=${genre.name}`}
                  className="inline-flex items-center gap-2 font-black text-xs tracking-widest uppercase px-8 py-3.5 rounded-full transition-all hover:scale-105"
                  style={{
                    background: genre.color,
                    color: '#0f0e17',
                    boxShadow: `0 8px 30px ${genre.color}50`,
                  }}
                >
                  Explore {genre.name} <ArrowRight size={13} />
                </Link>
              </motion.div>
            </AnimatePresence>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-bold px-8 py-3.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur transition-all"
            >
              Browse All
            </Link>
          </div>
        </motion.div>

        {/* ══ Stats bar ══ */}
        <div className="relative z-[15] border-t border-white/10 bg-black/35 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex items-center gap-2.5"
                >
                  <s.icon size={15} className="text-white/35" />
                  <div>
                    <p className="text-white font-bold text-base leading-none">{s.value}</p>
                    <p className="text-white/35 text-xs">{s.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

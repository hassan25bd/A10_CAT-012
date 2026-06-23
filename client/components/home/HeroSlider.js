'use client';
import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen, Star, Users, TrendingUp, Sparkles } from 'lucide-react';

/* ─── Welcome slide ─────────────────────────────────────────── */
const WELCOME_BG = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&q=85';

/* ─── Genre slides ───────────────────────────────────────────── */
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
  { icon: BookOpen,   value: '1,200+', label: 'Ebooks'        },
  { icon: Users,      value: '8,500+', label: 'Readers'       },
  { icon: Star,       value: '340+',   label: 'Writers'       },
  { icon: TrendingUp, value: '2,100+', label: 'Monthly Sales' },
];

const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: 3 + (i * 13 + 7) % 94,
  y: 2 + (i * 17 + 3) % 96,
  size: 0.8 + (i % 4) * 0.6,
  duration: 6 + (i * 0.55) % 10,
  delay: (i * 0.38) % 8,
  opacity: 0.12 + (i % 5) * 0.07,
}));

/* floating 3-D geometric shapes */
const SHAPES = [
  { type: 'ring',   size: 120, x: '8%',  y: '18%', dur: 18, delay: 0,   rot: [0,   360] },
  { type: 'ring',   size: 80,  x: '88%', y: '22%', dur: 24, delay: 3,   rot: [360, 0  ] },
  { type: 'ring',   size: 55,  x: '15%', y: '72%', dur: 20, delay: 6,   rot: [0,   360] },
  { type: 'dot',    size: 10,  x: '75%', y: '65%', dur: 4,  delay: 1,   rot: [0,   0  ] },
  { type: 'dot',    size: 6,   x: '30%', y: '85%', dur: 5,  delay: 2.5, rot: [0,   0  ] },
  { type: 'square', size: 40,  x: '82%', y: '78%', dur: 30, delay: 0,   rot: [0,   360] },
  { type: 'square', size: 24,  x: '5%',  y: '45%', dur: 22, delay: 4,   rot: [360, 0  ] },
];

export default function HeroSlider() {
  const containerRef  = useRef(null);
  const [active, setActive]         = useState(1);
  const [showWelcome, setShowWelcome] = useState(true);
  const [countdown, setCountdown]   = useState(5);
  const [cursor, setCursor]         = useState({ x: -200, y: -200, visible: false });

  /* ── auto-advance from welcome → genre wheel ── */
  useEffect(() => {
    if (!showWelcome) return;
    const tick = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(tick); setShowWelcome(false); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [showWelcome]);

  /* ── preload ── */
  useEffect(() => {
    [WELCOME_BG, ...GENRES.map(g => g.bg)].forEach(src => {
      const img = new Image(); img.src = src;
    });
  }, []);

  /* ── spring-smoothed pointer tracking ── */
  const cfg   = { stiffness: 30, damping: 18 };
  const mouseX = useSpring(0, cfg);
  const mouseY = useSpring(0, cfg);

  /* parallax layers */
  const bgX = useTransform(mouseX, v => `${v * 0.18}px`);
  const bgY = useTransform(mouseY, v => `${v * 0.18}px`);
  const ptX = useTransform(mouseX, v => `${v * 0.45}px`);
  const ptY = useTransform(mouseY, v => `${v * 0.45}px`);
  const fgX = useTransform(mouseX, v => `${v * 0.9}px`);
  const fgY = useTransform(mouseY, v => `${v * 0.9}px`);
  const txX = useTransform(mouseX, v => `${v * 0.1}px`);
  const txY = useTransform(mouseY, v => `${v * 0.1}px`);

  /* 3-D tilt on the centre content card */
  const tiltX = useTransform(mouseY, v => `${-v * 0.13}deg`);
  const tiltY = useTransform(mouseX, v => `${v * 0.13}deg`);

  /* shape layer — opposite to mouse for depth feeling */
  const shpX = useTransform(mouseX, v => `${-v * 0.25}px`);
  const shpY = useTransform(mouseY, v => `${-v * 0.25}px`);

  const updatePointer = useCallback((clientX, clientY) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    mouseX.set((clientX / r.width  - 0.5) * 100);
    mouseY.set((clientY / r.height - 0.5) * 70);
  }, [mouseX, mouseY]);

  const onMouseMove  = (e) => { updatePointer(e.clientX, e.clientY); setCursor({ x: e.clientX, y: e.clientY, visible: true }); };
  const onMouseLeave = ()  => { mouseX.set(0); mouseY.set(0); setCursor(c => ({ ...c, visible: false })); };
  const onTouchMove  = (e) => { const t = e.touches[0]; if (t) updatePointer(t.clientX, t.clientY); };
  const onTouchEnd   = ()  => { mouseX.set(0); mouseY.set(0); };

  const genre = GENRES[active];

  /* genre wheel positions */
  const R = 158;
  const labelPositions = GENRES.map((g, i) => {
    const angle = (i / GENRES.length) * 360 - 90;
    const rad   = angle * Math.PI / 180;
    return { ...g, i, x: Math.cos(rad) * R, y: Math.sin(rad) * R };
  });

  const currentBg = showWelcome ? WELCOME_BG : genre.bg;
  const currentColor = showWelcome ? '#a78bfa' : genre.color;

  return (
    <>
      {/* ── custom glowing cursor ── */}
      <div
        className="fixed pointer-events-none z-[99999]"
        style={{
          left: cursor.x, top: cursor.y,
          transform: 'translate(-50%,-50%)',
          opacity: cursor.visible ? 1 : 0,
          transition: 'opacity 0.2s',
        }}
      >
        <div
          className="w-5 h-5 rounded-full"
          style={{
            background: currentColor,
            boxShadow: `0 0 18px 4px ${currentColor}70`,
            mixBlendMode: 'screen',
          }}
        />
      </div>

      <section
        ref={containerRef}
        className="relative w-full min-h-screen overflow-hidden flex flex-col"
        style={{ cursor: 'none', perspective: '1200px' }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >

        {/* ══ LAYER 0 — 3D depth grid ══ */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-[0]"
          style={{ x: bgX, y: bgY }}
        >
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
              transform: 'perspective(600px) rotateX(25deg) scale(1.4)',
              transformOrigin: 'center bottom',
            }}
          />
        </motion.div>

        {/* ══ LAYER 1 — Background image (slowest) ══ */}
        <motion.div
          className="absolute pointer-events-none"
          style={{ x: bgX, y: bgY, inset: '-10%', width: '120%', height: '120%' }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentBg}
              src={currentBg}
              alt=""
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1,  scale: 1    }}
              exit={{    opacity: 0              }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
          </AnimatePresence>
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/25 to-black/80 pointer-events-none z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 pointer-events-none z-[1]" />

        {/* Colour tint */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentColor}
            className="absolute inset-0 pointer-events-none z-[1]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.10 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{ background: currentColor }}
          />
        </AnimatePresence>

        {/* ══ LAYER 2 — Floating 3D particles ══ */}
        <motion.div className="absolute inset-0 pointer-events-none z-[2]" style={{ x: ptX, y: ptY }}>
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

        {/* ══ LAYER 3 — 3D floating geometric shapes ══ */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-[3]"
          style={{ x: shpX, y: shpY }}
        >
          {SHAPES.map((s, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ left: s.x, top: s.y, width: s.size, height: s.size }}
              animate={{
                rotate: s.rot,
                y: [0, -18, 0],
                scale: [1, 1.08, 1],
              }}
              transition={{
                rotate: { duration: s.dur, repeat: Infinity, ease: 'linear' },
                y:      { duration: s.dur * 0.6, repeat: Infinity, ease: 'easeInOut', delay: s.delay },
                scale:  { duration: s.dur * 0.5, repeat: Infinity, ease: 'easeInOut', delay: s.delay + 1 },
              }}
            >
              {s.type === 'ring' && (
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    border: `1px solid ${currentColor}30`,
                    boxShadow: `0 0 12px ${currentColor}15`,
                  }}
                />
              )}
              {s.type === 'square' && (
                <div
                  className="w-full h-full rounded-md"
                  style={{
                    border: `1px solid ${currentColor}25`,
                    boxShadow: `0 0 8px ${currentColor}10`,
                  }}
                />
              )}
              {s.type === 'dot' && (
                <motion.div
                  className="w-full h-full rounded-full"
                  style={{ background: currentColor, opacity: 0.35 }}
                  animate={{ scale: [1, 1.6, 1], opacity: [0.35, 0.15, 0.35] }}
                  transition={{ duration: s.dur, repeat: Infinity, ease: 'easeInOut', delay: s.delay }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* ══ LAYER 4 — Foreground decorative text ══ */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-[4] hidden lg:block"
          style={{ x: fgX, y: fgY }}
        >
          <p className="absolute top-24 left-24 text-white/10 text-xs tracking-[0.4em] font-semibold uppercase">Est. 2024</p>
          <p className="absolute top-24 right-10  text-white/10 text-xs tracking-[0.3em] uppercase">Read · Discover · Write</p>
        </motion.div>

        {/* ══ LAYER 5 — Left sidebar ══ */}
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

        {/* ══ LAYER 6 — WELCOME SCREEN ══ */}
        <AnimatePresence>
          {showWelcome && (
            <motion.div
              key="welcome"
              className="absolute inset-0 z-[20] flex flex-col items-center justify-center text-center px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.8 }}
              style={{
                rotateX: tiltX,
                rotateY: tiltY,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Pulsing rings */}
              {[1, 2, 3].map(ring => (
                <motion.div
                  key={ring}
                  className="absolute rounded-full border border-violet-400/20 pointer-events-none"
                  style={{ width: 200 + ring * 120, height: 200 + ring * 120 }}
                  animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: ring * 0.9, ease: 'easeOut' }}
                />
              ))}

              {/* Welcome badge */}
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
                className="mb-6"
              >
                <div
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-violet-400/30 bg-violet-500/15 backdrop-blur-sm"
                >
                  <motion.span
                    animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Sparkles size={14} className="text-violet-300" />
                  </motion.span>
                  <span className="text-violet-200 text-xs font-bold tracking-[0.3em] uppercase">Welcome to Fable</span>
                </div>
              </motion.div>

              {/* Big title */}
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="font-display font-black text-white leading-none mb-4 select-none"
                style={{
                  fontSize: 'clamp(56px, 10vw, 110px)',
                  textShadow: '0 4px 60px rgba(167,139,250,0.4), 0 2px 20px rgba(0,0,0,0.8)',
                }}
              >
                Fable
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="text-white/70 text-lg md:text-xl mb-2 max-w-lg leading-relaxed"
              >
                A digital library where every story finds its reader.
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-violet-300/70 text-xs tracking-[0.35em] uppercase mb-10"
              >
                Read · Discover · Write · Share
              </motion.p>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 items-center"
              >
                <motion.button
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setShowWelcome(false)}
                  className="inline-flex items-center gap-2 font-black text-sm tracking-widest uppercase px-8 py-4 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg,#7c3aed,#a78bfa)',
                    color: '#fff',
                    boxShadow: '0 8px 30px rgba(124,58,237,0.5)',
                  }}
                >
                  <Sparkles size={15} /> Start Exploring
                </motion.button>

                <Link
                  href="/browse"
                  className="inline-flex items-center gap-2 text-sm tracking-widest uppercase font-bold px-8 py-4 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur transition-all"
                >
                  Browse Library <ArrowRight size={14} />
                </Link>
              </motion.div>

              {/* Auto-advance countdown ring */}
              <motion.div
                className="mt-10 flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <div className="relative w-10 h-10">
                  <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
                    <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                    <motion.circle
                      cx="20" cy="20" r="16"
                      fill="none"
                      stroke="#a78bfa"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 16}`}
                      initial={{ strokeDashoffset: 0 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 16 }}
                      transition={{ duration: 5, ease: 'linear' }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-white/60 text-xs font-bold">
                    {countdown}
                  </span>
                </div>
                <p className="text-white/30 text-[10px] tracking-widest uppercase">Auto exploring</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══ LAYER 7 — Genre wheel content ══ */}
        <AnimatePresence>
          {!showWelcome && (
            <motion.div
              key="genre-content"
              className="relative flex-1 flex flex-col items-center justify-center text-center z-[10] px-6 py-32"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1,  scale: 1    }}
              exit={{    opacity: 0              }}
              transition={{ duration: 0.7 }}
              style={{
                x: txX, y: txY,
                rotateX: tiltX,
                rotateY: tiltY,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Circular genre wheel */}
              <div className="relative mb-6" style={{ width: 380, height: 380 }}>

                {/* Spinning dashed ring */}
                <motion.svg
                  viewBox="0 0 380 380"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                >
                  <circle cx="190" cy="190" r="158" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1"   strokeDasharray="4 14" />
                  <circle cx="190" cy="190" r="128" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                </motion.svg>

                {/* Genre labels */}
                {labelPositions.map(({ name, color, x, y, i: idx }) => {
                  const isActive = active === idx;
                  return (
                    <div
                      key={name}
                      className="absolute"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top:  `calc(50% + ${y}px)`,
                        transform: 'translate(-50%,-50%)',
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

                {/* Central badge */}
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
                      <motion.div
                        animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.15, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute -inset-4 rounded-[22px]"
                        style={{ background: genre.color, filter: 'blur(16px)' }}
                      />
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

              {/* Genre tagline */}
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
                    <motion.div whileHover={{ scale: 1.06, y: -2 }} whileTap={{ scale: 0.96 }}>
                      <Link
                        href={`/browse?genre=${genre.name}`}
                        className="inline-flex items-center gap-2 font-black text-xs tracking-widest uppercase px-8 py-3.5 rounded-full transition-all"
                        style={{
                          background: genre.color,
                          color: '#0f0e17',
                          boxShadow: `0 8px 30px ${genre.color}50`,
                        }}
                      >
                        Explore {genre.name} <ArrowRight size={13} />
                      </Link>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>

                <motion.div whileHover={{ scale: 1.06, y: -2 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    href="/browse"
                    className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-bold px-8 py-3.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur transition-all"
                  >
                    Browse All
                  </Link>
                </motion.div>
              </div>

              {/* Back to welcome */}
              <motion.button
                onClick={() => { setShowWelcome(true); setCountdown(5); }}
                className="mt-6 text-white/25 hover:text-white/50 text-[10px] tracking-widest uppercase transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                ← Welcome Screen
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

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

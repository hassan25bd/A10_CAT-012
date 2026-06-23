'use client';
import Link from 'next/link';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { useRef, useState, useCallback } from 'react';

const GENRES = [
  { name: 'Fiction',    emoji: '📖', from: '#3B82F6', to: '#6366F1', light: 'rgba(59,130,246,0.08)'  },
  { name: 'Mystery',    emoji: '🔍', from: '#F59E0B', to: '#EF4444', light: 'rgba(245,158,11,0.08)'  },
  { name: 'Romance',    emoji: '💕', from: '#EC4899', to: '#F472B6', light: 'rgba(236,72,153,0.08)'  },
  { name: 'Sci-Fi',     emoji: '🚀', from: '#06B6D4', to: '#3B82F6', light: 'rgba(6,182,212,0.08)'   },
  { name: 'Fantasy',    emoji: '🐉', from: '#8B5CF6', to: '#6366F1', light: 'rgba(139,92,246,0.08)'  },
  { name: 'Horror',     emoji: '👻', from: '#EF4444', to: '#7C3AED', light: 'rgba(239,68,68,0.08)'   },
  { name: 'Biography',  emoji: '🧑', from: '#F97316', to: '#FBBF24', light: 'rgba(249,115,22,0.08)'  },
  { name: 'Self-Help',  emoji: '🌱', from: '#10B981', to: '#34D399', light: 'rgba(16,185,129,0.08)'  },
  { name: 'History',    emoji: '🏛️', from: '#D97706', to: '#F59E0B', light: 'rgba(217,119,6,0.08)'   },
  { name: 'Poetry',     emoji: '✍️', from: '#7C3AED', to: '#A78BFA', light: 'rgba(124,58,237,0.08)'  },
  { name: 'Thriller',   emoji: '⚡', from: '#EF4444', to: '#F97316', light: 'rgba(239,68,68,0.08)'   },
  { name: 'Adventure',  emoji: '🗺️', from: '#059669', to: '#0EA5E9', light: 'rgba(5,150,105,0.08)'   },
];

let _pid = 0;

function GenreCard({ genre, i }) {
  const cardRef  = useRef(null);
  const [hovered, setHovered]   = useState(false);
  const [pressed, setPressed]   = useState(false);
  const [ripples, setRipples]   = useState([]);
  const [particles, setParticles] = useState([]);
  const [tilt, setTilt]         = useState({ x: 0, y: 0 });
  const [glare, setGlare]       = useState({ x: 50, y: 50 });

  /* ── pointer tracking ── */
  const updateTilt = useCallback((cx, cy) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    setTilt({
      x:  ((cy - r.top)  / r.height - 0.5) * 20,
      y: -((cx - r.left) / r.width  - 0.5) * 20,
    });
    setGlare({
      x: ((cx - r.left) / r.width)  * 100,
      y: ((cy - r.top)  / r.height) * 100,
    });
  }, []);

  const onMouseMove  = (e) => { updateTilt(e.clientX, e.clientY); };
  const onMouseEnter = ()  => setHovered(true);
  const onMouseLeave = ()  => { setHovered(false); setTilt({ x: 0, y: 0 }); };

  const onTouchMove  = (e) => { const t = e.touches[0]; if (t) updateTilt(t.clientX, t.clientY); };
  const onTouchEnd   = ()  => { setHovered(false); setPressed(false); setTilt({ x: 0, y: 0 }); };

  /* ── ripple + particle burst on tap/click ── */
  const spawnEffects = useCallback((cx, cy) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    const lx = cx - r.left, ly = cy - r.top;

    /* ripple */
    const rid = ++_pid;
    setRipples(p => [...p, { id: rid, x: lx, y: ly }]);
    setTimeout(() => setRipples(p => p.filter(v => v.id !== rid)), 700);

    /* particles */
    const batch = Array.from({ length: 8 }, (_, k) => ({
      id: ++_pid,
      x: lx, y: ly,
      angle: (k / 8) * 360,
    }));
    setParticles(p => [...p, ...batch]);
    setTimeout(() => setParticles(p => p.filter(v => !batch.find(b => b.id === v.id))), 650);
  }, []);

  const onTouchStart = (e) => {
    setHovered(true); setPressed(true);
    const t = e.touches[0]; if (t) spawnEffects(t.clientX, t.clientY);
  };
  const onClick = (e) => spawnEffects(e.clientX, e.clientY);

  /* idle float per card */
  const floatDur    = 2.6 + (i % 4) * 0.4;
  const floatDelay  = (i % 6) * 0.3;
  const floatAmount = 5 + (i % 3) * 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: -20, scale: 0.88 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: i * 0.055, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      style={{ perspective: '700px' }}
    >
      <Link href={`/browse?genre=${genre.name}`} onClick={onClick}>
        <motion.div
          ref={cardRef}
          onMouseMove={onMouseMove}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          animate={{
            rotateX: hovered ? tilt.x : [0, -floatAmount * 0.15, 0],
            rotateY: hovered ? tilt.y : [0, floatAmount  * 0.1, 0],
            y:       hovered ? -10    : [0, -floatAmount, 0],
            scale:   pressed ? 0.94   : hovered ? 1.07 : 1,
          }}
          transition={{
            rotateX: hovered ? { duration: 0.06 } : { duration: floatDur, repeat: Infinity, ease: 'easeInOut', delay: floatDelay },
            rotateY: hovered ? { duration: 0.06 } : { duration: floatDur, repeat: Infinity, ease: 'easeInOut', delay: floatDelay + 0.4 },
            y:       hovered ? { type: 'spring', stiffness: 300, damping: 18 } : { duration: floatDur, repeat: Infinity, ease: 'easeInOut', delay: floatDelay },
            scale:   { type: 'spring', stiffness: 380, damping: 22 },
          }}
          className="relative flex flex-col items-center gap-3 p-6 rounded-3xl overflow-hidden cursor-pointer select-none"
          style={{
            background: hovered
              ? `linear-gradient(145deg, ${genre.from}, ${genre.to})`
              : genre.light,
            border: `1.5px solid ${hovered ? 'transparent' : genre.from + '35'}`,
            boxShadow: hovered
              ? `0 22px 55px -10px ${genre.from}55, 0 8px 20px -4px ${genre.from}33, 0 0 0 1px ${genre.from}20 inset`
              : `0 4px 18px -4px ${genre.from}18`,
            transformStyle: 'preserve-3d',
            backdropFilter: 'blur(8px)',
            transition: 'background 0.35s, box-shadow 0.35s, border-color 0.35s',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          {/* Ripple layer */}
          {ripples.map(rp => (
            <motion.div
              key={rp.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: rp.x, top: rp.y,
                background: 'rgba(255,255,255,0.55)',
                marginLeft: -4, marginTop: -4,
              }}
              initial={{ width: 8, height: 8, opacity: 0.7 }}
              animate={{ width: 180, height: 180, marginLeft: -90, marginTop: -90, opacity: 0 }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
            />
          ))}

          {/* Tap particle burst */}
          {particles.map(pt => (
            <motion.div
              key={pt.id}
              className="absolute w-2 h-2 rounded-full pointer-events-none"
              style={{ left: pt.x, top: pt.y, background: hovered ? '#fff' : genre.from }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos(pt.angle * Math.PI / 180) * 50,
                y: Math.sin(pt.angle * Math.PI / 180) * 50,
                opacity: 0, scale: 0,
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          ))}

          {/* Glare highlight */}
          {hovered && (
            <div
              className="absolute inset-0 pointer-events-none rounded-3xl"
              style={{
                background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.28) 0%, transparent 55%)`,
              }}
            />
          )}

          {/* Top-left shimmer */}
          <div
            className="absolute inset-0 pointer-events-none rounded-3xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 50%)',
              opacity: hovered ? 0.6 : 0.25,
              transition: 'opacity 0.3s',
            }}
          />

          {/* Emoji */}
          <motion.span
            animate={{
              scale:   hovered ? [1, 1.28, 1.18] : 1,
              rotateZ: hovered ? [0, -12, 10, 0] : 0,
              y:       hovered ? [0, -6, 0] : 0,
            }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="relative z-10 leading-none select-none"
            style={{
              fontSize: 42,
              filter: hovered ? `drop-shadow(0 6px 12px ${genre.from}80)` : 'none',
              transition: 'filter 0.3s',
            }}
          >
            {genre.emoji}
          </motion.span>

          {/* Label */}
          <motion.span
            animate={{ scale: hovered ? 1.05 : 1 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 font-black text-sm tracking-wide text-center leading-tight"
            style={{
              color: hovered ? '#fff' : genre.from,
              textShadow: hovered ? `0 2px 8px ${genre.from}80` : 'none',
              transition: 'color 0.3s, text-shadow 0.3s',
            }}
          >
            {genre.name}
          </motion.span>

          {/* Pulsing ring on hover */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                initial={{ opacity: 0.6, scale: 1 }}
                animate={{ opacity: 0, scale: 1.08 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                style={{ border: `2px solid ${genre.from}80` }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </Link>
    </motion.div>
  );
}

/* ── Floating background shapes ── */
const BG_SHAPES = GENRES.slice(0, 6).map((g, i) => ({
  color: g.from,
  size: 180 + i * 40,
  x: `${10 + i * 14}%`,
  y: i % 2 === 0 ? '15%' : '65%',
  dur: 14 + i * 3,
  delay: i * 1.8,
}));

export default function GenreGrid() {
  return (
    <section className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(160deg,#fafaff 0%,#f3f0ff 50%,#faf5ff 100%)' }}>

      {/* Animated background orbs */}
      {BG_SHAPES.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: s.size, height: s.size,
            left: s.x, top: s.y,
            background: `radial-gradient(circle, ${s.color}12 0%, transparent 70%)`,
            filter: 'blur(40px)',
          }}
          animate={{ x: [0, 25, -15, 0], y: [0, -20, 15, 0], scale: [1, 1.08, 0.96, 1] }}
          transition={{ duration: s.dur, repeat: Infinity, ease: 'easeInOut', delay: s.delay }}
        />
      ))}

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <motion.span
            className="inline-flex items-center gap-2 text-indigo-600 text-xs font-black tracking-[0.3em] uppercase mb-4 px-5 py-2 rounded-full border border-indigo-200/60"
            style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.08))' }}
            animate={{ boxShadow: ['0 0 0 0 rgba(99,102,241,0)', '0 0 0 8px rgba(99,102,241,0.08)', '0 0 0 0 rgba(99,102,241,0)'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ✦ Explore
          </motion.span>

          <motion.h2
            className="font-display text-4xl md:text-5xl font-black mt-2 mb-3"
            style={{
              background: 'linear-gradient(135deg,#1e1b4b,#4f46e5,#7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Browse by Genre
          </motion.h2>
          <p className="text-slate-500 text-lg max-w-md mx-auto">
            Find the perfect story that matches your mood
          </p>

          {/* Animated underline */}
          <motion.div
            className="mx-auto mt-4 h-1 rounded-full"
            style={{ background: 'linear-gradient(90deg,#6366f1,#a855f7,#ec4899)' }}
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {GENRES.map((genre, i) => (
            <GenreCard key={genre.name} genre={genre} i={i} />
          ))}
        </div>

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center text-slate-400 text-sm mt-12 tracking-wide"
        >
          Tap any genre to start your reading adventure ✨
        </motion.p>
      </div>
    </section>
  );
}

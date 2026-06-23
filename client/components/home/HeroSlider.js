'use client';
import { useRef, useState, useEffect, useCallback } from 'react';
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

let _rippleId = 0;

/* ── Per-genre cartoon reaction data ── */
const REACTIONS = {
  Fiction:   { char: '🤓', big: '📚', msg: 'A whole new world!',      confetti: ['📖','✨','🌟','📝'] },
  Mystery:   { char: '🕵️', big: '🔍', msg: 'Every clue counts...',   confetti: ['🔎','💡','🗝️','❓'] },
  Romance:   { char: '🥰', big: '💝', msg: 'Love fills the pages!',   confetti: ['💕','🌸','💖','✨'] },
  'Sci-Fi':  { char: '👾', big: '🚀', msg: 'Blast off to the future!',confetti: ['⭐','🛸','🌙','💫'] },
  Fantasy:   { char: '🧙', big: '🔮', msg: 'Pure magic awaits!',      confetti: ['✨','🌟','⚡','🦄'] },
  Horror:    { char: '👻', big: '💀', msg: 'Dare you turn the page?', confetti: ['🕷️','🦇','⚡','💀'] },
  Thriller:  { char: '😰', big: '🗡️', msg: 'Heart is POUNDING!',     confetti: ['💥','⚡','🔥','😱'] },
  Adventure: { char: '🤠', big: '🗺️', msg: 'The journey begins!',    confetti: ['🌄','⛰️','🌟','🏕️'] },
};

/* ── Reaction Popup Component ── */
function GenreReaction({ genreName, color, onDone }) {
  const r = REACTIONS[genreName];
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [genreName, onDone]);

  const confettiItems = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    emoji: r.confetti[i % r.confetti.length],
    angle: (i / 16) * 360,
    dist: 80 + (i % 3) * 35,
    delay: (i % 4) * 0.06,
  }));

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-[300] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Confetti burst */}
      {confettiItems.map(c => (
        <motion.span
          key={c.id}
          className="absolute text-2xl select-none pointer-events-none"
          style={{ fontSize: 22 }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
          animate={{
            x: Math.cos(c.angle * Math.PI / 180) * c.dist,
            y: Math.sin(c.angle * Math.PI / 180) * c.dist,
            opacity: [1, 1, 0],
            scale: [0.5, 1.2, 0.8],
            rotate: [0, 360],
          }}
          transition={{ duration: 0.9, delay: c.delay, ease: 'easeOut' }}
        >
          {c.emoji}
        </motion.span>
      ))}

      {/* Main card */}
      <motion.div
        className="relative flex flex-col items-center gap-4 px-10 py-8 rounded-[32px] text-center"
        style={{
          background: `linear-gradient(145deg, ${color}25, ${color}10)`,
          border: `1px solid ${color}50`,
          backdropFilter: 'blur(20px)',
          boxShadow: `0 0 60px ${color}30, 0 20px 60px rgba(0,0,0,0.4)`,
        }}
        initial={{ scale: 0.1, rotateY: -180, opacity: 0 }}
        animate={{ scale: 1,   rotateY: 0,    opacity: 1 }}
        exit={{    scale: 0.05, rotateY: 180,  opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 18 }}
      >
        {/* Outer glow ring */}
        <motion.div
          className="absolute -inset-6 rounded-[44px] pointer-events-none"
          style={{ background: color, filter: 'blur(28px)', opacity: 0.18 }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.18, 0.06, 0.18] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />

        {/* Big emoji — 3D wobble */}
        <motion.div
          style={{ fontSize: 80, lineHeight: 1, transformStyle: 'preserve-3d', perspective: 400 }}
          animate={{
            rotateY: [0, 25, -25, 15, -15, 0],
            rotateZ: [0, 8, -8, 4, -4, 0],
            y: [0, -12, 0, -8, 0],
            scale: [1, 1.12, 1],
          }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          {r.char}
        </motion.div>

        {/* Small floating big-emoji */}
        <motion.span
          className="absolute -top-4 -right-4 text-3xl"
          animate={{ rotate: [0, 20, -10, 0], scale: [1, 1.3, 1], y: [0, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {r.big}
        </motion.span>

        {/* Genre name */}
        <motion.p
          className="text-2xl font-black tracking-tight"
          style={{ color, textShadow: `0 0 20px ${color}80` }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {genreName}
        </motion.p>

        {/* Message */}
        <p className="text-white/70 text-sm font-medium max-w-[180px] leading-snug">{r.msg}</p>

        {/* Progress bar auto-dismiss */}
        <div className="w-32 h-1 rounded-full overflow-hidden" style={{ background: `${color}25` }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: color }}
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 2.8, ease: 'linear' }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function HeroSlider() {
  const containerRef = useRef(null);
  const [active, setActive]       = useState(1);
  const [cursor, setCursor]       = useState({ x: -200, y: -200, visible: false });
  const [ripples, setRipples]     = useState([]);
  const [sparks,  setSparks]      = useState([]);
  const [ringSpeed, setRingSpeed] = useState(45);
  const [reaction, setReaction]   = useState(null);

  /* ── spring-smoothed pointer (parallax) ── */
  const pCfg   = { stiffness: 28, damping: 16 };
  const mouseX = useSpring(0, pCfg);
  const mouseY = useSpring(0, pCfg);

  /* ── tight spring for 3-D tilt ── */
  const tCfg    = { stiffness: 110, damping: 20 };
  const tiltRawX = useSpring(0, tCfg);
  const tiltRawY = useSpring(0, tCfg);

  /* parallax layers */
  const bgX = useTransform(mouseX, v => `${v * 0.20}px`);
  const bgY = useTransform(mouseY, v => `${v * 0.20}px`);
  const ptX = useTransform(mouseX, v => `${v * 0.50}px`);
  const ptY = useTransform(mouseY, v => `${v * 0.50}px`);
  const fgX = useTransform(mouseX, v => `${v * 1.0}px`);
  const fgY = useTransform(mouseY, v => `${v * 1.0}px`);
  const txX = useTransform(mouseX, v => `${v * 0.08}px`);
  const txY = useTransform(mouseY, v => `${v * 0.08}px`);

  /* 3-D tilt on the central content block */
  const rotX = useTransform(tiltRawY, v => `${-v * 0.13}deg`);
  const rotY = useTransform(tiltRawX, v => `${ v * 0.13}deg`);

  /* depth counter-layer for floating rings */
  const shpX = useTransform(mouseX, v => `${-v * 0.28}px`);
  const shpY = useTransform(mouseY, v => `${-v * 0.28}px`);

  /* ── unified pointer updater ── */
  const updatePointer = useCallback((cx, cy) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    const nx = (cx / r.width  - 0.5) * 100;
    const ny = (cy / r.height - 0.5) * 70;
    mouseX.set(nx); mouseY.set(ny);
    tiltRawX.set(nx); tiltRawY.set(ny);
  }, [mouseX, mouseY, tiltRawX, tiltRawY]);

  const onMouseMove  = useCallback((e) => {
    updatePointer(e.clientX, e.clientY);
    setCursor({ x: e.clientX, y: e.clientY, visible: true });
  }, [updatePointer]);

  const onMouseLeave = useCallback(() => {
    mouseX.set(0); mouseY.set(0);
    tiltRawX.set(0); tiltRawY.set(0);
    setCursor(c => ({ ...c, visible: false }));
  }, [mouseX, mouseY, tiltRawX, tiltRawY]);

  const onTouchMove  = useCallback((e) => {
    const t = e.touches[0];
    if (t) { updatePointer(t.clientX, t.clientY); setCursor({ x: t.clientX, y: t.clientY, visible: false }); }
  }, [updatePointer]);

  const onTouchEnd = useCallback(() => {
    mouseX.set(0); mouseY.set(0);
    tiltRawX.set(0); tiltRawY.set(0);
  }, [mouseX, mouseY, tiltRawX, tiltRawY]);

  /* ripple: touch / click anywhere */
  const spawnRipple = useCallback((cx, cy) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    const id = ++_rippleId;
    setRipples(prev => [...prev, { id, x: cx - r.left, y: cy - r.top }]);
    setTimeout(() => setRipples(prev => prev.filter(p => p.id !== id)), 900);
  }, []);

  const onTouchStart = useCallback((e) => {
    const t = e.touches[0]; if (t) spawnRipple(t.clientX, t.clientY);
  }, [spawnRipple]);

  const onSectionClick = useCallback((e) => { spawnRipple(e.clientX, e.clientY); }, [spawnRipple]);

  /* sparks: on genre button click */
  const spawnSparks = useCallback((cx, cy, color) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    const batch = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: cx - r.left, y: cy - r.top,
      angle: (i / 12) * 360,
      color,
    }));
    setSparks(prev => [...prev, ...batch]);
    setTimeout(() => setSparks(prev => prev.filter(s => !batch.find(b => b.id === s.id))), 700);
  }, []);

  /* gyroscope tilt for mobile */
  useEffect(() => {
    const handler = (e) => {
      const nx = Math.max(-50, Math.min(50, (e.gamma || 0) * 1.4));
      const ny = Math.max(-35, Math.min(35, (e.beta  || 0) * 0.7 - 10));
      mouseX.set(nx); mouseY.set(ny);
      tiltRawX.set(nx); tiltRawY.set(ny);
    };
    window.addEventListener('deviceorientation', handler, true);
    return () => window.removeEventListener('deviceorientation', handler, true);
  }, [mouseX, mouseY, tiltRawX, tiltRawY]);

  /* preload */
  useEffect(() => {
    GENRES.forEach(g => { const img = new Image(); img.src = g.bg; });
  }, []);

  const genre = GENRES[active];
  const R = 158;
  const labelPositions = GENRES.map((g, i) => {
    const angle = (i / GENRES.length) * 360 - 90;
    const rad = angle * Math.PI / 180;
    return { ...g, i, x: Math.cos(rad) * R, y: Math.sin(rad) * R };
  });

  return (
    <>
      {/* ── Genre cartoon reaction popup ── */}
      <AnimatePresence>
        {reaction && (
          <GenreReaction
            key={reaction.name}
            genreName={reaction.name}
            color={reaction.color}
            onDone={() => setReaction(null)}
          />
        )}
      </AnimatePresence>

      {/* ── glowing cursor dot ── */}
      <div
        className="fixed pointer-events-none z-[99999]"
        style={{ left: cursor.x, top: cursor.y, transform: 'translate(-50%,-50%)', opacity: cursor.visible ? 1 : 0, transition: 'opacity 0.2s' }}
      >
        <motion.div
          className="rounded-full"
          style={{ background: genre.color, boxShadow: `0 0 24px 6px ${genre.color}70`, mixBlendMode: 'screen' }}
          animate={{ width: [18, 26, 18], height: [18, 26, 18] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <section
        ref={containerRef}
        className="relative w-full min-h-screen overflow-hidden flex flex-col"
        style={{ cursor: 'none', perspective: '900px' }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchStart={onTouchStart}
        onClick={onSectionClick}
      >

        {/* ══ Ripple layer ══ */}
        <div className="absolute inset-0 pointer-events-none z-[50]">
          {ripples.map(rp => (
            <motion.div
              key={rp.id}
              className="absolute rounded-full border-2 pointer-events-none"
              style={{ left: rp.x, top: rp.y, borderColor: `${genre.color}55`, marginLeft: -5, marginTop: -5 }}
              initial={{ width: 10, height: 10, opacity: 0.8 }}
              animate={{ width: 240, height: 240, marginLeft: -120, marginTop: -120, opacity: 0 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
            />
          ))}
        </div>

        {/* ══ Spark layer ══ */}
        <div className="absolute inset-0 pointer-events-none z-[51]">
          {sparks.map(sp => (
            <motion.div
              key={sp.id}
              className="absolute w-2 h-2 rounded-full pointer-events-none"
              style={{ left: sp.x, top: sp.y, background: sp.color, boxShadow: `0 0 6px ${sp.color}` }}
              animate={{
                x: Math.cos(sp.angle * Math.PI / 180) * 65,
                y: Math.sin(sp.angle * Math.PI / 180) * 65,
                opacity: [1, 0], scale: [1, 0],
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          ))}
        </div>

        {/* ══ LAYER 1 — BG image ══ */}
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
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeInOut' }}
            />
          </AnimatePresence>
        </motion.div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/75 pointer-events-none z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/25 pointer-events-none z-[1]" />
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{ background: genre.color }}
            initial={{ opacity: 0 }} animate={{ opacity: 0.09 }} exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        </AnimatePresence>

        {/* ══ LAYER 2 — Floating particles ══ */}
        <motion.div className="absolute inset-0 pointer-events-none z-[2]" style={{ x: ptX, y: ptY }}>
          {PARTICLES.map(p => (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-white"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
              animate={{ y: [0, -55, 0], opacity: [0, p.opacity, 0] }}
              transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </motion.div>

        {/* ══ LAYER 3 — 3D floating rings (counter-parallax) ══ */}
        <motion.div className="absolute inset-0 pointer-events-none z-[3]" style={{ x: shpX, y: shpY }}>
          {[
            { size: 130, left: '7%',  top: '16%', dur: 18, delay: 0   },
            { size:  90, left: '86%', top: '20%', dur: 24, delay: 3   },
            { size:  60, left: '14%', top: '70%', dur: 20, delay: 6   },
            { size:  45, left: '80%', top: '72%', dur: 28, delay: 1.5 },
          ].map((s, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: s.size, height: s.size, left: s.left, top: s.top,
                border: `1px solid ${genre.color}22`,
                boxShadow: `0 0 16px ${genre.color}10`,
              }}
              animate={{ rotate: [0, 360], y: [0, -20, 0], scale: [1, 1.07, 1] }}
              transition={{
                rotate: { duration: s.dur, repeat: Infinity, ease: 'linear' },
                y:      { duration: s.dur * 0.55, repeat: Infinity, ease: 'easeInOut', delay: s.delay },
                scale:  { duration: s.dur * 0.45, repeat: Infinity, ease: 'easeInOut', delay: s.delay + 1 },
              }}
            />
          ))}
        </motion.div>

        {/* ══ LAYER 4 — Decorative text ══ */}
        <motion.div className="absolute inset-0 pointer-events-none z-[4] hidden lg:block" style={{ x: fgX, y: fgY }}>
          <p className="absolute top-24 left-24 text-white/10 text-xs tracking-[0.4em] font-semibold uppercase">Est. 2024</p>
          <p className="absolute top-24 right-10  text-white/10 text-xs tracking-[0.3em] uppercase">Read · Discover · Write</p>
          <p className="absolute bottom-32 left-24 text-white/8  text-xs tracking-[0.5em] uppercase rotate-90 origin-left">Fable</p>
        </motion.div>

        {/* ══ LAYER 5 — Left sidebar ══ */}
        <motion.div
          className="absolute left-7 top-1/2 -translate-y-1/2 z-[10] hidden lg:flex flex-col items-center gap-4"
          style={{ x: ptX, y: ptY }}
        >
          <p className="text-white/30 text-[10px] tracking-[0.4em] font-medium uppercase"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
            Your Reading Journey
          </p>
          <div className="w-px h-10 bg-white/15 mx-auto" />
          {['f', '𝕏', 'in', '@'].map((ic, i) => (
            <motion.a
              key={i} href="#"
              className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-white/35 text-[10px] font-bold"
              whileHover={{ scale: 1.3, borderColor: 'rgba(255,255,255,0.6)' }}
              whileTap={{ scale: 0.88 }}
            >{ic}</motion.a>
          ))}
        </motion.div>

        {/* ══ LAYER 6 — Central content with 3D tilt ══ */}
        <motion.div
          className="relative flex-1 flex flex-col items-center justify-center text-center z-[10] px-6 py-32"
          style={{ x: txX, y: txY, rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}
        >
          {/* ── Genre wheel ── */}
          <div className="relative mb-6" style={{ width: 380, height: 380 }}>

            {/* Outer ring — speeds up on hover */}
            <motion.svg
              viewBox="0 0 380 380"
              className="absolute inset-0 w-full h-full pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{ duration: ringSpeed, repeat: Infinity, ease: 'linear' }}
              onHoverStart={() => setRingSpeed(10)}
              onHoverEnd={() => setRingSpeed(45)}
            >
              <circle cx="190" cy="190" r="158" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1" strokeDasharray="4 14" />
              <circle cx="190" cy="190" r="128" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            </motion.svg>

            {/* Counter-rotating inner ring */}
            <motion.svg
              viewBox="0 0 380 380"
              className="absolute inset-0 w-full h-full pointer-events-none"
              animate={{ rotate: -360 }}
              transition={{ duration: 65, repeat: Infinity, ease: 'linear' }}
            >
              <circle cx="190" cy="190" r="100" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="2 18" />
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
                    onClick={(e) => {
                      e.stopPropagation();
                      setActive(idx);
                      spawnSparks(e.clientX, e.clientY, color);
                      setReaction(null);
                      setTimeout(() => setReaction({ name: name, color }), 50);
                    }}
                    whileHover={{ scale: 1.35 }}
                    whileTap={{ scale: 0.85 }}
                    className="font-black tracking-[0.18em] uppercase whitespace-nowrap px-2 py-1 rounded-lg"
                    style={{
                      fontSize: 13,
                      color: isActive ? color : 'rgba(255,255,255,0.50)',
                      textShadow: isActive ? `0 0 22px ${color}` : 'none',
                      background: isActive ? `${color}15` : 'transparent',
                      border: `1px solid ${isActive ? color + '40' : 'transparent'}`,
                      transition: 'color 0.3s, background 0.3s, text-shadow 0.3s, border-color 0.3s',
                    }}
                  >
                    {name}
                  </motion.button>
                </div>
              );
            })}

            {/* ── Central 3D badge ── */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 0.65, rotateY: -35, rotateX: 18 }}
                  animate={{ opacity: 1, scale: 1,    rotateY: 0,   rotateX: 0  }}
                  exit={{    opacity: 0, scale: 1.12, rotateY: 35               }}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                  className="relative"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Double glow pulse */}
                  <motion.div
                    className="absolute -inset-5 rounded-[24px]"
                    style={{ background: genre.color, filter: 'blur(18px)' }}
                    animate={{ scale: [1, 1.22, 1], opacity: [0.55, 0.12, 0.55] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="absolute -inset-9 rounded-[28px]"
                    style={{ background: genre.color, filter: 'blur(26px)' }}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.18, 0, 0.18] }}
                    transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                  />
                  {/* Badge */}
                  <motion.div
                    className="relative w-20 h-20 rounded-[20px] flex items-center justify-center overflow-hidden"
                    style={{
                      background: 'linear-gradient(155deg,#1e1b4b 0%,#3730a3 38%,#4f46e5 65%,#7c3aed 100%)',
                      boxShadow: `0 8px 32px rgba(79,70,229,0.65), 0 0 0 1px rgba(255,255,255,0.12) inset`,
                      border: `2px solid ${genre.color}55`,
                    }}
                    animate={{ rotateY: [0, 5, 0, -5, 0], rotateX: [0, -3, 0, 3, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    whileHover={{ scale: 1.14 }}
                    whileTap={{ scale: 0.92 }}
                  >
                    <div className="absolute top-0 inset-x-0 h-10 rounded-t-[20px]"
                      style={{ background: 'linear-gradient(180deg,rgba(255,255,255,0.18) 0%,transparent 100%)' }} />
                    <svg width="42" height="42" viewBox="0 0 21 21" fill="none">
                      <rect x="3.5" y="2.5"  width="4"    height="16"  rx="1.8" fill="white"/>
                      <rect x="3.5" y="2.5"  width="14"   height="4"   rx="1.8" fill="white"/>
                      <rect x="3.5" y="11"   width="9.5"  height="3.2" rx="1.5" fill="rgba(255,255,255,0.82)"/>
                      <rect x="5"   y="19.2" width="8"    height="1.2" rx="0.6" fill="rgba(255,255,255,0.22)"/>
                      <rect x="5.5" y="17.8" width="6.5"  height="1"   rx="0.5" fill="rgba(255,255,255,0.14)"/>
                    </svg>
                    <div className="absolute bottom-0 inset-x-0 h-8"
                      style={{ background: 'linear-gradient(0deg,rgba(0,0,0,0.3) 0%,transparent 100%)' }} />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Micro tagline */}
          <motion.p
            className="text-white/40 text-[10px] font-bold tracking-[0.45em] uppercase mb-3"
            animate={{ opacity: [0.4, 0.75, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            A Digital Library Experience
          </motion.p>

          {/* Main title */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={`title-${active}`}
              className="font-display font-black italic text-white leading-none mb-3 select-none"
              style={{ fontSize: 'clamp(52px, 9vw, 96px)' }}
              animate={{ textShadow: [
                `0 4px 40px rgba(0,0,0,0.7), 0 0 60px ${genre.color}20`,
                `0 4px 40px rgba(0,0,0,0.7), 0 0 80px ${genre.color}50`,
                `0 4px 40px rgba(0,0,0,0.7), 0 0 60px ${genre.color}20`,
              ]}}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              Fable
            </motion.h1>
          </AnimatePresence>

          {/* Genre tagline with blur transition */}
          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
              animate={{ opacity: 1,  y: 0,  filter: 'blur(0px)' }}
              exit={{    opacity: 0,  y: -14, filter: 'blur(8px)' }}
              transition={{ duration: 0.45 }}
              className="text-sm font-medium tracking-[0.3em] uppercase mb-8 italic"
              style={{ color: genre.color, textShadow: `0 0 24px ${genre.color}65` }}
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
                <motion.div whileHover={{ scale: 1.07, y: -3 }} whileTap={{ scale: 0.93 }}>
                  <Link
                    href={`/browse?genre=${genre.name}`}
                    className="inline-flex items-center gap-2 font-black text-xs tracking-widest uppercase px-8 py-3.5 rounded-full"
                    style={{
                      background: genre.color,
                      color: '#0f0e17',
                      boxShadow: `0 8px 30px ${genre.color}55, 0 2px 8px rgba(0,0,0,0.3)`,
                    }}
                  >
                    Explore {genre.name} <ArrowRight size={13} />
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            <motion.div whileHover={{ scale: 1.07, y: -3 }} whileTap={{ scale: 0.93 }}>
              <Link
                href="/browse"
                className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-bold px-8 py-3.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur transition-all"
              >
                Browse All
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* ══ Stats bar ══ */}
        <motion.div
          className="relative z-[15] border-t border-white/10 bg-black/35 backdrop-blur-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  whileHover={{ scale: 1.07 }}
                  className="flex items-center gap-2.5 cursor-default"
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
        </motion.div>

      </section>
    </>
  );
}

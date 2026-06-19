'use client';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const GENRE_CONFIG = {
  All:        { emoji: '✦',  color: '#818cf8', from: '#6366f1', to: '#8b5cf6' },
  Fiction:    { emoji: '📖', color: '#60a5fa', from: '#3b82f6', to: '#6366f1' },
  Mystery:    { emoji: '🔎', color: '#fbbf24', from: '#d97706', to: '#fbbf24' },
  Romance:    { emoji: '🌹', color: '#f472b6', from: '#db2777', to: '#f472b6' },
  'Sci-Fi':   { emoji: '🚀', color: '#34d399', from: '#059669', to: '#34d399' },
  Fantasy:    { emoji: '🐉', color: '#a78bfa', from: '#7c3aed', to: '#a78bfa' },
  Horror:     { emoji: '🕯️', color: '#f87171', from: '#dc2626', to: '#f87171' },
  Biography:  { emoji: '📜', color: '#fb923c', from: '#ea580c', to: '#fb923c' },
  'Self-Help':{ emoji: '🌱', color: '#4ade80', from: '#16a34a', to: '#4ade80' },
  History:    { emoji: '🏛️', color: '#fcd34d', from: '#b45309', to: '#fcd34d' },
  Poetry:     { emoji: '✍️', color: '#c084fc', from: '#9333ea', to: '#c084fc' },
  Thriller:   { emoji: '⚡', color: '#f97316', from: '#c2410c', to: '#f97316' },
  Adventure:  { emoji: '🗺️', color: '#86efac', from: '#15803d', to: '#86efac' },
};

export default function GenreStrip({ genres, active = '', onChange }) {
  const allGenres = ['', ...genres];
  const scrollRef  = useRef(null);
  const dragging   = useRef(false);
  const startX     = useRef(0);
  const scrollLeft = useRef(0);
  const moved      = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const onMouseDown = (e) => {
    dragging.current   = true;
    moved.current      = false;
    startX.current     = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    setIsDragging(true);
  };
  const onMouseMove = (e) => {
    if (!dragging.current) return;
    e.preventDefault();
    const x    = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.6;
    if (Math.abs(walk) > 4) moved.current = true;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };
  const onMouseUp = () => { dragging.current = false; setIsDragging(false); };

  const handleClick = (e, fn) => {
    if (moved.current) { e.preventDefault(); e.stopPropagation(); return; }
    fn();
  };

  return (
    <div
      className="relative"
      style={{
        background: 'linear-gradient(180deg,#0d0d1f 0%,#0a0a18 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Left/right fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg,#0a0a18 0%,transparent 100%)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(270deg,#0a0a18 0%,transparent 100%)' }} />

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto py-3.5 px-6 max-w-7xl mx-auto select-none"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {allGenres.map((g, i) => {
          const label    = g || 'All';
          const cfg      = GENRE_CONFIG[label] || GENRE_CONFIG.All;
          const isActive = g === active;

          return (
            <motion.button
              key={label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.025, duration: 0.22 }}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleClick(e, () => onChange(g))}
              className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold whitespace-nowrap flex-shrink-0 overflow-hidden transition-colors duration-200 select-none"
              style={{
                background: isActive
                  ? `linear-gradient(135deg, ${cfg.from}, ${cfg.to})`
                  : 'rgba(255,255,255,0.04)',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
                border: isActive
                  ? '1px solid transparent'
                  : `1px solid rgba(255,255,255,0.07)`,
                boxShadow: isActive
                  ? `0 0 18px ${cfg.color}55, 0 2px 8px rgba(0,0,0,0.4)`
                  : 'none',
              }}
            >
              {/* Hover glow overlay */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                style={{ background: `linear-gradient(135deg,${cfg.from}18,${cfg.to}12)` }}
              />

              {/* Shine sweep on active */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ x: '-100%', opacity: 0.6 }}
                  animate={{ x: '200%', opacity: 0 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)', width: '60%' }}
                />
              )}

              <span className="relative text-base leading-none">{cfg.emoji}</span>
              <span className="relative tracking-wide">{label}</span>

              {/* Active bottom bar */}
              {isActive && (
                <motion.div
                  layoutId="genre-indicator"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-4/5 rounded-full"
                  style={{ background: `linear-gradient(90deg,transparent,#fff,transparent)` }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

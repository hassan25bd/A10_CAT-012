'use client';
import { useRef } from 'react';
import { motion } from 'framer-motion';

const GENRE_EMOJIS = {
  All:       '✨',
  Fiction:   '📖',
  Mystery:   '🔍',
  Romance:   '💕',
  'Sci-Fi':  '🚀',
  Fantasy:   '🐉',
  Horror:    '👻',
  Biography: '🧑',
  'Self-Help':'🌱',
  History:   '🏛️',
  Poetry:    '✍️',
  Thriller:  '⚡',
  Adventure: '🗺️',
};

export default function GenreStrip({ genres, active = '', onChange }) {
  const allGenres = ['', ...genres];
  const scrollRef = useRef(null);

  return (
    <div className="bg-[#10111f] border-b border-white/5">
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto py-4 px-4 sm:px-6 lg:px-8 no-scrollbar max-w-7xl mx-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {allGenres.map((g, i) => {
          const label   = g || 'All';
          const isActive = g === active;
          const emoji   = GENRE_EMOJIS[label] || '📚';

          return (
            <motion.button
              key={label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.25 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onChange(g)}
              className="relative flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold tracking-wide whitespace-nowrap transition-all duration-200 flex-shrink-0 border"
              style={
                isActive
                  ? {
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      color: '#fff',
                      borderColor: 'transparent',
                      boxShadow: '0 4px 20px rgba(99,102,241,0.45)',
                    }
                  : {
                      background: 'rgba(255,255,255,0.04)',
                      color: 'rgba(255,255,255,0.55)',
                      borderColor: 'rgba(255,255,255,0.08)',
                    }
              }
            >
              <span className="text-sm leading-none">{emoji}</span>
              {label}
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', zIndex: -1 }}
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

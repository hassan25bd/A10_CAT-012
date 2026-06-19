'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

const GENRES = [
  { name: 'Fiction',    emoji: '📖', from: '#3B82F6', to: '#6366F1', light: '#EFF6FF' },
  { name: 'Mystery',   emoji: '🔍', from: '#F59E0B', to: '#EF4444', light: '#FFFBEB' },
  { name: 'Romance',   emoji: '💕', from: '#EC4899', to: '#F472B6', light: '#FDF2F8' },
  { name: 'Sci-Fi',    emoji: '🚀', from: '#06B6D4', to: '#3B82F6', light: '#ECFEFF' },
  { name: 'Fantasy',   emoji: '🐉', from: '#8B5CF6', to: '#6366F1', light: '#F5F3FF' },
  { name: 'Horror',    emoji: '👻', from: '#EF4444', to: '#7C3AED', light: '#FEF2F2' },
  { name: 'Biography', emoji: '🧑', from: '#F97316', to: '#FBBF24', light: '#FFF7ED' },
  { name: 'Self-Help', emoji: '🌱', from: '#10B981', to: '#34D399', light: '#ECFDF5' },
  { name: 'History',   emoji: '🏛️', from: '#D97706', to: '#F59E0B', light: '#FFFBEB' },
  { name: 'Poetry',    emoji: '✍️', from: '#7C3AED', to: '#A78BFA', light: '#F5F3FF' },
  { name: 'Thriller',  emoji: '⚡', from: '#EF4444', to: '#F97316', light: '#FEF2F2' },
  { name: 'Adventure', emoji: '🗺️', from: '#059669', to: '#0EA5E9', light: '#ECFDF5' },
];

function GenreCard({ genre, i }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.045, duration: 0.45 }}
      style={{ perspective: '600px' }}
    >
      <Link href={`/browse?genre=${genre.name}`}>
        <motion.div
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          animate={{
            rotateX: hovered ? -6 : 0,
            rotateY: hovered ? 8 : 0,
            scale: hovered ? 1.06 : 1,
            translateZ: hovered ? 20 : 0,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative flex flex-col items-center gap-3 p-5 rounded-3xl border overflow-hidden cursor-pointer"
          style={{
            background: hovered
              ? `linear-gradient(135deg, ${genre.from}, ${genre.to})`
              : genre.light,
            borderColor: hovered ? 'transparent' : `${genre.from}30`,
            boxShadow: hovered
              ? `0 20px 50px -10px ${genre.from}55, 0 8px 20px -4px ${genre.from}33`
              : '0 2px 12px -2px rgba(0,0,0,0.06)',
            transformStyle: 'preserve-3d',
            transition: 'background 0.3s, box-shadow 0.3s',
          }}
        >
          {/* Glare */}
          {hovered && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 60%)',
              }}
            />
          )}

          <motion.span
            animate={{ scale: hovered ? 1.2 : 1, rotateZ: hovered ? 8 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="text-4xl relative z-10"
            style={{ filter: hovered ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'none' }}
          >
            {genre.emoji}
          </motion.span>

          <span
            className="font-bold text-sm text-center relative z-10"
            style={{ color: hovered ? '#fff' : genre.from }}
          >
            {genre.name}
          </span>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function GenreGrid() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block text-indigo-600 text-xs font-bold tracking-widest uppercase mb-3 px-4 py-1.5 bg-indigo-50 rounded-full border border-indigo-100">
            Explore
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mt-2">Browse by Genre</h2>
          <p className="text-slate-500 mt-3 text-lg">Find the perfect story that matches your mood</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {GENRES.map((genre, i) => (
            <GenreCard key={genre.name} genre={genre} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

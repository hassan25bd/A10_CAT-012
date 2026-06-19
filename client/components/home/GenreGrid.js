'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

const GENRES = [
  { name: 'Fiction', emoji: '📖', color: 'from-blue-600/20 to-blue-800/20 border-blue-500/30 hover:border-blue-400' },
  { name: 'Mystery', emoji: '🔍', color: 'from-yellow-600/20 to-yellow-800/20 border-yellow-500/30 hover:border-yellow-400' },
  { name: 'Romance', emoji: '💕', color: 'from-pink-600/20 to-pink-800/20 border-pink-500/30 hover:border-pink-400' },
  { name: 'Sci-Fi', emoji: '🚀', color: 'from-cyan-600/20 to-cyan-800/20 border-cyan-500/30 hover:border-cyan-400' },
  { name: 'Fantasy', emoji: '🐉', color: 'from-purple-600/20 to-purple-800/20 border-purple-500/30 hover:border-purple-400' },
  { name: 'Horror', emoji: '👻', color: 'from-red-600/20 to-red-800/20 border-red-500/30 hover:border-red-400' },
  { name: 'Biography', emoji: '🧑', color: 'from-orange-600/20 to-orange-800/20 border-orange-500/30 hover:border-orange-400' },
  { name: 'Self-Help', emoji: '🌱', color: 'from-green-600/20 to-green-800/20 border-green-500/30 hover:border-green-400' },
  { name: 'History', emoji: '🏛️', color: 'from-amber-600/20 to-amber-800/20 border-amber-500/30 hover:border-amber-400' },
  { name: 'Poetry', emoji: '✍️', color: 'from-violet-600/20 to-violet-800/20 border-violet-500/30 hover:border-violet-400' },
  { name: 'Thriller', emoji: '⚡', color: 'from-rose-600/20 to-rose-800/20 border-rose-500/30 hover:border-rose-400' },
  { name: 'Adventure', emoji: '🗺️', color: 'from-emerald-600/20 to-emerald-800/20 border-emerald-500/30 hover:border-emerald-400' },
];

export default function GenreGrid() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <span className="text-primary-400 text-sm font-semibold tracking-widest uppercase">Explore</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mt-1">Browse by Genre</h2>
        <p className="text-gray-400 mt-2">Find the perfect story that matches your mood</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {GENRES.map((genre, i) => (
          <motion.div
            key={genre.name}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              href={`/browse?genre=${genre.name}`}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br ${genre.color} border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group`}
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">{genre.emoji}</span>
              <span className="text-white text-xs font-semibold text-center">{genre.name}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

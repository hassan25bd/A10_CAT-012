'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BookOpen, Star, DollarSign, CheckCircle } from 'lucide-react';

const GENRE_COLORS = {
  Fiction: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Mystery: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  Romance: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'Sci-Fi': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  Fantasy: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Horror: 'bg-red-500/20 text-red-300 border-red-500/30',
  Biography: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'Self-Help': 'bg-green-500/20 text-green-300 border-green-500/30',
  History: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  Poetry: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  Thriller: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  Adventure: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
};

export default function EbookCard({ ebook, purchased = false, index = 0 }) {
  const genreColor = GENRE_COLORS[ebook.genre] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative"
    >
      <Link href={`/ebooks/${ebook._id}`}>
        <div className="bg-dark-800 rounded-2xl overflow-hidden border border-gray-800/50 hover:border-primary-500/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary-600/15">
          {/* Cover Image */}
          <div className="relative h-56 bg-dark-700 overflow-hidden">
            {ebook.coverImage ? (
              <img
                src={ebook.coverImage}
                alt={ebook.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen size={48} className="text-gray-600" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-800/80 via-transparent to-transparent" />

            {/* Genre badge */}
            <div className="absolute top-3 left-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${genreColor}`}>
                {ebook.genre}
              </span>
            </div>

            {/* Purchased badge */}
            {purchased && (
              <div className="absolute top-3 right-3">
                <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/40">
                  <CheckCircle size={11} /> Owned
                </span>
              </div>
            )}

            {/* Sales count */}
            {ebook.salesCount > 0 && (
              <div className="absolute bottom-3 right-3">
                <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-black/40 text-gold-400">
                  <Star size={10} fill="currentColor" /> {ebook.salesCount} sold
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-4">
            <h3 className="font-display font-semibold text-white text-base line-clamp-2 mb-1 group-hover:text-primary-300 transition-colors">
              {ebook.title}
            </h3>
            <p className="text-gray-500 text-xs mb-3">by {ebook.writer?.name || 'Unknown'}</p>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-gold-400 font-bold text-lg">
                <DollarSign size={16} className="text-gold-500" />
                {Number(ebook.price).toFixed(2)}
              </span>
              <span className="text-xs text-primary-400 font-medium bg-primary-600/10 px-3 py-1 rounded-full border border-primary-500/20 group-hover:bg-primary-600/20 transition-colors">
                View Details
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

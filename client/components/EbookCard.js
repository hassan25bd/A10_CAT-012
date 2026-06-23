'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Star, CheckCircle } from 'lucide-react';

const GENRE_COLORS = {
  Fiction:    'bg-blue-100 text-blue-700 border-blue-200',
  Mystery:    'bg-amber-100 text-amber-700 border-amber-200',
  Romance:    'bg-pink-100 text-pink-700 border-pink-200',
  'Sci-Fi':   'bg-cyan-100 text-cyan-700 border-cyan-200',
  Fantasy:    'bg-violet-100 text-violet-700 border-violet-200',
  Horror:     'bg-red-100 text-red-700 border-red-200',
  Biography:  'bg-orange-100 text-orange-700 border-orange-200',
  'Self-Help':'bg-green-100 text-green-700 border-green-200',
  History:    'bg-yellow-100 text-yellow-700 border-yellow-200',
  Poetry:     'bg-purple-100 text-purple-700 border-purple-200',
  Thriller:   'bg-rose-100 text-rose-700 border-rose-200',
  Adventure:  'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export default function EbookCard({ ebook, purchased = false, index = 0, dark = false }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const genreColor = GENRE_COLORS[ebook.genre] || 'bg-slate-100 text-slate-600 border-slate-200';

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 14;
    const y = -((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const gx = ((e.clientX - rect.left) / rect.width) * 100;
    const gy = ((e.clientY - rect.top) / rect.height) * 100;
    setTilt({ x, y });
    setGlare({ x: gx, y: gy });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50 });
    setHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="group"
      style={{ perspective: '1000px' }}
    >
      <Link href={`/ebooks/${ebook._id}`}>
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={handleMouseLeave}
          className="relative rounded-3xl overflow-hidden cursor-pointer"
          style={{
            background: dark
              ? hovered
                ? 'linear-gradient(145deg,rgba(99,102,241,0.18),rgba(139,92,246,0.12))'
                : 'linear-gradient(145deg,rgba(255,255,255,0.06),rgba(99,102,241,0.08))'
              : '#ffffff',
            border: dark ? '1px solid rgba(255,255,255,0.10)' : '1px solid #f1f5f9',
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${hovered ? 'translateZ(10px)' : 'translateZ(0px)'}`,
            transition: hovered ? 'transform 0.08s ease, background 0.3s ease' : 'transform 0.4s ease, background 0.3s ease',
            boxShadow: dark
              ? hovered
                ? '0 20px 50px -10px rgba(99,102,241,0.35), 0 0 0 1px rgba(255,255,255,0.12) inset'
                : '0 4px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06) inset'
              : hovered
                ? '0 24px 60px -12px rgba(99,102,241,0.22), 0 8px 20px rgba(0,0,0,0.08)'
                : '0 4px 20px -4px rgba(99,102,241,0.10), 0 1px 4px rgba(0,0,0,0.05)',
          }}
        >
          {/* Glare overlay */}
          {hovered && (
            <div
              className="absolute inset-0 z-20 pointer-events-none rounded-3xl"
              style={{
                background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${dark ? 0.1 : 0.18}) 0%, transparent 60%)`,
              }}
            />
          )}

          {/* Cover Image */}
          <div className={`relative h-52 overflow-hidden ${dark ? 'bg-white/5' : 'bg-slate-100'}`}>
            {ebook.coverImage ? (
              <img
                src={ebook.coverImage}
                alt={ebook.title}
                className="w-full h-full object-cover group-hover:scale-105"
                style={{ transition: 'transform 0.6s ease' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen size={48} className={dark ? 'text-white/20' : 'text-slate-300'} />
              </div>
            )}
            <div className={`absolute inset-0 bg-gradient-to-t ${dark ? 'from-black/60 via-black/10' : 'from-black/30 via-transparent'} to-transparent`} />

            {/* Genre badge */}
            <div className="absolute top-3 left-3">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm ${
                dark ? 'bg-black/50 text-white border-white/20' : `bg-white/90 ${genreColor}`
              }`}>
                {ebook.genre}
              </span>
            </div>

            {purchased && (
              <div className="absolute top-3 right-3">
                <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/80 text-white backdrop-blur-sm">
                  <CheckCircle size={11} /> Owned
                </span>
              </div>
            )}

            {ebook.salesCount > 0 && (
              <div className="absolute bottom-3 right-3">
                <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-black/50 text-amber-300 backdrop-blur-sm font-medium">
                  <Star size={10} fill="currentColor" /> {ebook.salesCount} sold
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-5">
            <h3 className={`font-display font-bold text-base line-clamp-2 mb-1 leading-snug transition-colors ${
              dark ? 'text-white group-hover:text-violet-300' : 'text-slate-900 group-hover:text-indigo-600'
            }`}>
              {ebook.title}
            </h3>
            <p className={`text-xs mb-4 font-medium ${dark ? 'text-white/45' : 'text-slate-400'}`}>
              by {ebook.writer?.name || 'Unknown'}
            </p>

            <div className="flex items-center justify-between">
              <span className={`font-black text-xl ${dark ? 'text-white' : 'text-slate-900'}`}>
                ${Number(ebook.price).toFixed(2)}
              </span>
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${
                dark
                  ? 'text-violet-300 bg-violet-500/15 border-violet-500/25 group-hover:bg-violet-500/25'
                  : 'text-indigo-600 bg-indigo-50 border-indigo-100 group-hover:bg-indigo-100'
              }`}>
                View Details →
              </span>
            </div>
          </div>

          {/* Bottom accent bar */}
          <div className={`absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            dark
              ? 'bg-gradient-to-r from-violet-500 to-indigo-500'
              : 'bg-gradient-to-r from-indigo-400 to-violet-400'
          }`} />
        </div>
      </Link>
    </motion.div>
  );
}

'use client';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Star, BookOpen, Trophy } from 'lucide-react';
import API from '../../lib/api';

const FALLBACK_PHOTOS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&q=80',
];

const MEDAL_CONFIG = [
  { emoji: '🥇', label: '1st', bg: 'from-amber-400 to-yellow-300', ring: 'ring-amber-300' },
  { emoji: '🥈', label: '2nd', bg: 'from-slate-400 to-slate-300', ring: 'ring-slate-300' },
  { emoji: '🥉', label: '3rd', bg: 'from-orange-400 to-amber-300', ring: 'ring-orange-300' },
];

export default function TopWriters() {
  const { data = [] } = useQuery({
    queryKey: ['top-writers'],
    queryFn: () => API.get('/ebooks/top-writers').then((r) => r.data),
  });

  const placeholder = [
    { writer: { name: 'Sophia Rivers', avatar: '' }, sales: 93 },
    { writer: { name: 'Elena Hartwood', avatar: '' }, sales: 53 },
    { writer: { name: 'Marcus Chen', avatar: '' }, sales: 43 },
  ];

  const writers = data.length > 0 ? data : placeholder;

  return (
    <section className="py-24 bg-[#F8F7FF] relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full bg-indigo-100 blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-56 h-56 rounded-full bg-violet-100 blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-indigo-600 text-xs font-bold tracking-widest uppercase mb-3 px-4 py-1.5 bg-indigo-50 rounded-full border border-indigo-100">
            <Trophy size={12} /> Community
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mt-2">Top Writers</h2>
          <p className="text-slate-500 mt-3 text-lg">Authors who readers love most</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {writers.map(({ writer, sales }, i) => {
            const medal = MEDAL_CONFIG[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className={`bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow duration-300 relative overflow-hidden ${i === 0 ? 'md:scale-105 md:z-10' : ''}`}
              >
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${medal.bg}`} />

                <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r ${medal.bg} text-white mb-5 shadow-sm`}>
                  <span>{medal.emoji}</span> {medal.label} Place
                </div>

                <div className={`w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden ring-4 ${medal.ring} shadow-xl`}>
                  <img
                    src={writer.avatar || FALLBACK_PHOTOS[i]}
                    alt={writer.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = FALLBACK_PHOTOS[i]; }}
                  />
                </div>

                <h3 className="text-slate-900 font-bold text-xl mb-2">{writer.name}</h3>

                <div className="flex items-center justify-center gap-1.5 text-amber-500 mb-3">
                  <Star size={15} fill="currentColor" />
                  <span className="font-bold text-base">{sales}</span>
                  <span className="text-slate-400 text-sm font-medium">books sold</span>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs">
                  <BookOpen size={13} />
                  <span className="font-medium">Verified Author</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

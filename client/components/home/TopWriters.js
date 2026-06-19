'use client';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Star, BookOpen } from 'lucide-react';
import API from '../../lib/api';

const FALLBACK_PHOTOS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&q=80',
];

const medals = ['🥇', '🥈', '🥉'];

export default function TopWriters() {
  const { data = [], isLoading } = useQuery({
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
    <section className="py-20 bg-dark-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-gold-500 text-sm font-semibold tracking-widest uppercase">Community</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mt-1">Top Writers</h2>
          <p className="text-gray-400 mt-2">Authors who readers love most</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {writers.map(({ writer, sales }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`glass rounded-2xl p-6 text-center border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                i === 0 ? 'border-gold-500/30 hover:border-gold-500/50' : 'border-gray-700/50 hover:border-primary-500/30'
              }`}
            >
              <div className="text-3xl mb-3">{medals[i]}</div>
              <div className="w-20 h-20 rounded-full border-2 border-primary-500/40 mx-auto mb-3 overflow-hidden">
                <img
                  src={writer.avatar || FALLBACK_PHOTOS[i]}
                  alt={writer.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = FALLBACK_PHOTOS[i]; }}
                />
              </div>
              <h3 className="text-white font-semibold text-lg">{writer.name}</h3>
              <div className="flex items-center justify-center gap-1 mt-2 text-gold-400">
                <Star size={14} fill="currentColor" />
                <span className="text-sm font-medium">{sales} books sold</span>
              </div>
              <div className="mt-3 flex items-center justify-center gap-1 text-gray-500 text-xs">
                <BookOpen size={12} />
                <span>Verified Author</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

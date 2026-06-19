'use client';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Star, BookOpen, Award } from 'lucide-react';
import API from '../../lib/api';

export default function TopWriters() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['top-writers'],
    queryFn: () => API.get('/ebooks/top-writers').then((r) => r.data),
  });

  const placeholder = [
    { writer: { name: 'Elena Hartwood', avatar: '', email: 'writer1@fable.com' }, sales: 124 },
    { writer: { name: 'Marcus Chen', avatar: '', email: 'writer2@fable.com' }, sales: 98 },
    { writer: { name: 'Sophia Rivers', avatar: '', email: 'writer3@fable.com' }, sales: 76 },
  ];

  const writers = data.length > 0 ? data : placeholder;

  const medalColors = ['text-gold-400', 'text-gray-300', 'text-amber-600'];
  const medals = ['🥇', '🥈', '🥉'];

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
              <div className="w-16 h-16 rounded-full bg-primary-600/30 border-2 border-primary-500/40 flex items-center justify-center mx-auto mb-3 overflow-hidden">
                {writer.avatar ? (
                  <img src={writer.avatar} alt={writer.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-primary-300">{writer.name?.charAt(0)}</span>
                )}
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

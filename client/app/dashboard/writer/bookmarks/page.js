'use client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Bookmark } from 'lucide-react';
import API from '../../../../lib/api';
import EbookCard from '../../../../components/EbookCard';
import SkeletonCard from '../../../../components/SkeletonCard';

export default function WriterBookmarksPage() {
  const { data: bookmarks = [], isLoading } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => API.get('/users/bookmarks').then((r) => r.data),
  });

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-white mb-1">Bookmarks</h1>
        <p className="text-gray-400 text-sm mb-8">Ebooks you've saved for later</p>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="glass rounded-2xl border border-gray-700/50 p-16 text-center">
            <Bookmark size={48} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">No bookmarks yet</h3>
            <Link href="/browse" className="btn-primary mt-4">Browse Ebooks</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bookmarks.map((ebook, i) => <EbookCard key={ebook._id} ebook={ebook} index={i} />)}
          </div>
        )}
      </motion.div>
    </div>
  );
}

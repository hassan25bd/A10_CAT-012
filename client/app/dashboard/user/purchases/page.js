'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingBag, ExternalLink, LayoutGrid, List } from 'lucide-react';
import API from '../../../../lib/api';
import EbookCard from '../../../../components/EbookCard';
import { SkeletonTable } from '../../../../components/SkeletonCard';
import SkeletonCard from '../../../../components/SkeletonCard';

export default function PurchasesPage() {
  const [view, setView] = useState('table');

  const { data: purchases = [], isLoading } = useQuery({
    queryKey: ['purchases'],
    queryFn: () => API.get('/users/purchases').then((r) => r.data),
  });

  const ebooks = purchases.map((t) => t.ebook).filter(Boolean);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-1">
          <h1 className="font-display text-2xl font-bold text-white">Purchase History</h1>
          {/* View toggle */}
          {purchases.length > 0 && (
            <div className="flex items-center gap-1 bg-dark-800 border border-gray-700 rounded-xl p-1">
              <button
                onClick={() => setView('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  view === 'table' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <List size={13} /> Table
              </button>
              <button
                onClick={() => setView('gallery')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  view === 'gallery' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <LayoutGrid size={13} /> Gallery
              </button>
            </div>
          )}
        </div>
        <p className="text-gray-400 text-sm mb-8">All ebooks you've purchased</p>

        {isLoading ? (
          view === 'gallery' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="glass rounded-2xl border border-gray-700/50 p-6">
              <SkeletonTable rows={5} cols={5} />
            </div>
          )
        ) : purchases.length === 0 ? (
          <div className="glass rounded-2xl border border-gray-700/50 p-16 text-center">
            <ShoppingBag size={48} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">No purchases yet</h3>
            <p className="text-gray-400 text-sm mb-6">Start exploring and buy your first ebook!</p>
            <Link href="/browse" className="btn-primary">Browse Ebooks</Link>
          </div>
        ) : view === 'gallery' ? (
          /* ── Gallery View ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ebooks.map((ebook, i) => (
              <EbookCard key={ebook._id} ebook={ebook} purchased index={i} />
            ))}
          </div>
        ) : (
          /* ── Table View ── */
          <div className="glass rounded-2xl border border-gray-700/50 p-6">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Cover</th><th>Ebook</th><th>Writer</th><th>Price</th><th>Date</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((t, i) => (
                    <motion.tr key={t._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                      <td>
                        <div className="w-10 h-12 rounded-lg overflow-hidden bg-dark-700">
                          {t.ebook?.coverImage && <img src={t.ebook.coverImage} alt="" className="w-full h-full object-cover" />}
                        </div>
                      </td>
                      <td className="font-medium text-white">{t.ebook?.title || 'Unknown'}</td>
                      <td>{t.ebook?.writer?.name || '—'}</td>
                      <td className="text-gold-400 font-semibold">${Number(t.amount).toFixed(2)}</td>
                      <td>{new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td>
                        <Link href={`/ebooks/${t.ebook?._id}`} className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors">
                          Read <ExternalLink size={12} />
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

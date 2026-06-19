'use client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingBag, ExternalLink } from 'lucide-react';
import API from '../../../../lib/api';
import { SkeletonTable } from '../../../../components/SkeletonCard';

export default function PurchasesPage() {
  const { data: purchases = [], isLoading } = useQuery({
    queryKey: ['purchases'],
    queryFn: () => API.get('/users/purchases').then((r) => r.data),
  });

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-white mb-1">Purchase History</h1>
        <p className="text-gray-400 text-sm mb-8">All ebooks you've purchased</p>

        <div className="glass rounded-2xl border border-gray-700/50 p-6">
          {isLoading ? (
            <SkeletonTable rows={5} cols={5} />
          ) : purchases.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag size={48} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">No purchases yet</h3>
              <p className="text-gray-400 text-sm mb-6">Start exploring and buy your first ebook!</p>
              <Link href="/browse" className="btn-primary">Browse Ebooks</Link>
            </div>
          ) : (
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
          )}
        </div>
      </motion.div>
    </div>
  );
}

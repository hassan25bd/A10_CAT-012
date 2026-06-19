'use client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingBag, Bookmark, BookOpen, Clock } from 'lucide-react';
import API from '../../../lib/api';
import { useAuth } from '../../../lib/AuthContext';
import EbookCard from '../../../components/EbookCard';
import { SkeletonTable } from '../../../components/SkeletonCard';

export default function UserDashboard() {
  const { user } = useAuth();

  const { data: purchases = [], isLoading: loadPurchases } = useQuery({
    queryKey: ['purchases'],
    queryFn: () => API.get('/users/purchases').then((r) => r.data),
  });

  const { data: bookmarks = [] } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => API.get('/users/bookmarks').then((r) => r.data),
  });

  const stats = [
    { icon: ShoppingBag, label: 'Purchased', value: purchases.length, color: 'text-primary-400', bg: 'bg-primary-600/20' },
    { icon: Bookmark, label: 'Bookmarked', value: bookmarks.length, color: 'text-gold-400', bg: 'bg-gold-500/20' },
    { icon: BookOpen, label: 'Reading Now', value: Math.min(purchases.length, 1), color: 'text-emerald-400', bg: 'bg-emerald-600/20' },
  ];

  const recentPurchases = purchases.slice(0, 5);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-white mb-1">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-400 text-sm mb-8">Your reading dashboard</p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="stat-card"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent Purchases */}
        <div className="glass rounded-2xl border border-gray-700/50 p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Clock size={18} className="text-primary-400" /> Recent Purchases
            </h2>
            <Link href="/dashboard/user/purchases" className="text-xs text-primary-400 hover:text-primary-300">View all →</Link>
          </div>

          {loadPurchases ? (
            <SkeletonTable rows={3} cols={4} />
          ) : recentPurchases.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag size={36} className="text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No purchases yet</p>
              <Link href="/browse" className="btn-primary mt-4 text-sm">Browse Ebooks</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ebook</th><th>Writer</th><th>Price</th><th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPurchases.map((t) => (
                    <tr key={t._id}>
                      <td>
                        <Link href={`/ebooks/${t.ebook?._id}`} className="text-primary-300 hover:text-primary-200 font-medium">
                          {t.ebook?.title || 'Unknown'}
                        </Link>
                      </td>
                      <td>{t.ebook?.writer?.name || '—'}</td>
                      <td className="text-gold-400">${Number(t.amount).toFixed(2)}</td>
                      <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recently bookmarked */}
        {bookmarks.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <Bookmark size={18} className="text-gold-400" /> Bookmarked Ebooks
              </h2>
              <Link href="/dashboard/user/bookmarks" className="text-xs text-primary-400 hover:text-primary-300">View all →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookmarks.slice(0, 3).map((ebook, i) => (
                <EbookCard key={ebook._id} ebook={ebook} index={i} />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

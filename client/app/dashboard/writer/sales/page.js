'use client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign } from 'lucide-react';
import API from '../../../../lib/api';
import { SkeletonTable } from '../../../../components/SkeletonCard';

export default function SalesPage() {
  const { data: sales = [], isLoading } = useQuery({
    queryKey: ['writer-sales'],
    queryFn: () => API.get('/users/writer/sales').then((r) => r.data),
  });

  const totalRevenue = sales.reduce((s, t) => s + (t.amount || 0), 0);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-white mb-1">Sales History</h1>
        <p className="text-gray-400 text-sm mb-8">Track your ebook sales and revenue</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="stat-card">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center">
              <TrendingUp size={20} className="text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">{sales.length}</p>
            <p className="text-gray-400 text-sm">Total Sales</p>
          </div>
          <div className="stat-card">
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 flex items-center justify-center">
              <DollarSign size={20} className="text-gold-400" />
            </div>
            <p className="text-2xl font-bold text-white">${totalRevenue.toFixed(2)}</p>
            <p className="text-gray-400 text-sm">Total Revenue</p>
          </div>
        </div>

        <div className="glass rounded-2xl border border-gray-700/50 p-6">
          {isLoading ? (
            <SkeletonTable rows={5} cols={4} />
          ) : sales.length === 0 ? (
            <div className="text-center py-16">
              <TrendingUp size={48} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">No sales yet</h3>
              <p className="text-gray-400 text-sm">Publish your ebooks to start earning!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr><th>Ebook</th><th>Buyer</th><th>Amount</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {sales.map((s, i) => (
                    <motion.tr key={s._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                      <td className="font-medium text-white">{s.ebook?.title}</td>
                      <td>
                        <div>
                          <p className="text-gray-200">{s.user?.name}</p>
                          <p className="text-xs text-gray-500">{s.user?.email}</p>
                        </div>
                      </td>
                      <td className="text-gold-400 font-semibold">${Number(s.amount).toFixed(2)}</td>
                      <td>{new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
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

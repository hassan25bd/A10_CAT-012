'use client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CreditCard, DollarSign } from 'lucide-react';
import API from '../../../../lib/api';
import { SkeletonTable } from '../../../../components/SkeletonCard';

export default function TransactionsPage() {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['admin-transactions'],
    queryFn: () => API.get('/admin/transactions').then((r) => r.data),
  });

  const totalRevenue = transactions.filter((t) => t.status === 'completed').reduce((s, t) => s + t.amount, 0);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-white mb-1">All Transactions</h1>
        <p className="text-gray-400 text-sm mb-8">Full transaction history for the platform</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="stat-card">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center">
              <CreditCard size={20} className="text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">{transactions.length}</p>
            <p className="text-gray-400 text-sm">Total Transactions</p>
          </div>
          <div className="stat-card">
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 flex items-center justify-center">
              <DollarSign size={20} className="text-gold-400" />
            </div>
            <p className="text-2xl font-bold text-white">${totalRevenue.toFixed(2)}</p>
            <p className="text-gray-400 text-sm">Total Revenue</p>
          </div>
        </div>

        <div className="rounded-2xl p-6" style={{ background: 'rgba(20,8,14,0.92)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {isLoading ? (
            <SkeletonTable rows={6} cols={6} />
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr><th>ID</th><th>Type</th><th>User</th><th>Ebook</th><th>Amount</th><th>Status</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {transactions.map((t, i) => (
                    <motion.tr key={t._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                      <td className="font-mono text-xs text-gray-500">{t._id.slice(-8)}</td>
                      <td>
                        <span style={t.type === 'purchase'
                          ? { background: 'rgba(59,130,246,0.22)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.4)' }
                          : { background: 'rgba(168,85,247,0.22)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.4)' }}
                          className="text-xs font-bold px-3 py-1 rounded-full">
                          {t.type === 'purchase' ? 'Purchase' : 'Publishing Fee'}
                        </span>
                      </td>
                      <td>
                        <div>
                          <p className="text-gray-200 text-sm">{t.user?.name}</p>
                          <p className="text-xs text-gray-500">{t.user?.email}</p>
                        </div>
                      </td>
                      <td className="text-gray-300 text-sm">{t.ebook?.title || '—'}</td>
                      <td className="text-gold-400 font-semibold">${Number(t.amount).toFixed(2)}</td>
                      <td>
                        <span style={
                          t.status === 'completed'
                            ? { background: 'rgba(34,197,94,0.2)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.45)' }
                            : t.status === 'pending'
                            ? { background: 'rgba(234,179,8,0.2)', color: '#facc15', border: '1px solid rgba(234,179,8,0.45)' }
                            : { background: 'rgba(239,68,68,0.2)', color: '#f87171', border: '1px solid rgba(239,68,68,0.45)' }
                        } className="text-xs font-bold px-3 py-1 rounded-full capitalize">
                          {t.status}
                        </span>
                      </td>
                      <td className="text-gray-500 text-xs">{new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {transactions.length === 0 && (
                <div className="text-center py-10 text-gray-500">No transactions yet</div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

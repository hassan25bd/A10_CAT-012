'use client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookMarked, TrendingUp, DollarSign, Eye, PlusCircle } from 'lucide-react';
import API from '../../../lib/api';
import { useAuth } from '../../../lib/AuthContext';
import { SkeletonTable } from '../../../components/SkeletonCard';

export default function WriterDashboard() {
  const { user } = useAuth();

  const { data: ebooks = [], isLoading: loadEbooks } = useQuery({
    queryKey: ['writer-ebooks'],
    queryFn: () => API.get('/users/writer/ebooks').then((r) => r.data),
  });

  const { data: sales = [], isLoading: loadSales } = useQuery({
    queryKey: ['writer-sales'],
    queryFn: () => API.get('/users/writer/sales').then((r) => r.data),
  });

  const totalRevenue = sales.reduce((s, t) => s + (t.amount || 0), 0);
  const published = ebooks.filter((e) => e.status === 'published').length;

  const stats = [
    { icon: BookMarked, label: 'Total Ebooks', value: ebooks.length, color: 'text-primary-400', bg: 'bg-primary-600/20' },
    { icon: Eye, label: 'Published', value: published, color: 'text-emerald-400', bg: 'bg-emerald-600/20' },
    { icon: TrendingUp, label: 'Total Sales', value: sales.length, color: 'text-blue-400', bg: 'bg-blue-600/20' },
    { icon: DollarSign, label: 'Revenue', value: `$${totalRevenue.toFixed(2)}`, color: 'text-gold-400', bg: 'bg-gold-500/20' },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Writer Dashboard</h1>
            <p className="text-gray-400 text-sm">Hello, {user?.name}! Manage your ebooks</p>
          </div>
          <Link href="/dashboard/writer/ebooks/add" className="btn-primary text-sm">
            <PlusCircle size={16} /> New Ebook
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="rounded-2xl p-6 flex flex-col gap-3 border border-white/8"
              style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.12) 0%,rgba(139,92,246,0.08) 100%)', backdropFilter: 'blur(12px)' }}
            >
              <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <p className="text-3xl font-black text-white">{stat.value}</p>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent Ebooks */}
        <div className="rounded-2xl border border-white/8 p-6 mb-6"
          style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(99,102,241,0.06) 100%)', backdropFilter: 'blur(12px)' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold">My Recent Ebooks</h2>
            <Link href="/dashboard/writer/ebooks" className="text-xs text-primary-400 hover:text-primary-300">View all →</Link>
          </div>
          {loadEbooks ? (
            <SkeletonTable rows={3} cols={4} />
          ) : ebooks.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">You haven't published any ebooks yet.</p>
              <Link href="/dashboard/writer/ebooks/add" className="btn-primary text-sm">Add Your First Ebook</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    {['Title','Price','Status','Sales'].map(h => (
                      <th key={h} className="text-left text-gray-500 font-medium py-3 px-4 border-b border-white/8">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ebooks.slice(0, 5).map((eb) => (
                    <tr key={eb._id} className="hover:bg-white/4 transition-colors">
                      <td className="py-3 px-4 font-medium text-white border-b border-white/5">{eb.title}</td>
                      <td className="py-3 px-4 text-amber-400 font-bold border-b border-white/5">${Number(eb.price).toFixed(2)}</td>
                      <td className="py-3 px-4 border-b border-white/5">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${eb.status === 'published' ? 'bg-green-500/20 text-green-300 border border-green-500/20' : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/20'}`}>
                          {eb.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-300 border-b border-white/5">{eb.salesCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Sales */}
        <div className="rounded-2xl border border-white/8 p-6"
          style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(99,102,241,0.06) 100%)', backdropFilter: 'blur(12px)' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold">Recent Sales</h2>
            <Link href="/dashboard/writer/sales" className="text-xs text-primary-400 hover:text-primary-300">View all →</Link>
          </div>
          {loadSales ? (
            <SkeletonTable rows={3} cols={4} />
          ) : sales.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No sales yet. Keep publishing!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    {['Ebook','Buyer','Amount','Date'].map(h => (
                      <th key={h} className="text-left text-gray-500 font-medium py-3 px-4 border-b border-white/8">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sales.slice(0, 5).map((s) => (
                    <tr key={s._id} className="hover:bg-white/4 transition-colors">
                      <td className="py-3 px-4 text-white font-medium border-b border-white/5">{s.ebook?.title}</td>
                      <td className="py-3 px-4 text-gray-400 border-b border-white/5">{s.user?.name || s.user?.email}</td>
                      <td className="py-3 px-4 text-amber-400 font-bold border-b border-white/5">${Number(s.amount).toFixed(2)}</td>
                      <td className="py-3 px-4 text-gray-400 border-b border-white/5">{new Date(s.createdAt).toLocaleDateString()}</td>
                    </tr>
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

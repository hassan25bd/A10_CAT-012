'use client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, BookOpen, DollarSign, TrendingUp } from 'lucide-react';
import API from '../../../lib/api';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const COLORS = ['#7c3aed', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#a855f7', '#14b8a6'];

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => API.get('/admin/stats').then((r) => r.data),
  });

  const statCards = [
    { icon: Users, label: 'Total Users', value: stats?.totalUsers || 0, color: 'text-blue-400', bg: 'bg-blue-600/20', change: '+12%' },
    { icon: TrendingUp, label: 'Total Writers', value: stats?.totalWriters || 0, color: 'text-emerald-400', bg: 'bg-emerald-600/20', change: '+8%' },
    { icon: BookOpen, label: 'Published Ebooks', value: stats?.totalEbooks || 0, color: 'text-primary-400', bg: 'bg-primary-600/20', change: '+23%' },
    { icon: DollarSign, label: 'Total Revenue', value: `$${Number(stats?.totalRevenue || 0).toFixed(2)}`, color: 'text-gold-400', bg: 'bg-gold-500/20', change: '+18%' },
  ];

  const chartData = (stats?.monthlySales || []).map((m) => ({
    month: MONTHS[m._id.month - 1],
    sales: m.sales,
    revenue: m.revenue,
  }));

  const genreData = (stats?.genreData || []).map((g) => ({ name: g._id, value: g.count }));

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-white mb-1">Analytics Overview</h1>
        <p className="text-gray-400 text-sm mb-8">Platform-wide statistics and insights</p>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="stat-card">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <s.icon size={20} className={s.color} />
                </div>
                <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">{s.change}</span>
              </div>
              {isLoading ? (
                <div className="h-8 skeleton rounded-lg w-20" />
              ) : (
                <p className="text-2xl font-bold text-white">{s.value}</p>
              )}
              <p className="text-gray-400 text-sm">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Sales Chart */}
          <div className="lg:col-span-2 glass rounded-2xl border border-gray-700/50 p-6">
            <h3 className="text-white font-semibold mb-6">Monthly Sales & Revenue</h3>
            {chartData.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-gray-500 text-sm">No sales data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#6b7280" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: '#1a1830', border: '1px solid #374151', borderRadius: '12px', color: '#e8e8f0' }} />
                  <Area type="monotone" dataKey="sales" stroke="#7c3aed" fill="url(#salesGrad)" strokeWidth={2} name="Sales" />
                  <Area type="monotone" dataKey="revenue" stroke="#f59e0b" fill="url(#revenueGrad)" strokeWidth={2} name="Revenue ($)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Genre Pie Chart */}
          <div className="glass rounded-2xl border border-gray-700/50 p-6">
            <h3 className="text-white font-semibold mb-6">Ebooks by Genre</h3>
            {genreData.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-gray-500 text-sm">No genre data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={genreData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {genreData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1a1830', border: '1px solid #374151', borderRadius: '12px', color: '#e8e8f0' }} />
                  <Legend formatter={(v) => <span style={{ color: '#9ca3af', fontSize: '11px' }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

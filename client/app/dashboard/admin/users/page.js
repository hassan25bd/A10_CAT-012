'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, Trash2, Shield, Search } from 'lucide-react';
import API from '../../../../lib/api';
import toast from 'react-hot-toast';
import { SkeletonTable } from '../../../../components/SkeletonCard';

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => API.get('/users').then((r) => r.data),
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }) => API.patch(`/users/${id}/role`, { role }),
    onSuccess: () => { queryClient.invalidateQueries(['admin-users']); toast.success('Role updated'); },
    onError: () => toast.error('Failed to update role'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => API.delete(`/users/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['admin-users']); toast.success('User deleted'); setConfirmDelete(null); },
    onError: () => toast.error('Failed to delete user'),
  });

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-white mb-1">Manage Users</h1>
        <p className="text-gray-400 text-sm mb-8">{users.length} registered users</p>

        <div className="glass rounded-2xl border border-gray-700/50 p-6">
          <div className="relative mb-6">
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full max-w-sm input-field"
            />
          </div>

          {isLoading ? (
            <SkeletonTable rows={6} cols={5} />
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr><th>User</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => (
                    <motion.tr key={u._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-600/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full object-cover" /> : <span className="text-xs font-bold text-primary-300">{u.name?.charAt(0)}</span>}
                          </div>
                          <span className="text-white font-medium">{u.name}</span>
                        </div>
                      </td>
                      <td className="text-gray-400">{u.email}</td>
                      <td>
                        <select
                          value={u.role}
                          onChange={(e) => roleMutation.mutate({ id: u._id, role: e.target.value })}
                          className="bg-dark-700 border border-gray-700 text-white rounded-lg px-2 py-1 text-xs outline-none cursor-pointer hover:border-primary-500 transition-colors"
                        >
                          <option value="user">User</option>
                          <option value="writer">Writer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="text-gray-500 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button onClick={() => setConfirmDelete(u)} className="p-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-10 text-gray-500">No users match your search</div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass border border-gray-700 rounded-2xl p-8 max-w-sm w-full text-center">
            <Trash2 size={36} className="text-red-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold text-lg mb-2">Delete User?</h3>
            <p className="text-gray-400 text-sm mb-1">{confirmDelete.name}</p>
            <p className="text-gray-500 text-xs mb-6">{confirmDelete.email}</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={() => deleteMutation.mutate(confirmDelete._id)} disabled={deleteMutation.isPending} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { PlusCircle, Edit2, Trash2, Eye, EyeOff, BookMarked } from 'lucide-react';
import { useState } from 'react';
import API from '../../../../lib/api';
import toast from 'react-hot-toast';
import { SkeletonTable } from '../../../../components/SkeletonCard';

export default function WriterEbooksPage() {
  const queryClient = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { data: ebooks = [], isLoading } = useQuery({
    queryKey: ['writer-ebooks'],
    queryFn: () => API.get('/users/writer/ebooks').then((r) => r.data),
  });

  const publishMutation = useMutation({
    mutationFn: (id) => API.patch(`/ebooks/${id}/publish`),
    onSuccess: () => { queryClient.invalidateQueries(['writer-ebooks']); toast.success('Status updated'); },
    onError: () => toast.error('Failed to update status'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => API.delete(`/ebooks/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['writer-ebooks']); toast.success('Ebook deleted'); setConfirmDelete(null); },
    onError: () => toast.error('Failed to delete'),
  });

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">My Ebooks</h1>
            <p className="text-gray-400 text-sm">{ebooks.length} total ebooks</p>
          </div>
          <Link href="/dashboard/writer/ebooks/add" className="btn-primary text-sm">
            <PlusCircle size={16} /> Add New Ebook
          </Link>
        </div>

        <div className="glass rounded-2xl border border-gray-700/50 overflow-hidden">
          {isLoading ? (
            <div className="p-6"><SkeletonTable rows={5} cols={5} /></div>
          ) : ebooks.length === 0 ? (
            <div className="text-center py-20">
              <BookMarked size={48} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">No ebooks yet</h3>
              <p className="text-gray-400 text-sm mb-6">Start sharing your stories with the world.</p>
              <Link href="/dashboard/writer/ebooks/add" className="btn-primary text-sm">Add Your First Ebook</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Cover</th><th>Title</th><th>Genre</th><th>Price</th><th>Status</th><th>Sales</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ebooks.map((eb, i) => (
                    <motion.tr key={eb._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                      <td>
                        <div className="w-10 h-12 rounded-lg overflow-hidden bg-dark-700 flex-shrink-0">
                          {eb.coverImage && <img src={eb.coverImage} alt="" className="w-full h-full object-cover" />}
                        </div>
                      </td>
                      <td className="font-medium text-white max-w-xs">
                        <p className="truncate">{eb.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{new Date(eb.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td><span className="genre-badge">{eb.genre}</span></td>
                      <td className="text-gold-400 font-semibold">${Number(eb.price).toFixed(2)}</td>
                      <td>
                        <span style={eb.status === 'published'
                          ? { background: 'rgba(34,197,94,0.2)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.45)' }
                          : { background: 'rgba(234,179,8,0.2)', color: '#facc15', border: '1px solid rgba(234,179,8,0.45)' }}
                          className="text-xs px-3 py-1 rounded-full font-bold capitalize">
                          {eb.status}
                        </span>
                      </td>
                      <td className="text-gray-300">{eb.salesCount}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Link href={`/dashboard/writer/ebooks/edit/${eb._id}`} className="p-1.5 rounded-lg bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition-colors" title="Edit">
                            <Edit2 size={14} />
                          </Link>
                          <button onClick={() => publishMutation.mutate(eb._id)} className="p-1.5 rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-colors" title={eb.status === 'published' ? 'Unpublish' : 'Publish'}>
                            {eb.status === 'published' ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                          <button onClick={() => setConfirmDelete(eb._id)} className="p-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass border border-gray-700 rounded-2xl p-8 max-w-sm w-full text-center">
            <Trash2 size={36} className="text-red-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold text-lg mb-2">Delete Ebook?</h3>
            <p className="text-gray-400 text-sm mb-6">This action cannot be undone. The ebook will be permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={() => deleteMutation.mutate(confirmDelete)} disabled={deleteMutation.isPending} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Eye, EyeOff, ImageIcon, Check, X } from 'lucide-react';
import API from '../../../../lib/api';
import toast from 'react-hot-toast';
import { SkeletonTable } from '../../../../components/SkeletonCard';

export default function AdminEbooksPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [coverEdit, setCoverEdit] = useState(null); // { id, url }

  const coverMutation = useMutation({
    mutationFn: ({ id, url }) => API.patch(`/ebooks/${id}/cover`, { coverImage: url }),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-ebooks']);
      toast.success('Cover image updated!');
      setCoverEdit(null);
    },
    onError: () => toast.error('Failed to update cover'),
  });

  const { data: ebooks = [], isLoading } = useQuery({
    queryKey: ['admin-ebooks'],
    queryFn: () => API.get('/admin/ebooks').then((r) => r.data),
  });

  const publishMutation = useMutation({
    mutationFn: (id) => API.patch(`/ebooks/${id}/publish`),
    onSuccess: () => { queryClient.invalidateQueries(['admin-ebooks']); toast.success('Status updated'); },
    onError: () => toast.error('Failed to update status'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => API.delete(`/ebooks/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['admin-ebooks']); toast.success('Ebook deleted'); setConfirmDelete(null); },
    onError: () => toast.error('Failed to delete ebook'),
  });

  const filtered = ebooks.filter(
    (e) =>
      e.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.writer?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-white mb-1">Manage All Ebooks</h1>
        <p className="text-gray-400 text-sm mb-8">{ebooks.length} total ebooks in the platform</p>

        <div className="glass rounded-2xl border border-gray-700/50 p-6">
          <div className="relative mb-6">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title or writer..." className="w-full max-w-sm input-field" />
          </div>

          {isLoading ? (
            <SkeletonTable rows={6} cols={6} />
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr><th>Cover</th><th>Title</th><th>Writer</th><th>Price</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filtered.map((eb, i) => (
                    <>
                    <motion.tr key={eb._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                      <td>
                        <div className="w-10 h-12 rounded-lg overflow-hidden bg-dark-700">
                          {eb.coverImage && <img src={eb.coverImage} alt="" className="w-full h-full object-cover" />}
                        </div>
                      </td>
                      <td className="font-medium text-white max-w-xs">
                        <p className="truncate">{eb.title}</p>
                        <span className="genre-badge text-xs">{eb.genre}</span>
                      </td>
                      <td>
                        <div>
                          <p className="text-gray-200">{eb.writer?.name}</p>
                          <p className="text-xs text-gray-500">{eb.writer?.email}</p>
                        </div>
                      </td>
                      <td className="text-gold-400 font-semibold">${Number(eb.price).toFixed(2)}</td>
                      <td>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${eb.status === 'published' ? 'bg-green-500/15 text-green-300' : 'bg-yellow-500/15 text-yellow-300'}`}>
                          {eb.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button onClick={() => publishMutation.mutate(eb._id)} className="p-1.5 rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-colors" title={eb.status === 'published' ? 'Unpublish' : 'Publish'}>
                            {eb.status === 'published' ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                          <button
                            onClick={() => setCoverEdit(coverEdit?.id === eb._id ? null : { id: eb._id, url: eb.coverImage || '' })}
                            className={`p-1.5 rounded-lg transition-colors ${coverEdit?.id === eb._id ? 'bg-indigo-500/30 text-indigo-300' : 'bg-indigo-500/15 text-indigo-400 hover:bg-indigo-500/25'}`}
                            title="Change cover image"
                          >
                            <ImageIcon size={14} />
                          </button>
                          <button onClick={() => setConfirmDelete(eb)} className="p-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                    <AnimatePresence>
                      {coverEdit?.id === eb._id && (
                        <motion.tr
                          key={`cover-edit-${eb._id}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <td colSpan={6} className="py-2 px-3">
                            <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-3">
                              {coverEdit.url && (
                                <img src={coverEdit.url} alt="" className="w-10 h-12 rounded-lg object-cover flex-shrink-0 border border-white/10" onError={(e) => e.target.style.display='none'} />
                              )}
                              <input
                                autoFocus
                                type="url"
                                value={coverEdit.url}
                                onChange={(e) => setCoverEdit(prev => ({ ...prev, url: e.target.value }))}
                                placeholder="Paste image URL (Unsplash, any direct image link)…"
                                className="flex-1 bg-dark-800 text-white text-sm px-3 py-2 rounded-lg border border-gray-600 focus:border-indigo-500 focus:outline-none"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') coverMutation.mutate({ id: eb._id, url: coverEdit.url });
                                  if (e.key === 'Escape') setCoverEdit(null);
                                }}
                              />
                              <button
                                onClick={() => coverMutation.mutate({ id: eb._id, url: coverEdit.url })}
                                disabled={!coverEdit.url || coverMutation.isPending}
                                className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition-colors"
                              >
                                <Check size={14} />
                              </button>
                              <button onClick={() => setCoverEdit(null)} className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors">
                                <X size={14} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                    </>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-10 text-gray-500">No ebooks found</div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass border border-gray-700 rounded-2xl p-8 max-w-sm w-full text-center">
            <Trash2 size={36} className="text-red-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Delete Ebook?</h3>
            <p className="text-gray-400 text-sm mb-6">"{confirmDelete.title}" will be permanently removed.</p>
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

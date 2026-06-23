'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Eye, EyeOff, ImageIcon, Check, X } from 'lucide-react';
import API from '../../../../lib/api';
import toast from 'react-hot-toast';
import { SkeletonTable } from '../../../../components/SkeletonCard';

const DARK = { background: 'rgba(20,8,14,0.92)', border: '1px solid rgba(255,255,255,0.08)' };

export default function AdminEbooksPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [coverEdit, setCoverEdit] = useState(null);

  const coverMutation = useMutation({
    mutationFn: ({ id, url }) => API.patch(`/ebooks/${id}/cover`, { coverImage: url }),
    onSuccess: () => { queryClient.invalidateQueries(['admin-ebooks']); toast.success('Cover updated!'); setCoverEdit(null); },
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
    (e) => e.title?.toLowerCase().includes(search.toLowerCase()) || e.writer?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-white mb-1">Manage All Ebooks</h1>
        <p className="text-gray-400 text-sm mb-8">{ebooks.length} total ebooks in the platform</p>

        <div className="rounded-2xl p-6" style={DARK}>
          {/* Search */}
          <div className="mb-6">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or writer..."
              className="w-full max-w-sm rounded-xl px-4 py-2.5 text-sm font-medium outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#f3f4f6' }}
            />
          </div>

          {isLoading ? <SkeletonTable rows={6} cols={6} /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {['Cover','Title','Writer','Price','Status','Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-4 font-medium" style={{ color: '#9ca3af' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((eb, i) => (
                    <>
                      <motion.tr
                        key={eb._id}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                        className="hover:bg-white/[0.03] transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="w-10 h-12 rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                            {eb.coverImage && <img src={eb.coverImage} alt="" className="w-full h-full object-cover" />}
                          </div>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <p className="font-semibold text-white truncate">{eb.title}</p>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block"
                            style={{ background: 'rgba(225,29,72,0.18)', color: '#fb7185', border: '1px solid rgba(225,29,72,0.3)' }}>
                            {eb.genre}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-gray-200 text-sm">{eb.writer?.name}</p>
                          <p className="text-xs text-gray-500">{eb.writer?.email}</p>
                        </td>
                        <td className="py-3 px-4 font-semibold" style={{ color: '#fbbf24' }}>${Number(eb.price).toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className="text-xs px-3 py-1 rounded-full font-bold capitalize" style={
                            eb.status === 'published'
                              ? { background: 'rgba(34,197,94,0.18)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.4)' }
                              : { background: 'rgba(234,179,8,0.18)', color: '#facc15', border: '1px solid rgba(234,179,8,0.4)' }
                          }>{eb.status}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => publishMutation.mutate(eb._id)}
                              title={eb.status === 'published' ? 'Unpublish' : 'Publish'}
                              className="p-1.5 rounded-lg transition-colors"
                              style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80' }}
                            >
                              {eb.status === 'published' ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                            <button
                              onClick={() => setCoverEdit(coverEdit?.id === eb._id ? null : { id: eb._id, url: eb.coverImage || '' })}
                              title="Change cover image"
                              className="p-1.5 rounded-lg transition-colors"
                              style={{ background: coverEdit?.id === eb._id ? 'rgba(225,29,72,0.3)' : 'rgba(225,29,72,0.15)', color: '#fb7185' }}
                            >
                              <ImageIcon size={14} />
                            </button>
                            <button
                              onClick={() => setConfirmDelete(eb)}
                              className="p-1.5 rounded-lg transition-colors"
                              style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                      <AnimatePresence>
                        {coverEdit?.id === eb._id && (
                          <motion.tr key={`cover-edit-${eb._id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <td colSpan={6} className="px-4 py-2">
                              <div className="flex items-center gap-2 rounded-xl p-3"
                                style={{ background: 'rgba(225,29,72,0.08)', border: '1px solid rgba(225,29,72,0.25)' }}>
                                {coverEdit.url && (
                                  <img src={coverEdit.url} alt="" className="w-10 h-12 rounded-lg object-cover flex-shrink-0"
                                    style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                                    onError={(e) => e.target.style.display='none'} />
                                )}
                                <input
                                  autoFocus type="url" value={coverEdit.url}
                                  onChange={(e) => setCoverEdit(prev => ({ ...prev, url: e.target.value }))}
                                  placeholder="Paste image URL…"
                                  className="flex-1 text-sm px-3 py-2 rounded-lg outline-none"
                                  style={{ background: 'rgba(255,255,255,0.07)', color: '#f3f4f6', border: '1px solid rgba(255,255,255,0.12)' }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') coverMutation.mutate({ id: eb._id, url: coverEdit.url });
                                    if (e.key === 'Escape') setCoverEdit(null);
                                  }}
                                />
                                <button
                                  onClick={() => coverMutation.mutate({ id: eb._id, url: coverEdit.url })}
                                  disabled={!coverEdit.url || coverMutation.isPending}
                                  className="p-2 rounded-lg text-white disabled:opacity-40 transition-colors"
                                  style={{ background: '#e11d48' }}
                                >
                                  <Check size={14} />
                                </button>
                                <button onClick={() => setCoverEdit(null)} className="p-2 rounded-lg transition-colors"
                                  style={{ background: 'rgba(255,255,255,0.08)', color: '#9ca3af' }}>
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
              {filtered.length === 0 && <div className="text-center py-10 text-gray-500">No ebooks found</div>}
            </div>
          )}
        </div>
      </motion.div>

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl p-8 max-w-sm w-full text-center"
            style={{ background: '#1e0b12', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Trash2 size={36} className="text-red-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Delete Ebook?</h3>
            <p className="text-gray-400 text-sm mb-6">"{confirmDelete.title}" will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-xl py-2.5 font-semibold transition-colors text-sm"
                style={{ background: 'rgba(255,255,255,0.08)', color: '#d1d5db', border: '1px solid rgba(255,255,255,0.1)' }}>
                Cancel
              </button>
              <button onClick={() => deleteMutation.mutate(confirmDelete._id)} disabled={deleteMutation.isPending}
                className="flex-1 rounded-xl py-2.5 font-semibold text-white text-sm transition-colors disabled:opacity-50"
                style={{ background: '#dc2626' }}>
                {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

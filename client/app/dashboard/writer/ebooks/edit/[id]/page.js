'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import API from '../../../../../../lib/api';
import EbookForm from '../../../../../../components/dashboard/EbookForm';
import toast from 'react-hot-toast';

export default function EditEbookPage({ params }) {
  const { id } = params;
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: ebook, isLoading } = useQuery({
    queryKey: ['ebook', id],
    queryFn: () => API.get(`/ebooks/${id}`).then((r) => r.data),
  });

  const mutation = useMutation({
    mutationFn: (data) => API.put(`/ebooks/${id}`, data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries(['writer-ebooks']);
      queryClient.invalidateQueries(['ebook', id]);
      toast.success('Ebook updated!');
      router.push('/dashboard/writer/ebooks');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update ebook'),
  });

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
        <Link href="/dashboard/writer/ebooks" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to My Ebooks
        </Link>
        <h1 className="font-display text-2xl font-bold text-white mb-1">Edit Ebook</h1>
        <p className="text-gray-400 text-sm mb-8">Update your ebook details</p>

        <div className="glass rounded-2xl border border-gray-700/50 p-8">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-12 skeleton rounded-xl" />)}
            </div>
          ) : ebook ? (
            <EbookForm initialData={ebook} onSubmit={mutation.mutate} loading={mutation.isPending} />
          ) : (
            <p className="text-red-400">Ebook not found</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

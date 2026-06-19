'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import API from '../../../../../lib/api';
import EbookForm from '../../../../../components/dashboard/EbookForm';
import toast from 'react-hot-toast';

export default function AddEbookPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data) => API.post('/ebooks', data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries(['writer-ebooks']);
      toast.success('Ebook created! You can now publish it.');
      router.push('/dashboard/writer/ebooks');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create ebook'),
  });

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
        <Link href="/dashboard/writer/ebooks" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to My Ebooks
        </Link>
        <h1 className="font-display text-2xl font-bold text-white mb-1">Add New Ebook</h1>
        <p className="text-gray-400 text-sm mb-8">Fill in the details below to create your ebook</p>

        <div className="glass rounded-2xl border border-gray-700/50 p-8">
          <EbookForm onSubmit={mutation.mutate} loading={mutation.isPending} />
        </div>
      </motion.div>
    </div>
  );
}

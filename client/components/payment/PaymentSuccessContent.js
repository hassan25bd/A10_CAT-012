'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, BookOpen, ArrowRight, Home } from 'lucide-react';
import API from '../../lib/api';
import { useAuth } from '../../lib/AuthContext';
import toast from 'react-hot-toast';

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { user } = useAuth();
  const [verified, setVerified] = useState(false);
  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId && user) {
      API.get(`/stripe/verify/${sessionId}`)
        .then((res) => {
          setVerified(true);
          setEbook(res.data.transaction?.ebook);
          toast.success('Payment successful! Enjoy your ebook.');
        })
        .catch(() => setVerified(true))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setVerified(true);
    }
  }, [sessionId, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Verifying payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', damping: 10 }}
          className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-500/40"
        >
          <CheckCircle size={48} className="text-green-400" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h1 className="font-display text-3xl font-bold text-white mb-3">Payment Successful!</h1>
          <p className="text-gray-400 text-lg mb-2">Thank you for your purchase.</p>
          {ebook && <p className="text-primary-300 font-medium">"{ebook.title}" is now yours!</p>}
          <p className="text-gray-500 text-sm mt-2 mb-8">You can now access the full content of your ebook.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {ebook && (
              <Link href={`/ebooks/${ebook._id}`} className="btn-primary">
                <BookOpen size={18} /> Read Now <ArrowRight size={16} />
              </Link>
            )}
            <Link href="/dashboard/user/purchases" className="btn-secondary">My Purchases</Link>
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors px-4 py-3">
              <Home size={16} /> Home
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

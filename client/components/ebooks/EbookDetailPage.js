'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen, User, DollarSign, Tag, Calendar, CheckCircle, ShoppingCart,
  Bookmark, BookmarkCheck, Lock, ArrowLeft, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../lib/api';
import { useAuth } from '../../lib/AuthContext';

function SkeletonDetail() {
  return (
    <div className="max-w-5xl mx-auto animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2 h-80 skeleton rounded-2xl" />
        <div className="lg:col-span-3 space-y-4">
          <div className="h-8 skeleton rounded-lg w-3/4" />
          <div className="h-5 skeleton rounded-lg w-1/3" />
          <div className="h-24 skeleton rounded-lg" />
          <div className="h-10 skeleton rounded-xl w-1/2" />
          <div className="h-12 skeleton rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function EbookDetailPage({ id }) {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [buying, setBuying] = useState(false);

  const { data: ebook, isLoading, isError } = useQuery({
    queryKey: ['ebook', id],
    queryFn: () => API.get(`/ebooks/${id}`).then((r) => r.data),
  });

  const { data: purchases = [] } = useQuery({
    queryKey: ['purchases'],
    queryFn: () => API.get('/users/purchases').then((r) => r.data),
    enabled: !!user,
  });
  const isPurchased = purchases.some((t) => t.ebook?._id === id);

  const { data: userData } = useQuery({
    queryKey: ['profile'],
    queryFn: () => API.get('/users/profile').then((r) => r.data),
    enabled: !!user,
  });
  const isBookmarked = userData?.bookmarks?.includes(id);

  const bookmarkMutation = useMutation({
    mutationFn: () => API.post(`/users/bookmark/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['profile']);
      toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
    },
    onError: () => toast.error('Failed to update bookmark'),
  });

  const handleBuy = async () => {
    if (!user) { router.push('/login'); return; }
    setBuying(true);
    try {
      const res = await API.post('/stripe/checkout', { ebookId: id });
      window.location.href = res.data.url;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
      setBuying(false);
    }
  };

  if (isLoading) return (
    <div className="bg-dark-900 min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-5xl mx-auto"><SkeletonDetail /></div>
    </div>
  );

  if (isError || !ebook) return (
    <div className="bg-dark-900 min-h-screen pt-28 pb-20 flex items-center justify-center">
      <div className="text-center">
        <AlertCircle size={56} className="text-red-400 mx-auto mb-4" />
        <h2 className="text-white text-2xl font-semibold mb-2">Ebook Not Found</h2>
        <p className="text-gray-400 mb-6">The ebook you're looking for doesn't exist.</p>
        <Link href="/browse" className="btn-primary">Browse Ebooks</Link>
      </div>
    </div>
  );

  const isOwner = user && ebook.writer?._id === user._id;
  const canPurchase = user && !isOwner && !isPurchased;

  return (
    <div className="bg-dark-900 min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/browse" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Browse
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-10"
        >
          {/* Cover */}
          <div className="lg:col-span-2">
            <div className="sticky top-28">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 aspect-[3/4] bg-dark-700">
                {ebook.coverImage ? (
                  <img src={ebook.coverImage} alt={ebook.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen size={64} className="text-gray-600" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="genre-badge">{ebook.genre}</span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                    ebook.status === 'published'
                      ? 'bg-green-500/20 text-green-300 border-green-500/30'
                      : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                  }`}>
                    {ebook.status === 'published' ? 'Available' : 'Unpublished'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-3">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">{ebook.title}</h1>

            <Link href={`/browse?search=${ebook.writer?.name}`} className="flex items-center gap-2 text-primary-400 hover:text-primary-300 mb-4 transition-colors w-fit">
              <User size={16} />
              <span className="font-medium">{ebook.writer?.name}</span>
            </Link>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="glass rounded-xl p-3 flex items-center gap-2">
                <DollarSign size={18} className="text-gold-400" />
                <div>
                  <p className="text-xs text-gray-500">Price</p>
                  <p className="text-white font-bold">${Number(ebook.price).toFixed(2)}</p>
                </div>
              </div>
              <div className="glass rounded-xl p-3 flex items-center gap-2">
                <Tag size={18} className="text-primary-400" />
                <div>
                  <p className="text-xs text-gray-500">Genre</p>
                  <p className="text-white font-medium">{ebook.genre}</p>
                </div>
              </div>
              <div className="glass rounded-xl p-3 flex items-center gap-2">
                <Calendar size={18} className="text-blue-400" />
                <div>
                  <p className="text-xs text-gray-500">Published</p>
                  <p className="text-white font-medium text-sm">{new Date(ebook.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="glass rounded-xl p-3 flex items-center gap-2">
                <BookOpen size={18} className="text-emerald-400" />
                <div>
                  <p className="text-xs text-gray-500">Sales</p>
                  <p className="text-white font-medium">{ebook.salesCount} copies</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-white font-semibold mb-2">Description</h3>
              <p className="text-gray-400 leading-relaxed">{ebook.description}</p>
            </div>

            {/* Content preview or full */}
            {isPurchased ? (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle size={18} className="text-green-400" />
                  <h3 className="text-white font-semibold">Full Content</h3>
                </div>
                <div className="glass rounded-xl p-6 max-h-96 overflow-y-auto">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">{ebook.content}</p>
                </div>
              </div>
            ) : (
              <div className="mb-8 relative">
                <h3 className="text-white font-semibold mb-2">Content Preview</h3>
                <div className="glass rounded-xl p-6 max-h-40 overflow-hidden relative">
                  <p className="text-gray-400 text-sm leading-relaxed">{ebook.content?.substring(0, 300)}...</p>
                  <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-dark-800 to-transparent" />
                </div>
                {!user && (
                  <div className="flex items-center gap-2 mt-3 text-gray-500 text-sm">
                    <Lock size={14} /> Login to purchase and read the full content
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {isPurchased ? (
                <button className="btn-primary flex-1 cursor-default opacity-80" disabled>
                  <CheckCircle size={18} /> Already Purchased
                </button>
              ) : isOwner ? (
                <div className="flex-1 text-center py-3 px-6 rounded-xl bg-dark-700 border border-gray-700 text-gray-400 text-sm">
                  This is your ebook
                </div>
              ) : (
                <button onClick={handleBuy} disabled={buying || !user} className="btn-primary flex-1">
                  {buying ? (
                    <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</span>
                  ) : (
                    <><ShoppingCart size={18} /> {user ? 'Buy Now' : 'Login to Purchase'}</>
                  )}
                </button>
              )}

              {user && !isOwner && (
                <button
                  onClick={() => bookmarkMutation.mutate()}
                  disabled={bookmarkMutation.isPending}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-medium text-sm transition-all ${
                    isBookmarked
                      ? 'bg-primary-600/20 border-primary-500 text-primary-300'
                      : 'bg-dark-700 border-gray-700 text-gray-300 hover:border-primary-500 hover:text-white'
                  }`}
                >
                  {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                  {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

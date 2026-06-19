'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import API from '../../lib/api';
import EbookCard from '../EbookCard';
import SkeletonCard from '../SkeletonCard';
import GenreStrip from '../GenreStrip';
import { useAuth } from '../../lib/AuthContext';

const GENRES = ['Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Fantasy', 'Horror', 'Biography', 'Self-Help', 'History', 'Poetry', 'Thriller', 'Adventure'];

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [genre, setGenre] = useState(searchParams.get('genre') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [availability, setAvailability] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const LIMIT = 12;

  const queryKey = ['ebooks', { search, genre, minPrice, maxPrice, availability, sort, page }];
  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () =>
      API.get('/ebooks', {
        params: { search, genre, minPrice, maxPrice, availability, sort, page, limit: LIMIT },
      }).then((r) => r.data),
    keepPreviousData: true,
  });

  const { data: purchasedData } = useQuery({
    queryKey: ['purchases'],
    queryFn: () => API.get('/users/purchases').then((r) => r.data),
    enabled: !!user,
  });
  const purchasedIds = new Set((purchasedData || []).map((t) => t.ebook?._id));

  const ebooks = data?.ebooks || [];
  const totalPages = data?.pages || 1;

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const clearFilters = () => {
    setSearch(''); setGenre(''); setMinPrice(''); setMaxPrice(''); setAvailability(''); setSort('newest'); setPage(1);
  };

  const hasFilters = search || genre || minPrice || maxPrice || availability;

  return (
    <div className="bg-[#F8F7FF] min-h-screen pb-20">
      {/* Genre strip — sticky dark pill bar */}
      <div className="sticky top-16 z-40">
        <GenreStrip
          genres={GENRES}
          active={genre}
          onChange={(g) => { setGenre(g); setPage(1); }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900">Browse Ebooks</h1>
          <p className="text-slate-500 mt-1">{data?.total || 0} ebooks available</p>
        </motion.div>

        {/* Search & Filter Bar */}
        <div className="glass rounded-2xl p-4 mb-8 border border-gray-700/50">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title or writer name..."
                className="w-full bg-white border border-slate-200 focus:border-indigo-400 text-slate-800 placeholder-gray-500 rounded-xl px-4 py-3 outline-none transition-colors"
              />
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-white border border-slate-200 focus:border-indigo-400 text-slate-700 rounded-xl px-4 py-3 outline-none transition-colors cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>

            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
                showFilters || hasFilters
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-600'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              <SlidersHorizontal size={16} />
              Filters
              {hasFilters && <span className="w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">!</span>}
            </button>

            <button type="submit" className="btn-primary">Search</button>
          </form>

          {/* Filters panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block font-medium">Genre</label>
                <select
                  value={genre}
                  onChange={(e) => { setGenre(e.target.value); setPage(1); }}
                  className="w-full bg-white border border-slate-200 focus:border-indigo-400 text-slate-800 rounded-xl px-3 py-2.5 outline-none text-sm"
                >
                  <option value="">All Genres</option>
                  {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-500 mb-1.5 block font-medium">Min Price ($)</label>
                <input
                  type="number" min="0" value={minPrice}
                  onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                  placeholder="0"
                  className="w-full bg-white border border-slate-200 focus:border-indigo-400 text-slate-800 placeholder-slate-300 rounded-xl px-3 py-2.5 outline-none text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 mb-1.5 block font-medium">Max Price ($)</label>
                <input
                  type="number" min="0" value={maxPrice}
                  onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                  placeholder="Any"
                  className="w-full bg-white border border-slate-200 focus:border-indigo-400 text-slate-800 placeholder-slate-300 rounded-xl px-3 py-2.5 outline-none text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 mb-1.5 block font-medium">Availability</label>
                <select
                  value={availability}
                  onChange={(e) => { setAvailability(e.target.value); setPage(1); }}
                  className="w-full bg-white border border-slate-200 focus:border-indigo-400 text-slate-800 rounded-xl px-3 py-2.5 outline-none text-sm"
                >
                  <option value="">All</option>
                  <option value="available">Available</option>
                  <option value="sold">Has Sales</option>
                </select>
              </div>

              {hasFilters && (
                <button onClick={clearFilters} className="sm:col-span-2 lg:col-span-4 flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors">
                  <X size={14} /> Clear all filters
                </button>
              )}
            </motion.div>
          )}
        </div>

        {/* Results */}
        {isError ? (
          <div className="text-center py-20">
            <p className="text-red-400 text-lg">Failed to load ebooks. Please try again.</p>
            <button onClick={() => window.location.reload()} className="btn-primary mt-4">Retry</button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: LIMIT }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : ebooks.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={56} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">No ebooks found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your filters or search terms</p>
            <button onClick={clearFilters} className="btn-secondary">Clear Filters</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {ebooks.map((ebook, i) => (
                <EbookCard key={ebook._id} ebook={ebook} purchased={purchasedIds.has(ebook._id)} index={i} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-white flex items-center justify-center hover:border-primary-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                  .map((p, i, arr) => (
                    <span key={p}>
                      {i > 0 && arr[i - 1] !== p - 1 && <span className="text-gray-600 px-1">...</span>}
                      <button
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-xl border text-sm font-medium transition-all ${
                          p === page
                            ? 'bg-primary-600 border-primary-500 text-white'
                            : 'bg-dark-700 border-gray-700 text-gray-300 hover:border-primary-500 hover:text-white'
                        }`}
                      >
                        {p}
                      </button>
                    </span>
                  ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-white flex items-center justify-center hover:border-primary-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

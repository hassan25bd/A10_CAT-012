'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, BookOpen, DollarSign, Tag, FileText, Save } from 'lucide-react';
import { uploadToImgBB } from '../../lib/imgbb';
import toast from 'react-hot-toast';

const GENRES = ['Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Fantasy', 'Horror', 'Biography', 'Self-Help', 'History', 'Poetry', 'Thriller', 'Adventure'];

export default function EbookForm({ initialData = {}, onSubmit, loading }) {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [content, setContent] = useState(initialData.content || '');
  const [price, setPrice] = useState(initialData.price || '');
  const [genre, setGenre] = useState(initialData.genre || '');
  const [coverImage, setCoverImage] = useState(initialData.coverImage || '');
  const [coverPreview, setCoverPreview] = useState(initialData.coverImage || '');
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToImgBB(file);
      setCoverImage(url);
      setCoverPreview(url);
      toast.success('Cover uploaded!');
    } catch {
      toast.error('Image upload failed. Check your imgBB API key.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!coverImage) { toast.error('Please upload a cover image'); return; }
    if (!genre) { toast.error('Please select a genre'); return; }
    onSubmit({ title, description, content, price: Number(price), genre, coverImage });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Cover Image */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Cover Image *</label>
        <div className="flex gap-4 items-start">
          <div className="w-28 h-36 rounded-xl bg-dark-700 border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden flex-shrink-0">
            {coverPreview ? (
              <img src={coverPreview} alt="cover" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center px-2">
                <ImageIcon size={24} className="text-gray-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">No image</p>
              </div>
            )}
          </div>
          <div className="flex-1">
            <label className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-700 hover:border-primary-500 cursor-pointer transition-colors bg-dark-700">
              {uploading ? (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <div className="w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </div>
              ) : (
                <>
                  <ImageIcon size={20} className="text-gray-500" />
                  <span className="text-sm text-gray-400">Click to upload cover image</span>
                  <span className="text-xs text-gray-600">PNG, JPG, WEBP (via imgBB)</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
            </label>
            {coverImage && (
              <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                ✓ Image uploaded successfully
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Title *</label>
        <div className="relative">
          <BookOpen size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Enter ebook title" className="input-field pl-11" />
        </div>
      </div>

      {/* Genre & Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Genre *</label>
          <div className="relative">
            <Tag size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <select value={genre} onChange={(e) => setGenre(e.target.value)} required className="input-field pl-11 appearance-none cursor-pointer">
              <option value="">Select genre</option>
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Price (USD) *</label>
          <div className="relative">
            <DollarSign size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="9.99" className="input-field pl-11" />
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Description *</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} placeholder="Write a compelling description of your ebook..." className="input-field resize-none" />
      </div>

      {/* Full Content */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          <span className="flex items-center gap-1.5"><FileText size={15} /> Full Content *</span>
          <span className="text-xs text-gray-500 ml-5">This is what buyers will read after purchasing</span>
        </label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={10} placeholder="Write the full content of your ebook here..." className="input-field resize-y min-h-40" />
      </div>

      <button type="submit" disabled={loading || uploading} className="btn-primary w-full text-base">
        {loading ? (
          <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</span>
        ) : (
          <><Save size={18} /> Save Ebook</>
        )}
      </button>
    </form>
  );
}

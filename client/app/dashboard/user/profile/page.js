'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Camera, Save } from 'lucide-react';
import { useAuth } from '../../../../lib/AuthContext';
import API from '../../../../lib/api';
import { uploadToImgBB } from '../../../../lib/imgbb';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const [name, setName] = useState(user?.name || '');
  const [uploading, setUploading] = useState(false);

  const mutation = useMutation({
    mutationFn: (data) => API.put('/users/profile', data).then((r) => r.data),
    onSuccess: (updated) => {
      updateUser(updated);
      toast.success('Profile updated!');
      queryClient.invalidateQueries(['profile']);
    },
    onError: () => toast.error('Failed to update profile'),
  });

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToImgBB(file);
      mutation.mutate({ name: user.name, avatar: url });
    } catch {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    mutation.mutate({ name, avatar: user?.avatar });
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg">
        <h1 className="font-display text-2xl font-bold text-white mb-1">Profile</h1>
        <p className="text-gray-400 text-sm mb-8">Manage your account details</p>

        <div className="glass rounded-2xl border border-gray-700/50 p-8">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-primary-600/30 border-2 border-primary-500/40 flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-primary-300">{user?.name?.charAt(0)}</span>
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-600 hover:bg-primary-700 rounded-xl flex items-center justify-center cursor-pointer border-2 border-dark-900 transition-colors">
                {uploading ? (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera size={14} className="text-white" />
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-3">Click the camera icon to change avatar</p>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input value={name} onChange={(e) => setName(e.target.value)} className="input-field pl-11" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input value={user?.email} className="input-field pl-11 opacity-60 cursor-not-allowed" disabled />
              </div>
              <p className="text-xs text-gray-600 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Role</label>
              <div className="relative">
                <Shield size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input value={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} className="input-field pl-11 opacity-60 cursor-not-allowed capitalize" disabled />
              </div>
            </div>

            <button type="submit" disabled={mutation.isPending} className="btn-primary w-full">
              {mutation.isPending ? (
                <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</span>
              ) : (
                <><Save size={18} /> Save Changes</>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/AuthContext';

export default function DashboardRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) { router.replace('/login'); return; }
      if (user.role === 'admin') router.replace('/dashboard/admin');
      else if (user.role === 'writer') router.replace('/dashboard/writer');
      else router.replace('/dashboard/user');
    }
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center h-48">
      <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

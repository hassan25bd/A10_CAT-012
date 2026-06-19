'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, LayoutDashboard, ShoppingBag, Bookmark, User,
  PenLine, PlusCircle, TrendingUp, Users, BookMarked, BarChart3,
  CreditCard, LogOut, Menu, X, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import toast from 'react-hot-toast';

const navItems = {
  user: [
    { href: '/dashboard/user', icon: LayoutDashboard, label: 'Overview' },
    { href: '/dashboard/user/purchases', icon: ShoppingBag, label: 'My Purchases' },
    { href: '/dashboard/user/bookmarks', icon: Bookmark, label: 'Bookmarks' },
    { href: '/dashboard/user/profile', icon: User, label: 'Profile' },
  ],
  writer: [
    { href: '/dashboard/writer', icon: LayoutDashboard, label: 'Overview' },
    { href: '/dashboard/writer/ebooks', icon: BookMarked, label: 'My Ebooks' },
    { href: '/dashboard/writer/ebooks/add', icon: PlusCircle, label: 'Add Ebook' },
    { href: '/dashboard/writer/sales', icon: TrendingUp, label: 'Sales History' },
    { href: '/dashboard/writer/bookmarks', icon: Bookmark, label: 'Bookmarks' },
  ],
  admin: [
    { href: '/dashboard/admin', icon: BarChart3, label: 'Analytics' },
    { href: '/dashboard/admin/users', icon: Users, label: 'Manage Users' },
    { href: '/dashboard/admin/ebooks', icon: BookMarked, label: 'All Ebooks' },
    { href: '/dashboard/admin/transactions', icon: CreditCard, label: 'Transactions' },
  ],
};

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    router.push('/');
  };

  const links = navItems[user?.role] || [];
  const isActive = (href) => pathname === href || (href !== `/dashboard/${user?.role}` && pathname.startsWith(href));

  const Sidebar = ({ mobile = false }) => (
    <aside className={`${mobile ? 'w-full' : 'w-64 hidden lg:flex'} flex-col bg-dark-800 border-r border-gray-800/50 min-h-screen`}>
      <div className="p-6 border-b border-gray-800/50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <BookOpen size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg text-white">Fa<span className="text-primary-400">ble</span></span>
        </Link>
      </div>

      <div className="p-4 border-b border-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-600/30 border border-primary-500/30 flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-primary-300 font-bold">{user?.name?.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-primary-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={`sidebar-link ${isActive(item.href) ? 'active' : ''}`}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
            {isActive(item.href) && <ChevronRight size={14} className="ml-auto text-primary-400" />}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800/50 space-y-1">
        <Link href="/" className="sidebar-link">
          <BookOpen size={18} /> Back to Site
        </Link>
        <button onClick={handleLogout} className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-dark-900">
        <Sidebar />

        {/* Mobile sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed left-0 top-0 bottom-0 w-72 z-50 lg:hidden"
              >
                <div className="h-full bg-dark-800 border-r border-gray-800/50 flex flex-col">
                  <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
                    <span className="font-display font-bold text-white">Menu</span>
                    <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
                      <X size={20} />
                    </button>
                  </div>
                  <Sidebar mobile />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <div className="h-14 bg-dark-800/80 backdrop-blur border-b border-gray-800/50 flex items-center px-4 gap-4 lg:hidden sticky top-0 z-30">
            <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white">
              <Menu size={22} />
            </button>
            <span className="font-display font-semibold text-white">
              Fa<span className="text-primary-400">ble</span>
            </span>
          </div>

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

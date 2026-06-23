'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Menu, X, LogOut, LayoutDashboard, ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import toast from 'react-hot-toast';

function FableLogo({ scrolled }) {
  return (
    <Link href="/" className="flex items-center gap-3 group select-none">
      {/* ── Mark ── */}
      <div className="relative flex-shrink-0">
        {/* Animated glow ring — shows on hover */}
        <motion.div
          className="absolute -inset-1.5 rounded-[15px] pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          style={{
            background: 'linear-gradient(135deg,#6366f1,#a855f7,#ec4899)',
            filter: 'blur(10px)',
          }}
        />

        {/* Badge body */}
        <motion.div
          whileHover={{ scale: 1.07, rotate: -2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="relative w-10 h-10 rounded-[11px] flex items-center justify-center overflow-hidden"
          style={{
            background: 'linear-gradient(155deg,#1e1b4b 0%,#3730a3 38%,#4f46e5 65%,#7c3aed 100%)',
            boxShadow: '0 2px 12px rgba(79,70,229,0.55), 0 1px 0 rgba(255,255,255,0.08) inset',
          }}
        >
          {/* Top specular highlight */}
          <div
            className="absolute top-0 inset-x-0 h-5 rounded-t-[11px] pointer-events-none"
            style={{ background: 'linear-gradient(180deg,rgba(255,255,255,0.14) 0%,transparent 100%)' }}
          />
          {/* Corner sparkle */}
          <div
            className="absolute top-0 left-0 w-5 h-5 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 0% 0%,rgba(255,255,255,0.22) 0%,transparent 70%)' }}
          />

          {/* Geometric F — left stroke = book spine, bars = open pages */}
          <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
            {/* Spine / vertical stroke */}
            <rect x="3.5" y="2.5" width="4"  height="16" rx="1.8" fill="white"/>
            {/* Top bar — full width, top page */}
            <rect x="3.5" y="2.5" width="14" height="4"  rx="1.8" fill="white"/>
            {/* Mid bar — shorter, middle pages */}
            <rect x="3.5" y="11" width="9.5" height="3.2" rx="1.5" fill="rgba(255,255,255,0.80)"/>
            {/* Page-fan hints at bottom */}
            <rect x="5"   y="19.2" width="8" height="1.2" rx="0.6" fill="rgba(255,255,255,0.22)"/>
            <rect x="5.5" y="17.8" width="6.5" height="1" rx="0.5" fill="rgba(255,255,255,0.14)"/>
          </svg>

          {/* Bottom shadow vignette */}
          <div
            className="absolute bottom-0 inset-x-0 h-4 pointer-events-none"
            style={{ background: 'linear-gradient(0deg,rgba(0,0,0,0.25) 0%,transparent 100%)' }}
          />
        </motion.div>
      </div>

      {/* ── Wordmark ── */}
      <div className="flex flex-col justify-center leading-none">
        <span
          className="font-display font-bold tracking-tight transition-all duration-300"
          style={{
            fontSize: 21,
            ...(scrolled
              ? {
                  background: 'linear-gradient(135deg,#3730a3,#6366f1,#7c3aed)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }
              : {
                  color: '#ffffff',
                  textShadow: '0 0 28px rgba(255,255,255,0.28)',
                }),
          }}
        >
          Fable
        </span>
        <span
          className="font-medium tracking-[0.28em] uppercase transition-colors duration-300"
          style={{
            fontSize: 8,
            color: scrolled ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.38)',
            letterSpacing: '0.3em',
          }}
        >
          Library
        </span>
      </div>
    </Link>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/dashboard/admin';
    if (user.role === 'writer') return '/dashboard/writer';
    return '/dashboard/user';
  };

  const isActive = (path) => pathname === path || pathname.startsWith(path + '/');

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/browse', label: 'Browse' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-indigo-50'
          : 'bg-transparent'
      }`}
    >
      {/* Scroll progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] origin-left pointer-events-none"
        style={{
          scaleX,
          background: 'linear-gradient(90deg,#6366f1,#a855f7,#ec4899)',
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <FableLogo scrolled={scrolled} />

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? scrolled ? 'text-indigo-600 bg-indigo-50' : 'text-white bg-white/10'
                    : scrolled ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                href={getDashboardLink()}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive('/dashboard')
                    ? scrolled ? 'text-indigo-600 bg-indigo-50' : 'text-white bg-white/10'
                    : scrolled ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-sm text-slate-700 font-medium max-w-24 truncate">{user.name}</span>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-100 py-1.5 z-50"
                    >
                      <div className="px-4 py-2.5 border-b border-slate-100 mb-1">
                        <p className="text-xs text-slate-400 capitalize font-medium">{user.role}</p>
                        <p className="text-sm text-slate-800 font-semibold truncate">{user.email}</p>
                      </div>
                      <Link
                        href={getDashboardLink()}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <LayoutDashboard size={15} /> Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={15} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link href="/login" className={`text-sm font-medium transition-colors px-4 py-2 rounded-xl ${scrolled ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50' : 'text-white/80 hover:text-white hover:bg-white/10'}`}>
                  Login
                </Link>
                <Link href="/register" className="btn-primary text-sm !px-5 !py-2.5 !rounded-xl">
                  <Sparkles size={15} /> Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu btn */}
          <button className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/98 backdrop-blur-xl border-t border-slate-100 shadow-lg"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.href) ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link href={getDashboardLink()} onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-2">
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <button onClick={handleLogout} className="px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 flex items-center gap-2 text-left">
                    <LogOut size={16} /> Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 mt-2">
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="btn-secondary text-center text-sm">Login</Link>
                  <Link href="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-center text-sm">Get Started</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

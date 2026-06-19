import Link from 'next/link';
import { BookOpen, Facebook, Twitter, Instagram, Youtube, Mail, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-gray-800/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <BookOpen size={22} className="text-white" />
              </div>
              <span className="font-display font-bold text-2xl text-white">
                Fa<span className="text-primary-400">ble</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Connecting ebook lovers with talented writers. Discover, read, and share original stories from around the world.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-dark-700 hover:bg-primary-600/30 border border-gray-700 hover:border-primary-500/50 flex items-center justify-center text-gray-400 hover:text-primary-400 transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Browse Ebooks', href: '/browse' },
                { label: 'About Us', href: '#' },
                { label: 'Contact', href: '#' },
                { label: 'Privacy Policy', href: '#' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-400 hover:text-primary-300 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h4 className="text-white font-semibold mb-5">Genres</h4>
            <ul className="space-y-3">
              {['Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Fantasy', 'Horror'].map((genre) => (
                <li key={genre}>
                  <Link href={`/browse?genre=${genre}`} className="text-gray-400 hover:text-primary-300 text-sm transition-colors">
                    {genre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-5">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">Get the latest ebooks and author updates delivered to your inbox.</p>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full bg-dark-700 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-500 transition-colors"
                />
              </div>
              <button className="bg-primary-600 hover:bg-primary-700 text-white p-2.5 rounded-xl transition-colors">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Fable. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

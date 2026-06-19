'use client';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Bell, Mail } from 'lucide-react';

const SECTIONS = [
  {
    icon: Database,
    title: 'Information We Collect',
    content: `We collect information you provide directly to us when you create an account, make a purchase, or contact us. This includes your name, email address, payment information, and any content you submit to the platform. We also automatically collect certain information when you use our services, such as your IP address, browser type, and pages visited.`,
  },
  {
    icon: Eye,
    title: 'How We Use Your Information',
    content: `We use the information we collect to provide, maintain, and improve our services; process transactions; send you technical notices and support messages; respond to your comments and questions; and send you marketing communications (where permitted by law). We do not sell your personal information to third parties.`,
  },
  {
    icon: Lock,
    title: 'Data Security',
    content: `We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. All payment information is encrypted using industry-standard SSL technology. Your account is protected by your password, and we encourage you to use a unique, strong password.`,
  },
  {
    icon: Bell,
    title: 'Cookies & Tracking',
    content: `We use cookies and similar tracking technologies to track activity on our platform and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.`,
  },
  {
    icon: Mail,
    title: 'Communications',
    content: `We may send you promotional communications, such as information about new ebooks, features, or offers. You may opt out of receiving these communications at any time by following the unsubscribe link or instructions provided in any email we send. Transactional emails (such as purchase confirmations) cannot be opted out of.`,
  },
  {
    icon: Shield,
    title: 'Your Rights',
    content: `You have the right to access, update, or delete your personal information at any time through your account settings. You may also request a copy of your personal data or ask us to restrict processing of your data. To exercise these rights, please contact us at support@fable.com.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#03040f 0%,#0d0621 50%,#060312 100%)' }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle,#ffffff 1px,transparent 1px)', backgroundSize: '32px 32px' }} />
        <motion.div className="absolute rounded-full pointer-events-none"
          style={{ width: 500, height: 500, left: '60%', top: '-20%',
            background: 'radial-gradient(circle,#6366f130 0%,#8b5cf610 60%,transparent 80%)', filter: 'blur(80px)' }}
          animate={{ x: [0, -20, 0], y: [0, 20, 0] }} transition={{ duration: 22, repeat: Infinity }} />

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10">
              <Shield size={14} className="text-indigo-400" />
              <span className="text-indigo-400 text-xs font-bold tracking-widest uppercase">Legal</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-4 leading-tight"
              style={{ background: 'linear-gradient(135deg,#ffffff 0%,#c4b5fd 60%,#a78bfa 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Privacy Policy
            </h1>
            <p className="text-slate-300 text-lg mb-4">
              Your privacy matters to us. Here's how we collect, use, and protect your data.
            </p>
            <p className="text-slate-500 text-sm">Last updated: June 2026</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-slate-600 text-lg leading-relaxed mb-12 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
            This Privacy Policy describes how Fable ("we," "us," or "our") collects, uses, and shares information about you when you use our ebook platform. By using Fable, you agree to the collection and use of information in accordance with this policy.
          </motion.p>

          <div className="space-y-8">
            {SECTIONS.map(({ icon: Icon, title, content }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mt-1">
                  <Icon size={20} className="text-indigo-600" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-slate-900 mb-3">{title}</h2>
                  <p className="text-slate-600 leading-relaxed">{content}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <p className="text-slate-600 text-sm">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:support@fable.com" className="text-indigo-600 font-semibold hover:underline">
                support@fable.com
              </a>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

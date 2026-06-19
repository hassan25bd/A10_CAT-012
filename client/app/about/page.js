'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, Users, Globe, Sparkles, ArrowRight, Heart } from 'lucide-react';

const STATS = [
  { value: '30+', label: 'Ebooks Available' },
  { value: '12', label: 'Genres' },
  { value: '500+', label: 'Happy Readers' },
  { value: '3+', label: 'Expert Writers' },
];

const TEAM = [
  { name: 'Elena Hartwood', role: 'Lead Writer & Co-Founder', emoji: '✍️' },
  { name: 'Marcus Chen', role: 'Sci-Fi & Fiction Author', emoji: '🚀' },
  { name: 'Sophia Rivers', role: 'Romance & Horror Specialist', emoji: '📖' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero */}
      <section
        className="relative py-28 overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#03040f 0%,#0d0621 50%,#060312 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle,#ffffff 1px,transparent 1px)', backgroundSize: '32px 32px' }} />
        {[
          { w: 500, h: 500, x: '-5%', y: '-30%', from: '#6366f1', to: '#8b5cf6' },
          { w: 400, h: 400, x: '65%', y: '20%',  from: '#ec4899', to: '#a855f7' },
        ].map((orb, i) => (
          <motion.div key={i} className="absolute rounded-full pointer-events-none"
            style={{ width: orb.w, height: orb.h, left: orb.x, top: orb.y,
              background: `radial-gradient(circle,${orb.from}30 0%,${orb.to}10 60%,transparent 80%)`,
              filter: 'blur(80px)' }}
            animate={{ x: [0, 20, -15, 0], y: [0, -20, 15, 0] }}
            transition={{ duration: 20 + i * 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10">
              <Sparkles size={14} className="text-indigo-400" />
              <span className="text-indigo-400 text-xs font-bold tracking-widest uppercase">Our Story</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 leading-tight"
              style={{ background: 'linear-gradient(135deg,#ffffff 0%,#c4b5fd 60%,#a78bfa 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              About Fable
            </h1>
            <p className="text-slate-300 text-xl leading-relaxed max-w-2xl mx-auto">
              A platform built for readers and writers alike — where stories come to life and every page opens a new world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="text-3xl font-black text-indigo-600 mb-1">{s.value}</div>
                <div className="text-slate-500 text-sm font-medium">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="font-display text-4xl font-bold text-slate-900 mb-5">Our Mission</h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-5">
                Fable was created to democratize storytelling — giving talented writers a platform to share their work and connecting readers with stories that truly resonate.
              </p>
              <p className="text-slate-600 leading-relaxed">
                We believe great stories deserve great readers. That's why we've built a curated marketplace across 12 genres, from heart-pounding thrillers to sweeping romances, all in one place.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="grid grid-cols-2 gap-4">
              {[
                { icon: BookOpen, title: 'Curated Library', desc: 'Every ebook is reviewed before publishing' },
                { icon: Users,    title: 'Writer Support', desc: 'Tools and analytics for every author' },
                { icon: Globe,    title: 'Global Reach', desc: 'Readers from around the world' },
                { icon: Heart,    title: 'Reader First', desc: 'Built with the reader experience in mind' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <Icon size={22} className="text-indigo-600 mb-3" />
                  <h4 className="font-bold text-slate-800 text-sm mb-1">{title}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-slate-900 mb-3">Meet the Writers</h2>
            <p className="text-slate-500">The talented authors behind Fable's ebook collection</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {TEAM.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-7 border border-slate-100 shadow-sm text-center">
                <div className="text-5xl mb-4">{member.emoji}</div>
                <h3 className="font-bold text-slate-900 mb-1">{member.name}</h3>
                <p className="text-slate-500 text-sm">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-3xl font-bold text-slate-900 mb-4">Start Reading Today</h2>
            <p className="text-slate-500 mb-8">Browse our full collection of ebooks across every genre.</p>
            <Link href="/browse"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-bold shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 0 30px rgba(99,102,241,0.3)' }}>
              Browse Ebooks <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

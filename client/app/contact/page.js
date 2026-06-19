'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, MapPin, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSent(true);
    toast.success('Message sent! We\'ll get back to you soon.');
  };

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#03040f 0%,#0d0621 50%,#060312 100%)' }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle,#ffffff 1px,transparent 1px)', backgroundSize: '32px 32px' }} />
        <motion.div className="absolute rounded-full pointer-events-none"
          style={{ width: 500, height: 500, left: '-5%', top: '-30%',
            background: 'radial-gradient(circle,#6366f130 0%,#8b5cf610 60%,transparent 80%)', filter: 'blur(80px)' }}
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }} transition={{ duration: 20, repeat: Infinity }} />

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10">
              <Mail size={14} className="text-indigo-400" />
              <span className="text-indigo-400 text-xs font-bold tracking-widest uppercase">Get In Touch</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-4 leading-tight"
              style={{ background: 'linear-gradient(135deg,#ffffff 0%,#c4b5fd 60%,#a78bfa 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Contact Us
            </h1>
            <p className="text-slate-300 text-lg">Have a question or feedback? We'd love to hear from you.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-12">
            {/* Info */}
            <div className="md:col-span-2 space-y-6">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">We're here to help</h2>
                {[
                  { icon: Mail,         title: 'Email Us',       detail: 'support@fable.com',       sub: 'We reply within 24 hours' },
                  { icon: MessageSquare, title: 'Live Chat',      detail: 'Available on the platform', sub: 'Mon–Fri, 9am–6pm' },
                  { icon: MapPin,       title: 'Headquarters',   detail: 'Dhaka, Bangladesh',       sub: 'Remote-first team' },
                  { icon: Clock,        title: 'Response Time',  detail: 'Under 24 hours',          sub: 'For all inquiries' },
                ].map(({ icon: Icon, title, detail, sub }) => (
                  <div key={title} className="flex gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{title}</p>
                      <p className="text-slate-700 text-sm">{detail}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{sub}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Form */}
            <motion.div className="md:col-span-3" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              {sent ? (
                <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                  <p className="text-slate-500">Thanks for reaching out. We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Name *</label>
                      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your full name"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
                      <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                    <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="What is this about?"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Message *</label>
                    <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Write your message here..." rows={6}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none" />
                  </div>
                  <button type="submit"
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold transition-all hover:-translate-y-0.5 duration-200"
                    style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 0 24px rgba(99,102,241,0.35)' }}>
                    <Send size={17} /> Send Message
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

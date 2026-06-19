'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Mail, Lock, User, Eye, EyeOff, UserCheck, PenLine, CheckCircle } from 'lucide-react';
import { useAuth } from '../../../lib/AuthContext';
import GoogleLoginButton from '../../../components/GoogleLoginButton';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [role, setRole] = useState('user');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleStep1 = (e) => {
    e.preventDefault();
    if (password !== confirmPass) { toast.error('Passwords do not match'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setStep(2);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const user = await register(name, email, password, role);
      toast.success(`Welcome to Fable, ${user.name}!`);
      router.push('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-72 h-72 rounded-full bg-primary-600/10 blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 rounded-full bg-purple-700/10 blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <BookOpen size={22} className="text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-white">Fa<span className="text-primary-400">ble</span></span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-white">Create your account</h1>
          <p className="text-gray-400 text-sm mt-1">Join thousands of readers and writers</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-6">
          {[1, 2].map((s) => (
            <div key={s} className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${s <= step ? 'bg-primary-600' : 'bg-gray-700'}`} />
          ))}
        </div>

        <div className="glass rounded-2xl p-8 border border-gray-700/50">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleStep1}
                noValidate
                className="space-y-5"
              >
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-4">Step 1 — Your Details</p>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="input-field pl-11" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="input-field pl-11" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input type={showPass ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" className="input-field pl-10 pr-10" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                      {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input type="password" required value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} placeholder="••••••••" className="input-field pl-11" />
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full">Continue →</button>
              </motion.form>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-4">Step 2 — Choose Your Role</p>
                <p className="text-gray-300 text-sm">How will you primarily use Fable?</p>

                <div className="grid grid-cols-1 gap-4">
                  {[
                    { value: 'user', icon: UserCheck, label: 'Reader', desc: 'Browse, discover, and purchase ebooks from talented writers.' },
                    { value: 'writer', icon: PenLine, label: 'Writer', desc: 'Upload, publish, and sell your ebooks to readers worldwide.' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setRole(opt.value)}
                      className={`text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                        role === opt.value
                          ? 'border-primary-500 bg-primary-600/15'
                          : 'border-gray-700 hover:border-gray-500 bg-dark-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${role === opt.value ? 'bg-primary-600/30' : 'bg-dark-600'}`}>
                          <opt.icon size={20} className={role === opt.value ? 'text-primary-300' : 'text-gray-400'} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-white font-semibold">{opt.label}</p>
                            {role === opt.value && <CheckCircle size={18} className="text-primary-400" />}
                          </div>
                          <p className="text-gray-400 text-xs mt-1">{opt.desc}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-secondary flex-1">← Back</button>
                  <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1">
                    {loading ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating...</span> : 'Create Account'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-6">
          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700/60" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-500">
              <span className="px-3 bg-dark-900 rounded">or sign up with Google</span>
            </div>
          </div>
          <GoogleLoginButton role={role} />
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}

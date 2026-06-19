'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const totalMs = 2200;
    const tick = 16;
    const steps = totalMs / tick;
    let step = 0;

    const id = setInterval(() => {
      step++;
      // Ease-out cubic: fast start, slow finish
      const t = step / steps;
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.min(Math.round(eased * 100), 100));
      if (step >= steps) {
        clearInterval(id);
        setTimeout(() => setVisible(false), 400);
      }
    }, tick);

    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: '#F8F7FF' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
          {/* Ambient glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle, rgba(99,102,241,${progress / 400}) 0%, transparent 70%)`,
            }}
          />

          <div className="flex flex-col items-center gap-5 relative z-10">
            {/* Logo wipe effect */}
            <div className="relative select-none">
              <span
                className="block font-black leading-none tracking-tight"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(64px, 12vw, 108px)',
                  color: '#E0E7FF',
                }}
              >
                Fable
              </span>

              {/* Filled — indigo to violet gradient wipe */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <span
                  className="block font-black leading-none tracking-tight whitespace-nowrap"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 'clamp(64px, 12vw, 108px)',
                    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Fable
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-32 h-1 bg-indigo-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-none"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #6366F1, #8B5CF6)',
                }}
              />
            </div>

            {/* Percentage */}
            <span
              className="text-xs font-bold tracking-widest uppercase"
              style={{ color: '#A5B4FC', fontFamily: "'Inter', sans-serif" }}
            >
              {progress}%
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

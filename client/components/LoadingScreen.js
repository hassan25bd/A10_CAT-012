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
          className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <div className="flex flex-col items-center gap-4">
            {/* Logo wipe effect */}
            <div className="relative select-none">
              {/* Ghost (unfilled) text */}
              <span
                className="block text-[96px] font-black leading-none tracking-tight"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: '#d1d5db',
                }}
              >
                Fable
              </span>

              {/* Filled text clipped to progress width */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <span
                  className="block text-[96px] font-black leading-none tracking-tight whitespace-nowrap"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: '#111827',
                  }}
                >
                  Fable
                </span>
              </div>
            </div>

            {/* Percentage */}
            <span
              className="text-sm font-semibold tracking-widest"
              style={{ color: '#6b7280', fontFamily: "'Inter', sans-serif" }}
            >
              {progress}%
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

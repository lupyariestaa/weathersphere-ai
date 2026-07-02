"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE_CONFIG } from "@/config/site";

interface LoadingScreenProps {
  onFinished: () => void;
  minDurationMs?: number;
}

/**
 * A cinematic loading sequence instead of a spinner: progress ticks up,
 * the logo settles into place, then the whole screen fades into the hero.
 */
export function LoadingScreen({ onFinished, minDurationMs = 1800 }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const start = performance.now();
    let frame: number;

    const tick = () => {
      const elapsed = performance.now() - start;
      const next = Math.min(99, (elapsed / minDurationMs) * 100);
      setProgress(next);
      if (elapsed < minDurationMs) {
        frame = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setTimeout(() => setVisible(false), 350);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [minDurationMs]);

  return (
    <AnimatePresence onExitComplete={onFinished}>
      {visible && (
        <motion.div
          key="loading-screen"
          className="fixed inset-0 z-[200] flex items-center justify-center bg-gradient-to-br from-[#0b1220] via-[#13265c] to-[#0b1220]"
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-sphere-blue/30 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sphere-cyan/20 blur-3xl" />
          </div>

          <div className="relative flex flex-col items-center gap-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="relative h-20 w-20 rounded-full bg-gradient-to-br from-sphere-cyan to-sphere-blue shadow-glow"
            >
              <span className="absolute inset-2 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="font-display text-xl font-semibold tracking-tight text-white sm:text-2xl"
            >
              {SITE_CONFIG.name}
            </motion.h1>

            <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10 sm:w-64">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-sphere-cyan to-sphere-blue"
                style={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
            <span className="text-xs font-medium tabular text-white/60">{Math.round(progress)}%</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

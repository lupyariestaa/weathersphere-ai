"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface AIAssistantProps {
  message: string;
  tips: string[];
}

/**
 * A small, friendly assistant presence — not a chat product, just a face
 * for the contextual messages the dashboard already generates. Idle
 * floating + periodic blink keep it feeling alive without being noisy.
 */
export function AIAssistant({ message, tips }: AIAssistantProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex items-start gap-3">
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -6, 0] }}
        transition={{ y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" } }}
        aria-label={open ? "Hide assistant message" : "Show assistant message"}
        aria-expanded={open}
        className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sphere-cyan to-sphere-blue shadow-glowCyan"
      >
        <span className="absolute inset-0 rounded-full bg-sphere-cyan/40 animate-glow-pulse blur-md" aria-hidden="true" />
        <Sparkles size={20} className="relative z-10 text-white" />
        {/* Eyes, purely decorative, give the orb a face without becoming cartoonish */}
        <span className="absolute top-[18px] left-[15px] flex gap-[6px]" aria-hidden="true">
          <span className="block h-[5px] w-[5px] origin-center animate-blink rounded-full bg-white/90" />
          <span className="block h-[5px] w-[5px] origin-center animate-blink rounded-full bg-white/90" />
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -8, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel max-w-sm rounded-xl2 px-4 py-3 text-sm text-slate-800 dark:text-slate-100"
          >
            <p className="font-medium leading-snug">{message}</p>
            {tips.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                {tips.map((tip) => (
                  <li key={tip} className="flex items-start gap-1.5">
                    <span className="mt-1 block h-1 w-1 rounded-full bg-sphere-cyan" aria-hidden="true" />
                    {tip}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";
import { useState } from "react";
import { usePwaInstall } from "@/hooks/usePwaInstall";
import { Button } from "@/components/ui/Button";

export function PwaInstallBanner() {
  const { canInstall, installed, promptInstall } = usePwaInstall();
  const [dismissed, setDismissed] = useState(false);

  const visible = canInstall && !installed && !dismissed;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 sm:bottom-6"
          role="status"
        >
          <div className="glass-panel flex items-center gap-3 rounded-2xl px-4 py-3 shadow-glassDark">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sphere-cyan to-sphere-blue">
              <Download size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-white">Install WeatherSphere</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Use offline, add to home screen</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="primary" size="sm" onClick={promptInstall}>
                Install
              </Button>
              <button
                onClick={() => setDismissed(true)}
                aria-label="Dismiss install prompt"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

const ICONS = { success: CheckCircle2, info: Info, error: XCircle };

export function ToastViewport() {
  const { toasts, dismissToast } = useToast();

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-[100] flex flex-col gap-2 sm:top-6 sm:right-6" role="status" aria-live="polite">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = ICONS[toast.variant];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
              className="glass-panel pointer-events-auto flex items-center gap-2.5 rounded-xl2 px-4 py-3 shadow-glass dark:shadow-glassDark"
            >
              <Icon size={18} className={toast.variant === "error" ? "text-red-400" : toast.variant === "success" ? "text-emerald-400" : "text-sphere-cyan"} />
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{toast.message}</span>
              <button onClick={() => dismissToast(toast.id)} className="ml-1 text-slate-400 hover:text-slate-700 dark:hover:text-white" aria-label="Dismiss notification">
                ×
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

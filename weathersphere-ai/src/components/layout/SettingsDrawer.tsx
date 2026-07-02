"use client";

import { type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Trash2, X, Monitor } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useToast } from "@/contexts/ToastContext";
import { Button } from "@/components/ui/Button";
import type { ThemeMode } from "@/types/weather";

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
}

const THEME_OPTIONS: { mode: ThemeMode; label: string; icon: ReactNode }[] = [
  { mode: "light", label: "Light", icon: <Sun size={15} /> },
  { mode: "dark", label: "Dark", icon: <Moon size={15} /> },
  { mode: "system", label: "System", icon: <Monitor size={15} /> },
];

export function SettingsDrawer({ open, onClose }: SettingsDrawerProps) {
  const { mode, setMode } = useTheme();
  const { unit, setUnit, clearRecentSearches } = usePreferences();
  const { showToast } = useToast();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Settings"
            className="glass-panel fixed right-0 top-0 z-[95] h-full w-full max-w-sm overflow-y-auto p-6 shadow-glass dark:shadow-glassDark"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-slate-800 dark:text-white">Settings</h2>
              <button onClick={onClose} aria-label="Close settings" className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>

            <section className="mt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Theme</h3>
              <div className="mt-2 flex gap-2">
                {THEME_OPTIONS.map((opt) => (
                  <button
                    key={opt.mode}
                    onClick={() => setMode(opt.mode)}
                    aria-pressed={mode === opt.mode}
                    className={`flex flex-1 flex-col items-center gap-1 rounded-xl2 py-3 text-xs font-medium transition-colors ${
                      mode === opt.mode ? "bg-sphere-blue text-white shadow-glow" : "bg-white/10 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="mt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Temperature unit</h3>
              <div className="mt-2 flex gap-2">
                {(["celsius", "fahrenheit"] as const).map((u) => (
                  <button
                    key={u}
                    onClick={() => setUnit(u)}
                    aria-pressed={unit === u}
                    className={`flex-1 rounded-xl2 py-3 text-sm font-medium transition-colors ${
                      unit === u ? "bg-sphere-blue text-white shadow-glow" : "bg-white/10 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    °{u === "celsius" ? "C" : "F"}
                  </button>
                ))}
              </div>
            </section>

            <section className="mt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Data</h3>
              <Button
                variant="glass"
                size="sm"
                className="mt-2 w-full justify-start"
                onClick={() => {
                  clearRecentSearches();
                  showToast("Recent searches cleared", "success");
                }}
              >
                <Trash2 size={14} /> Clear recent searches
              </Button>
            </section>

            <p className="mt-8 text-xs text-slate-400">
              WeatherSphere AI stores preferences only in your browser — no account, no server, no tracking.
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

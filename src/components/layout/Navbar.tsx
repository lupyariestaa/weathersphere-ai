"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Menu, Moon, Settings, Sun, X } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { SITE_CONFIG } from "@/config/site";
import { Button } from "@/components/ui/Button";

interface NavbarProps {
  onOpenSettings: () => void;
}

export function Navbar({ onOpenSettings }: NavbarProps) {
  const { resolvedTheme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6">
      <nav className="glass-panel mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2.5 shadow-glass dark:shadow-glassDark sm:px-6">
        <a href="#top" className="flex items-center gap-2 font-display text-base font-semibold tracking-tight text-slate-800 dark:text-white">
          <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-sphere-cyan to-sphere-blue shadow-glowCyan" aria-hidden="true" />
          {SITE_CONFIG.name}
        </a>

        <div className="hidden items-center gap-1.5 sm:flex">
          <Button variant="ghost" size="sm" onClick={toggle} aria-label="Toggle theme">
            {resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
          <Button variant="ghost" size="sm" onClick={onOpenSettings} aria-label="Open settings">
            <Settings size={16} />
          </Button>
          <a href={SITE_CONFIG.github} target="_blank" rel="noreferrer" aria-label="View source on GitHub">
            <Button variant="glass" size="sm">
              <Github size={16} />
              GitHub
            </Button>
          </a>
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 dark:text-white sm:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-2xl p-2 shadow-glass sm:hidden"
          >
            <button onClick={toggle} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-white">
              {resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />} Toggle theme
            </button>
            <button onClick={onOpenSettings} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-white">
              <Settings size={16} /> Settings
            </button>
            <a href={SITE_CONFIG.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-white">
              <Github size={16} /> GitHub
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

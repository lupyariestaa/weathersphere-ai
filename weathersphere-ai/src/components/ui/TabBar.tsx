"use client";

import { useRef, useState, useLayoutEffect, type KeyboardEvent, type ReactNode } from "react";
import { motion } from "framer-motion";

export interface Tab {
  key: string;
  label: string;
  icon?: ReactNode;
}

interface TabBarProps {
  tabs: Tab[];
  activeKey: string;
  onChange: (key: string) => void;
}

/**
 * Pill-style tab bar with a sliding glass indicator underneath the active tab.
 * Fully keyboard-navigable and screen-reader friendly.
 */
export function TabBar({ tabs, activeKey, onChange }: TabBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const activeBtn = container.querySelector<HTMLButtonElement>(
      `[data-tab="${activeKey}"]`
    );
    if (!activeBtn) return;
    const containerRect = container.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    setIndicatorStyle({
      left: btnRect.left - containerRect.left,
      width: btnRect.width,
    });
  }, [activeKey]);

  const handleKeyDown = (e: KeyboardEvent, currentKey: string) => {
    const idx = tabs.findIndex((t) => t.key === currentKey);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      onChange(tabs[(idx + 1) % tabs.length].key);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      onChange(tabs[(idx - 1 + tabs.length) % tabs.length].key);
    }
  };

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label="Dashboard sections"
      className="glass-panel relative flex items-center gap-1 overflow-x-auto rounded-full p-1 shadow-glass dark:shadow-glassDark"
    >
      <motion.div
        className="absolute h-[calc(100%-8px)] rounded-full bg-sphere-blue/90 shadow-glow"
        animate={indicatorStyle}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      />

      {tabs.map((tab) => (
        <button
          key={tab.key}
          role="tab"
          aria-selected={activeKey === tab.key}
          data-tab={tab.key}
          onClick={() => onChange(tab.key)}
          onKeyDown={(e) => handleKeyDown(e, tab.key)}
          className={`relative z-10 flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none ${
            activeKey === tab.key
              ? "text-white"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

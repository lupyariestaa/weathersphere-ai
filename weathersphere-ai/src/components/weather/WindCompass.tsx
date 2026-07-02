"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatWindSpeed, windDirectionLabel } from "@/utils/units";

interface WindCompassProps {
  speed: number;
  direction: number;
  gusts: number;
}

const TICKS = ["N", "E", "S", "W"];

export function WindCompass({ speed, direction, gusts }: WindCompassProps) {
  return (
    <GlassCard>
      <h3 className="font-display text-sm font-semibold text-slate-700 dark:text-white">Wind</h3>
      <div className="mt-4 flex items-center gap-5">
        <div className="relative h-24 w-24 shrink-0">
          <div className="absolute inset-0 rounded-full border border-white/20" />
          {TICKS.map((t, i) => (
            <span
              key={t}
              className="absolute text-[10px] font-semibold text-slate-400"
              style={{
                top: i === 0 ? "2px" : i === 2 ? "calc(100% - 14px)" : "calc(50% - 6px)",
                left: i === 3 ? "2px" : i === 1 ? "calc(100% - 10px)" : "calc(50% - 4px)",
              }}
            >
              {t}
            </span>
          ))}
          <motion.div
            animate={{ rotate: direction }}
            transition={{ type: "spring", stiffness: 60, damping: 12 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <svg width="20" height="60" viewBox="0 0 20 60" className="-translate-y-1">
              <path d="M10 0 L18 24 L10 18 L2 24 Z" fill="#22D3EE" />
              <line x1="10" y1="18" x2="10" y2="55" stroke="#22D3EE" strokeWidth="2" />
            </svg>
          </motion.div>
        </div>

        <div className="flex flex-col gap-2">
          <Stat label="Speed" value={formatWindSpeed(speed)} />
          <Stat label="Gusts" value={formatWindSpeed(gusts)} />
          <Stat label="Direction" value={`${windDirectionLabel(direction)} (${Math.round(direction)}°)`} />
        </div>
      </div>
    </GlassCard>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-sm font-semibold tabular text-slate-800 dark:text-white">{value}</p>
    </div>
  );
}

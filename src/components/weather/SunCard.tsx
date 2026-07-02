"use client";

import { Sunrise, Sunset } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatClock, remainingDaylight, secondsToHoursMinutes } from "@/utils/datetime";
import type { DailyForecastEntry } from "@/types/weather";

interface SunCardProps {
  today: DailyForecastEntry;
}

export function SunCard({ today }: SunCardProps) {
  const sunrise = new Date(today.sunrise).getTime();
  const sunset = new Date(today.sunset).getTime();
  const now = Date.now();
  const progress = Math.min(1, Math.max(0, (now - sunrise) / (sunset - sunrise)));

  return (
    <GlassCard>
      <h3 className="font-display text-sm font-semibold text-slate-700 dark:text-white">Sun</h3>

      <div className="relative mt-6 h-20">
        <svg viewBox="0 0 200 100" className="absolute inset-0 h-full w-full overflow-visible">
          <path d="M 10 90 Q 100 0 190 90" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeLinecap="round" />
          <path
            d="M 10 90 Q 100 0 190 90"
            fill="none"
            stroke="#FBBF24"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="280"
            strokeDashoffset={280 - progress * 280}
          />
          <circle
            cx={10 + progress * 180}
            cy={90 - Math.sin(progress * Math.PI) * 80}
            r="6"
            fill="#FBBF24"
            className="drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]"
          />
        </svg>
      </div>

      <div className="mt-2 flex justify-between text-sm">
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
          <Sunrise size={16} className="text-amber-400" /> {formatClock(today.sunrise)}
        </div>
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
          <Sunset size={16} className="text-orange-400" /> {formatClock(today.sunset)}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
        <div className="rounded-xl2 bg-white/10 px-3 py-2">
          <p>Day length</p>
          <p className="font-semibold tabular text-slate-800 dark:text-white">{secondsToHoursMinutes(today.daylightDurationSeconds)}</p>
        </div>
        <div className="rounded-xl2 bg-white/10 px-3 py-2">
          <p>Daylight left</p>
          <p className="font-semibold tabular text-slate-800 dark:text-white">{remainingDaylight(today.sunset)}</p>
        </div>
      </div>
    </GlassCard>
  );
}

"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { getMoonPhase, secondsToHoursMinutes } from "@/utils/datetime";
import type { DailyForecastEntry } from "@/types/weather";

interface MoonCardProps {
  today: DailyForecastEntry;
}

export function MoonCard({ today }: MoonCardProps) {
  const moon = getMoonPhase(new Date());
  const sunset = new Date(today.sunset).getTime();
  const sunrise = new Date(today.sunrise).getTime();
  const nightSeconds = Math.max(0, (sunrise + 86400000 - sunset) / 1000);

  return (
    <GlassCard>
      <h3 className="font-display text-sm font-semibold text-slate-700 dark:text-white">Moon</h3>
      <div className="mt-4 flex items-center gap-4">
        <span className="text-5xl" aria-hidden="true">{moon.emoji}</span>
        <div>
          <p className="text-base font-semibold text-slate-800 dark:text-white">{moon.phase}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{Math.round(moon.illumination * 100)}% illuminated</p>
        </div>
      </div>
      <div className="mt-4 rounded-xl2 bg-white/10 px-3 py-2 text-xs text-slate-500 dark:text-slate-400">
        <p>Night duration</p>
        <p className="font-semibold tabular text-slate-800 dark:text-white">{secondsToHoursMinutes(nightSeconds)}</p>
      </div>
    </GlassCard>
  );
}

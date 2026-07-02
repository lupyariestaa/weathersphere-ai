"use client";

import { Droplets, Eye, Gauge, SunMedium } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { formatDistanceKm, uvLabel } from "@/utils/units";
import type { CurrentWeather } from "@/types/weather";

interface DetailsGridProps {
  current: CurrentWeather;
}

export function DetailsGrid({ current }: DetailsGridProps) {
  const uv = current.uvIndex ?? 0;
  const uvInfo = uvLabel(uv);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <GlassCard className="flex flex-col items-center text-center">
        <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"><Droplets size={14} /> Humidity</span>
        <ProgressRing value={current.humidity} size={72} strokeWidth={6} color="#22D3EE" label={`${Math.round(current.humidity)}%`} />
        <p className="text-[11px] text-slate-500 dark:text-slate-400">{current.humidity > 70 ? "Humid" : current.humidity > 40 ? "Comfortable" : "Dry"}</p>
      </GlassCard>

      <GlassCard className="flex flex-col items-center text-center">
        <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"><Gauge size={14} /> Pressure</span>
        <ProgressRing
          value={Math.min(100, Math.max(0, ((current.pressure - 970) / (1040 - 970)) * 100))}
          size={72}
          strokeWidth={6}
          color="#34D399"
          label={`${Math.round(current.pressure)}`}
        />
        <p className="text-[11px] text-slate-500 dark:text-slate-400">hPa · {current.pressure >= 1013 ? "High" : "Low"}</p>
      </GlassCard>

      <GlassCard className="flex flex-col items-center text-center">
        <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"><Eye size={14} /> Visibility</span>
        <ProgressRing
          value={current.visibility ? Math.min(100, (current.visibility / 20000) * 100) : 0}
          size={72}
          strokeWidth={6}
          color="#2F6FED"
          label={current.visibility ? formatDistanceKm(current.visibility / 1000) : "—"}
        />
        <p className="text-[11px] text-slate-500 dark:text-slate-400">{!current.visibility ? "Unavailable" : current.visibility > 10000 ? "Excellent" : "Reduced"}</p>
      </GlassCard>

      <GlassCard className="flex flex-col items-center text-center">
        <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"><SunMedium size={14} /> UV index</span>
        <ProgressRing value={Math.min(100, (uv / 11) * 100)} size={72} strokeWidth={6} color={uvInfo.color} label={`${uv.toFixed(1)}`} />
        <p className="text-[11px] font-medium" style={{ color: uvInfo.color }}>{uvInfo.label}</p>
      </GlassCard>
    </div>
  );
}

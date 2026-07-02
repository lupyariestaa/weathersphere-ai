"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { GlassCard } from "@/components/ui/GlassCard";
import { usePreferences } from "@/contexts/PreferencesContext";
import { celsiusTo } from "@/utils/units";
import { formatHour } from "@/utils/datetime";
import type { HourlyForecastEntry } from "@/types/weather";

interface TemperatureChartProps {
  hourly: HourlyForecastEntry[];
}

export function TemperatureChart({ hourly }: TemperatureChartProps) {
  const { unit } = usePreferences();

  const data = hourly.slice(0, 24).map((h) => ({
    time: formatHour(h.time),
    temperature: Math.round(celsiusTo(unit, h.temperature)),
  }));

  return (
    <GlassCard hoverLift={false}>
      <h3 className="font-display text-sm font-semibold text-slate-700 dark:text-white">Temperature trend</h3>
      <div className="mt-3 h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.55} />
                <stop offset="100%" stopColor="#22D3EE" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" tick={{ fontSize: 11, fill: "currentColor", opacity: 0.5 }} axisLine={false} tickLine={false} interval={2} />
            <YAxis tick={{ fontSize: 11, fill: "currentColor", opacity: 0.5 }} axisLine={false} tickLine={false} width={36} />
            <Tooltip
              contentStyle={{ background: "rgba(15,23,42,0.85)", border: "none", borderRadius: 12, fontSize: 12 }}
              labelStyle={{ color: "#e2e8f0" }}
              formatter={(value: number) => [`${value}°${unit === "fahrenheit" ? "F" : "C"}`, "Temperature"]}
            />
            <Area type="monotone" dataKey="temperature" stroke="#2F6FED" strokeWidth={2.5} fill="url(#tempGradient)" animationDuration={900} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

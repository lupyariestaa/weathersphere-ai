"use client";

import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { GlassCard } from "@/components/ui/GlassCard";
import { usePreferences } from "@/contexts/PreferencesContext";
import { celsiusTo } from "@/utils/units";
import { formatWeekday } from "@/utils/datetime";
import type { DailyForecastEntry } from "@/types/weather";

interface WeeklyTemperatureChartProps {
  daily: DailyForecastEntry[];
}

export function WeeklyTemperatureChart({ daily }: WeeklyTemperatureChartProps) {
  const { unit } = usePreferences();

  const data = daily.slice(0, 7).map((d, i) => ({
    day: i === 0 ? "Today" : formatWeekday(d.date, true),
    max: Math.round(celsiusTo(unit, d.tempMax)),
    min: Math.round(celsiusTo(unit, d.tempMin)),
  }));

  return (
    <GlassCard hoverLift={false}>
      <h3 className="font-display text-sm font-semibold text-slate-700 dark:text-white">
        Weekly temperature range
      </h3>
      <div className="mt-3 h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: "currentColor", opacity: 0.5 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "currentColor", opacity: 0.5 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}°`}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(15,23,42,0.85)",
                border: "none",
                borderRadius: 12,
                fontSize: 12,
              }}
              labelStyle={{ color: "#e2e8f0" }}
              formatter={(value: number, name: string) => [
                `${value}°${unit === "fahrenheit" ? "F" : "C"}`,
                name === "max" ? "High" : "Low",
              ]}
            />
            <Bar dataKey="max" radius={[6, 6, 0, 0]} animationDuration={800}>
              {data.map((_, i) => (
                <Cell key={i} fill="#2F6FED" opacity={0.75 + i * 0.03} />
              ))}
            </Bar>
            <Line
              type="monotone"
              dataKey="min"
              stroke="#22D3EE"
              strokeWidth={2}
              dot={{ fill: "#22D3EE", r: 3 }}
              animationDuration={800}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-4 rounded bg-sphere-blue/75" /> Daily high
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded bg-sphere-cyan" /> Daily low
        </span>
      </div>
    </GlassCard>
  );
}

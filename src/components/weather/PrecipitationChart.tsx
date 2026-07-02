"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatHour } from "@/utils/datetime";
import type { HourlyForecastEntry } from "@/types/weather";

interface PrecipitationChartProps {
  hourly: HourlyForecastEntry[];
}

export function PrecipitationChart({ hourly }: PrecipitationChartProps) {
  const data = hourly.slice(0, 24).map((h) => ({
    time: formatHour(h.time),
    probability: h.precipitationProbability,
  }));

  const hasPrecip = data.some((d) => d.probability > 0);

  return (
    <GlassCard hoverLift={false}>
      <h3 className="font-display text-sm font-semibold text-slate-700 dark:text-white">
        Rain probability
      </h3>
      {!hasPrecip && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          No precipitation expected in the next 24 hours.
        </p>
      )}
      {hasPrecip && (
        <div className="mt-3 h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barCategoryGap="25%">
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fill: "currentColor", opacity: 0.5 }}
                axisLine={false}
                tickLine={false}
                interval={3}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "currentColor", opacity: 0.5 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(15,23,42,0.85)",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 12,
                }}
                labelStyle={{ color: "#e2e8f0" }}
                formatter={(value: number) => [`${value}%`, "Rain chance"]}
              />
              <Bar dataKey="probability" radius={[4, 4, 0, 0]} animationDuration={800}>
                {data.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={
                      entry.probability >= 70
                        ? "#2F6FED"
                        : entry.probability >= 40
                        ? "#38bdf8"
                        : "#7dd3fc"
                    }
                    opacity={0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </GlassCard>
  );
}

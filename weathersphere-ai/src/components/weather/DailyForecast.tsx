"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Droplets, Wind } from "lucide-react";
import { WeatherIcon } from "./WeatherIcon";
import { GlassCard } from "@/components/ui/GlassCard";
import { usePreferences } from "@/contexts/PreferencesContext";
import { getWeatherInfo } from "@/constants/weatherCodes";
import { formatTemperature, formatWindSpeed } from "@/utils/units";
import { formatWeekday, formatDayMonth } from "@/utils/datetime";
import type { DailyForecastEntry } from "@/types/weather";

interface DailyForecastProps {
  daily: DailyForecastEntry[];
}

export function DailyForecast({ daily }: DailyForecastProps) {
  const { unit } = usePreferences();
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  return (
    <GlassCard hoverLift={false}>
      <h3 className="font-display text-sm font-semibold text-slate-700 dark:text-white">7-day forecast</h3>
      <div className="mt-3 flex flex-col divide-y divide-white/10">
        {daily.slice(0, 7).map((day, i) => {
          const { label } = getWeatherInfo(day.weatherCode);
          const expanded = expandedDate === day.date;
          return (
            <div key={day.date}>
              <button
                onClick={() => setExpandedDate(expanded ? null : day.date)}
                aria-expanded={expanded}
                className="flex w-full items-center gap-3 py-3 text-left"
              >
                <span className="w-12 text-sm font-medium text-slate-700 dark:text-slate-200">{i === 0 ? "Today" : formatWeekday(day.date)}</span>
                <WeatherIcon code={day.weatherCode} size={22} className="text-sphere-blue dark:text-sphere-cyan" />
                <span className="flex-1 truncate text-xs text-slate-500 dark:text-slate-400 sm:text-sm">{label}</span>
                {day.precipitationProbabilityMax > 0 && (
                  <span className="flex items-center gap-0.5 text-xs text-sphere-cyan">
                    <Droplets size={12} /> {day.precipitationProbabilityMax}%
                  </span>
                )}
                <span className="w-20 text-right text-sm tabular text-slate-500 dark:text-slate-400">
                  {formatTemperature(day.tempMin, unit, false)} / <span className="font-semibold text-slate-800 dark:text-white">{formatTemperature(day.tempMax, unit, false)}</span>
                </span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-3 gap-2 pb-3 text-xs text-slate-500 dark:text-slate-400">
                      <span>{formatDayMonth(day.date)}</span>
                      <span className="flex items-center gap-1"><Wind size={12} /> {formatWindSpeed(day.windSpeedMax)}</span>
                      <span>UV {day.uvIndexMax ? Math.round(day.uvIndexMax) : "—"}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

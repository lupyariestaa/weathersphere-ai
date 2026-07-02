"use client";

import { motion } from "framer-motion";
import { Droplets } from "lucide-react";
import { WeatherIcon } from "./WeatherIcon";
import { GlassCard } from "@/components/ui/GlassCard";
import { usePreferences } from "@/contexts/PreferencesContext";
import { formatTemperature } from "@/utils/units";
import { formatHour } from "@/utils/datetime";
import type { HourlyForecastEntry } from "@/types/weather";

interface HourlyForecastProps {
  hourly: HourlyForecastEntry[];
  isDay: boolean;
}

export function HourlyForecast({ hourly, isDay }: HourlyForecastProps) {
  const { unit } = usePreferences();

  return (
    <GlassCard hoverLift={false}>
      <h3 className="font-display text-sm font-semibold text-slate-700 dark:text-white">Hourly forecast</h3>
      <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
        {hourly.slice(0, 24).map((hour, i) => (
          <motion.div
            key={hour.time}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(i * 0.02, 0.4) }}
            whileHover={{ y: -3 }}
            className="flex w-[76px] shrink-0 flex-col items-center gap-2 rounded-xl2 bg-white/10 px-2 py-3 text-center"
          >
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{i === 0 ? "Now" : formatHour(hour.time)}</span>
            <WeatherIcon code={hour.weatherCode} isDay={isDay} size={22} className="text-sphere-blue dark:text-sphere-cyan" />
            <span className="text-sm font-semibold tabular text-slate-800 dark:text-white">{formatTemperature(hour.temperature, unit, false)}</span>
            {hour.precipitationProbability > 0 && (
              <span className="flex items-center gap-0.5 text-[10px] text-sphere-cyan">
                <Droplets size={10} /> {hour.precipitationProbability}%
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}

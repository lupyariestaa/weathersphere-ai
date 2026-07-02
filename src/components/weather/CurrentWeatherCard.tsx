"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Droplets, Eye, Gauge, MapPin, Star, Wind } from "lucide-react";
import { WeatherIcon } from "./WeatherIcon";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { usePreferences } from "@/contexts/PreferencesContext";
import { getWeatherInfo } from "@/constants/weatherCodes";
import { formatTemperature, formatWindSpeed } from "@/utils/units";
import { formatClock } from "@/utils/datetime";
import type { CurrentWeather, GeoLocation } from "@/types/weather";

interface CurrentWeatherCardProps {
  current: CurrentWeather;
  location: GeoLocation;
}

export function CurrentWeatherCard({ current, location }: CurrentWeatherCardProps) {
  const { unit, isFavorite, addFavorite, removeFavorite } = usePreferences();
  const { label } = getWeatherInfo(current.weatherCode);
  const favorited = isFavorite(location.id);

  return (
    <GlassCard className="relative overflow-hidden" hoverLift={false}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
          <MapPin size={15} />
          <span className="font-medium">{location.name}</span>
          {location.country && <span className="text-slate-400">, {location.country}</span>}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => (favorited ? removeFavorite(location.id) : addFavorite(location))}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={favorited}
        >
          <Star size={16} className={favorited ? "fill-amber-400 text-amber-400" : ""} />
        </Button>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <motion.span
          key={Math.round(current.temperature)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-display text-6xl font-semibold tabular tracking-tight text-slate-900 dark:text-white sm:text-7xl"
        >
          {formatTemperature(current.temperature, unit, false)}
        </motion.span>
        <div className="flex flex-col items-center gap-1">
          <WeatherIcon code={current.weatherCode} isDay={current.isDay} size={40} className="text-sphere-blue dark:text-sphere-cyan" />
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>
        </div>
      </div>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Feels like {formatTemperature(current.apparentTemperature, unit)} · {formatClock(current.time)}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniStat icon={<Droplets size={15} />} label="Humidity" value={`${Math.round(current.humidity)}%`} />
        <MiniStat icon={<Wind size={15} />} label="Wind" value={formatWindSpeed(current.windSpeed)} />
        <MiniStat icon={<Gauge size={15} />} label="Pressure" value={`${Math.round(current.pressure)} hPa`} />
        <MiniStat icon={<Eye size={15} />} label="Visibility" value={current.visibility ? `${Math.round(current.visibility / 1000)} km` : "—"} />
      </div>
    </GlassCard>
  );
}

function MiniStat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl2 bg-white/10 px-3 py-2.5">
      <span className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
        {icon} {label}
      </span>
      <span className="text-sm font-semibold tabular text-slate-800 dark:text-white">{value}</span>
    </div>
  );
}

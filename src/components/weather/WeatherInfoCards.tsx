"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import {
  Droplets,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  Thermometer,
  Wind,
  SunMedium,
  CloudRain,
} from "lucide-react";
import { WeatherIcon } from "@/components/weather/WeatherIcon";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useTheme } from "@/contexts/ThemeContext";
import { getWeatherInfo } from "@/constants/weatherCodes";
import { formatTemperature, formatWindSpeed, uvLabel } from "@/utils/units";
import { formatClock } from "@/utils/datetime";
import type { WeatherBundle } from "@/types/weather";

interface WeatherInfoCardsProps {
  bundle: WeatherBundle | null;
}

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 },
  }),
};

/** Skeleton version of a card — shown while data is loading */
function CardSkeleton({ height = "h-40" }: { height?: string }) {
  return (
    <div className={`skeleton rounded-xl3 ${height}`} />
  );
}

export function WeatherInfoCards({ bundle }: WeatherInfoCardsProps) {
  const { unit } = usePreferences();
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  const cardBase = isDark
    ? "bg-white/5 border border-white/10 backdrop-blur-xl"
    : "bg-white/60 border border-white/70 backdrop-blur-xl shadow-lg";

  const labelCls = isDark ? "text-slate-400" : "text-slate-500";
  const valueCls = isDark ? "text-white" : "text-slate-800";
  const subCls = isDark ? "text-slate-300" : "text-slate-600";

  if (!bundle) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <CardSkeleton height="h-44" />
        <CardSkeleton height="h-36" />
        <CardSkeleton height="h-32" />
      </div>
    );
  }

  const { current, daily, location } = bundle;
  const { label } = getWeatherInfo(current.weatherCode);
  const today = daily[0];
  const uvInfo = current.uvIndex ? uvLabel(current.uvIndex) : null;

  return (
    <div className="flex flex-col gap-4 w-full">

      {/* Card 1 — Main Temperature */}
      <motion.div
        custom={0}
        variants={cardVariants}
        initial="hidden"
        animate="show"
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className={`rounded-xl3 p-5 ${cardBase}`}
      >
        <div className={`text-xs font-semibold uppercase tracking-wider mb-3 ${labelCls}`}>
          Current conditions · {location.name}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className={`font-display text-5xl font-semibold tabular ${valueCls}`}>
              {formatTemperature(current.temperature, unit, false)}
            </div>
            <div className={`mt-1 text-sm ${subCls}`}>
              Feels like {formatTemperature(current.apparentTemperature, unit)}
            </div>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <WeatherIcon
              code={current.weatherCode}
              isDay={current.isDay}
              size={44}
              className={isDark ? "text-sphere-cyan" : "text-sphere-blue"}
            />
            <span className={`text-xs font-medium ${subCls}`}>{label}</span>
          </div>
        </div>

        {today && (
          <div className={`mt-3 flex items-center gap-1.5 text-xs ${labelCls}`}>
            <Thermometer size={13} />
            High {formatTemperature(today.tempMax, unit, false)} ·
            Low {formatTemperature(today.tempMin, unit, false)}
            <span className="mx-1">·</span>
            {formatClock(current.time)}
          </div>
        )}
      </motion.div>

      {/* Card 2 — Quick Stats Grid */}
      <motion.div
        custom={1}
        variants={cardVariants}
        initial="hidden"
        animate="show"
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className={`rounded-xl3 p-5 ${cardBase}`}
      >
        <div className={`text-xs font-semibold uppercase tracking-wider mb-3 ${labelCls}`}>
          Details
        </div>
        <div className="grid grid-cols-2 gap-3">
          <StatRow icon={<Droplets size={14} />} label="Humidity" value={`${Math.round(current.humidity)}%`} dark={isDark} />
          <StatRow icon={<Wind size={14} />} label="Wind" value={formatWindSpeed(current.windSpeed)} dark={isDark} />
          <StatRow icon={<Gauge size={14} />} label="Pressure" value={`${Math.round(current.pressure)} hPa`} dark={isDark} />
          <StatRow
            icon={<Eye size={14} />}
            label="Visibility"
            value={current.visibility ? `${Math.round(current.visibility / 1000)} km` : "—"}
            dark={isDark}
          />
        </div>
      </motion.div>

      {/* Card 3 — Sunrise / Rain / UV */}
      <motion.div
        custom={2}
        variants={cardVariants}
        initial="hidden"
        animate="show"
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className={`rounded-xl3 p-5 ${cardBase}`}
      >
        <div className={`text-xs font-semibold uppercase tracking-wider mb-3 ${labelCls}`}>
          Today's highlights
        </div>
        <div className="flex flex-col gap-2.5">
          {today && (
            <div className="flex items-center justify-between">
              <span className={`flex items-center gap-1.5 text-xs ${labelCls}`}>
                <Sunrise size={14} className="text-amber-400" /> Sunrise
              </span>
              <span className={`text-sm font-semibold tabular ${valueCls}`}>
                {formatClock(today.sunrise)}
              </span>
            </div>
          )}
          {today && (
            <div className="flex items-center justify-between">
              <span className={`flex items-center gap-1.5 text-xs ${labelCls}`}>
                <Sunset size={14} className="text-orange-400" /> Sunset
              </span>
              <span className={`text-sm font-semibold tabular ${valueCls}`}>
                {formatClock(today.sunset)}
              </span>
            </div>
          )}
          {today && (
            <div className="flex items-center justify-between">
              <span className={`flex items-center gap-1.5 text-xs ${labelCls}`}>
                <CloudRain size={14} className="text-sky-400" /> Rain chance
              </span>
              <span className={`text-sm font-semibold tabular ${valueCls}`}>
                {today.precipitationProbabilityMax}%
              </span>
            </div>
          )}
          {uvInfo && (
            <div className="flex items-center justify-between">
              <span className={`flex items-center gap-1.5 text-xs ${labelCls}`}>
                <SunMedium size={14} /> UV index
              </span>
              <span className="text-sm font-semibold" style={{ color: uvInfo.color }}>
                {current.uvIndex?.toFixed(1)} · {uvInfo.label}
              </span>
            </div>
          )}
        </div>
      </motion.div>

    </div>
  );
}

function StatRow({
  icon,
  label,
  value,
  dark,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  dark: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className={`flex items-center gap-1 text-[11px] ${dark ? "text-slate-400" : "text-slate-500"}`}>
        {icon} {label}
      </span>
      <span className={`text-sm font-semibold tabular ${dark ? "text-white" : "text-slate-800"}`}>
        {value}
      </span>
    </div>
  );
}

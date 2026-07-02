"use client";

import { ProgressRing } from "@/components/ui/ProgressRing";
import { GlassCard } from "@/components/ui/GlassCard";
import { aqiLabel } from "@/utils/units";
import type { AirQuality } from "@/types/weather";

interface AirQualityCardProps {
  airQuality: AirQuality | null;
}

const POLLUTANTS: { key: keyof AirQuality; label: string; unit: string }[] = [
  { key: "pm2_5", label: "Fine particles (PM2.5)", unit: "µg/m³" },
  { key: "pm10", label: "Coarse particles (PM10)", unit: "µg/m³" },
  { key: "ozone", label: "Ozone", unit: "µg/m³" },
  { key: "nitrogenDioxide", label: "Nitrogen dioxide", unit: "µg/m³" },
  { key: "sulphurDioxide", label: "Sulfur dioxide", unit: "µg/m³" },
  { key: "carbonMonoxide", label: "Carbon monoxide", unit: "µg/m³" },
];

export function AirQualityCard({ airQuality }: AirQualityCardProps) {
  // Gracefully hide rather than show an empty card when the data isn't available.
  if (!airQuality || airQuality.aqi === null) return null;

  const { label, color } = aqiLabel(airQuality.aqi);

  return (
    <GlassCard>
      <h3 className="font-display text-sm font-semibold text-slate-700 dark:text-white">Air quality</h3>
      <div className="mt-4 flex items-center gap-5">
        <ProgressRing value={Math.min(airQuality.aqi, 300) / 3} color={color} label={`${Math.round(airQuality.aqi)}`} />
        <div>
          <p className="text-base font-semibold" style={{ color }}>{label}</p>
          <p className="mt-1 max-w-[180px] text-xs text-slate-500 dark:text-slate-400">
            {airQuality.aqi <= 50
              ? "Air quality is good — ideal for outdoor activity."
              : airQuality.aqi <= 100
              ? "Acceptable air quality for most people."
              : "Sensitive groups should limit prolonged outdoor exertion."}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
        {POLLUTANTS.map(({ key, label: pLabel, unit }) => {
          const value = airQuality[key];
          if (value === null || typeof value !== "number") return null;
          return (
            <div key={key} className="rounded-xl2 bg-white/10 px-3 py-2">
              <p className="text-slate-500 dark:text-slate-400">{pLabel}</p>
              <p className="font-semibold tabular text-slate-800 dark:text-white">
                {value.toFixed(1)} <span className="font-normal text-slate-400">{unit}</span>
              </p>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Scale, X } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { SearchBar } from "@/components/search/SearchBar";
import { WeatherIcon } from "@/components/weather/WeatherIcon";
import { useCompareCities } from "@/hooks/useCompareCities";
import { usePreferences } from "@/contexts/PreferencesContext";
import { getWeatherInfo } from "@/constants/weatherCodes";
import { formatTemperature, formatWindSpeed } from "@/utils/units";
import type { GeoLocation } from "@/types/weather";

const MAX_COMPARE = 4;

export function CompareCities() {
  const [cities, setCities] = useState<GeoLocation[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const { unit } = usePreferences();
  const { bundles, loading } = useCompareCities(cities);

  const addCity = (city: GeoLocation) => {
    if (cities.some((c) => c.id === city.id) || cities.length >= MAX_COMPARE) return;
    setCities((prev) => [...prev, city]);
    setPickerOpen(false);
  };

  const removeCity = (id: number) => setCities((prev) => prev.filter((c) => c.id !== id));

  return (
    <GlassCard hoverLift={false}>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-slate-700 dark:text-white">Compare cities</h3>
        {cities.length < MAX_COMPARE && (
          <button
            onClick={() => setPickerOpen((v) => !v)}
            className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200"
          >
            <Plus size={13} /> Add city
          </button>
        )}
      </div>

      <AnimatePresence>
        {pickerOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 overflow-visible">
            <SearchBar onSelect={addCity} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4">
        {cities.length === 0 && !pickerOpen && (
          <EmptyState
            icon={<Scale size={20} />}
            title="No cities to compare yet"
            description="Add up to 4 cities to compare temperature, wind, and humidity side by side."
          />
        )}

        {cities.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {cities.map((city) => {
              const bundle = bundles[city.id];
              return (
                <div key={city.id} className="relative rounded-xl2 bg-white/10 p-4">
                  <button
                    onClick={() => removeCity(city.id)}
                    aria-label={`Remove ${city.name} from comparison`}
                    className="absolute right-2 top-2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  >
                    <X size={14} />
                  </button>

                  {loading && !bundle && (
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  )}

                  {bundle && (
                    <>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{city.name}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <WeatherIcon code={bundle.current.weatherCode} isDay={bundle.current.isDay} size={24} className="text-sphere-blue dark:text-sphere-cyan" />
                        <span className="font-display text-2xl font-semibold tabular text-slate-900 dark:text-white">
                          {formatTemperature(bundle.current.temperature, unit, false)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{getWeatherInfo(bundle.current.weatherCode).label}</p>
                      <div className="mt-2 grid grid-cols-2 gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <span>Humidity {Math.round(bundle.current.humidity)}%</span>
                        <span>Wind {formatWindSpeed(bundle.current.windSpeed)}</span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </GlassCard>
  );
}

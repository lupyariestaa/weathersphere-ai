"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchForecast } from "@/services/weatherService";
import { fetchAirQuality } from "@/services/airQualityService";
import { getCache, setCache } from "@/lib/cache";
import type { AsyncStatus, GeoLocation, WeatherBundle } from "@/types/weather";

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes — weather doesn't need to be fetched more often than this

/** Loads + caches the full weather bundle (current, hourly, daily, air quality) for a location. */
export function useWeatherBundle(location: GeoLocation | null) {
  const [bundle, setBundle] = useState<WeatherBundle | null>(null);
  const [status, setStatus] = useState<AsyncStatus>("idle");

  const load = useCallback(async (loc: GeoLocation, { force = false } = {}) => {
    const cacheKey = `weather:${loc.latitude.toFixed(2)}:${loc.longitude.toFixed(2)}`;
    if (!force) {
      const cached = getCache<WeatherBundle>(cacheKey);
      if (cached) {
        setBundle(cached);
        setStatus("success");
        return;
      }
    }
    setStatus("loading");
    try {
      const [forecast, airQuality] = await Promise.all([
        fetchForecast(loc.latitude, loc.longitude),
        fetchAirQuality(loc.latitude, loc.longitude),
      ]);
      const next: WeatherBundle = {
        location: loc,
        current: forecast.current,
        hourly: forecast.hourly,
        daily: forecast.daily,
        airQuality,
        fetchedAt: Date.now(),
      };
      setBundle(next);
      setStatus("success");
      setCache(cacheKey, next, CACHE_TTL_MS);
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (location) void load(location);
  }, [location, load]);

  const refresh = useCallback(() => {
    if (location) void load(location, { force: true });
  }, [location, load]);

  return { bundle, status, refresh };
}

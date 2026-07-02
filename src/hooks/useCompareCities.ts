"use client";

import { useEffect, useState } from "react";
import { fetchForecast } from "@/services/weatherService";
import type { GeoLocation, WeatherBundle } from "@/types/weather";

/** Fetches forecasts for a small set of cities in parallel for the comparison view. */
export function useCompareCities(cities: GeoLocation[]) {
  const [bundles, setBundles] = useState<Record<number, WeatherBundle | null>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cities.length === 0) {
      setBundles({});
      return;
    }
    let cancelled = false;
    setLoading(true);

    Promise.all(
      cities.map(async (city) => {
        try {
          const forecast = await fetchForecast(city.latitude, city.longitude);
          return [city.id, { location: city, ...forecast, airQuality: null, fetchedAt: Date.now() } as WeatherBundle] as const;
        } catch {
          return [city.id, null] as const;
        }
      })
    ).then((results) => {
      if (cancelled) return;
      setBundles(Object.fromEntries(results));
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [cities]);

  return { bundles, loading };
}

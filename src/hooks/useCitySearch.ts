"use client";

import { useEffect, useState } from "react";
import { searchCities } from "@/services/geocodingService";
import { useDebouncedValue } from "./useDebouncedValue";
import type { GeoLocation } from "@/types/weather";
import type { AsyncStatus } from "@/types/weather";

export function useCitySearch(query: string) {
  const debounced = useDebouncedValue(query.trim(), 350);
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [status, setStatus] = useState<AsyncStatus>("idle");

  useEffect(() => {
    if (!debounced) {
      setResults([]);
      setStatus("idle");
      return;
    }
    let cancelled = false;
    setStatus("loading");
    searchCities(debounced)
      .then((cities) => {
        if (cancelled) return;
        setResults(cities);
        setStatus(cities.length ? "success" : "empty");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  return { results, status };
}

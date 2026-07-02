"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/Skeleton";
import type { GeoLocation, CurrentWeather } from "@/types/weather";

const WeatherMap = dynamic(() => import("./WeatherMap").then((m) => m.WeatherMap), {
  ssr: false,
  loading: () => <Skeleton className="h-72 w-full sm:h-80" />,
});

interface WeatherMapLoaderProps {
  location: GeoLocation;
  current: CurrentWeather;
}

/** Leaflet touches `window` on import, so the map must never render on the server. */
export function WeatherMapLoader(props: WeatherMapLoaderProps) {
  return <WeatherMap {...props} />;
}

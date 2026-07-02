"use client";

import dynamic from "next/dynamic";
import type { WeatherGroup } from "@/constants/weatherCodes";

const EarthScene = dynamic(() => import("./EarthScene").then((m) => m.EarthScene), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-48 w-48 animate-pulse rounded-full bg-white/10 sm:h-64 sm:w-64" />
    </div>
  ),
});

interface EarthSceneLoaderProps {
  isDay: boolean;
  weatherGroup: WeatherGroup;
  cloudCover: number;
}

/** Lazily loads the (relatively heavy) Three.js bundle only on the client, only when needed. */
export function EarthSceneLoader(props: EarthSceneLoaderProps) {
  return <EarthScene {...props} />;
}

"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Earth } from "./Earth";
import { WeatherParticles } from "./WeatherParticles";
import { EarthFallback } from "./EarthFallback";
import type { WeatherGroup } from "@/constants/weatherCodes";

interface EarthSceneProps {
  isDay: boolean;
  weatherGroup: WeatherGroup;
  cloudCover: number;
}

function supportsWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

export function EarthScene({ isDay, weatherGroup, cloudCover }: EarthSceneProps) {
  const [webglOk, setWebglOk] = useState<boolean | null>(null);
  const [active, setActive] = useState(true);

  useEffect(() => { setWebglOk(supportsWebGL()); }, []);
  useEffect(() => {
    const onVis = () => setActive(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  if (webglOk === false) return <EarthFallback />;

  return (
    <div className="relative h-full w-full">
      <Canvas dpr={[1, 1.75]} frameloop={active ? "always" : "never"} camera={{ position: [0, 0, 5.2], fov: 42 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
        <ambientLight intensity={isDay ? 0.35 : 0.12} />
        <directionalLight position={[3, 2, 4]} intensity={isDay ? 1.4 : 0.25} color={isDay ? "#fff6e0" : "#7d97ff"} />
        <Suspense fallback={null}>
          <Earth isDay={isDay} weatherGroup={weatherGroup} cloudCover={cloudCover} />
          <WeatherParticles weatherGroup={weatherGroup} isDay={isDay} />
        </Suspense>
      </Canvas>
    </div>
  );
}

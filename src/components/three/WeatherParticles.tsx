"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointLight } from "three";
import { Stars } from "@react-three/drei";
import type { WeatherGroup } from "@/constants/weatherCodes";

interface WeatherParticlesProps {
  weatherGroup: WeatherGroup;
  isDay: boolean;
}

const RAIN_COUNT = 260;
const SNOW_COUNT = 180;

function FallingParticles({ count, speed, length, color }: { count: number; speed: number; length: number; color: string }) {
  const pointsRef = useRef<Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 5.5;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 5.5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 5.5;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    const geo = pointsRef.current?.geometry;
    if (!geo) return;
    const pos = geo.attributes.position as unknown as { array: Float32Array; needsUpdate: boolean };
    for (let i = 0; i < count; i++) {
      pos.array[i * 3 + 1] -= speed * delta;
      if (pos.array[i * 3 + 1] < -2.8) pos.array[i * 3 + 1] = 2.8;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={length} sizeAttenuation transparent opacity={0.55} depthWrite={false} />
    </points>
  );
}

function LightningFlash() {
  const lightRef = useRef<PointLight>(null);
  const [, forceTick] = useState(0);

  useFrame(() => {
    if (Math.random() < 0.004 && lightRef.current) {
      lightRef.current.intensity = 6 + Math.random() * 6;
      setTimeout(() => {
        if (lightRef.current) lightRef.current.intensity = 0;
      }, 90 + Math.random() * 120);
      forceTick((t) => t + 1);
    } else if (lightRef.current && lightRef.current.intensity > 0) {
      lightRef.current.intensity *= 0.8;
    }
  });

  return <pointLight ref={lightRef} position={[2, 3, 2]} color="#cdd9ff" intensity={0} distance={12} />;
}

/** Renders the right ambient particle system for the current weather, and nothing when conditions are calm. */
export function WeatherParticles({ weatherGroup, isDay }: WeatherParticlesProps) {
  return (
    <>
      {!isDay && <Stars radius={40} depth={20} count={1400} factor={2} saturation={0} fade speed={0.4} />}

      {(weatherGroup === "rain" || weatherGroup === "rain-shower" || weatherGroup === "drizzle" || weatherGroup === "freezing-rain") && (
        <FallingParticles count={RAIN_COUNT} speed={4.2} length={0.025} color="#bcd4ff" />
      )}

      {(weatherGroup === "snow" || weatherGroup === "snow-shower") && (
        <FallingParticles count={SNOW_COUNT} speed={0.6} length={0.05} color="#ffffff" />
      )}

      {weatherGroup === "thunderstorm" && (
        <>
          <FallingParticles count={RAIN_COUNT} speed={5} length={0.025} color="#a9b9e6" />
          <LightningFlash />
        </>
      )}
    </>
  );
}

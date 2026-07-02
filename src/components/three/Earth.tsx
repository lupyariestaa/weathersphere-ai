"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Group, Mesh } from "three";
import * as THREE from "three";
import "./earthShaders";
import type { WeatherGroup } from "@/constants/weatherCodes";

interface EarthProps {
  isDay: boolean;
  weatherGroup: WeatherGroup;
  cloudCover: number; // 0-100
}

/** The hero of the experience: a slowly rotating, low-poly, procedurally shaded planet. */
export function Earth({ isDay, weatherGroup, cloudCover }: EarthProps) {
  const groupRef = useRef<Group>(null);
  const earthMeshRef = useRef<Mesh>(null);
  const cloudsRef = useRef<Mesh>(null);
  const { pointer } = useThree();

  const sunDirection = useMemo<[number, number, number]>(() => {
    return isDay ? [1, 0.35, 0.65] : [-1, -0.2, -0.4];
  }, [isDay]);

  const dayIntensity = weatherGroup === "thunderstorm" ? 0.65 : weatherGroup === "cloudy" || weatherGroup === "fog" ? 0.8 : 1;
  const cloudOpacity = Math.min(0.85, 0.15 + cloudCover / 130);

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Gentle continuous rotation — the planet should always feel alive, never static.
      groupRef.current.rotation.y += delta * 0.06;
      // Subtle floating motion.
      groupRef.current.position.y = Math.sin(performance.now() / 1800) * 0.08;
      // Mouse parallax — small, premium, never aggressive.
      groupRef.current.rotation.x += (pointer.y * 0.15 - groupRef.current.rotation.x) * 0.04;
      groupRef.current.rotation.z += (-pointer.x * 0.08 - groupRef.current.rotation.z) * 0.04;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.085;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={earthMeshRef}>
        <icosahedronGeometry args={[1.6, 4]} />
        {/* @ts-ignore — custom shader material registered via extend(), not in ThreeElements types */}
        <earthMaterial
          uSunDirection={sunDirection}
          uDayIntensity={dayIntensity}
          key={`${isDay}-${weatherGroup}`}
        />
      </mesh>

      <mesh ref={cloudsRef} scale={1.025}>
        <icosahedronGeometry args={[1.6, 3]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={cloudOpacity} roughness={1} depthWrite={false} />
      </mesh>

      <mesh scale={1.18}>
        <icosahedronGeometry args={[1.6, 3]} />
        {/* @ts-ignore — custom shader material registered via extend(), not in ThreeElements types */}
        <atmosphereMaterial
          uGlowColor={weatherGroup === "thunderstorm" ? "#a78bfa" : isDay ? "#7ec8ff" : "#3b5bcf"}
          uIntensity={isDay ? 1.1 : 0.7}
          transparent
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

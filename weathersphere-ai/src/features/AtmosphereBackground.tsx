"use client";

import { motion } from "framer-motion";
import { getAtmosphereTheme } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import type { WeatherGroup } from "@/constants/weatherCodes";

interface AtmosphereBackgroundProps {
  weatherGroup: WeatherGroup;
}

/**
 * Full-bleed background. Colour is driven by the USER's chosen
 * light/dark mode — not by time of day. Weather only shifts the hue
 * within that light or dark palette. Transitions always animate smoothly.
 */
export function AtmosphereBackground({ weatherGroup }: AtmosphereBackgroundProps) {
  const { resolvedTheme } = useTheme();
  const theme = getAtmosphereTheme(weatherGroup, resolvedTheme);

  return (
    <motion.div
      className="fixed inset-0 -z-10 overflow-hidden"
      animate={{
        background: `linear-gradient(160deg, ${theme.gradient[0]} 0%, ${theme.gradient[1]} 50%, ${theme.gradient[2]} 100%)`,
      }}
      transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="noise-overlay absolute inset-0" />
      <motion.div
        className="absolute -top-40 left-1/4 h-[28rem] w-[28rem] rounded-full blur-3xl"
        animate={{ backgroundColor: theme.glow, opacity: resolvedTheme === "light" ? 0.45 : 0.25 }}
        transition={{ duration: 1.6 }}
      />
      <motion.div
        className="absolute bottom-0 right-0 h-96 w-96 rounded-full blur-3xl"
        animate={{ backgroundColor: theme.accent, opacity: resolvedTheme === "light" ? 0.3 : 0.22 }}
        transition={{ duration: 1.6 }}
      />
    </motion.div>
  );
}

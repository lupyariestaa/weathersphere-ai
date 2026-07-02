import type { WeatherGroup } from "./weatherCodes";

export interface AtmosphereTheme {
  gradient: [string, string, string];
  glow: string;
  accent: string;
  label: string;
}

/**
 * LIGHT MODE palettes — always bright regardless of time of day.
 * Weather tints the hue, but the page always stays readable and airy.
 */
const LIGHT_THEMES: Record<WeatherGroup, AtmosphereTheme> = {
  clear:           { gradient: ["#dbeafe", "#bfdbfe", "#93c5fd"], glow: "#fde68a", accent: "#2f6fed", label: "sunny" },
  "partly-cloudy": { gradient: ["#e0eaf8", "#c7d9f0", "#a8c2e8"], glow: "#e2e8f0", accent: "#60a5fa", label: "partly cloudy" },
  cloudy:          { gradient: ["#e8edf3", "#d1dae6", "#b8c5d4"], glow: "#cbd5e1", accent: "#94a3b8", label: "cloudy" },
  fog:             { gradient: ["#eef0f3", "#dde1e7", "#caced6"], glow: "#e2e8f0", accent: "#94a3b8", label: "foggy" },
  drizzle:         { gradient: ["#dce8f5", "#bdd4ec", "#9dbfdf"], glow: "#bae6fd", accent: "#38bdf8", label: "drizzling" },
  rain:            { gradient: ["#ccdff5", "#a8c8ec", "#83b0e0"], glow: "#7dd3fc", accent: "#3b82f6", label: "rainy" },
  "rain-shower":   { gradient: ["#cfddf0", "#aecae6", "#8db5db"], glow: "#7dd3fc", accent: "#3b82f6", label: "showery" },
  "freezing-rain": { gradient: ["#d5e8f0", "#b0d3e8", "#88bcd8"], glow: "#a5f3fc", accent: "#0891b2", label: "icy" },
  snow:            { gradient: ["#f0f6ff", "#e2edff", "#cfe0ff"], glow: "#ffffff", accent: "#93c5fd", label: "snowy" },
  "snow-shower":   { gradient: ["#edf3fb", "#dae6f5", "#c5d8ef"], glow: "#ffffff", accent: "#93c5fd", label: "snow showers" },
  thunderstorm:    { gradient: ["#d4cde8", "#b8aed9", "#9b8ec8"], glow: "#a78bfa", accent: "#7c3aed", label: "stormy" },
};

/**
 * DARK MODE palettes — always deep regardless of time of day.
 * Weather shifts the colour temperature, never the overall depth.
 */
const DARK_THEMES: Record<WeatherGroup, AtmosphereTheme> = {
  clear:           { gradient: ["#0f1a3d", "#0a1230", "#040714"], glow: "#fde68a", accent: "#2f6fed", label: "clear" },
  "partly-cloudy": { gradient: ["#101a35", "#0c1428", "#050811"], glow: "#94a3c9", accent: "#475a9e", label: "partly cloudy" },
  cloudy:          { gradient: ["#161c28", "#10141d", "#070910"], glow: "#64748b", accent: "#3a455c", label: "cloudy" },
  fog:             { gradient: ["#1b2030", "#141823", "#08090f"], glow: "#7c8aa0", accent: "#475569", label: "foggy" },
  drizzle:         { gradient: ["#0e1830", "#0a1224", "#040711"], glow: "#38bdf8", accent: "#0369a1", label: "drizzling" },
  rain:            { gradient: ["#0c1426", "#080e1c", "#03050c"], glow: "#3b82c4", accent: "#1d4ed8", label: "rainy" },
  "rain-shower":   { gradient: ["#0d1527", "#090f1e", "#03050d"], glow: "#3b82c4", accent: "#1d4ed8", label: "showery" },
  "freezing-rain": { gradient: ["#0b1a24", "#08121c", "#03070d"], glow: "#67c9d8", accent: "#0891b2", label: "icy" },
  snow:            { gradient: ["#121c30", "#0d1525", "#05080f"], glow: "#e0eeff", accent: "#60a5fa", label: "snowy" },
  "snow-shower":   { gradient: ["#111a2e", "#0c1323", "#050810"], glow: "#d0e4ff", accent: "#60a5fa", label: "snow showers" },
  thunderstorm:    { gradient: ["#1c1430", "#120c22", "#050310"], glow: "#a78bfa", accent: "#7c3aed", label: "stormy" },
};

/**
 * Selects the right palette based on the USER's theme preference,
 * not the time of day. isDay is still passed in for components that
 * need it (e.g. the sun card arc), but it no longer drives background color.
 */
export function getAtmosphereTheme(
  group: WeatherGroup,
  resolvedTheme: "light" | "dark"
): AtmosphereTheme {
  return resolvedTheme === "dark" ? DARK_THEMES[group] : LIGHT_THEMES[group];
}

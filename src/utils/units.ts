import type { TemperatureUnit } from "@/types/weather";

export function celsiusTo(unit: TemperatureUnit, celsius: number): number {
  return unit === "fahrenheit" ? celsius * (9 / 5) + 32 : celsius;
}

export function formatTemperature(celsius: number, unit: TemperatureUnit, withUnit = true): string {
  const value = Math.round(celsiusTo(unit, celsius));
  return withUnit ? `${value}°${unit === "fahrenheit" ? "F" : "C"}` : `${value}°`;
}

export function windDirectionLabel(deg: number): string {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return directions[Math.round(deg / 22.5) % 16];
}

export function formatWindSpeed(kmh: number): string {
  return `${Math.round(kmh)} km/h`;
}

export function formatDistanceKm(km: number): string {
  if (km >= 10) return `${Math.round(km)} km`;
  return `${km.toFixed(1)} km`;
}

export function aqiLabel(aqi: number): { label: string; color: string } {
  if (aqi <= 50) return { label: "Good", color: "#34D399" };
  if (aqi <= 100) return { label: "Moderate", color: "#FBBF24" };
  if (aqi <= 150) return { label: "Unhealthy for Sensitive Groups", color: "#FB923C" };
  if (aqi <= 200) return { label: "Unhealthy", color: "#F87171" };
  if (aqi <= 300) return { label: "Very Unhealthy", color: "#C084FC" };
  return { label: "Hazardous", color: "#7F1D1D" };
}

export function uvLabel(uv: number): { label: string; color: string } {
  if (uv < 3) return { label: "Low", color: "#34D399" };
  if (uv < 6) return { label: "Moderate", color: "#FBBF24" };
  if (uv < 8) return { label: "High", color: "#FB923C" };
  if (uv < 11) return { label: "Very High", color: "#F87171" };
  return { label: "Extreme", color: "#C084FC" };
}

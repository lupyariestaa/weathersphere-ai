/**
 * WMO Weather interpretation codes, as used by Open-Meteo.
 * https://open-meteo.com/en/docs
 */
export type WeatherGroup =
  | "clear"
  | "partly-cloudy"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "freezing-rain"
  | "snow"
  | "rain-shower"
  | "snow-shower"
  | "thunderstorm";

export interface WeatherCodeInfo {
  label: string;
  group: WeatherGroup;
}

export const WEATHER_CODE_MAP: Record<number, WeatherCodeInfo> = {
  0: { label: "Clear sky", group: "clear" },
  1: { label: "Mostly clear", group: "clear" },
  2: { label: "Partly cloudy", group: "partly-cloudy" },
  3: { label: "Overcast", group: "cloudy" },
  45: { label: "Fog", group: "fog" },
  48: { label: "Rime fog", group: "fog" },
  51: { label: "Light drizzle", group: "drizzle" },
  53: { label: "Drizzle", group: "drizzle" },
  55: { label: "Dense drizzle", group: "drizzle" },
  56: { label: "Freezing drizzle", group: "freezing-rain" },
  57: { label: "Dense freezing drizzle", group: "freezing-rain" },
  61: { label: "Light rain", group: "rain" },
  63: { label: "Rain", group: "rain" },
  65: { label: "Heavy rain", group: "rain" },
  66: { label: "Freezing rain", group: "freezing-rain" },
  67: { label: "Heavy freezing rain", group: "freezing-rain" },
  71: { label: "Light snow", group: "snow" },
  73: { label: "Snow", group: "snow" },
  75: { label: "Heavy snow", group: "snow" },
  77: { label: "Snow grains", group: "snow" },
  80: { label: "Light showers", group: "rain-shower" },
  81: { label: "Showers", group: "rain-shower" },
  82: { label: "Violent showers", group: "rain-shower" },
  85: { label: "Snow showers", group: "snow-shower" },
  86: { label: "Heavy snow showers", group: "snow-shower" },
  95: { label: "Thunderstorm", group: "thunderstorm" },
  96: { label: "Thunderstorm + hail", group: "thunderstorm" },
  99: { label: "Severe thunderstorm + hail", group: "thunderstorm" },
};

export function getWeatherInfo(code: number): WeatherCodeInfo {
  return WEATHER_CODE_MAP[code] ?? { label: "Unknown", group: "cloudy" };
}

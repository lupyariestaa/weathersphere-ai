export interface GeoLocation {
  id: number;
  name: string;
  country: string;
  countryCode: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  isDay: boolean;
  precipitation: number;
  weatherCode: number;
  cloudCover: number;
  pressure: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  uvIndex: number | null;
  visibility: number | null;
  time: string;
}

export interface HourlyForecastEntry {
  time: string;
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  precipitationProbability: number;
  windSpeed: number;
  humidity: number;
  uvIndex: number | null;
  visibility: number | null;
}

export interface DailyForecastEntry {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationProbabilityMax: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number | null;
  windSpeedMax: number;
  daylightDurationSeconds: number;
}

export interface AirQuality {
  aqi: number | null;
  pm10: number | null;
  pm2_5: number | null;
  ozone: number | null;
  nitrogenDioxide: number | null;
  sulphurDioxide: number | null;
  carbonMonoxide: number | null;
}

export interface WeatherBundle {
  location: GeoLocation;
  current: CurrentWeather;
  hourly: HourlyForecastEntry[];
  daily: DailyForecastEntry[];
  airQuality: AirQuality | null;
  fetchedAt: number;
}

export type TemperatureUnit = "celsius" | "fahrenheit";
export type ThemeMode = "light" | "dark" | "system";

export type AsyncStatus = "idle" | "loading" | "success" | "empty" | "error" | "offline";

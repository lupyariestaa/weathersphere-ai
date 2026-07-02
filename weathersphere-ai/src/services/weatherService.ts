import { fetchJson } from "@/lib/http";
import type { CurrentWeather, DailyForecastEntry, HourlyForecastEntry } from "@/types/weather";

const FORECAST_BASE = "https://api.open-meteo.com/v1/forecast";

const CURRENT_VARS = [
  "temperature_2m",
  "relative_humidity_2m",
  "apparent_temperature",
  "is_day",
  "precipitation",
  "weather_code",
  "cloud_cover",
  "pressure_msl",
  "wind_speed_10m",
  "wind_direction_10m",
  "wind_gusts_10m",
].join(",");

const HOURLY_VARS = [
  "temperature_2m",
  "apparent_temperature",
  "precipitation_probability",
  "weather_code",
  "wind_speed_10m",
  "relative_humidity_2m",
  "uv_index",
  "visibility",
].join(",");

const DAILY_VARS = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "precipitation_probability_max",
  "sunrise",
  "sunset",
  "uv_index_max",
  "wind_speed_10m_max",
  "daylight_duration",
].join(",");

interface RawForecastResponse {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    weather_code: number;
    cloud_cover: number;
    pressure_msl: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    apparent_temperature: number[];
    precipitation_probability: number[];
    weather_code: number[];
    wind_speed_10m: number[];
    relative_humidity_2m: number[];
    uv_index: number[];
    visibility: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
    wind_speed_10m_max: number[];
    daylight_duration: number[];
  };
}

export interface ForecastBundle {
  current: CurrentWeather;
  hourly: HourlyForecastEntry[];
  daily: DailyForecastEntry[];
}

/** Open-Meteo Forecast API — free, keyless current/hourly/daily weather. */
export async function fetchForecast(latitude: number, longitude: number): Promise<ForecastBundle> {
  const url =
    `${FORECAST_BASE}?latitude=${latitude}&longitude=${longitude}` +
    `&current=${CURRENT_VARS}&hourly=${HOURLY_VARS}&daily=${DAILY_VARS}` +
    `&timezone=auto&forecast_days=8`;

  const data = await fetchJson<RawForecastResponse>(url, { retries: 2 });

  const current: CurrentWeather = {
    temperature: data.current.temperature_2m,
    apparentTemperature: data.current.apparent_temperature,
    isDay: data.current.is_day === 1,
    precipitation: data.current.precipitation,
    weatherCode: data.current.weather_code,
    cloudCover: data.current.cloud_cover,
    pressure: data.current.pressure_msl,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    windDirection: data.current.wind_direction_10m,
    windGusts: data.current.wind_gusts_10m,
    uvIndex: pickNearestHourly(data.hourly.time, data.hourly.uv_index, data.current.time),
    visibility: pickNearestHourly(data.hourly.time, data.hourly.visibility, data.current.time),
    time: data.current.time,
  };

  const nowIndex = data.hourly.time.findIndex((t) => t >= data.current.time);
  const startIndex = Math.max(nowIndex, 0);

  const hourly: HourlyForecastEntry[] = data.hourly.time
    .slice(startIndex, startIndex + 24)
    .map((time, i) => {
      const idx = startIndex + i;
      return {
        time,
        temperature: data.hourly.temperature_2m[idx],
        apparentTemperature: data.hourly.apparent_temperature[idx],
        weatherCode: data.hourly.weather_code[idx],
        precipitationProbability: data.hourly.precipitation_probability[idx],
        windSpeed: data.hourly.wind_speed_10m[idx],
        humidity: data.hourly.relative_humidity_2m[idx],
        uvIndex: data.hourly.uv_index?.[idx] ?? null,
        visibility: data.hourly.visibility?.[idx] ?? null,
      };
    });

  const daily: DailyForecastEntry[] = data.daily.time.map((date, idx) => ({
    date,
    weatherCode: data.daily.weather_code[idx],
    tempMax: data.daily.temperature_2m_max[idx],
    tempMin: data.daily.temperature_2m_min[idx],
    precipitationProbabilityMax: data.daily.precipitation_probability_max[idx],
    sunrise: data.daily.sunrise[idx],
    sunset: data.daily.sunset[idx],
    uvIndexMax: data.daily.uv_index_max?.[idx] ?? null,
    windSpeedMax: data.daily.wind_speed_10m_max[idx],
    daylightDurationSeconds: data.daily.daylight_duration[idx],
  }));

  return { current, hourly, daily };
}

function pickNearestHourly(times: string[], values: number[] | undefined, target: string): number | null {
  if (!values) return null;
  const idx = times.findIndex((t) => t >= target);
  const safeIdx = idx === -1 ? values.length - 1 : idx;
  return values[safeIdx] ?? null;
}

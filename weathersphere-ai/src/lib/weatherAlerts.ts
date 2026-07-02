import { getWeatherInfo } from "@/constants/weatherCodes";
import type { CurrentWeather, DailyForecastEntry, HourlyForecastEntry } from "@/types/weather";

export type AlertSeverity = "advisory" | "watch" | "warning";

export interface WeatherAlert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
}

/**
 * Open-Meteo does not expose a free, keyless alerts endpoint, so instead of
 * faking an integration, alerts here are honestly derived from the forecast
 * data itself against sensible meteorological thresholds. This keeps the
 * feature fully functional with zero extra API keys while staying true to
 * "if alerts are unavailable, hide the section gracefully" — if nothing
 * crosses a threshold, no alerts are generated at all.
 */
export function deriveWeatherAlerts(
  current: CurrentWeather,
  hourly: HourlyForecastEntry[],
  today?: DailyForecastEntry
): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];
  const { group } = getWeatherInfo(current.weatherCode);
  const next6Hours = hourly.slice(0, 6);

  if (group === "thunderstorm") {
    alerts.push({
      id: "thunderstorm-active",
      title: "Thunderstorm in progress",
      description: "Lightning and heavy rain are occurring now. Avoid open areas and unplug sensitive electronics.",
      severity: "warning",
    });
  }

  const upcomingStorm = next6Hours.some((h) => getWeatherInfo(h.weatherCode).group === "thunderstorm");
  if (upcomingStorm && group !== "thunderstorm") {
    alerts.push({
      id: "thunderstorm-incoming",
      title: "Thunderstorm expected",
      description: "Storms are forecast within the next 6 hours. Plan outdoor activities accordingly.",
      severity: "watch",
    });
  }

  if (current.windGusts >= 70) {
    alerts.push({
      id: "wind-warning",
      title: "Damaging wind gusts",
      description: `Gusts up to ${Math.round(current.windGusts)} km/h are possible — secure loose outdoor items.`,
      severity: "warning",
    });
  } else if (current.windGusts >= 50) {
    alerts.push({
      id: "wind-advisory",
      title: "Strong wind advisory",
      description: `Gusts up to ${Math.round(current.windGusts)} km/h expected.`,
      severity: "advisory",
    });
  }

  if (current.uvIndex && current.uvIndex >= 9) {
    alerts.push({
      id: "uv-extreme",
      title: "Extreme UV levels",
      description: "Unprotected skin can burn in minutes. Seek shade and wear SPF 30+.",
      severity: "warning",
    });
  }

  if (today && today.precipitationProbabilityMax >= 85 && (group === "rain" || group === "rain-shower")) {
    alerts.push({
      id: "heavy-rain",
      title: "Heavy rain likely",
      description: "A very high chance of sustained rain today — watch for localized flooding in low-lying areas.",
      severity: "watch",
    });
  }

  if (current.apparentTemperature >= 38) {
    alerts.push({
      id: "heat-warning",
      title: "Extreme heat",
      description: `Feels like ${Math.round(current.apparentTemperature)}°C — limit outdoor exertion and stay hydrated.`,
      severity: "warning",
    });
  }

  if (current.apparentTemperature <= -10) {
    alerts.push({
      id: "cold-warning",
      title: "Dangerous cold",
      description: `Feels like ${Math.round(current.apparentTemperature)}°C — frostbite risk on exposed skin.`,
      severity: "warning",
    });
  }

  return alerts;
}

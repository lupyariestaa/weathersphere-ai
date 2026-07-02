import { getWeatherInfo } from "@/constants/weatherCodes";
import type { CurrentWeather, DailyForecastEntry, HourlyForecastEntry } from "@/types/weather";

function timeGreeting(hour: number): string {
  if (hour < 5) return "Still up late";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
}

/** Generates a short, human, non-repetitive greeting from live conditions instead of static copy. */
export function generateGreeting(current: CurrentWeather, locationName: string, nextHour?: HourlyForecastEntry): string {
  const hour = new Date(current.time).getHours();
  const greeting = timeGreeting(hour);
  const { group } = getWeatherInfo(current.weatherCode);

  if (nextHour && nextHour.precipitationProbability >= 60 && group !== "rain" && group !== "thunderstorm") {
    return `${greeting}! Rain looks likely within the hour in ${locationName} — worth keeping an umbrella close.`;
  }
  if (group === "thunderstorm") {
    return `${greeting}. There's a thunderstorm moving through ${locationName} right now — best to stay indoors for a bit.`;
  }
  if (group === "clear" && current.uvIndex && current.uvIndex >= 6) {
    return `${greeting}! Clear skies over ${locationName}, but the UV is high — sunscreen earns its keep today.`;
  }
  if (group === "clear") {
    return `${greeting}! ${locationName} is looking beautifully clear right now.`;
  }
  if (group === "snow" || group === "snow-shower") {
    return `${greeting}. Snow is falling over ${locationName} — a good day to slow down and stay warm.`;
  }
  return `${greeting}! Here's how things look over ${locationName} right now.`;
}

/** Short, data-driven recommendations — never hardcoded boilerplate. */
export function generateRecommendations(current: CurrentWeather, today?: DailyForecastEntry): string[] {
  const tips: string[] = [];
  const { group } = getWeatherInfo(current.weatherCode);

  if (current.uvIndex && current.uvIndex >= 6) tips.push("UV is high — sunglasses and sunscreen recommended.");
  if (group === "rain" || group === "rain-shower" || group === "drizzle" || group === "thunderstorm") tips.push("Carry an umbrella or waterproof layer.");
  if (current.windSpeed >= 35) tips.push("Strong winds today — secure loose items outdoors.");
  if (current.apparentTemperature <= 5) tips.push("Feels cold out — a warm jacket is a good idea.");
  if (current.apparentTemperature >= 30) tips.push("It feels hot — stay hydrated and seek shade.");
  if (group === "clear" && current.apparentTemperature >= 18 && current.apparentTemperature <= 27) tips.push("Comfortable conditions — great for outdoor activities.");
  if (today && today.precipitationProbabilityMax <= 10 && group !== "snow") tips.push("Low rain chance today — a good day to be outside.");

  return tips.slice(0, 3);
}

/** A short natural-language summary of the day, built from the data rather than a template string. */
export function generateDailySummary(current: CurrentWeather, today?: DailyForecastEntry): string {
  const { label } = getWeatherInfo(current.weatherCode);
  if (!today) return `Currently ${label.toLowerCase()}.`;

  const rainNote =
    today.precipitationProbabilityMax >= 60
      ? "Rain is likely later."
      : today.precipitationProbabilityMax >= 30
      ? "There's a moderate chance of rain."
      : "Low chance of rain.";

  return `Today is mostly ${label.toLowerCase()} with highs near ${Math.round(today.tempMax)}° and lows around ${Math.round(today.tempMin)}°. ${rainNote}`;
}

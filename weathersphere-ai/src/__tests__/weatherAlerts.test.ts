import { describe, it, expect } from "vitest";
import { deriveWeatherAlerts } from "../lib/weatherAlerts";
import type { CurrentWeather, HourlyForecastEntry } from "../types/weather";

const BASE_CURRENT: CurrentWeather = {
  temperature: 22,
  apparentTemperature: 21,
  isDay: true,
  precipitation: 0,
  weatherCode: 0,
  cloudCover: 10,
  pressure: 1013,
  humidity: 55,
  windSpeed: 15,
  windDirection: 180,
  windGusts: 20,
  uvIndex: 3,
  visibility: 15000,
  time: "2026-01-01T12:00",
};

const BASE_HOURLY: HourlyForecastEntry[] = Array.from({ length: 24 }, (_, i) => ({
  time: `2026-01-01T${String(i).padStart(2, "0")}:00`,
  temperature: 22,
  apparentTemperature: 21,
  weatherCode: 0,
  precipitationProbability: 0,
  windSpeed: 15,
  humidity: 55,
  uvIndex: 3,
  visibility: 15000,
}));

describe("deriveWeatherAlerts", () => {
  it("returns no alerts for calm, clear conditions", () => {
    const alerts = deriveWeatherAlerts(BASE_CURRENT, BASE_HOURLY);
    expect(alerts).toHaveLength(0);
  });

  it("returns a thunderstorm warning when weather code is 95", () => {
    const current = { ...BASE_CURRENT, weatherCode: 95 };
    const alerts = deriveWeatherAlerts(current, BASE_HOURLY);
    expect(alerts.some((a) => a.id === "thunderstorm-active")).toBe(true);
    expect(alerts.find((a) => a.id === "thunderstorm-active")?.severity).toBe("warning");
  });

  it("returns a thunderstorm watch when upcoming hour has storm code", () => {
    const hourly = BASE_HOURLY.map((h, i) => ({
      ...h,
      weatherCode: i === 3 ? 95 : 0,
    }));
    const alerts = deriveWeatherAlerts(BASE_CURRENT, hourly);
    expect(alerts.some((a) => a.id === "thunderstorm-incoming")).toBe(true);
    expect(alerts.find((a) => a.id === "thunderstorm-incoming")?.severity).toBe("watch");
  });

  it("returns a wind warning for gusts ≥ 70 km/h", () => {
    const current = { ...BASE_CURRENT, windGusts: 80 };
    const alerts = deriveWeatherAlerts(current, BASE_HOURLY);
    expect(alerts.some((a) => a.id === "wind-warning")).toBe(true);
  });

  it("returns a wind advisory for gusts 50–69 km/h", () => {
    const current = { ...BASE_CURRENT, windGusts: 55 };
    const alerts = deriveWeatherAlerts(current, BASE_HOURLY);
    expect(alerts.some((a) => a.id === "wind-advisory")).toBe(true);
  });

  it("returns an extreme UV warning for UV ≥ 9", () => {
    const current = { ...BASE_CURRENT, uvIndex: 10 };
    const alerts = deriveWeatherAlerts(current, BASE_HOURLY);
    expect(alerts.some((a) => a.id === "uv-extreme")).toBe(true);
  });

  it("returns heat warning for apparentTemperature ≥ 38", () => {
    const current = { ...BASE_CURRENT, apparentTemperature: 41 };
    const alerts = deriveWeatherAlerts(current, BASE_HOURLY);
    expect(alerts.some((a) => a.id === "heat-warning")).toBe(true);
  });

  it("returns cold warning for apparentTemperature ≤ -10", () => {
    const current = { ...BASE_CURRENT, apparentTemperature: -15 };
    const alerts = deriveWeatherAlerts(current, BASE_HOURLY);
    expect(alerts.some((a) => a.id === "cold-warning")).toBe(true);
  });

  it("limits results to the most critical alerts (all fires independently)", () => {
    const current = { ...BASE_CURRENT, windGusts: 80, uvIndex: 11 };
    const alerts = deriveWeatherAlerts(current, BASE_HOURLY);
    const ids = alerts.map((a) => a.id);
    expect(ids).toContain("wind-warning");
    expect(ids).toContain("uv-extreme");
  });
});

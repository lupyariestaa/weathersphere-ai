import { describe, it, expect } from "vitest";
import { getWeatherInfo, WEATHER_CODE_MAP } from "../constants/weatherCodes";

describe("getWeatherInfo", () => {
  it("returns correct info for WMO code 0 (clear)", () => {
    const info = getWeatherInfo(0);
    expect(info.label).toBe("Clear sky");
    expect(info.group).toBe("clear");
  });

  it("returns correct info for code 95 (thunderstorm)", () => {
    const info = getWeatherInfo(95);
    expect(info.group).toBe("thunderstorm");
  });

  it("returns a fallback for unknown codes", () => {
    const info = getWeatherInfo(9999);
    expect(info.label).toBe("Unknown");
    expect(info.group).toBe("cloudy");
  });

  it("every code in the map has a non-empty label", () => {
    for (const [, info] of Object.entries(WEATHER_CODE_MAP)) {
      expect(info.label.length).toBeGreaterThan(0);
    }
  });

  it("every code in the map has a valid group", () => {
    const validGroups = new Set([
      "clear", "partly-cloudy", "cloudy", "fog", "drizzle",
      "rain", "freezing-rain", "snow", "rain-shower", "snow-shower", "thunderstorm",
    ]);
    for (const [, info] of Object.entries(WEATHER_CODE_MAP)) {
      expect(validGroups.has(info.group)).toBe(true);
    }
  });
});

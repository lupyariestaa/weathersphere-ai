import { describe, it, expect } from "vitest";
import {
  celsiusTo,
  formatTemperature,
  windDirectionLabel,
  formatWindSpeed,
  formatDistanceKm,
  aqiLabel,
  uvLabel,
} from "../utils/units";

describe("celsiusTo", () => {
  it("returns the same value for celsius", () => {
    expect(celsiusTo("celsius", 20)).toBe(20);
  });

  it("converts 0°C to 32°F", () => {
    expect(celsiusTo("fahrenheit", 0)).toBe(32);
  });

  it("converts 100°C to 212°F", () => {
    expect(celsiusTo("fahrenheit", 100)).toBe(212);
  });

  it("converts negative celsius correctly", () => {
    expect(celsiusTo("fahrenheit", -40)).toBe(-40);
  });
});

describe("formatTemperature", () => {
  it("formats celsius with unit", () => {
    expect(formatTemperature(20, "celsius")).toBe("20°C");
  });

  it("formats fahrenheit with unit", () => {
    expect(formatTemperature(0, "fahrenheit")).toBe("32°F");
  });

  it("formats without unit when withUnit is false", () => {
    expect(formatTemperature(20, "celsius", false)).toBe("20°");
  });

  it("rounds fractional temperatures", () => {
    expect(formatTemperature(20.7, "celsius")).toBe("21°C");
    expect(formatTemperature(20.2, "celsius")).toBe("20°C");
  });
});

describe("windDirectionLabel", () => {
  it("returns N for 0°", () => expect(windDirectionLabel(0)).toBe("N"));
  it("returns E for 90°", () => expect(windDirectionLabel(90)).toBe("E"));
  it("returns S for 180°", () => expect(windDirectionLabel(180)).toBe("S"));
  it("returns W for 270°", () => expect(windDirectionLabel(270)).toBe("W"));
  it("returns NE for 45°", () => expect(windDirectionLabel(45)).toBe("NE"));
  it("returns SW for 225°", () => expect(windDirectionLabel(225)).toBe("SW"));
});

describe("formatWindSpeed", () => {
  it("appends km/h unit", () => {
    expect(formatWindSpeed(42)).toBe("42 km/h");
  });
  it("rounds fractional speed", () => {
    expect(formatWindSpeed(42.9)).toBe("43 km/h");
  });
});

describe("formatDistanceKm", () => {
  it("shows one decimal for distances under 10 km", () => {
    expect(formatDistanceKm(3.55)).toBe("3.6 km");
  });
  it("rounds to whole km for distances 10+", () => {
    expect(formatDistanceKm(15.7)).toBe("16 km");
  });
});

describe("aqiLabel", () => {
  it("returns Good for AQI ≤ 50", () => {
    expect(aqiLabel(25).label).toBe("Good");
    expect(aqiLabel(50).label).toBe("Good");
  });
  it("returns Moderate for AQI 51–100", () => {
    expect(aqiLabel(75).label).toBe("Moderate");
  });
  it("returns Hazardous for AQI > 300", () => {
    expect(aqiLabel(350).label).toBe("Hazardous");
  });
});

describe("uvLabel", () => {
  it("returns Low for UV < 3", () => expect(uvLabel(1).label).toBe("Low"));
  it("returns Moderate for UV 3–5", () => expect(uvLabel(4).label).toBe("Moderate"));
  it("returns High for UV 6–7", () => expect(uvLabel(7).label).toBe("High"));
  it("returns Very High for UV 8–10", () => expect(uvLabel(9).label).toBe("Very High"));
  it("returns Extreme for UV 11+", () => expect(uvLabel(12).label).toBe("Extreme"));
});

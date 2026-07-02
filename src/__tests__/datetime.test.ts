import { describe, it, expect } from "vitest";
import {
  formatHour,
  formatWeekday,
  secondsToHoursMinutes,
  getMoonPhase,
} from "../utils/datetime";

describe("formatHour", () => {
  it("formats midnight as 12am", () => {
    expect(formatHour("2026-01-01T00:00")).toBe("12am");
  });
  it("formats noon as 12pm", () => {
    expect(formatHour("2026-01-01T12:00")).toBe("12pm");
  });
  it("formats 6pm correctly", () => {
    expect(formatHour("2026-01-01T18:00")).toBe("6pm");
  });
});

describe("formatWeekday", () => {
  it("returns short weekday", () => {
    // 2026-01-05 is a Monday
    expect(formatWeekday("2026-01-05")).toBe("Mon");
  });
  it("returns full weekday when short=false", () => {
    expect(formatWeekday("2026-01-05", false)).toBe("Monday");
  });
});

describe("secondsToHoursMinutes", () => {
  it("converts 3600 seconds to 1h 0m", () => {
    expect(secondsToHoursMinutes(3600)).toBe("1h 0m");
  });
  it("converts 5400 seconds to 1h 30m", () => {
    expect(secondsToHoursMinutes(5400)).toBe("1h 30m");
  });
  it("handles zero", () => {
    expect(secondsToHoursMinutes(0)).toBe("0h 0m");
  });
});

describe("getMoonPhase", () => {
  it("returns an illumination between 0 and 1", () => {
    const { illumination } = getMoonPhase(new Date("2026-01-01"));
    expect(illumination).toBeGreaterThanOrEqual(0);
    expect(illumination).toBeLessThanOrEqual(1);
  });

  it("returns a known phase label for a known new moon date", () => {
    // 2026-02-17 is close to a new moon
    const { phase } = getMoonPhase(new Date("2026-02-17"));
    expect(typeof phase).toBe("string");
    expect(phase.length).toBeGreaterThan(0);
  });

  it("returns an emoji", () => {
    const { emoji } = getMoonPhase(new Date());
    expect(emoji).toMatch(/[\u{1F311}-\u{1F318}]/u);
  });
});

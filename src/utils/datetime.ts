import { format, differenceInSeconds, parseISO } from "date-fns";

export function formatHour(iso: string): string {
  return format(parseISO(iso), "ha").toLowerCase();
}

export function formatWeekday(iso: string, short = true): string {
  return format(parseISO(iso), short ? "EEE" : "EEEE");
}

export function formatClock(iso: string): string {
  return format(parseISO(iso), "h:mm a");
}

export function formatDayMonth(iso: string): string {
  return format(parseISO(iso), "MMM d");
}

export function secondsToHoursMinutes(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

export function remainingDaylight(sunsetIso: string, now = new Date()): string {
  const diff = differenceInSeconds(parseISO(sunsetIso), now);
  if (diff <= 0) return "0h 0m";
  return secondsToHoursMinutes(diff);
}

/**
 * Lightweight moon phase approximation (no API required).
 * Returns illumination 0-1 and a phase label, accurate to within ~1 day —
 * more than sufficient for a decorative moon card.
 */
export function getMoonPhase(date: Date = new Date()): { phase: string; illumination: number; emoji: string } {
  const synodicMonth = 29.530588853;
  const knownNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14));
  const daysSince = (date.getTime() - knownNewMoon.getTime()) / 86400000;
  const age = daysSince % synodicMonth;
  const normalizedAge = age < 0 ? age + synodicMonth : age;
  const illumination = (1 - Math.cos((2 * Math.PI * normalizedAge) / synodicMonth)) / 2;

  const phases = [
    { max: 1.84, phase: "New Moon", emoji: "🌑" },
    { max: 5.53, phase: "Waxing Crescent", emoji: "🌒" },
    { max: 9.22, phase: "First Quarter", emoji: "🌓" },
    { max: 12.91, phase: "Waxing Gibbous", emoji: "🌔" },
    { max: 16.61, phase: "Full Moon", emoji: "🌕" },
    { max: 20.30, phase: "Waning Gibbous", emoji: "🌖" },
    { max: 23.99, phase: "Last Quarter", emoji: "🌗" },
    { max: 27.68, phase: "Waning Crescent", emoji: "🌘" },
    { max: 29.53, phase: "New Moon", emoji: "🌑" },
  ];
  const match = phases.find((p) => normalizedAge <= p.max) ?? phases[0];
  return { phase: match.phase, illumination, emoji: match.emoji };
}

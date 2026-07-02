"use client";

import { useRef, useState } from "react";
import { Download, Share2 } from "lucide-react";
import { WeatherIcon } from "./WeatherIcon";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { useToast } from "@/contexts/ToastContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { getWeatherInfo } from "@/constants/weatherCodes";
import { formatTemperature } from "@/utils/units";
import { downloadPng, shareWeatherCard } from "@/lib/shareCard";
import { generateDailySummary } from "@/lib/assistantMessages";
import { SITE_CONFIG } from "@/config/site";
import type { CurrentWeather, DailyForecastEntry, GeoLocation } from "@/types/weather";

interface ShareableWeatherCardProps {
  location: GeoLocation;
  current: CurrentWeather;
  today?: DailyForecastEntry;
}

export function ShareableWeatherCard({ location, current, today }: ShareableWeatherCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<"download" | "share" | null>(null);
  const { unit } = usePreferences();
  const { showToast } = useToast();
  const { label } = getWeatherInfo(current.weatherCode);

  const summary = generateDailySummary(current, today);
  const filename = `weathersphere-${location.name.toLowerCase().replace(/\s+/g, "-")}.png`;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setBusy("download");
    try {
      await downloadPng(cardRef.current, filename);
      showToast("Weather card downloaded", "success");
    } catch {
      showToast("Couldn't generate the image. Please try again.", "error");
    } finally {
      setBusy(null);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    setBusy("share");
    try {
      const result = await shareWeatherCard(cardRef.current, `${location.name}: ${formatTemperature(current.temperature, unit)}, ${label}. ${summary}`, filename);
      if (result === "image-copied") showToast("Image copied to clipboard", "success");
      else if (result === "text-copied") showToast("Summary copied to clipboard", "success");
    } catch {
      showToast("Sharing isn't available on this device.", "error");
    } finally {
      setBusy(null);
    }
  };

  return (
    <GlassCard hoverLift={false}>
      <h3 className="font-display text-sm font-semibold text-slate-700 dark:text-white">Share this forecast</h3>

      <div
        ref={cardRef}
        className="mt-3 rounded-xl3 bg-gradient-to-br from-[#1c3d8f] via-[#2f6fed] to-[#0e1c4a] p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white/80">{location.name}{location.country ? `, ${location.country}` : ""}</span>
          <WeatherIcon code={current.weatherCode} isDay={current.isDay} size={28} className="text-white" />
        </div>
        <p className="mt-3 font-display text-5xl font-semibold tabular">{formatTemperature(current.temperature, unit, false)}</p>
        <p className="mt-1 text-sm text-white/80">{label} · Feels like {formatTemperature(current.apparentTemperature, unit)}</p>
        <p className="mt-4 text-xs leading-relaxed text-white/70">{summary}</p>
        <p className="mt-4 text-[10px] font-medium uppercase tracking-wide text-white/50">{SITE_CONFIG.name}</p>
      </div>

      <div className="mt-3 flex gap-2">
        <Button variant="glass" size="sm" className="flex-1" onClick={handleDownload} loading={busy === "download"}>
          <Download size={14} /> Download
        </Button>
        <Button variant="primary" size="sm" className="flex-1" onClick={handleShare} loading={busy === "share"}>
          <Share2 size={14} /> Share
        </Button>
      </div>
    </GlassCard>
  );
}

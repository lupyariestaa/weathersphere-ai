"use client";

import { motion } from "framer-motion";
import { AIAssistant } from "@/components/assistant/AIAssistant";
import { SearchBar } from "@/components/search/SearchBar";
import { WeatherInfoCards } from "@/components/weather/WeatherInfoCards";
import { SITE_CONFIG } from "@/config/site";
import { generateGreeting, generateRecommendations } from "@/lib/assistantMessages";
import { getWeatherInfo } from "@/constants/weatherCodes";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useTheme } from "@/contexts/ThemeContext";
import { formatTemperature } from "@/utils/units";
import type { GeoLocation, WeatherBundle } from "@/types/weather";

interface HeroProps {
  bundle: WeatherBundle | null;
  onSelectCity: (location: GeoLocation) => void;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export function Hero({ bundle, onSelectCity }: HeroProps) {
  const { unit } = usePreferences();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const current = bundle?.current;
  const today = bundle?.daily[0];
  const nextHour = bundle?.hourly[1];

  const weatherLabel = current ? getWeatherInfo(current.weatherCode).label : null;
  const greeting = current && bundle
    ? generateGreeting(current, bundle.location.name, nextHour)
    : null;
  const tips = current ? generateRecommendations(current, today) : [];

  const headingCls = isDark ? "text-white" : "text-slate-900";
  const subCls = isDark ? "text-white/75" : "text-slate-600";
  const badgeCls = isDark
    ? "bg-white/10 text-white/80"
    : "bg-slate-900/8 text-slate-600";

  return (
    <section
      id="top"
      className="mx-auto grid max-w-6xl gap-8 px-4 pt-10 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:pt-16"
    >
      {/* ── Left column: text + search + assistant ── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-6"
      >
        <motion.div variants={item}>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${badgeCls}`}>
            {SITE_CONFIG.tagline}
          </span>
        </motion.div>

        <motion.h1
          variants={item}
          className={`font-display text-balance text-4xl font-semibold tracking-tight sm:text-5xl ${headingCls}`}
        >
          {bundle
            ? `${formatTemperature(current!.temperature, unit, false)} in ${bundle.location.name}`
            : "Weather, reimagined."}
        </motion.h1>

        {weatherLabel && (
          <motion.p variants={item} className={`text-lg ${subCls}`}>
            {weatherLabel} · Feels like {formatTemperature(current!.apparentTemperature, unit)}
          </motion.p>
        )}

        <motion.div variants={item}>
          <SearchBar onSelect={onSelectCity} />
        </motion.div>

        {greeting && (
          <motion.div variants={item}>
            <AIAssistant message={greeting} tips={tips} />
          </motion.div>
        )}
      </motion.div>

      {/* ── Right column: 3 Glass Info Cards ── */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
        className="flex items-start"
      >
        <WeatherInfoCards bundle={bundle} />
      </motion.div>
    </section>
  );
}

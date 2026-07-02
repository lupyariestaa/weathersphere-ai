"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart2,
  CloudOff,
  Globe,
  Map,
  RefreshCw,
  Scale,
  Search,
} from "lucide-react";
import { TabBar, type Tab } from "@/components/ui/TabBar";
import { RevealSection } from "@/components/ui/RevealSection";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { FavoritesBar } from "@/components/search/FavoritesBar";

import { CurrentWeatherCard } from "@/components/weather/CurrentWeatherCard";
import { HourlyForecast } from "@/components/weather/HourlyForecast";
import { DailyForecast } from "@/components/weather/DailyForecast";
import { AirQualityCard } from "@/components/weather/AirQualityCard";
import { SunCard } from "@/components/weather/SunCard";
import { MoonCard } from "@/components/weather/MoonCard";
import { WindCompass } from "@/components/weather/WindCompass";
import { DetailsGrid } from "@/components/weather/DetailsGrid";
import { TemperatureChart } from "@/components/weather/TemperatureChart";
import { PrecipitationChart } from "@/components/weather/PrecipitationChart";
import { WeeklyTemperatureChart } from "@/components/weather/WeeklyTemperatureChart";
import { AlertsCard } from "@/components/weather/AlertsCard";
import { ShareableWeatherCard } from "@/components/weather/ShareableWeatherCard";
import { WeatherMapLoader } from "@/components/map/WeatherMapLoader";
import { CompareCities } from "@/features/CompareCities";

import { deriveWeatherAlerts } from "@/lib/weatherAlerts";
import type { AsyncStatus, GeoLocation, WeatherBundle } from "@/types/weather";

interface DashboardProps {
  bundle: WeatherBundle | null;
  status: AsyncStatus;
  onRetry: () => void;
  onSelectCity: (location: GeoLocation) => void;
}

type TabKey = "today" | "weekly" | "map" | "compare";

const TABS: Tab[] = [
  { key: "today", label: "Today", icon: <Globe size={15} /> },
  { key: "weekly", label: "Weekly", icon: <BarChart2 size={15} /> },
  { key: "map", label: "Map", icon: <Map size={15} /> },
  { key: "compare", label: "Compare", icon: <Scale size={15} /> },
];

const tabVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export function Dashboard({ bundle, status, onRetry, onSelectCity }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("today");

  const alerts = useMemo(() => {
    if (!bundle) return [];
    return deriveWeatherAlerts(bundle.current, bundle.hourly, bundle.daily[0]);
  }, [bundle]);

  return (
    <section
      className="mx-auto mt-10 max-w-6xl px-4 pb-8 sm:px-6"
      aria-label="Weather dashboard"
    >
      {/* Favorites quick-access bar */}
      <RevealSection>
        <FavoritesBar onSelect={onSelectCity} activeId={bundle?.location.id} />
      </RevealSection>

      {/* Empty / error / loading gate */}
      <div className="mt-6">
        {status === "loading" && !bundle && <DashboardSkeleton />}

        {status === "error" && (
          <EmptyState
            icon={<CloudOff size={22} />}
            title="Couldn't load the forecast"
            description="The weather service didn't respond. Check your connection and try again."
            action={
              <Button variant="primary" size="sm" onClick={onRetry}>
                <RefreshCw size={14} /> Retry
              </Button>
            }
          />
        )}

        {status === "idle" && !bundle && (
          <EmptyState
            icon={<Search size={22} />}
            title="Search for a city"
            description="Allow location access for instant local weather, or search any city worldwide."
          />
        )}

        {bundle && (
          <>
            {/* Alert strip — shown above tabs when active */}
            {alerts.length > 0 && (
              <RevealSection className="mb-4">
                <AlertsCard alerts={alerts} />
              </RevealSection>
            )}

            {/* Tab navigation */}
            <RevealSection className="mb-6">
              <TabBar
                tabs={TABS}
                activeKey={activeTab}
                onChange={(k) => setActiveTab(k as TabKey)}
              />
            </RevealSection>

            {/* Tab panels */}
            <AnimatePresence mode="wait">
              {activeTab === "today" && (
                <motion.div
                  key="today"
                  variants={tabVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  <TodayTab bundle={bundle} />
                </motion.div>
              )}

              {activeTab === "weekly" && (
                <motion.div
                  key="weekly"
                  variants={tabVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  <WeeklyTab bundle={bundle} />
                </motion.div>
              )}

              {activeTab === "map" && (
                <motion.div
                  key="map"
                  variants={tabVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  <MapTab bundle={bundle} />
                </motion.div>
              )}

              {activeTab === "compare" && (
                <motion.div
                  key="compare"
                  variants={tabVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  <CompareTab onSelectCity={onSelectCity} />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </section>
  );
}

/* ─── Tab content components ────────────────────────────────────────── */

function TodayTab({ bundle }: { bundle: WeatherBundle }) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      {/* Main column */}
      <div className="flex flex-col gap-5 lg:col-span-2">
        <RevealSection>
          <CurrentWeatherCard current={bundle.current} location={bundle.location} />
        </RevealSection>

        <RevealSection delay={0.05}>
          <HourlyForecast hourly={bundle.hourly} isDay={bundle.current.isDay} />
        </RevealSection>

        <RevealSection delay={0.1}>
          <TemperatureChart hourly={bundle.hourly} />
        </RevealSection>

        <RevealSection delay={0.12}>
          <PrecipitationChart hourly={bundle.hourly} />
        </RevealSection>

        <RevealSection delay={0.15}>
          <DetailsGrid current={bundle.current} />
        </RevealSection>
      </div>

      {/* Side column */}
      <div className="flex flex-col gap-5">
        <RevealSection>
          <WindCompass
            speed={bundle.current.windSpeed}
            direction={bundle.current.windDirection}
            gusts={bundle.current.windGusts}
          />
        </RevealSection>

        {bundle.daily[0] && (
          <RevealSection delay={0.05}>
            <SunCard today={bundle.daily[0]} />
          </RevealSection>
        )}

        {bundle.daily[0] && (
          <RevealSection delay={0.1}>
            <MoonCard today={bundle.daily[0]} />
          </RevealSection>
        )}

        <RevealSection delay={0.12}>
          <AirQualityCard airQuality={bundle.airQuality} />
        </RevealSection>

        <RevealSection delay={0.15}>
          <ShareableWeatherCard
            location={bundle.location}
            current={bundle.current}
            today={bundle.daily[0]}
          />
        </RevealSection>
      </div>
    </div>
  );
}

function WeeklyTab({ bundle }: { bundle: WeatherBundle }) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="flex flex-col gap-5 lg:col-span-2">
        <RevealSection>
          <WeeklyTemperatureChart daily={bundle.daily} />
        </RevealSection>
        <RevealSection delay={0.05}>
          <DailyForecast daily={bundle.daily} />
        </RevealSection>
      </div>
      <div className="flex flex-col gap-5">
        {bundle.daily[0] && (
          <RevealSection>
            <SunCard today={bundle.daily[0]} />
          </RevealSection>
        )}
        {bundle.daily[0] && (
          <RevealSection delay={0.05}>
            <MoonCard today={bundle.daily[0]} />
          </RevealSection>
        )}
      </div>
    </div>
  );
}

function MapTab({ bundle }: { bundle: WeatherBundle }) {
  return (
    <div className="flex flex-col gap-5">
      <RevealSection>
        <div className="glass-panel overflow-hidden rounded-xl3 p-4 shadow-glass dark:shadow-glassDark">
          <h3 className="mb-4 font-display text-sm font-semibold text-slate-700 dark:text-white">
            {bundle.location.name}
            {bundle.location.country ? `, ${bundle.location.country}` : ""} map
          </h3>
          <WeatherMapLoader location={bundle.location} current={bundle.current} />
          <p className="mt-2 text-[11px] text-slate-400">
            Drag to explore · Map tiles © OpenStreetMap contributors / CARTO
          </p>
        </div>
      </RevealSection>

      <RevealSection delay={0.06}>
        <CurrentWeatherCard current={bundle.current} location={bundle.location} />
      </RevealSection>
    </div>
  );
}

function CompareTab({ onSelectCity }: { onSelectCity: (l: GeoLocation) => void }) {
  return (
    <RevealSection>
      <CompareCities />
    </RevealSection>
  );
}

/* ─── Loading skeleton ───────────────────────────────────────────────── */

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="h-10 w-full max-w-sm rounded-full" />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="flex flex-col gap-5 lg:col-span-2">
          <Skeleton className="h-56" />
          <Skeleton className="h-40" />
          <Skeleton className="h-48" />
        </div>
        <div className="flex flex-col gap-5">
          <Skeleton className="h-44" />
          <Skeleton className="h-44" />
        </div>
      </div>
    </div>
  );
}

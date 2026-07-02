"use client";

import { useCallback, useEffect, useState } from "react";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { OfflineBanner } from "@/components/layout/OfflineBanner";
import { SettingsDrawer } from "@/components/layout/SettingsDrawer";
import { PwaInstallBanner } from "@/components/layout/PwaInstallBanner";
import { ToastViewport } from "@/components/ui/ToastViewport";
import { AtmosphereBackground } from "@/features/AtmosphereBackground";
import { Hero } from "@/features/Hero";
import { Dashboard } from "@/features/Dashboard";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useWeatherBundle } from "@/hooks/useWeatherBundle";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useToast } from "@/contexts/ToastContext";
import { reverseGeocode } from "@/services/geocodingService";
import { getWeatherInfo } from "@/constants/weatherCodes";
import type { GeoLocation } from "@/types/weather";

/** Jakarta — sensible default when geolocation is unavailable and no last city exists. */
const FALLBACK_CITY: GeoLocation = {
  id: 1642911,
  name: "Jakarta",
  country: "Indonesia",
  countryCode: "ID",
  latitude: -6.2088,
  longitude: 106.8456,
  timezone: "auto",
};

export function AppShell() {
  const [appLoading, setAppLoading] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [locating, setLocating] = useState(true);

  const geo = useGeolocation();
  const { bundle, status, refresh } = useWeatherBundle(location);
  const { lastCity, setLastCity, addRecentSearch } = usePreferences();
  const { showToast } = useToast();

  // Kick off geolocation on first mount.
  useEffect(() => {
    geo.request();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Resolve coordinates → a named location, or fall back gracefully.
  useEffect(() => {
    if (geo.status === "granted" && geo.coords) {
      setLocating(true);
      reverseGeocode(geo.coords.latitude, geo.coords.longitude)
        .then((resolved) => {
          const loc: GeoLocation = resolved ?? {
            id: Date.now(),
            name: "Your location",
            country: "",
            countryCode: "",
            latitude: geo.coords!.latitude,
            longitude: geo.coords!.longitude,
            timezone: "auto",
          };
          setLocation(loc);
          setLastCity(loc);
        })
        .finally(() => setLocating(false));
    } else if (
      geo.status === "denied" ||
      geo.status === "unsupported" ||
      geo.status === "error"
    ) {
      setLocation(lastCity ?? FALLBACK_CITY);
      setLocating(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo.status, geo.coords]);

  const handleSelectCity = useCallback(
    (next: GeoLocation) => {
      setLocation(next);
      setLastCity(next);
      addRecentSearch(next);
      showToast(`Showing weather for ${next.name}`, "success");
    },
    [setLastCity, addRecentSearch, showToast]
  );

  const weatherGroup = bundle
    ? getWeatherInfo(bundle.current.weatherCode).group
    : "clear";
  const isDay = bundle?.current.isDay ?? true;

  return (
    <>
      {appLoading && (
        <LoadingScreen
          onFinished={() => setAppLoading(false)}
          minDurationMs={locating ? 2400 : 1500}
        />
      )}

      {!appLoading && (
        <>
          <AtmosphereBackground weatherGroup={weatherGroup} />
          <OfflineBanner />
          <ToastViewport />
          <PwaInstallBanner />

          <Navbar onOpenSettings={() => setSettingsOpen(true)} />

          <main id="top">
            <Hero bundle={bundle} onSelectCity={handleSelectCity} />
            <Dashboard
              bundle={bundle}
              status={status}
              onRetry={refresh}
              onSelectCity={handleSelectCity}
            />
          </main>

          <Footer />
          <SettingsDrawer
            open={settingsOpen}
            onClose={() => setSettingsOpen(false)}
          />
        </>
      )}
    </>
  );
}

"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { GeoLocation, TemperatureUnit } from "@/types/weather";

const MAX_FAVORITES = 50;
const MAX_RECENTS = 8;

interface PreferencesContextValue {
  unit: TemperatureUnit;
  setUnit: (unit: TemperatureUnit) => void;
  favorites: GeoLocation[];
  isFavorite: (id: number) => boolean;
  addFavorite: (location: GeoLocation) => void;
  removeFavorite: (id: number) => void;
  reorderFavorites: (next: GeoLocation[]) => void;
  recentSearches: GeoLocation[];
  addRecentSearch: (location: GeoLocation) => void;
  clearRecentSearches: () => void;
  removeRecentSearch: (id: number) => void;
  lastCity: GeoLocation | null;
  setLastCity: (location: GeoLocation) => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [unit, setUnit] = useLocalStorage<TemperatureUnit>("weathersphere:unit", "celsius");
  const [favorites, setFavorites] = useLocalStorage<GeoLocation[]>("weathersphere:favorites", []);
  const [recentSearches, setRecentSearches] = useLocalStorage<GeoLocation[]>("weathersphere:recents", []);
  const [lastCity, setLastCityState] = useLocalStorage<GeoLocation | null>("weathersphere:lastCity", null);

  const value = useMemo<PreferencesContextValue>(() => {
    const isFavorite = (id: number) => favorites.some((f) => f.id === id);

    return {
      unit,
      setUnit,
      favorites,
      isFavorite,
      addFavorite: (location) =>
        setFavorites((prev) => (prev.some((f) => f.id === location.id) ? prev : [...prev, location].slice(0, MAX_FAVORITES))),
      removeFavorite: (id) => setFavorites((prev) => prev.filter((f) => f.id !== id)),
      reorderFavorites: (next) => setFavorites(next),
      recentSearches,
      addRecentSearch: (location) =>
        setRecentSearches((prev) => [location, ...prev.filter((r) => r.id !== location.id)].slice(0, MAX_RECENTS)),
      clearRecentSearches: () => setRecentSearches([]),
      removeRecentSearch: (id) => setRecentSearches((prev) => prev.filter((r) => r.id !== id)),
      lastCity,
      setLastCity: (location) => setLastCityState(location),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit, favorites, recentSearches, lastCity]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used within PreferencesProvider");
  return ctx;
}

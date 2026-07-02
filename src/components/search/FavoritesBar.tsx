"use client";

import { Reorder } from "framer-motion";
import { Star, X } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import type { GeoLocation } from "@/types/weather";

interface FavoritesBarProps {
  onSelect: (location: GeoLocation) => void;
  activeId?: number;
}

export function FavoritesBar({ onSelect, activeId }: FavoritesBarProps) {
  const { favorites, removeFavorite, reorderFavorites } = usePreferences();

  if (favorites.length === 0) {
    return (
      <div className="glass-panel flex items-center gap-2 rounded-2xl px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
        <Star size={16} className="text-slate-400" />
        No favorite cities yet — star a city to pin it here.
      </div>
    );
  }

  return (
    <Reorder.Group
      as="div"
      axis="x"
      values={favorites}
      onReorder={reorderFavorites}
      className="flex gap-2 overflow-x-auto pb-1"
    >
      {favorites.map((city) => (
        <Reorder.Item key={city.id} value={city} as="div" className="shrink-0">
          <div
            className={`group flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeId === city.id ? "bg-sphere-blue text-white shadow-glow" : "glass-panel text-slate-700 dark:text-slate-200"
            }`}
          >
            <button onClick={() => onSelect(city)}>{city.name}</button>
            <button
              onClick={() => removeFavorite(city.id)}
              aria-label={`Remove ${city.name} from favorites`}
              className="opacity-60 hover:opacity-100"
            >
              <X size={13} />
            </button>
          </div>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}

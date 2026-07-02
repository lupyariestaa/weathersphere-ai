"use client";

import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, Search, X } from "lucide-react";
import { useCitySearch } from "@/hooks/useCitySearch";
import { usePreferences } from "@/contexts/PreferencesContext";
import type { GeoLocation } from "@/types/weather";

interface SearchBarProps {
  onSelect: (location: GeoLocation) => void;
}

export function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const { results, status } = useCitySearch(query);
  const { recentSearches, removeRecentSearch, clearRecentSearches } = usePreferences();

  const showRecents = query.trim().length === 0;
  const list = showRecents ? recentSearches : results;

  const handleSelect = (location: GeoLocation) => {
    onSelect(location);
    setQuery("");
    setFocused(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!list.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, list.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const loc = list[highlighted];
      if (loc) handleSelect(loc);
    } else if (e.key === "Escape") {
      inputRef.current?.blur();
      setFocused(false);
    }
  };

  const placeholder = useMemo(() => "Search for a city...", []);

  return (
    <div className="relative w-full max-w-md">
      <div className="glass-panel flex items-center gap-2.5 rounded-full px-4 py-3 shadow-glass transition-shadow duration-300 focus-within:shadow-glow dark:shadow-glassDark">
        <Search size={18} className="text-slate-500 dark:text-slate-300" aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={focused}
          aria-autocomplete="list"
          aria-label="Search for a city"
          value={query}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlighted(0);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 120)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none dark:text-white dark:placeholder:text-slate-500"
        />
        {query && (
          <button onClick={() => setQuery("")} aria-label="Clear search" className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
            <X size={16} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {focused && (query.trim().length > 0 || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="glass-panel absolute left-0 right-0 top-[calc(100%+8px)] z-30 max-h-80 overflow-auto rounded-2xl p-2 shadow-glass dark:shadow-glassDark"
          >
            {showRecents && recentSearches.length > 0 && (
              <div className="flex items-center justify-between px-2 py-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Recent</span>
                <button onClick={clearRecentSearches} className="text-[11px] font-medium text-sphere-blue hover:underline">
                  Clear all
                </button>
              </div>
            )}

            {status === "loading" && !showRecents && <p className="px-3 py-3 text-sm text-slate-400">Searching…</p>}
            {status === "empty" && !showRecents && <p className="px-3 py-3 text-sm text-slate-400">No cities found for &ldquo;{query}&rdquo;.</p>}

            {list.map((loc, i) => (
              <div key={loc.id} className="group flex items-center">
                <button
                  onMouseEnter={() => setHighlighted(i)}
                  onClick={() => handleSelect(loc)}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                    highlighted === i ? "bg-sphere-blue/15 text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-200"
                  }`}
                >
                  {showRecents ? <Clock size={15} className="text-slate-400" /> : <MapPin size={15} className="text-slate-400" />}
                  <span>
                    {loc.name}
                    <span className="text-slate-400">{loc.admin1 ? `, ${loc.admin1}` : ""}{loc.country ? `, ${loc.country}` : ""}</span>
                  </span>
                </button>
                {showRecents && (
                  <button
                    onClick={() => removeRecentSearch(loc.id)}
                    aria-label={`Remove ${loc.name} from recent searches`}
                    className="mr-2 hidden text-slate-400 hover:text-slate-700 group-hover:block dark:hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

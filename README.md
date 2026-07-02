# WeatherSphere AI

**The Next Generation Weather Experience.**

A premium, weather-reactive dashboard built around a living 3D Earth — designed to feel like a flagship product, not a weather widget.

---

## Overview

WeatherSphere AI combines a glass-morphic dashboard, a procedurally shaded low-poly 3D Earth, and a contextual AI-style assistant into a single cohesive experience. The interface, background, and Earth lighting all react to real conditions — sunny, rainy, stormy, snowy, or night — fetched live from free, keyless weather APIs.

No API keys, no backend, no sign-up. Clone it, `npm install`, `npm run dev`, and it works.

## Features

- **Live 3D Earth** — a procedural, low-poly planet (React Three Fiber + custom GLSL shaders) with day/night lighting, atmosphere glow, mouse parallax, gentle floating motion, and weather-driven effects (clouds, rain, snow, lightning, stars). Falls back to an animated CSS orb if WebGL is unavailable.
- **Automatic geolocation** with a graceful, friendly fallback to search if location access is denied.
- **Premium city search** — debounced autocomplete, keyboard navigation, recent searches, and pinned favorites (drag to reorder).
- **Full weather dashboard** — current conditions, 24-hour forecast, 7-day forecast, animated temperature chart, wind compass, humidity/pressure/visibility/UV meters, air quality breakdown, sunrise/sunset arc, and a computed moon phase.
- **Weather-reactive design system** — the background gradient, Earth lighting, and glass tinting all shift smoothly with current conditions and time of day.
- **Contextual AI assistant** — short, data-driven greetings and recommendations generated from live conditions, not hardcoded copy.
- **Light / dark / system theme**, Celsius/Fahrenheit toggle, and all preferences persisted locally.
- **Resilient by design** — loading skeletons, empty states, offline banner, retry-on-error, and response caching to avoid redundant requests.
- **Accessible** — semantic HTML, visible focus states, ARIA labels on interactive controls, and `prefers-reduced-motion` support.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| 3D | Three.js + React Three Fiber + Drei |
| Charts | Recharts |
| Icons | Lucide React |
| Utilities | clsx, date-fns |

## Data Sources

All free and keyless — no signup, no environment variables required:

- **[Open-Meteo Forecast API](https://open-meteo.com)** — current, hourly, and daily weather.
- **[Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)** — city search.
- **[Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api)** — AQI and pollutant breakdown.
- **[BigDataCloud Reverse Geocoding](https://www.bigdatacloud.com/geocoding-apis)** — used only to turn browser coordinates into a city name, since Open-Meteo's geocoding API does not yet offer reverse lookup.

Moon phase is computed locally from a standard astronomical approximation — no API needed.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). That's it — no `.env` file required.

### Other scripts

```bash
npm run build      # production build
npm run start       # serve the production build
npm run lint        # ESLint
npm run typecheck   # TypeScript, no emit
```

## Folder Structure

```
src/
  app/            Next.js App Router entry (layout, page, global styles)
  components/
    ui/           Design-system primitives (GlassCard, Button, ProgressRing, ...)
    layout/       Navbar, Footer, SettingsDrawer, OfflineBanner
    three/        Earth shaders, scene, particles, WebGL fallback
    weather/      Current/hourly/daily/air quality/sun/moon/wind cards
    search/       SearchBar, FavoritesBar
    assistant/    AI assistant widget
    loading/      Cinematic loading screen
  features/       Page-level composition (Hero, Dashboard, AppShell, background)
  contexts/       Theme, Preferences (units/favorites/recents), Toasts
  hooks/          Geolocation, debouncing, weather data fetching, persistence
  services/       Open-Meteo + reverse-geocoding API clients
  lib/            HTTP client, localStorage cache, assistant message generator
  types/          Shared TypeScript interfaces
  constants/      Weather code mapping, weather-reactive theme tokens
  utils/          Unit conversion, date formatting, moon phase calculation
  config/         Site metadata
public/           Manifest, icons, robots.txt
```

## Performance Notes

- The Three.js bundle is loaded via `next/dynamic` with `ssr: false`, so it never blocks the initial page render.
- Canvas rendering pauses entirely (`frameloop: "never"`) when the browser tab is hidden.
- Pixel ratio is capped (`dpr={[1, 1.75]}`) to avoid over-rendering on high-DPI displays.
- The Earth is genuinely low-poly (icosahedron, low subdivision) with no external texture downloads — geometry and shading are both procedural.
- Weather responses are cached in `localStorage` for 10 minutes per coordinate to avoid duplicate network requests on revisits.

## Accessibility Notes

- A "Skip to content" link is included for keyboard users.
- All interactive icon-only controls have `aria-label`s.
- Toggle/expand controls use `aria-expanded` / `aria-pressed` where appropriate.
- Animations respect `prefers-reduced-motion`.

## Architecture for Future Expansion

The codebase is intentionally organized so the following can be added without restructuring:

- Weather radar overlay (a new card under `components/weather`, fed by a new `services/radarService.ts`)
- Multi-city comparison view (a new route reusing `useWeatherBundle` per city)
- Multi-language support (an `i18n` layer sitting alongside `lib/assistantMessages.ts`)
- Shareable / exportable weather cards (canvas export of `CurrentWeatherCard`)
- PWA install prompt (the manifest is already in place under `public/`)
- User accounts and cloud sync (would slot in as a new context alongside `PreferencesContext`)

## Credits

Built entirely with free, open data from [Open-Meteo](https://open-meteo.com) (CC BY 4.0) and [BigDataCloud](https://www.bigdatacloud.com/). No proprietary or paid assets are used; the 3D Earth is fully procedural.

## License

MIT License — Copyright © 2026 Lupy Ariesta

---

© 2026 WeatherSphere AI — by Lupy Ariesta

---

## V2 Changelog

### New features
- **Tabbed dashboard** — Today / Weekly / Map / Compare tabs with animated sliding indicator, keyboard navigation (←→ arrows), and AnimatePresence tab transitions.
- **Interactive Leaflet map** — dark/light tile themes swap with the app theme; smooth `flyTo` on city change; custom glass-styled popup; no API key needed (CARTO tiles, OSM data).
- **City comparison** — add up to 4 cities side by side showing temperature, condition, wind, and humidity; fetches in parallel; drag-to-remove.
- **Intelligent weather alerts** — derived from forecast thresholds (gust speed, UV, thunderstorm codes, heat/cold), since Open-Meteo has no free keyless alerts endpoint. Advisory / Watch / Warning severity. Section hidden completely when no thresholds are crossed.
- **Share & export** — branded weather card (PNG download or Web Share API; clipboard fallback). `html-to-image` — no server round-trip.
- **PWA** — service worker (network-first, offline shell fallback), `manifest.json` already present, install prompt banner with dismiss.
- **Precipitation chart** — 24h bar chart with colour-scaled bars (light/moderate/heavy probability).
- **Weekly temperature range chart** — 7-day high (bar) / low (line) composed chart.
- **Scroll-reveal animations** — `RevealSection` wrapper using `useInView` for staggered entrance animations without janky layouts.

### Bug fixes (V1 audit)
- All bare `React.ReactNode`, `React.KeyboardEvent`, `React.ElementType` references replaced with proper named imports.
- Duplicate `lucide-react` import in `CurrentWeatherCard` merged.
- Earth icosahedron subdivision levels corrected (24 → 4, 16 → 3) — prevents vertex explosion while keeping the low-poly aesthetic.

### New tests
- `src/__tests__/units.test.ts` — unit conversion, formatters, AQI/UV labels.
- `src/__tests__/datetime.test.ts` — hour/weekday formatting, time arithmetic, moon phase.
- `src/__tests__/weatherAlerts.test.ts` — alert derivation logic, all severity levels.
- `src/__tests__/weatherCodes.test.ts` — WMO code map integrity.

Run tests with `npm test`.

### Dependencies added
| Package | Purpose |
|---|---|
| `leaflet` + `react-leaflet` | Interactive map, no API key |
| `html-to-image` | Client-side PNG export |
| `vitest` | Unit testing |
| `@types/leaflet` | TypeScript types |

"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "@/contexts/ThemeContext";
import { getWeatherInfo } from "@/constants/weatherCodes";
import type { GeoLocation, CurrentWeather } from "@/types/weather";

interface WeatherMapProps {
  location: GeoLocation;
  current: CurrentWeather;
}

const LIGHT_TILES = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const DARK_TILES = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

const markerIcon = L.divIcon({
  className: "",
  html: `<div style="
    width: 18px; height: 18px; border-radius: 9999px;
    background: radial-gradient(circle, #22D3EE, #2F6FED);
    box-shadow: 0 0 16px rgba(34,211,238,0.8), 0 0 0 4px rgba(255,255,255,0.25);
  "></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], map.getZoom(), { duration: 1.1 });
  }, [lat, lng, map]);
  return null;
}

/** Interactive map centered on the active city, swapping tile themes with the app's light/dark mode. */
export function WeatherMap({ location, current }: WeatherMapProps) {
  const { resolvedTheme } = useTheme();
  const { label } = getWeatherInfo(current.weatherCode);

  return (
    <div className="h-72 w-full overflow-hidden rounded-xl3 sm:h-80">
      <MapContainer
        center={[location.latitude, location.longitude]}
        zoom={9}
        scrollWheelZoom={false}
        className="h-full w-full"
        attributionControl={true}
      >
        <TileLayer url={resolvedTheme === "dark" ? DARK_TILES : LIGHT_TILES} attribution={TILE_ATTRIBUTION} />
        <Marker position={[location.latitude, location.longitude]} icon={markerIcon}>
          <Popup>
            <strong>{location.name}</strong>
            <br />
            {label} · {Math.round(current.temperature)}°
          </Popup>
        </Marker>
        <Recenter lat={location.latitude} lng={location.longitude} />
      </MapContainer>
    </div>
  );
}

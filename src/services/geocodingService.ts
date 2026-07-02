import { fetchJson } from "@/lib/http";
import type { GeoLocation } from "@/types/weather";

const GEOCODING_BASE = "https://geocoding-api.open-meteo.com/v1/search";
// Open-Meteo's geocoding API does not yet offer reverse geocoding
// (see open-meteo/open-meteo discussion #698), so browser geolocation
// reverse-lookup uses BigDataCloud's free, keyless client-side reverse
// geocoding API instead. Weather and forward search still come entirely
// from Open-Meteo.
const REVERSE_BASE = "https://api.bigdatacloud.net/data/reverse-geocode-client";

interface RawGeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string;
  timezone: string;
}

interface RawGeocodingResponse {
  results?: RawGeocodingResult[];
}

function normalize(result: RawGeocodingResult): GeoLocation {
  return {
    id: result.id,
    name: result.name,
    country: result.country ?? "",
    countryCode: result.country_code ?? "",
    admin1: result.admin1,
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone,
  };
}

/** Open-Meteo Geocoding API — free, keyless city search with autocomplete-friendly results. */
export async function searchCities(query: string, count = 8): Promise<GeoLocation[]> {
  if (!query.trim()) return [];
  const url = `${GEOCODING_BASE}?name=${encodeURIComponent(query)}&count=${count}&language=en&format=json`;
  const data = await fetchJson<RawGeocodingResponse>(url);
  return (data.results ?? []).map(normalize);
}

interface RawReverseResponse {
  city?: string;
  locality?: string;
  principalSubdivision?: string;
  countryName?: string;
  countryCode?: string;
  latitude?: number;
  longitude?: number;
}

/** Reverse geocode browser coordinates into a displayable city/country. */
export async function reverseGeocode(latitude: number, longitude: number): Promise<GeoLocation | null> {
  const url = `${REVERSE_BASE}?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
  try {
    const data = await fetchJson<RawReverseResponse>(url);
    const name = data.city || data.locality;
    if (!name) return null;
    return {
      id: Math.round(latitude * 1000) + Math.round(longitude * 1000),
      name,
      country: data.countryName ?? "",
      countryCode: data.countryCode ?? "",
      admin1: data.principalSubdivision,
      latitude,
      longitude,
      // Open-Meteo's forecast API resolves the correct IANA timezone
      // itself via timezone=auto, so an explicit value isn't needed here.
      timezone: "auto",
    };
  } catch {
    return null;
  }
}

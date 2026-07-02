import { fetchJson } from "@/lib/http";
import type { AirQuality } from "@/types/weather";

const AIR_QUALITY_BASE = "https://air-quality-api.open-meteo.com/v1/air-quality";

interface RawAirQualityResponse {
  current?: {
    us_aqi?: number;
    pm10?: number;
    pm2_5?: number;
    ozone?: number;
    nitrogen_dioxide?: number;
    sulphur_dioxide?: number;
    carbon_monoxide?: number;
  };
}

/** Open-Meteo Air Quality API — free, keyless, US AQI + pollutant breakdown. */
export async function fetchAirQuality(latitude: number, longitude: number): Promise<AirQuality | null> {
  const url =
    `${AIR_QUALITY_BASE}?latitude=${latitude}&longitude=${longitude}` +
    `&current=us_aqi,pm10,pm2_5,ozone,nitrogen_dioxide,sulphur_dioxide,carbon_monoxide`;

  try {
    const data = await fetchJson<RawAirQualityResponse>(url, { retries: 1 });
    if (!data.current) return null;
    return {
      aqi: data.current.us_aqi ?? null,
      pm10: data.current.pm10 ?? null,
      pm2_5: data.current.pm2_5 ?? null,
      ozone: data.current.ozone ?? null,
      nitrogenDioxide: data.current.nitrogen_dioxide ?? null,
      sulphurDioxide: data.current.sulphur_dioxide ?? null,
      carbonMonoxide: data.current.carbon_monoxide ?? null,
    };
  } catch {
    // Air quality is a supplementary card — never let it block the dashboard.
    return null;
  }
}

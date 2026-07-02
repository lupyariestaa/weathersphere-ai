import { CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Cloudy, Moon, Sun } from "lucide-react";
import { getWeatherInfo } from "@/constants/weatherCodes";
import { cn } from "@/utils/cn";

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  size?: number;
  className?: string;
}

export function WeatherIcon({ code, isDay = true, size = 28, className }: WeatherIconProps) {
  const { group } = getWeatherInfo(code);
  const common = { size, className: cn("shrink-0", className) };

  switch (group) {
    case "clear":
      return isDay ? <Sun {...common} /> : <Moon {...common} />;
    case "partly-cloudy":
      return <CloudSun {...common} />;
    case "cloudy":
      return <Cloudy {...common} />;
    case "fog":
      return <CloudFog {...common} />;
    case "drizzle":
      return <CloudDrizzle {...common} />;
    case "rain":
    case "rain-shower":
      return <CloudRain {...common} />;
    case "freezing-rain":
      return <CloudRain {...common} />;
    case "snow":
    case "snow-shower":
      return <CloudSnow {...common} />;
    case "thunderstorm":
      return <CloudLightning {...common} />;
    default:
      return <Cloudy {...common} />;
  }
}

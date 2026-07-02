"use client";

import { useCallback, useState } from "react";

interface GeolocationState {
  status: "idle" | "loading" | "granted" | "denied" | "unsupported" | "error";
  coords: { latitude: number; longitude: number } | null;
}

/** Wraps the browser Geolocation API with friendly states instead of raw errors. */
export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({ status: "idle", coords: null });

  const request = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setState({ status: "unsupported", coords: null });
      return;
    }
    setState((prev) => ({ ...prev, status: "loading" }));
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          status: "granted",
          coords: { latitude: position.coords.latitude, longitude: position.coords.longitude },
        });
      },
      (error) => {
        setState({ status: error.code === error.PERMISSION_DENIED ? "denied" : "error", coords: null });
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 5 * 60 * 1000 }
    );
  }, []);

  return { ...state, request };
}

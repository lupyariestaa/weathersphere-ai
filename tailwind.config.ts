import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sphere: {
          blue: "#2F6FED",
          cyan: "#22D3EE",
          emerald: "#34D399",
          white: "#F8FAFC",
          gray: "#E2E8F0",
          dark: "#0B1220",
          dusk: "#0F1A2E",
        },
        glass: {
          light: "rgba(255, 255, 255, 0.55)",
          lighter: "rgba(255, 255, 255, 0.75)",
          dark: "rgba(15, 23, 42, 0.45)",
          darker: "rgba(8, 13, 26, 0.65)",
          border: "rgba(255, 255, 255, 0.18)",
          borderDark: "rgba(255, 255, 255, 0.08)",
        },
      },
      fontFamily: {
        display: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        body: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.75rem",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255,255,255,0.25)",
        glassDark: "0 8px 32px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
        glow: "0 0 60px rgba(47, 111, 237, 0.35)",
        glowCyan: "0 0 60px rgba(34, 211, 238, 0.3)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-700px 0" },
          "100%": { backgroundPosition: "700px 0" },
        },
        blink: {
          "0%, 92%, 100%": { transform: "scaleY(1)" },
          "96%": { transform: "scaleY(0.1)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        shimmer: "shimmer 1.6s linear infinite",
        blink: "blink 4s ease-in-out infinite",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;

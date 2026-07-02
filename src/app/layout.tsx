import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { PreferencesProvider } from "@/contexts/PreferencesContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { SITE_CONFIG } from "@/config/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
  description: SITE_CONFIG.description,
  authors: [{ name: SITE_CONFIG.author }],
  manifest: "/manifest.json",
  openGraph: {
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
  },
  icons: {
    icon: "/icons/icon-192.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2F6FED",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-sphere-dark font-body antialiased">
        <a href="#top" className="sr-only focus:not-sr-only focus:fixed focus:z-[200] focus:m-2 focus:rounded-full focus:bg-white focus:px-4 focus:py-2">
          Skip to content
        </a>
        <ThemeProvider>
          <PreferencesProvider>
            <ToastProvider>{children}</ToastProvider>
          </PreferencesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

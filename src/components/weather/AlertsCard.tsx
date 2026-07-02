"use client";

import { type ElementType } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ShieldAlert, Siren } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { WeatherAlert } from "@/lib/weatherAlerts";

interface AlertsCardProps {
  alerts: WeatherAlert[];
}

const SEVERITY_STYLES: Record<WeatherAlert["severity"], { bg: string; text: string; icon: ElementType }> = {
  advisory: { bg: "bg-amber-400/15", text: "text-amber-400", icon: AlertTriangle },
  watch: { bg: "bg-orange-400/15", text: "text-orange-400", icon: ShieldAlert },
  warning: { bg: "bg-red-500/15", text: "text-red-400", icon: Siren },
};

/** Never renders an empty card — if there are no active alerts, this section simply doesn't exist. */
export function AlertsCard({ alerts }: AlertsCardProps) {
  if (alerts.length === 0) return null;

  return (
    <GlassCard hoverLift={false} className="border border-red-400/20">
      <h3 className="font-display text-sm font-semibold text-slate-700 dark:text-white">Weather alerts</h3>
      <div className="mt-3 flex flex-col gap-2">
        {alerts.map((alert, i) => {
          const style = SEVERITY_STYLES[alert.severity];
          const Icon = style.icon;
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className={`flex items-start gap-2.5 rounded-xl2 px-3 py-2.5 ${style.bg}`}
            >
              <Icon size={16} className={`mt-0.5 shrink-0 ${style.text}`} />
              <div>
                <p className={`text-sm font-semibold ${style.text}`}>{alert.title}</p>
                <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">{alert.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}

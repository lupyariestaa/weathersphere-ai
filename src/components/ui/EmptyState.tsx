import type { ReactNode } from "react";
import { GlassCard } from "./GlassCard";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <GlassCard className="flex flex-col items-center gap-3 py-10 text-center" hoverLift={false}>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-sphere-cyan">{icon}</div>
      <div>
        <p className="font-display text-sm font-semibold text-slate-800 dark:text-white">{title}</p>
        <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      {action}
    </GlassCard>
  );
}

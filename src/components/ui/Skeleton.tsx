import { cn } from "@/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-xl2", className)} aria-hidden="true" />;
}

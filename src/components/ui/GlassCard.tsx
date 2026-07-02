"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  hoverLift?: boolean;
  padded?: boolean;
}

/**
 * The single visual primitive every dashboard card is built from —
 * keeping blur, border, and shadow values here is what makes the whole
 * app read as one consistent design language.
 */
export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hoverLift = true, padded = true, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        whileHover={hoverLift ? { y: -4 } : undefined}
        className={cn(
          "glass-panel rounded-xl3 shadow-glass dark:shadow-glassDark",
          padded && "p-5 sm:p-6",
          "transition-shadow duration-300 ease-premium",
          className
        )}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }
);
GlassCard.displayName = "GlassCard";

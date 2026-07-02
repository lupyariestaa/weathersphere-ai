"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "glass" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 rounded-full font-medium",
          "transition-all duration-300 ease-premium focus-visible:outline-none",
          "disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]",
          size === "sm" && "px-4 py-2 text-sm",
          size === "md" && "px-5 py-2.5 text-sm",
          size === "lg" && "px-7 py-3.5 text-base",
          variant === "primary" &&
            "bg-sphere-blue text-white shadow-glow hover:shadow-[0_0_80px_rgba(47,111,237,0.5)] hover:-translate-y-0.5",
          variant === "glass" &&
            "glass-panel text-slate-800 dark:text-white hover:-translate-y-0.5 hover:shadow-glow",
          variant === "ghost" &&
            "bg-transparent text-slate-600 dark:text-slate-300 hover:bg-white/10",
          className
        )}
        {...props}
      >
        {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : children}
      </button>
    );
  }
);
Button.displayName = "Button";

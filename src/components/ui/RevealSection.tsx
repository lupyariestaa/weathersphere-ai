"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";

interface RevealSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Wraps any content in a scroll-triggered fade-up reveal.
 * Once the element has entered the viewport, the animation
 * doesn't replay — keeping things calm on re-renders.
 */
export function RevealSection({ children, className, delay = 0 }: RevealSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

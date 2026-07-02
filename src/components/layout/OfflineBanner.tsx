"use client";

import { motion, AnimatePresence } from "framer-motion";
import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export function OfflineBanner() {
  const online = useOnlineStatus();

  return (
    <AnimatePresence>
      {!online && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3"
          role="status"
        >
          <div className="glass-panel flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-amber-600 shadow-glass dark:text-amber-300">
            <WifiOff size={15} />
            You&apos;re offline — showing the last saved forecast.
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

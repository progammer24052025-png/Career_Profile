"use client";

import { motion } from "framer-motion";
import { Check, Gauge } from "lucide-react";
import { AuroraBackdrop } from "@/components/ui/aurora-backdrop";

/**
 * Decorative scene behind the auth card. The two floating instruments are
 * hidden until there is real margin beside the layout, and the whole layer is
 * removed from the accessibility tree.
 */
export function AuthBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <AuroraBackdrop />

      <motion.div
        animate={{ y: [0, -10, 0] }}
        className="aurora-glass absolute left-[4.5%] top-[21%] hidden w-56 p-4 2xl:block"
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="aurora-label">Readiness</p>
          <Gauge className="h-4 w-4 text-primary" />
        </div>
        <p className="mt-2 font-display text-3xl font-semibold tracking-[-0.05em] text-ink">
          63<span className="ml-1 font-sans text-xs font-normal tracking-normal text-faintText">/ 100</span>
        </p>
        <p className="mt-0.5 text-[11px] text-mutedText">Data Analyst · weighted</p>
        <div className="aurora-meter mt-3">
          <div className="aurora-meter-fill" style={{ width: "63%" }} />
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 9, 0] }}
        className="aurora-glass absolute right-[4.5%] bottom-[23%] hidden w-60 p-4 2xl:block"
        transition={{ duration: 9.5, delay: 0.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <p className="aurora-label">Matched skill</p>
        <div className="mt-2.5 flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--accent-soft)] text-primary">
            <Check className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink">SQL</p>
            <p className="text-[10px] text-mutedText">Confident · 25% weight</p>
          </div>
        </div>
        <p className="mt-3 border-t border-[var(--aurora-glass-edge)] pt-2.5 text-[11px] leading-4 text-mutedText">
          One project linked as evidence.
        </p>
      </motion.div>
    </div>
  );
}

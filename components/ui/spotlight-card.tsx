"use client";

import { useRef, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

/**
 * A card whose glow follows the pointer through two CSS custom properties.
 * The resting state and the whole hover treatment live in `.aurora-card`, so
 * the component works without JavaScript and never animates on its own.
 */
export function SpotlightCard({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const track = (event: PointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node || event.pointerType === "touch") return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    node.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  };

  return (
    <div ref={ref} className={cn("aurora-card", className)} onPointerMove={track}>
      {children}
    </div>
  );
}

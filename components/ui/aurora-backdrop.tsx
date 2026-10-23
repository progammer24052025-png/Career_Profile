import { cn } from "@/lib/utils";

/**
 * Decorative only: ribbons, a soft grid and a grain veil. The parent supplies
 * `aurora-shell` tokens; this layer never receives pointer events.
 */
export function AuroraBackdrop({ className, ribbons = true }: { className?: string; ribbons?: boolean }) {
  return (
    <div aria-hidden="true" className={cn("aurora-sky", className)}>
      {ribbons && (
        <>
          <div className="aurora-ribbon" />
          <div className="aurora-ribbon aurora-ribbon-b" />
        </>
      )}
      <div className="aurora-grid-lines" />
      <div className="aurora-noise" />
    </div>
  );
}

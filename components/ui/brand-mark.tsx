import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  wordmarkClassName?: string;
  showWordmark?: boolean;
  markClassName?: string;
};

/**
 * Signal-path mark: a rising path and a lit endpoint. The wordmark stays
 * quiet next to it so the aurora surfaces own the colour.
 */
export function BrandMark({ className, wordmarkClassName, showWordmark = true, markClassName }: BrandMarkProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-ink", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "relative grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-[10px] text-[#04131A] shadow-[0_0_22px_-6px_var(--accent-glow)]",
          "bg-[linear-gradient(135deg,var(--aurora-teal),var(--aurora-iris))]",
          markClassName
        )}
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]">
          <path d="M4.5 16.8 9.6 11l2.8 2.9 6.9-7.4" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="19.3" cy="6.5" r="1.9" fill="currentColor" />
          <path d="M4.5 19.5h15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity=".55" />
        </svg>
      </span>
      {showWordmark && (
        <span className={cn("font-display text-[1.05rem] font-semibold tracking-[-0.035em]", wordmarkClassName)}>
          Career<span className="font-normal text-mutedText">Profile</span>
        </span>
      )}
    </span>
  );
}

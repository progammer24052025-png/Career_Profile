import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type ScoreRingProps = {
  score: number;
  id: string;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
};

/**
 * Readiness instrument. The arc is a plain SVG stroke, so it prints, scales
 * and animates with one CSS variable. Pass a unique `id` when two rings share
 * a page because the gradient lives in `<defs>`.
 */
export function ScoreRing({ score, id, size = 128, strokeWidth = 9, label = "out of 100", className }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference * (1 - clamped / 100);
  const gradientId = `ring-gradient-${id}`;
  const style = {
    "--ring-circumference": circumference,
    "--ring-offset": offset
  } as CSSProperties;

  return (
    <svg
      aria-label={`Readiness ${score} out of 100`}
      className={cn("aurora-ring", className)}
      role="img"
      style={style}
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--aurora-teal)" />
          <stop offset="100%" stopColor="var(--aurora-iris)" />
        </linearGradient>
      </defs>
      <circle
        className="aurora-ring-track"
        cx={center}
        cy={center}
        fill="none"
        r={radius}
        strokeWidth={strokeWidth}
      />
      <circle
        className="aurora-ring-arc"
        cx={center}
        cy={center}
        fill="none"
        r={radius}
        stroke={`url(#${gradientId})`}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        transform={`rotate(-90 ${center} ${center})`}
      />
      <text
        dominantBaseline="central"
        fill="var(--ink)"
        fontFamily="var(--font-display), ui-sans-serif, sans-serif"
        fontSize={size * 0.26}
        fontWeight="600"
        letterSpacing="-0.04em"
        textAnchor="middle"
        x={center}
        y={center - size * 0.055}
      >
        {score}
      </text>
      <text
        dominantBaseline="central"
        fill="var(--muted)"
        fontFamily="var(--font-sans), ui-sans-serif, sans-serif"
        fontSize={size * 0.072}
        textAnchor="middle"
        x={center}
        y={center + size * 0.16}
      >
        {label}
      </text>
    </svg>
  );
}

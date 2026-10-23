import Link from "next/link";
import { Check, Compass } from "lucide-react";
import { AuthBackground } from "@/components/auth/auth-background";
import { ThemeToggle } from "@/components/providers/theme-toggle";
import { BrandMark } from "@/components/ui/brand-mark";
import { ScoreRing } from "@/components/ui/score-ring";

export function AuthShell({ children, title, description }: { children: React.ReactNode; title: string; description: string }) {
  return (
    <main id="main-content" className="aurora-shell aurora-auth">
      <AuthBackground />
      <div className="absolute right-3 top-3 z-20 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>

      <div className="aurora-auth-grid">
        <div className="aurora-auth-story hidden lg:block">
          <Link href="/" aria-label="CareerProfile home" className="inline-flex min-h-11 items-center">
            <BrandMark />
          </Link>
          <p className="aurora-kicker mt-10">A career map for students</p>
          <p className="aurora-heading mt-4 text-[clamp(2.3rem,3.6vw,3.3rem)]">
            Know your skills.
            <br />
            <span className="aurora-gradient-text">Choose the next step.</span>
          </p>
          <p className="aurora-subhead">
            Bring your academic record, target career and projects into one private view of where you are and what to build next.
          </p>

          <div className="mt-7 flex items-center gap-5">
            <ScoreRing id="auth" score={63} size={112} strokeWidth={8} />
            <div className="min-w-0">
              <p className="aurora-label">Explainable readiness</p>
              <p className="mt-1 max-w-[26ch] text-xs leading-5 text-mutedText">
                Weight times proficiency over the expected level. No hidden model, no invented metrics.
              </p>
              <div className="mt-3 grid gap-1.5 text-xs text-mutedText">
                <span className="inline-flex items-center gap-2"><Check aria-hidden="true" className="h-3.5 w-3.5 text-primary" /> Private, owner-only rows</span>
                <span className="inline-flex items-center gap-2"><Compass aria-hidden="true" className="h-3.5 w-3.5 text-primary" /> Ten careers to compare</span>
              </div>
            </div>
          </div>
        </div>

        <section aria-labelledby="auth-title" className="aurora-glass aurora-auth-card">
          <Link href="/" aria-label="CareerProfile home" className="aurora-auth-brand">
            <BrandMark />
          </Link>
          <h1 className="aurora-auth-title" id="auth-title">{title}</h1>
          <p className="aurora-auth-desc">{description}</p>
          {children}
          <div className="aurora-auth-links">
            <Link href="/privacy" className="inline-flex min-h-11 items-center font-medium text-primary hover:underline">
              Privacy and data
            </Link>
            <span aria-hidden="true" className="h-3 w-px bg-[var(--aurora-glass-edge)]" />
            <Link href="/demo" className="inline-flex min-h-11 items-center font-medium text-primary hover:underline">
              Explore the demo
            </Link>
            <span className="hidden w-full text-center text-[10px] text-faintText sm:block">Private student profile · Transparent scoring</span>
          </div>
        </section>
      </div>
    </main>
  );
}

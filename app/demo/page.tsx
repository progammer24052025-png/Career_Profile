import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Eye } from "lucide-react";
import { CareerDemo } from "@/components/demo/career-demo";
import { ThemeToggle } from "@/components/providers/theme-toggle";
import { AuroraBackdrop } from "@/components/ui/aurora-backdrop";
import { BrandMark } from "@/components/ui/brand-mark";

export const metadata: Metadata = {
  title: "Career readiness demo",
  description: "Explore sample student skills, career requirements and a transparent readiness score.",
};

export default function DemoPage() {
  return (
    <div className="aurora-shell aurora-page">
      <AuroraBackdrop />

      <header className="aurora-header">
        <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between gap-2 pr-2 pl-3 sm:px-4">
          <Link aria-label="CareerProfile home" href="/" className="inline-flex min-h-11 items-center gap-2.5">
            <BrandMark showWordmark={false} />
            <span className="hidden font-display text-lg font-semibold tracking-tight text-ink sm:inline">Career<span className="font-normal text-primary">Profile</span></span>
          </Link>
          <div className="flex items-center gap-1.5">
            <span className="aurora-chip hidden sm:inline-flex"><Eye aria-hidden="true" className="h-3 w-3" /> Sample data</span>
            <ThemeToggle />
            <Link
              aria-label="Back to site"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-[var(--aurora-glass-edge)] px-3 text-sm font-medium text-mutedText transition-colors hover:text-ink"
              href="/"
            >
              <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Back to site</span>
            </Link>
            <Link className="aurora-cta !min-h-10 !px-3.5 text-[0.8rem]" href="/signup">Build your profile</Link>
          </div>
        </div>
      </header>

      <main id="main-content" className="relative z-10 mx-auto max-w-6xl px-4 py-6 pb-28 sm:px-8 sm:pt-10 md:pb-10">
        <div className="aurora-demo-meta mb-6 flex-wrap items-center">
          <div className="aurora-demo-breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="font-medium text-ink">Career readiness demo</span>
          </div>
          <span className="text-faintText">Sample data only. Your changes are not saved.</span>
        </div>

        <div className="aurora-demo-hero pt-0">
          <p className="aurora-kicker">No account needed</p>
          <h1 className="aurora-heading mt-4">Career readiness, made clear.</h1>
          <p className="aurora-subhead">
            Explore a sample student record and change the target career. Every requirement, weight and gap stays visible.
          </p>
        </div>

        <CareerDemo />
      </main>

      <footer className="relative z-10 px-4 py-6 pb-28 sm:px-8 md:pb-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-[var(--aurora-glass-edge)] pt-5 text-xs text-mutedText sm:flex-row">
          <p>Illustrative levels and requirements. Create a profile for your own comparison.</p>
          <Link className="inline-flex min-h-11 items-center font-medium text-primary hover:underline" href="/signup">
            Create your profile
          </Link>
        </div>
      </footer>
    </div>
  );
}

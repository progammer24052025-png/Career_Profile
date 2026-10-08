import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CareerDemo } from "@/components/demo/career-demo";
import { ThemeToggle } from "@/components/providers/theme-toggle";
import { GlassHeader } from "@/components/layout/glass-header";

export const metadata: Metadata = {
  title: "Career readiness demo",
  description: "Explore sample student skills, career requirements and a transparent readiness score.",
};

export default function DemoPage() {
  return <div className="dashboard-canvas min-h-screen">
    <GlassHeader><div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-5 sm:px-8">
      <Link href="/" className="inline-flex min-h-11 items-center gap-2.5"><span className="grid h-8 w-8 place-items-center rounded-[9px] border border-primary/25 bg-ink font-display text-[10px] font-semibold text-background">CP</span><span className="font-display text-lg font-semibold tracking-tight text-ink">Career<em className="font-normal text-primary">Profile</em></span></Link>
      <div className="flex items-center gap-2"><span className="hidden items-center gap-1.5 rounded-full border border-warning/20 bg-warning/10 px-2.5 py-1 text-[11px] font-semibold text-warning sm:inline-flex"><Eye className="h-3 w-3" /> Sample data</span><ThemeToggle /><Button asChild size="sm" variant="secondary"><Link href="/"><ArrowLeft className="h-3.5 w-3.5" /><span className="hidden sm:inline">Overview</span></Link></Button><Button asChild size="sm"><Link href="/signup">Build your profile</Link></Button></div>
    </div></GlassHeader>
    <main id="main-content" className="mx-auto max-w-6xl px-4 py-6 pb-28 sm:px-8 sm:pt-10 md:pb-10"><div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-mutedText"><Link href="/" className="inline-flex min-h-11 items-center hover:text-ink">Home</Link><span aria-hidden="true">/</span><span className="font-medium text-ink">Career readiness demo</span><span className="text-faintText">·</span><span>Sample data only. Your changes aren’t saved.</span></div><CareerDemo /></main>
    <footer className="px-4 py-6 pb-28 sm:px-8 md:pb-8"><div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-xs text-mutedText sm:flex-row"><p>Illustrative skill levels and career requirements. Update your own profile to get a personal comparison.</p><Link href="/signup" className="inline-flex min-h-11 items-center font-medium text-primary hover:underline">Create your profile</Link></div></footer>
  </div>;
}

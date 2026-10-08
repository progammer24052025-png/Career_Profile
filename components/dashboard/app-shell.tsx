"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenCheck, BriefcaseBusiness, ChevronLeft, Compass, LayoutDashboard, Map, Menu, Target, UserRound, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { signOut } from "@/actions/auth";
import { ThemeToggle } from "@/components/providers/theme-toggle";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDashboardStore } from "@/lib/stores/dashboard-store";
import { GlassHeader } from "@/components/layout/glass-header";
import { DashboardMobileDock } from "@/components/ui/mobile-bottom-nav";

const navigation = [
  ["Dashboard", "/dashboard", LayoutDashboard],
  ["Skills", "/dashboard/skills", Target],
  ["Proof", "/dashboard/proof", BriefcaseBusiness],
  ["Journey", "/dashboard/journey", Compass],
  ["Roadmap", "/dashboard/roadmap", Map],
  ["Profile", "/dashboard/profile", UserRound],
] as const;

export function AppShell({ children, email, profile }: { children: React.ReactNode; email?: string; profile?: { display_name?: string | null } | null }) {
  const pathname = usePathname();
  const { mobileNavOpen: open, sidebarCollapsed: collapsed, setMobileNavOpen: setOpen, toggleSidebar, userName, userEmail, setProfile } = useDashboardStore();
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const activeEmail = email || userEmail || "student@careerprofile.app";
  const displayName = userName || profile?.display_name || "";

  useEffect(() => { setMounted(true); if (email) setProfile({ email }); if (profile?.display_name) setProfile({ name: profile.display_name }); }, [email, profile, setProfile]);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = overflow; document.removeEventListener("keydown", onKeyDown); previous?.focus?.(); };
  }, [open, setOpen]);

  const cabinet = () => <aside className={cn("flex h-full flex-col border-r border-borderSoft bg-surface text-ink", collapsed && "lg:w-[76px]")}>
    <div className="shrink-0 border-b border-borderSoft px-3 py-3.5">
      <div className="flex items-center justify-between gap-2">
        <Link href="/dashboard" aria-label="CareerProfile dashboard" className="flex min-w-0 items-center gap-3 overflow-hidden">
          <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-[9px] border border-primary/25 bg-ink font-display text-[12px] font-semibold tracking-tight text-background shadow-sm">CP</span>
          {!collapsed && <span className="min-w-0"><span className="block font-display text-[15px] font-semibold leading-none tracking-tight">CareerProfile</span><span className="mt-1 block text-[10px] text-mutedText">Student career map</span></span>}
        </Link>
        <button aria-label={collapsed ? "Expand navigation" : "Collapse navigation"} onClick={toggleSidebar} className="hidden h-8 w-8 shrink-0 place-items-center rounded-lg text-faintText hover:bg-surface-muted hover:text-ink lg:grid"><ChevronLeft aria-hidden="true" className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} /></button>
      </div>
      {!collapsed && <><div aria-hidden="true" className="brass-rule mt-3 opacity-25" /><div className="pt-3"><p className="mono text-[10px] tracking-[0.1em] text-faintText">YOUR CAREER ATLAS</p><p className="mt-1 text-xs leading-4 text-mutedText">Skills, proof and next steps in one place.</p></div></>}
    </div>
    <nav aria-label="Career profile" className="flex-1 overflow-y-auto px-2 py-3"><div className="grid gap-1">{navigation.map(([label, href, Icon], index) => {
      const active = pathname === href;
      return <div key={href}>{index === 5 && !collapsed && <div aria-hidden="true" className="mx-2 my-2 h-px bg-borderSoft" />}<Link href={href} aria-current={active ? "page" : undefined} title={collapsed ? label : undefined} onClick={() => setOpen(false)} className={cn("group relative flex min-h-11 items-center gap-3 rounded-[10px] px-2.5 py-2.5 text-sm transition-colors", collapsed ? "justify-center" : "justify-start")}>
        <span className={cn("absolute inset-0 rounded-[10px] border transition-colors", active ? "border-ink bg-ink text-background shadow-sm" : "border-transparent bg-transparent text-mutedText group-hover:bg-surface-muted group-hover:text-ink")} aria-hidden="true" />
        <span className={cn("relative grid h-7 w-7 shrink-0 place-items-center rounded-[8px] border transition-colors", active ? "border-borderSoft bg-background text-primary" : "border-borderSoft bg-surface-muted text-mutedText")}><Icon aria-hidden="true" className="h-3.5 w-3.5" /></span>
        {!collapsed && <span className={cn("relative truncate text-[13px] font-medium tracking-tight", active ? "text-background" : "text-current")}>{label}</span>}
      </Link></div>;
    })}</div></nav>
    <div className="shrink-0 border-t border-borderSoft p-3">{!collapsed ? <div className="rounded-[12px] border border-borderSoft bg-surface-muted p-3"><div className="flex items-center gap-2"><BookOpenCheck aria-hidden="true" className="h-4 w-4 text-primary" /><span className="text-xs font-semibold text-ink">Your next step</span></div><p className="mt-1.5 text-xs leading-4 text-mutedText">Compare your skills, then add a project as proof.</p></div> : <span className="grid h-9 place-items-center text-primary"><BookOpenCheck aria-hidden="true" className="h-4 w-4" /></span>}</div>
  </aside>;

  const label = navigation.find(([, href]) => href === pathname)?.[0] ?? "Dashboard";
  const initials = mounted && displayName ? displayName.trim().split(/\s+/).map((part) => part[0]).join("").toUpperCase().slice(0, 2) : activeEmail.slice(0, 2).toUpperCase();
  return <div className={cn("dashboard-canvas min-h-screen text-ink", collapsed ? "lg:grid lg:grid-cols-[76px_1fr]" : "lg:grid lg:grid-cols-[272px_1fr]")}>
    <ScrollProgress />
    <div className="sticky top-0 hidden h-screen lg:block">{cabinet()}</div>
    <AnimatePresence>{open && <motion.div animate={{ opacity: 1 }} exit={{ opacity: 0 }} initial={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-50 lg:hidden"><div role="dialog" aria-modal="true" aria-label="Career profile navigation" className="absolute inset-0"><button aria-label="Close navigation" tabIndex={-1} className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setOpen(false)} /><motion.div animate={{ x: 0 }} exit={{ x: -280 }} initial={{ x: -280 }} transition={{ type: "spring", stiffness: 320, damping: 32 }} className="relative h-full w-[300px] border-r border-borderSoft bg-surface">{cabinet()}<button ref={closeRef} aria-label="Close navigation" className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-ink text-background" onClick={() => setOpen(false)}><X aria-hidden="true" className="h-4 w-4" /></button></motion.div></div></motion.div>}</AnimatePresence>
    <div className="min-w-0"><GlassHeader className="flex h-16 items-center gap-3 px-4 sm:px-6"><Button aria-label="Open navigation" className="border border-borderSoft bg-surface text-ink hover:bg-surface-muted lg:hidden" onClick={() => setOpen(true)} size="icon" variant="secondary"><Menu aria-hidden="true" className="h-5 w-5" /></Button><div className="hidden items-center gap-2 sm:flex"><span className="mono text-[10px] tracking-[0.14em] text-faintText">CAREER MAP</span><span className="h-3 w-px bg-borderSoft" aria-hidden="true" /><span className="mono text-xs text-ink">{label}</span></div><div className="ml-auto flex items-center gap-2"><ThemeToggle /><form action={signOut}><button aria-label={`Sign out${displayName ? `, ${displayName}` : ""}`} title={`${displayName || "Signed in"} · ${activeEmail}`} className="rounded-full outline-none ring-primary hover:opacity-90 focus-visible:ring-2"><Avatar className="h-9 w-9 border border-borderSoft"><AvatarFallback className="bg-accent-soft font-semibold text-primary">{initials}</AvatarFallback></Avatar></button></form></div></GlassHeader>
      <main id="main-content" className="p-4 pb-[calc(80px_+_env(safe-area-inset-bottom))] sm:p-6 sm:pb-[calc(80px_+_env(safe-area-inset-bottom))] lg:p-8 lg:pb-8"><motion.div key={pathname} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.div></main><DashboardMobileDock /></div>
  </div>;
}

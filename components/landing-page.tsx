"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  CalendarRange,
  Check,
  Compass,
  FolderKanban,
  Layers3,
  LockKeyhole,
  Menu,
  Plus,
  Sigma,
  Target,
  TrendingUp,
  X
} from "lucide-react";
import { BrandMark } from "@/components/ui/brand-mark";
import { AuroraBackdrop } from "@/components/ui/aurora-backdrop";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ThemeToggle } from "@/components/providers/theme-toggle";
import { LandingMobileDock } from "@/components/ui/mobile-bottom-nav";
import { ReadinessConsole } from "@/components/landing/readiness-console";
import { CAREERS } from "@/lib/career-readiness";

const nav = [
  ["The map", "#map"],
  ["How it works", "#how"],
  ["Demo", "/demo"]
] as const;

const proofs = ["Self-assessed, not guessed", "A score you can explain", "Private to your account"];

const steps = [
  {
    number: "01",
    title: "Add your student record",
    copy: "Your degree, semester and the skills you already use. Everything starts from what you know today."
  },
  {
    number: "02",
    title: "Choose a target career",
    copy: "Pick one of ten career maps. Every required skill shows its expected level and how much weight it carries."
  },
  {
    number: "03",
    title: "Build the weighted gap",
    copy: "The roadmap ranks gaps by weight. Add a project as proof, then watch readiness recalculate."
  }
] as const;

const formulaRows = [
  ["SQL", "25% × 2/3", "16.7"],
  ["Statistics", "20% × 1/3", "6.7"],
  ["Python", "15% × 0/2", "0.0"]
] as const;

const gaps = [
  ["Python", "15%", "+15"],
  ["Statistics", "20%", "+13"],
  ["SQL", "25%", "+8"]
] as const;

const proficiency = ["Exploring", "Learning", "Practicing", "Confident"] as const;

const faqs = [
  {
    question: "Is readiness a verified credential?",
    answer:
      "No. Readiness is a weighted summary of the skill levels you enter yourself. It is not an employment prediction and not a verified credential, which is why every score shows the requirements behind it."
  },
  {
    question: "How is the score calculated?",
    answer:
      "For each requirement, its weight is multiplied by your proficiency divided by the expected proficiency, capped at the expected level. The contributions are summed and rounded. Missing skills count as zero."
  },
  {
    question: "Who can see my profile and skills?",
    answer:
      "Only you. Supabase Auth identifies your account, and row-level security scopes profile, skill and project rows to their owner. There is no public profile and no admin verification in this version."
  },
  {
    question: "Do I need to connect GitHub?",
    answer:
      "Not in this version. Projects are recorded manually and can include a URL. Automated repository syncing, certificates, internships and result uploads are not enabled yet."
  }
] as const;

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <div id="top" className="aurora-shell aurora-page">
      <AuroraBackdrop />

      <header className={`aurora-header ${scrolled ? "aurora-header-scrolled" : ""}`}>
        <div className="flex h-16 items-center justify-between gap-2 pr-2 pl-3">
          <Link href="/" aria-label="CareerProfile home" className="inline-flex min-h-11 items-center">
            <BrandMark />
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-0.5 md:flex">
            {nav.map(([label, href]) =>
              href.startsWith("#") ? (
                <a key={label} href={href} className="aurora-nav-link">{label}</a>
              ) : (
                <Link key={label} href={href} className="aurora-nav-link">{label}</Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <Link href="/login" className="hidden min-h-11 items-center rounded-full px-3 text-sm font-medium text-mutedText transition-colors hover:text-ink sm:inline-flex">
              Sign in
            </Link>
            <Link href="/signup" className="aurora-cta hidden !min-h-10 !px-4 text-[0.82rem] sm:inline-flex">
              Build your profile
            </Link>
            <button
              aria-controls="mobile-menu"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="grid h-11 w-11 place-items-center rounded-full border border-[var(--aurora-glass-edge)] text-ink md:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              type="button"
            >
              {menuOpen ? <X aria-hidden="true" className="h-4 w-4" /> : <Menu aria-hidden="true" className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div id="mobile-menu" className="aurora-menu-panel mx-1.5 mb-1.5 grid gap-0.5 p-2 md:hidden">
            {nav.map(([label, href]) =>
              href.startsWith("#") ? (
                <a key={label} href={href} className="aurora-menu-link" onClick={() => setMenuOpen(false)}>{label}</a>
              ) : (
                <Link key={label} href={href} className="aurora-menu-link" onClick={() => setMenuOpen(false)}>{label}</Link>
              )
            )}
            <div className="my-1 h-px bg-[var(--aurora-glass-edge)]" />
            <Link href="/login" className="aurora-menu-link" onClick={() => setMenuOpen(false)}>Sign in</Link>
            <Link href="/signup" className="aurora-cta mt-1 w-full" onClick={() => setMenuOpen(false)}>
              Build your profile <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        )}
      </header>

      <main id="main-content" className="relative z-10">
        <section className="aurora-hero" aria-labelledby="hero-heading">
          <div className="aurora-wrap">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="aurora-hero-copy"
              initial={{ opacity: 0, y: 14 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="aurora-pill">
                <span aria-hidden="true" className="aurora-pill-mark" />
                A career map for students
              </span>
              <h1 className="aurora-display mt-6" id="hero-heading">
                See where your skills stand.
                <br />
                <span className="aurora-gradient-text">Know what to build next.</span>
              </h1>
              <p className="aurora-subhead">
                Bring your academic record, skills and projects into one private map. Choose a career to explore and see the gap as a weighted, explainable score — not a guess.
              </p>
              <div className="aurora-hero-actions">
                <Link href="/signup" className="aurora-cta">
                  Build your profile <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <Link href="/demo" className="aurora-cta-ghost">
                  <Compass aria-hidden="true" className="h-4 w-4" /> Explore the sample map
                </Link>
              </div>
              <div className="aurora-proof-row">
                {proofs.map((proof) => (
                  <span key={proof}><Check aria-hidden="true" /> {proof}</span>
                ))}
              </div>
            </motion.div>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="aurora-console-wrap"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <ReadinessConsole />
            </motion.div>

            <div className="mt-7">
              <p className="text-center text-xs text-faintText">Ten career maps, from Data Analyst to UI/UX Designer.</p>
              <div className="aurora-role-rail">
                {CAREERS.map((career) => (
                  <span key={career.id} className="aurora-role-chip">
                    <i aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                    {career.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="aurora-section aurora-section-rule scroll-mt-28" id="map" aria-labelledby="map-heading">
          <div className="aurora-wrap">
            <div className="aurora-section-head">
              <p className="aurora-kicker">The career map</p>
              <h2 className="aurora-heading mt-4" id="map-heading">Not a scoreboard. A map of what to build next.</h2>
              <p className="aurora-subhead">
                CareerProfile keeps the parts of your record that matter to a role, then shows how far each one is from the expected level. The score is arithmetic, not a model.
              </p>
            </div>

            <div className="aurora-bento">
              <SpotlightCard className="aurora-bento-3 aurora-bento-cell">
                <div className="flex items-start justify-between gap-3">
                  <span className="aurora-icon-tile"><Sigma aria-hidden="true" /></span>
                  <span className="aurora-chip">Explainable</span>
                </div>
                <h3 className="aurora-bento-title">Every point has a reason</h3>
                <p className="aurora-bento-copy">
                  A skill&apos;s weight is multiplied by how close your proficiency is to the expected level, capped at that level. Missing skills count as zero.
                </p>
                <div className="mt-5 border-t border-[var(--aurora-glass-edge)]">
                  {formulaRows.map(([skill, formula, points]) => (
                    <div key={skill} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[var(--aurora-glass-edge)] py-2.5 text-xs">
                      <span className="font-semibold text-ink">{skill}</span>
                      <span className="font-mono text-faintText">{formula}</span>
                      <span className="font-mono text-ink">{points} pts</span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[11px] leading-5 text-faintText">The same inputs always produce the same total.</p>
              </SpotlightCard>

              <SpotlightCard className="aurora-bento-3 aurora-bento-cell">
                <div className="flex items-start justify-between gap-3">
                  <span className="aurora-icon-tile"><TrendingUp aria-hidden="true" /></span>
                  <span className="aurora-chip">Ranked by weight</span>
                </div>
                <h3 className="aurora-bento-title">Start where the weight is</h3>
                <p className="aurora-bento-copy">
                  Next steps follow the weighted distance to the role, so a high-weight gap never hides behind a long generic checklist.
                </p>
                <div className="mt-5 grid gap-2">
                  {gaps.map(([skill, weight, lift], index) => (
                    <div key={skill} className="flex items-center gap-3 rounded-xl border border-[var(--aurora-glass-edge)] bg-[color-mix(in_srgb,var(--surface)_30%,transparent)] px-3 py-2.5">
                      <span className="font-mono text-[10px] text-faintText">0{index + 1}</span>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{skill}</span>
                      <span className="font-mono text-[10px] text-faintText">{weight} weight</span>
                      <span className="rounded-md bg-[var(--accent-soft)] px-1.5 py-0.5 font-mono text-[10px] text-primary">{lift} pts</span>
                    </div>
                  ))}
                </div>
              </SpotlightCard>

              <SpotlightCard className="aurora-bento-2 aurora-bento-cell">
                <span className="aurora-icon-tile"><Layers3 aria-hidden="true" /></span>
                <h3 className="aurora-bento-title">A level, not a percentage</h3>
                <p className="aurora-bento-copy">Four plain levels keep self-assessment honest.</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {proficiency.map((level) => (
                    <span key={level} className="aurora-chip">{level}</span>
                  ))}
                </div>
              </SpotlightCard>

              <SpotlightCard className="aurora-bento-2 aurora-bento-cell">
                <span className="aurora-icon-tile"><CalendarRange aria-hidden="true" /></span>
                <h3 className="aurora-bento-title">Your journey, by semester</h3>
                <p className="aurora-bento-copy">Projects stay in the term they belong to, so progress has context.</p>
                <div className="mt-4 space-y-2 border-l border-[var(--aurora-glass-edge)] pl-3">
                  <div>
                    <p className="font-mono text-[10px] text-primary">SEMESTER 4 · 2025</p>
                    <p className="mt-0.5 text-xs text-mutedText">Course planner API</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-primary">SEMESTER 5 · 2026</p>
                    <p className="mt-0.5 text-xs text-mutedText">Sales dashboard</p>
                  </div>
                </div>
              </SpotlightCard>

              <SpotlightCard className="aurora-bento-2 aurora-bento-cell">
                <span className="aurora-icon-tile"><FolderKanban aria-hidden="true" /></span>
                <h3 className="aurora-bento-title">Proof you can show</h3>
                <p className="aurora-bento-copy">Record the project, the tools and an optional link.</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="aurora-chip aurora-chip-strong">SQL</span>
                  <span className="aurora-chip">Python</span>
                  <span className="aurora-chip">Statistics</span>
                  <span className="aurora-chip">Figma</span>
                </div>
              </SpotlightCard>

              <SpotlightCard className="aurora-bento-2 aurora-bento-cell">
                <span className="aurora-icon-tile"><LockKeyhole aria-hidden="true" /></span>
                <h3 className="aurora-bento-title">Private by default</h3>
                <p className="aurora-bento-copy">
                  Row-level security scopes profile, skill and project rows to your account. Nothing is shared publicly.
                </p>
                <span className="aurora-chip mt-4">Owner-only rows</span>
              </SpotlightCard>

              <SpotlightCard className="aurora-bento-4 aurora-bento-cell">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <span className="aurora-icon-tile"><Target aria-hidden="true" /></span>
                  <span className="aurora-chip">10 defined profiles</span>
                </div>
                <h3 className="aurora-bento-title">One record, ten directions</h3>
                <p className="aurora-bento-copy">
                  Each profile carries its own expected levels and weights, so the same skills can read differently for two roles.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {CAREERS.map((career) => (
                    <span key={career.id} className="aurora-chip">{career.name}</span>
                  ))}
                </div>
              </SpotlightCard>
            </div>
          </div>
        </section>

        <section className="aurora-section aurora-section-rule scroll-mt-28" id="how" aria-labelledby="how-heading">
          <div className="aurora-wrap">
            <div className="aurora-section-head">
              <p className="aurora-kicker">How it works</p>
              <h2 className="aurora-heading mt-4" id="how-heading">Three steps, in order.</h2>
              <p className="aurora-subhead">Start with what you have. The map tells you what is missing, not what you should already be.</p>
            </div>
            <div className="aurora-steps">
              {steps.map((step) => (
                <article key={step.number} className="aurora-step">
                  <p className="aurora-step-number">{step.number}</p>
                  <h3 className="aurora-step-title">{step.title}</h3>
                  <p className="aurora-step-copy">{step.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="aurora-section" aria-labelledby="demo-heading">
          <div className="aurora-wrap">
            <div className="aurora-glass aurora-demo-band">
              <div>
                <p className="aurora-kicker">No account needed</p>
                <h2 className="aurora-heading mt-3 text-[clamp(1.8rem,3.4vw,2.8rem)]" id="demo-heading">Try the map before you sign up.</h2>
                <p className="aurora-subhead">
                  A sample student record, all ten career profiles and a live comparison. Change the target career. Nothing you touch is saved.
                </p>
                <Link href="/demo" className="aurora-cta mt-6">
                  Open the sample map <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  ["10", "career profiles"],
                  ["4", "skill levels"],
                  ["0", "changes saved"]
                ].map(([value, label]) => (
                  <div key={label} className="rounded-xl border border-[var(--aurora-glass-edge)] bg-[color-mix(in_srgb,var(--surface)_32%,transparent)] p-3">
                    <p className="font-display text-2xl font-semibold tracking-[-0.04em] text-ink">{value}</p>
                    <p className="mt-1 text-[11px] leading-4 text-mutedText">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="aurora-section aurora-section-rule" aria-labelledby="faq-heading">
          <div className="aurora-wrap grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="aurora-section-head">
              <p className="aurora-kicker">Straight answers</p>
              <h2 className="aurora-heading mt-4" id="faq-heading">What the score is, and is not.</h2>
              <p className="aurora-subhead">If a number cannot explain itself here, it should not be on the page.</p>
            </div>
            <div className="aurora-faq">
              {faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>
                    {faq.question}
                    <span aria-hidden="true"><Plus className="h-3.5 w-3.5" /></span>
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section
          className="aurora-closing"
          style={{ background: "radial-gradient(70% 90% at 50% 110%, var(--accent-soft), transparent 70%)" }}
          aria-labelledby="closing-heading"
        >
          <div className="aurora-wrap-narrow">
            <span className="aurora-pill">
              <span aria-hidden="true" className="aurora-pill-mark" />
              Start with your record
            </span>
            <h2 className="aurora-heading mt-6" id="closing-heading">
              A clearer next step starts with <span className="aurora-gradient-text">what you already know.</span>
            </h2>
            <p className="aurora-subhead">
              Create a private profile, choose a career to explore, and let the weighted gaps point to the next thing worth building.
            </p>
            <div className="aurora-hero-actions">
              <Link href="/signup" className="aurora-cta">
                Create your profile <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link href="/demo" className="aurora-cta-ghost">
                <BookOpenCheck aria-hidden="true" className="h-4 w-4" /> Preview the demo
              </Link>
            </div>
            <p className="mt-5 text-[11px] leading-5 text-faintText">
              Skill levels are self-reported. Readiness is not verified and does not predict employment.
            </p>
          </div>
        </section>
      </main>

      <LandingMobileDock />
    </div>
  );
}

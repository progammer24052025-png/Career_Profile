"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Check, Circle, CircleHelp, Clock3, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreRing } from "@/components/ui/score-ring";
import { CAREERS, PROFICIENCY_LEVELS, analyzeCareer, type StudentSkill } from "@/lib/career-readiness";

const sampleSkills: StudentSkill[] = [
  { id: "1", skill_name: "SQL", category: "Technical", proficiency: 3 },
  { id: "2", skill_name: "Excel", category: "Technical", proficiency: 3 },
  { id: "3", skill_name: "Python", category: "Technical", proficiency: 2 },
  { id: "4", skill_name: "Statistics", category: "Technical", proficiency: 2 },
  { id: "5", skill_name: "Data visualization", category: "Technical", proficiency: 2 },
  { id: "6", skill_name: "Communication", category: "Soft", proficiency: 3 },
  { id: "7", skill_name: "Problem solving", category: "Soft", proficiency: 3 }
];

const statusIcon: Record<string, typeof Check> = { Matched: Check, Partial: Clock3, Missing: Circle };
const statusClass: Record<string, string> = {
  Matched: "aurora-status-matched",
  Partial: "aurora-status-partial",
  Missing: "aurora-status-missing"
};

export function CareerDemo() {
  const [careerId, setCareerId] = useState<string>(CAREERS[0].id);
  const result = useMemo(() => analyzeCareer(careerId, sampleSkills), [careerId]);
  const gaps = useMemo(
    () =>
      [...result.entries]
        .filter((entry) => entry.status !== "Matched")
        .sort((a, b) => b.weight * (1 - b.current / b.expected) - a.weight * (1 - a.current / a.expected))
        .slice(0, 2),
    [result.entries]
  );

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden">
        <CardContent className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="aurora-label">Your comparison</p>
              <Badge variant="outline">Sample student</Badge>
            </div>
            <label className="mt-4 block text-sm font-medium text-mutedText" htmlFor="demo-career">Target career</label>
            <select
              className="mt-2 min-h-12 w-full max-w-lg rounded-xl border border-borderSoft bg-surface px-3 text-base font-semibold text-ink outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              id="demo-career"
              onChange={(event) => setCareerId(event.target.value)}
              value={careerId}
            >
              {CAREERS.map((career) => <option key={career.id} value={career.id}>{career.name}</option>)}
            </select>
            <p className="mt-3 max-w-lg text-sm leading-6 text-mutedText">
              Avery is a third-year computer science student. Skill levels are self-assessed; each career skill carries a transparent weight.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline">B.Tech · Computer Science</Badge>
              <Badge variant="outline">Semester 5</Badge>
              <Badge variant="outline">{sampleSkills.length} skills on record</Badge>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 rounded-2xl border border-[var(--aurora-glass-edge)] bg-[color-mix(in_srgb,var(--surface)_34%,transparent)] p-5 sm:gap-7">
            <ScoreRing id="demo" score={result.score} size={148} strokeWidth={10} />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">Skill readiness</p>
              <p className="mt-1 max-w-[24ch] text-xs leading-5 text-mutedText">Weighted across {result.entries.length} requirements for this role.</p>
              <div className="mt-3 grid gap-1.5 text-xs">
                <span className="inline-flex items-center gap-1.5 text-mutedText"><i aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--ok)" }} />{result.matched} matched</span>
                <span className="inline-flex items-center gap-1.5 text-mutedText"><i aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--warn)" }} />{result.partial} in progress</span>
                <span className="inline-flex items-center gap-1.5 text-mutedText"><i aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--faint)" }} />{result.missing} to explore</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_.85fr]">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>Role requirements</CardTitle>
                <CardDescription>{result.career.name} · expected proficiency and skill weight</CardDescription>
              </div>
              <span className="aurora-chip aurora-chip-strong">{result.score}% readiness</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-2 grid grid-cols-[minmax(0,1fr)_auto_auto] gap-3 border-b border-[var(--aurora-glass-edge)] pb-2 text-[11px] font-medium text-faintText">
              <span>Required skill</span>
              <span>Weight</span>
              <span>Status</span>
            </div>
            <div className="divide-y divide-[var(--aurora-glass-edge)]">
              {result.entries.map((entry) => {
                const Icon = statusIcon[entry.status];
                const fill = Math.min(100, Math.round((entry.current / entry.expected) * 100));
                return (
                  <div className="grid min-h-14 grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 py-3" key={entry.name}>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <p className="text-sm font-medium text-ink">{entry.name}</p>
                        <p className="text-[11px] text-faintText">Expected {PROFICIENCY_LEVELS[entry.expected - 1]}</p>
                      </div>
                      <div className="aurora-meter mt-1.5 max-w-[240px]">
                        <div className="aurora-meter-fill" style={{ width: `${fill}%` }} />
                      </div>
                    </div>
                    <span className="text-xs tabular-nums text-mutedText">{entry.weight}%</span>
                    <span className={`aurora-status ${statusClass[entry.status] ?? ""}`}>
                      <Icon aria-hidden="true" className="h-2.5 w-2.5" />
                      {entry.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Target aria-hidden="true" className="h-4 w-4 text-primary" /> Biggest weighted gaps</CardTitle>
              <CardDescription>The top actions come from the current target role.</CardDescription>
            </CardHeader>
            <CardContent>
              {gaps.map((entry) => {
                const lift = Math.max(0, Math.round(entry.weight * (1 - entry.current / entry.expected)));
                return (
                  <div className="mb-2.5 rounded-xl border border-[var(--aurora-glass-edge)] bg-[color-mix(in_srgb,var(--surface)_30%,transparent)] p-3 last:mb-0" key={entry.name}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-ink">Build {entry.name}</p>
                      <span className="aurora-chip aurora-chip-strong">+{lift} pts</span>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-mutedText">
                      Carries {entry.weight}% of this role&apos;s score. Add a small project that exercises it, then update the level.
                    </p>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-start gap-3 p-4">
              <CircleHelp aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-xs leading-5 text-mutedText">
                Readiness is the weighted sum of current proficiency divided by expected proficiency, capped at 100% per skill. Missing skills count as zero.
              </p>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-2">
            <Link className="aurora-cta" href="/signup">Create your profile <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
            <Link className="aurora-cta-ghost" href="/">Back to overview</Link>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <span className="aurora-icon-tile"><BriefcaseBusiness aria-hidden="true" /></span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink">Student journey</p>
            <p className="mt-0.5 text-xs text-mutedText">Projects can be recorded by academic year and semester, so progress has context.</p>
          </div>
          <Link className="inline-flex min-h-11 items-center gap-1 text-xs font-semibold text-primary hover:underline" href="/signup">
            Start building <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

import { Check, Circle, Clock3, GraduationCap, Sparkles } from "lucide-react";
import { ScoreRing } from "@/components/ui/score-ring";
import { analyzeCareer, type StudentSkill } from "@/lib/career-readiness";

const sampleSkills: StudentSkill[] = [
  { id: "1", skill_name: "SQL", category: "Technical", proficiency: 2 },
  { id: "2", skill_name: "Excel", category: "Technical", proficiency: 3 },
  { id: "3", skill_name: "Statistics", category: "Technical", proficiency: 1 },
  { id: "4", skill_name: "Data visualization", category: "Technical", proficiency: 2 },
  { id: "5", skill_name: "Communication", category: "Soft", proficiency: 2 }
];

const statusIcon: Record<string, typeof Check> = {
  Matched: Check,
  Partial: Clock3,
  Missing: Circle
};

const statusClass: Record<string, string> = {
  Matched: "aurora-status-matched",
  Partial: "aurora-status-partial",
  Missing: "aurora-status-missing"
};

export function ReadinessConsole() {
  const result = analyzeCareer("data-analyst", sampleSkills);

  return (
    <section aria-label="Sample career readiness console" className="aurora-console">
      <div className="aurora-console-bar">
        <p className="aurora-console-brand">
          <i aria-hidden="true"><GraduationCap className="h-3.5 w-3.5" /></i>
          Readiness console
          <span className="hidden text-[11px] font-normal text-faintText sm:inline">Sample profile</span>
        </p>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="aurora-chip hidden sm:inline-flex">Data Analyst</span>
          <span className="aurora-chip aurora-chip-strong">
            <Sparkles aria-hidden="true" className="h-3 w-3" /> Nothing is saved
          </span>
        </div>
      </div>

      <div className="aurora-console-body grid gap-5 sm:grid-cols-[minmax(0,0.92fr)_minmax(0,1.18fr)] lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.18fr)_minmax(0,0.84fr)] lg:gap-6">
        <div className="min-w-0">
          <p className="aurora-label">Target career</p>
          <h2 className="mt-1.5 font-display text-2xl font-semibold tracking-[-0.04em] text-ink">{result.career.name}</h2>
          <p className="mt-1 text-xs text-mutedText">Mira Shah · B.Tech CSE · Semester 5</p>

          <div className="aurora-score mt-5">
            <ScoreRing id="landing-hero" score={result.score} size={132} strokeWidth={9} />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">Readiness</p>
              <p className="mt-1 max-w-[19ch] text-xs leading-5 text-mutedText">Weighted, capped at each role&apos;s expected level.</p>
              <div className="aurora-legend mt-3">
                <span><i style={{ background: "var(--ok)" }} />{result.matched} matched</span>
                <span><i style={{ background: "var(--warn)" }} />{result.partial} in progress</span>
                <span><i style={{ background: "var(--faint)" }} />{result.missing} missing</span>
              </div>
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm font-semibold text-ink">Skill comparison</p>
            <span className="aurora-label">Weight</span>
          </div>
          <div className="aurora-ledger mt-4">
            {result.entries.map((entry, index) => {
              const Icon = statusIcon[entry.status];
              const fill = Math.min(100, Math.round((entry.current / entry.expected) * 100));
              return (
                <div className={`aurora-ledger-row ${index > 3 ? "hidden sm:grid" : ""}`} key={entry.name}>
                  <div>
                    <div className="aurora-ledger-meta">
                      <span className="aurora-ledger-name">{entry.name}</span>
                      <span className="aurora-ledger-value">{entry.weight}%</span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="aurora-meter flex-1">
                        <div className="aurora-meter-fill" style={{ width: `${fill}%` }} />
                      </div>
                      <span className={`aurora-status ${statusClass[entry.status]}`}>
                        <Icon aria-hidden="true" className="h-2.5 w-2.5" />
                        {entry.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            <p className="text-[11px] text-faintText sm:hidden">Plus {result.entries.length - 4} more requirements in the full profile.</p>
          </div>
        </div>

        <div className="hidden min-w-0 sm:col-span-2 sm:block lg:col-span-1">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-xl border border-[var(--aurora-glass-edge)] bg-[color-mix(in_srgb,var(--surface)_36%,transparent)] p-3.5">
              <p className="aurora-label">Largest gap</p>
              <p className="mt-1.5 text-sm font-semibold text-ink">Python</p>
              <p className="mt-1 text-xs leading-5 text-mutedText">
                Carries 15% of this role. A small data-cleaning project turns the gap into evidence.
              </p>
              <p className="mt-2.5 font-mono text-[11px] text-primary">+15 points possible</p>
            </div>
            <div className="rounded-xl border border-[var(--aurora-glass-edge)] p-3.5">
              <div className="flex items-center justify-between gap-2">
                <p className="aurora-label">Project evidence</p>
                <span className="font-mono text-[11px] text-ink">02</span>
              </div>
              <p className="mt-1.5 text-xs leading-5 text-mutedText">Semester 4 · Course planner API<br />Semester 5 · Sales dashboard</p>
            </div>
          </div>
          <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-4 text-faintText">
            <Sparkles aria-hidden="true" className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
            Sample profile. Your own levels are always self-assessed.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--aurora-glass-edge)] px-4 py-2.5 font-mono text-[10px] tracking-[0.06em] text-faintText sm:px-5">
        <span>PROFILE · 3RD YEAR</span>
        <span>CAREER MAP · 01 / 10</span>
      </div>
    </section>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, BriefcaseBusiness, Check, CircleHelp, Compass, FolderKanban, GraduationCap, Pencil, Plus, Sparkles, Target, Trash2 } from "lucide-react";
import { CAREERS, PROFICIENCY_LEVELS, analyzeCareer, type Proficiency, type StudentProfile, type StudentProject, type StudentSkill } from "@/lib/career-readiness";
import { PageHeading } from "@/components/dashboard/page-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type View = "dashboard" | "skills" | "proof" | "journey" | "roadmap" | "profile";
type SkillDraft = { skill_name: string; category: string; proficiency: string };
type ProjectDraft = { project_name: string; description: string; technologies: string; academic_year: string; semester: string; project_url: string };
const emptyProfile: StudentProfile = { display_name: null, university: null, degree: null, branch: null, academic_achievements: null, academic_year: null, current_semester: null, graduation_year: null, target_career: CAREERS[0].id, github_profile_url: null };
const inputClass = "mt-1.5 min-h-11 w-full rounded-xl border border-borderSoft bg-surface px-3 text-sm text-ink outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40";
const viewCopy: Record<View, { eyebrow: string; title: string; description: string }> = {
  dashboard: { eyebrow: "Career map", title: "Your next chapter, in view", description: "A clear picture of what you bring, what your target role asks for, and where to focus next." },
  skills: { eyebrow: "Skills atlas", title: "See how your skills line up", description: "Compare your current proficiency with the expectations for your chosen career." },
  proof: { eyebrow: "Evidence drawer", title: "Keep your work close", description: "Projects make your skills easier to see. Add the work you can walk someone through." },
  journey: { eyebrow: "Student journey", title: "A record of what you’ve built", description: "Your projects and milestones, set in the semester where they happened." },
  roadmap: { eyebrow: "Next steps", title: "A practical path forward", description: "Small, specific actions drawn from the skill gaps in your target career." },
  profile: { eyebrow: "Student record", title: "Your profile, in one place", description: "Keep your academic details and target career up to date." },
};

export function CareerProfileApp({ view }: { view: View }) {
  const [profile, setProfile] = useState<StudentProfile>(emptyProfile);
  const [skills, setSkills] = useState<StudentSkill[]>([]);
  const [projects, setProjects] = useState<StudentProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [skillDraft, setSkillDraft] = useState({ skill_name: "", category: "Technical", proficiency: "2" });
  const [projectDraft, setProjectDraft] = useState({ project_name: "", description: "", technologies: "", academic_year: "", semester: "", project_url: "" });
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const analysis = useMemo(() => analyzeCareer(profile.target_career, skills), [profile.target_career, skills]);
  const copy = viewCopy[view];

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/career-profile", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Your student record could not be loaded.");
      setProfile({ ...emptyProfile, ...data.profile, target_career: data.profile?.target_career || CAREERS[0].id });
      setSkills(data.skills ?? []);
      setProjects(data.projects ?? []);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Your student record could not be loaded.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function request(method: string, body?: unknown, query = "") {
    const response = await fetch(`/api/career-profile${query}`, { method, headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Your change could not be saved.");
    return data;
  }

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError(""); setNotice("");
    try {
      const data = await request("PATCH", profile);
      setProfile({ ...profile, ...data.profile }); setNotice("Profile saved.");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Profile could not be saved."); }
    finally { setSaving(false); }
  }

  async function saveCareerTarget(careerId: string) {
    const nextProfile = { ...profile, target_career: careerId };
    setProfile(nextProfile); setSaving(true); setError(""); setNotice("");
    try { const data = await request("PATCH", nextProfile); setProfile({ ...nextProfile, ...data.profile }); setNotice("Career direction updated."); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Career direction could not be updated."); }
    finally { setSaving(false); }
  }

  async function addSkill(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setNotice("");
    try {
      const data = await request("POST", { type: "skill", ...skillDraft, proficiency: Number(skillDraft.proficiency) });
      setSkills((current) => [...current, data.skill].sort((a, b) => a.skill_name.localeCompare(b.skill_name)));
      setSkillDraft({ skill_name: "", category: "Technical", proficiency: "2" }); setNotice("Skill added.");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Skill could not be added."); }
  }

  async function updateSkill(id: string, proficiency: Proficiency) {
    try {
      const data = await request("PUT", { type: "skill", id, proficiency });
      setSkills((current) => current.map((item) => item.id === id ? data.skill : item)); setNotice("Proficiency updated."); setError("");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Proficiency could not be updated."); }
  }

  async function addProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setNotice("");
    try {
      const payload = { type: "project", ...projectDraft, semester: projectDraft.semester ? Number(projectDraft.semester) : null, technologies: projectDraft.technologies.split(",").map((item) => item.trim()).filter(Boolean) };
      const data = await request(editingProjectId ? "PUT" : "POST", { ...payload, ...(editingProjectId ? { id: editingProjectId } : {}) });
      const wasEditing = editingProjectId !== null;
      setProjects((current) => editingProjectId ? current.map((item) => item.id === editingProjectId ? data.project : item) : [data.project, ...current]);
      setEditingProjectId(null);
      setProjectDraft({ project_name: "", description: "", technologies: "", academic_year: "", semester: "", project_url: "" }); setNotice(wasEditing ? "Project updated." : "Project added to your record.");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Project could not be saved."); }
  }

  async function remove(type: "skill" | "project", id: string) {
    setError("");
    try {
      await request("DELETE", undefined, `?type=${type}&id=${encodeURIComponent(id)}`);
      if (type === "skill") setSkills((current) => current.filter((item) => item.id !== id));
      else setProjects((current) => current.filter((item) => item.id !== id));
      setNotice(type === "skill" ? "Skill removed." : "Project removed.");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "This item could not be removed."); }
  }

  const events = [...projects].sort((a, b) => (b.academic_year ?? "").localeCompare(a.academic_year ?? "") || (b.semester ?? 0) - (a.semester ?? 0) || b.created_at.localeCompare(a.created_at));
  const firstName = profile.display_name?.trim().split(/\s+/)[0] || "there";

  return <div className="space-y-6">
    <PageHeading {...copy} />
    {error && <div role="alert" className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>}
    {notice && <div role="status" aria-live="polite" className="rounded-xl border border-success/25 bg-success/10 px-4 py-3 text-sm text-success">{notice}</div>}
    {loading ? <Card><CardContent className="p-6 text-sm text-mutedText">Opening your student record…</CardContent></Card> : view === "dashboard" ? <DashboardView name={firstName} profile={profile} onChooseCareer={saveCareerTarget} saving={saving} analysis={analysis} skills={skills} projects={projects} />
      : view === "skills" ? <SkillsView skills={skills} analysis={analysis} draft={skillDraft} setDraft={setSkillDraft} onAdd={addSkill} onUpdate={updateSkill} onRemove={(id) => void remove("skill", id)} />
      : view === "proof" ? <ProofView projects={projects} draft={projectDraft} setDraft={setProjectDraft} editing={editingProjectId !== null} onAdd={addProject} onEdit={(project) => { setEditingProjectId(project.id); setProjectDraft({ project_name: project.project_name, description: project.description, technologies: project.technologies.join(", "), academic_year: project.academic_year ?? "", semester: project.semester ? String(project.semester) : "", project_url: project.project_url ?? "" }); }} onCancelEdit={() => { setEditingProjectId(null); setProjectDraft({ project_name: "", description: "", technologies: "", academic_year: "", semester: "", project_url: "" }); }} onRemove={(id) => void remove("project", id)} />
      : view === "journey" ? <JourneyView events={events} />
      : view === "roadmap" ? <RoadmapView analysis={analysis} />
      : <ProfileView profile={profile} setProfile={setProfile} saving={saving} onSave={saveProfile} />}
  </div>;
}

type Analysis = ReturnType<typeof analyzeCareer>;

function DashboardView({ name, profile, onChooseCareer, saving, analysis, skills, projects }: { name: string; profile: StudentProfile; onChooseCareer: (careerId: string) => void; saving: boolean; analysis: Analysis; skills: StudentSkill[]; projects: StudentProject[] }) {
  return <div className="space-y-5">
    <Card className="overflow-hidden border-primary/20 bg-card"><CardContent className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
      <div><Badge variant="primary">Your current direction</Badge><h2 className="mt-3 font-heading text-2xl font-medium tracking-tight text-ink">Good to see you, {name}.</h2><p className="mt-1 max-w-xl text-sm leading-6 text-mutedText">You’re building toward <strong className="font-semibold text-ink">{analysis.career.name}</strong>. Your score shows how your recorded skills match its weighted requirements.</p>
        <label className="mt-5 block max-w-md text-xs font-medium text-mutedText" htmlFor="target-career">Target career<select id="target-career" value={profile.target_career ?? CAREERS[0].id} disabled={saving} onChange={(event) => onChooseCareer(event.target.value)} className={inputClass}>{CAREERS.map((career) => <option key={career.id} value={career.id}>{career.name}</option>)}</select></label>
      </div>
      <div className="flex items-center justify-center gap-5 rounded-2xl border border-borderSoft bg-surface/60 p-5 sm:gap-7"><ScoreRing score={analysis.score} /><div className="space-y-2.5 text-sm"><p className="font-medium text-ink">Skill readiness</p><p className="flex items-center gap-2 text-mutedText"><span className="h-2 w-2 rounded-full bg-success" />{analysis.matched} matched</p><p className="flex items-center gap-2 text-mutedText"><span className="h-2 w-2 rounded-full bg-warning" />{analysis.partial} in progress</p><p className="flex items-center gap-2 text-mutedText"><span className="h-2 w-2 rounded-full bg-faintText" />{analysis.missing} to explore</p></div></div>
    </CardContent></Card>
    {(!profile.university || skills.length === 0) && <Card className="border-primary/20 bg-accent-soft"><CardContent className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"><div><h2 className="font-heading text-lg font-medium text-ink">Start building your map</h2><p className="mt-1 max-w-xl text-sm leading-6 text-mutedText">Add your academic context and the skills you have practiced. Your readiness score will update as you go.</p></div><div className="flex flex-wrap gap-2"><Button asChild><Link href="/dashboard/profile">Add profile details</Link></Button><Button asChild variant="secondary"><Link href="/dashboard/skills">Add skills</Link></Button></div></CardContent></Card>}
    <div className="grid gap-4 sm:grid-cols-3"><MetricCard icon={<Target className="h-4 w-4" />} label="Skills on record" value={String(skills.length)} note="Your self-assessed skills" /><MetricCard icon={<FolderKanban className="h-4 w-4" />} label="Projects" value={String(projects.length)} note="Evidence you can share" /><MetricCard icon={<GraduationCap className="h-4 w-4" />} label="Current semester" value={profile.current_semester ? `Semester ${profile.current_semester}` : "Add details"} note={profile.academic_year || profile.degree || "Your academic context"} /></div>
    <div className="grid gap-4 xl:grid-cols-[1.1fr_.9fr]"><Card><CardHeader><CardTitle>Focus next</CardTitle><CardDescription>The highest-weight gaps for {analysis.career.name}.</CardDescription></CardHeader><CardContent><GapList entries={analysis.entries.filter((entry) => entry.status !== "Matched").slice(0, 3)} /></CardContent></Card><Card><CardHeader><CardTitle>Recent journey</CardTitle><CardDescription>Recent proof from your student record.</CardDescription></CardHeader><CardContent>{projects.length ? <div className="space-y-3">{projects.slice(0, 3).map((project) => <div key={project.id} className="flex items-start gap-3 border-b border-borderSoft pb-3 last:border-0 last:pb-0"><span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-primary/20 bg-accent-soft text-primary"><BriefcaseBusiness className="h-4 w-4" /></span><div><p className="text-sm font-medium text-ink">{project.project_name}</p><p className="mt-0.5 text-xs text-mutedText">{project.academic_year || "Year not set"}{project.semester ? ` · Semester ${project.semester}` : ""}</p></div></div>)}</div> : <p className="text-sm leading-6 text-mutedText">Your timeline starts when you add a project. Class assignments, club work and personal builds all count.</p>}</CardContent></Card></div>
    <p className="flex items-start gap-2 text-xs leading-5 text-mutedText"><CircleHelp aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />Readiness uses the weighted average of your proficiency against each career requirement. It reflects your self-assessment, not a verified credential.</p>
  </div>;
}

function ScoreRing({ score }: { score: number }) {
  return <div className="grid h-32 w-32 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(var(--accent) ${score * 3.6}deg, rgb(var(--line-rgb)) 0deg)` }} role="img" aria-label={`Career readiness ${score} percent`}><div className="grid h-[calc(100%-12px)] w-[calc(100%-12px)] place-content-center rounded-full bg-card text-center"><strong className="font-display text-4xl font-semibold leading-none tracking-tight text-ink">{score}</strong><span className="mt-1 text-[11px] text-mutedText">out of 100</span></div></div>;
}

function MetricCard({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: string; note: string }) {
  return <Card><CardContent className="flex min-h-[126px] items-start justify-between p-5"><div><p className="text-xs font-medium text-mutedText">{label}</p><p className="mt-2 font-heading text-2xl font-medium tracking-tight text-ink">{value}</p><p className="mt-1 text-xs text-mutedText">{note}</p></div><span className="grid h-9 w-9 place-items-center rounded-xl border border-primary/20 bg-accent-soft text-primary">{icon}</span></CardContent></Card>;
}

function SkillsView({ skills, analysis, draft, setDraft, onAdd, onUpdate, onRemove }: { skills: StudentSkill[]; analysis: Analysis; draft: SkillDraft; setDraft: (draft: SkillDraft) => void; onAdd: (event: React.FormEvent<HTMLFormElement>) => void; onUpdate: (id: string, proficiency: Proficiency) => void; onRemove: (id: string) => void }) {
  return <div className="grid gap-5 xl:grid-cols-[.85fr_1.15fr]"><Card><CardHeader><CardTitle>Your skills</CardTitle><CardDescription>Proficiency is your current self-assessment. You can change it at any time.</CardDescription></CardHeader><CardContent className="space-y-4">
    <form onSubmit={onAdd} className="grid gap-3 rounded-xl border border-borderSoft bg-surface/50 p-4"><label className="text-xs font-medium text-mutedText">Skill name<input required maxLength={80} value={draft.skill_name} onChange={(e) => setDraft({ ...draft, skill_name: e.target.value })} className={inputClass} placeholder="For example, SQL" /></label><div className="grid gap-3 sm:grid-cols-2"><label className="text-xs font-medium text-mutedText">Type<select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className={inputClass}><option>Technical</option><option>Soft</option></select></label><label className="text-xs font-medium text-mutedText">Proficiency<select value={draft.proficiency} onChange={(e) => setDraft({ ...draft, proficiency: e.target.value })} className={inputClass}>{PROFICIENCY_LEVELS.map((level, index) => <option key={level} value={index + 1}>{level}</option>)}</select></label></div><Button type="submit" className="min-h-11"><Plus aria-hidden="true" className="h-4 w-4" />Add skill</Button></form>
    {skills.length ? <ul className="divide-y divide-borderSoft">{skills.map((skill) => <li key={skill.id} className="flex items-center gap-3 py-3"><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-ink">{skill.skill_name}</p><p className="mt-0.5 text-xs text-mutedText">{skill.category}</p></div><label className="sr-only" htmlFor={`skill-${skill.id}`}>Proficiency for {skill.skill_name}</label><select id={`skill-${skill.id}`} value={skill.proficiency} onChange={(e) => onUpdate(skill.id, Number(e.target.value) as Proficiency)} className="min-h-11 max-w-[160px] rounded-lg border border-borderSoft bg-surface px-2 text-xs text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">{PROFICIENCY_LEVELS.map((level, index) => <option key={level} value={index + 1}>{level}</option>)}</select><button type="button" onClick={() => onRemove(skill.id)} aria-label={`Remove ${skill.skill_name}`} className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-mutedText hover:bg-danger/10 hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"><Trash2 className="h-4 w-4" /></button></li>)}</ul> : <Empty text="Add the skills you have practiced, even if you are still learning them." />}
  </CardContent></Card><Card><CardHeader><div className="flex flex-wrap items-start justify-between gap-3"><div><CardTitle>Required for {analysis.career.name}</CardTitle><CardDescription>Expected level and importance in the readiness score.</CardDescription></div><Badge variant="outline">{analysis.score}% readiness</Badge></div></CardHeader><CardContent><div className="mb-3 grid grid-cols-[1fr_auto_auto] gap-3 border-b border-borderSoft pb-2 text-[11px] font-medium text-mutedText"><span>Career skill</span><span>Weight</span><span>Status</span></div><div className="divide-y divide-borderSoft">{analysis.entries.map((entry) => <div key={entry.name} className="grid min-h-14 grid-cols-[1fr_auto_auto] items-center gap-3 py-2"><div><p className="text-sm font-medium text-ink">{entry.name}</p><p className="text-[11px] text-mutedText">Expected: {PROFICIENCY_LEVELS[entry.expected - 1]}</p></div><span className="text-xs tabular-nums text-mutedText">{entry.weight}%</span><StatusBadge status={entry.status} /></div>)}</div></CardContent></Card></div>;
}

function StatusBadge({ status }: { status: string }) { return <Badge variant={status === "Matched" ? "success" : status === "Partial" ? "warning" : "outline"}>{status}</Badge>; }
function GapList({ entries }: { entries: Analysis["entries"] }) { return entries.length ? <div className="space-y-3">{entries.map((entry) => <div key={entry.name} className="flex items-center gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-borderSoft bg-surface text-xs font-semibold tabular-nums text-mutedText">{entry.weight}</span><div className="min-w-0 flex-1"><p className="text-sm font-medium text-ink">{entry.name}</p><p className="text-xs text-mutedText">{entry.status === "Missing" ? "Not on your skills list yet" : `Build from ${PROFICIENCY_LEVELS[entry.current - 1]} toward ${PROFICIENCY_LEVELS[entry.expected - 1]}`}</p></div><StatusBadge status={entry.status} /></div>)}</div> : <p className="text-sm text-mutedText">Every listed requirement is at or above its expected level. Keep collecting proof to support your skills.</p>; }
function Empty({ text }: { text: string }) { return <div className="rounded-xl border border-dashed border-borderSoft bg-surface/40 p-5 text-sm leading-6 text-mutedText">{text}</div>; }

function ProofView({ projects, draft, setDraft, editing, onAdd, onEdit, onCancelEdit, onRemove }: { projects: StudentProject[]; draft: ProjectDraft; setDraft: (draft: ProjectDraft) => void; editing: boolean; onAdd: (event: React.FormEvent<HTMLFormElement>) => void; onEdit: (project: StudentProject) => void; onCancelEdit: () => void; onRemove: (id: string) => void }) {
  return <div className="grid gap-5 xl:grid-cols-[.85fr_1.15fr]"><Card><CardHeader><CardTitle>{editing ? "Edit project" : "Add a project"}</CardTitle><CardDescription>Record the work, tools and semester. Imported work stays under your review.</CardDescription></CardHeader><CardContent><form onSubmit={onAdd} className="space-y-3"><label className="block text-xs font-medium text-mutedText">Project name<input required maxLength={160} value={draft.project_name} onChange={(e) => setDraft({ ...draft, project_name: e.target.value })} className={inputClass} /></label><label className="block text-xs font-medium text-mutedText">What did you build?<textarea maxLength={1200} rows={3} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className={`${inputClass} py-2.5`} /></label><label className="block text-xs font-medium text-mutedText">Skills and technologies<input value={draft.technologies} onChange={(e) => setDraft({ ...draft, technologies: e.target.value })} className={inputClass} placeholder="React, SQL, teamwork" /><span className="mt-1 block font-normal">Separate each item with a comma.</span></label><div className="grid gap-3 sm:grid-cols-2"><label className="text-xs font-medium text-mutedText">Academic year<input maxLength={40} value={draft.academic_year} onChange={(e) => setDraft({ ...draft, academic_year: e.target.value })} className={inputClass} placeholder="2025–26" /></label><label className="text-xs font-medium text-mutedText">Semester<input type="number" min="1" max="12" value={draft.semester} onChange={(e) => setDraft({ ...draft, semester: e.target.value })} className={inputClass} /></label></div><label className="block text-xs font-medium text-mutedText">Project link<input type="url" maxLength={240} value={draft.project_url} onChange={(e) => setDraft({ ...draft, project_url: e.target.value })} className={inputClass} placeholder="https://" /></label><div className="flex flex-wrap gap-2"><Button type="submit" className="min-h-11 flex-1"><Plus className="h-4 w-4" />{editing ? "Save changes" : "Save project"}</Button>{editing && <Button type="button" variant="secondary" onClick={onCancelEdit}>Cancel</Button>}</div></form></CardContent></Card><div className="space-y-3"><h2 className="font-heading text-lg font-medium text-ink">Your proof</h2>{projects.length ? projects.map((project) => <Card key={project.id}><CardContent className="flex items-start gap-3 p-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-primary/20 bg-accent-soft text-primary"><FolderKanban className="h-4 w-4" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="text-sm font-semibold text-ink">{project.project_name}</h3><p className="mt-0.5 text-xs text-mutedText">{project.source} · {project.academic_year || "Year not set"}{project.semester ? ` · Semester ${project.semester}` : ""}</p></div><div className="flex"><button type="button" onClick={() => onEdit(project)} aria-label={`Edit ${project.project_name}`} className="grid h-9 w-9 place-items-center rounded-lg text-mutedText hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"><Pencil className="h-4 w-4" /></button><button type="button" onClick={() => onRemove(project.id)} aria-label={`Remove ${project.project_name}`} className="grid h-9 w-9 place-items-center rounded-lg text-mutedText hover:bg-danger/10 hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"><Trash2 className="h-4 w-4" /></button></div></div>{project.description && <p className="mt-2 text-sm leading-5 text-mutedText">{project.description}</p>}{project.technologies.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{project.technologies.map((tech) => <Badge variant="outline" key={tech}>{tech}</Badge>)}</div>}{project.project_url && <a className="mt-3 inline-flex min-h-9 items-center gap-1 text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40" href={project.project_url} target="_blank" rel="noreferrer">Open project <ArrowUpRight className="h-3.5 w-3.5" /></a>}</div></CardContent></Card>) : <Card><CardContent className="p-5"><Empty text="Your evidence drawer is empty. Add a course project, personal build or club project to give your skills context." /></CardContent></Card>}<Card className="border-warning/20 bg-warning/5"><CardContent className="flex gap-3 p-4 text-sm leading-5 text-mutedText"><CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-warning" /><p>Certificates, internships and academic-result verification are not enabled in this build yet. Projects are available now.</p></CardContent></Card></div></div>;
}

function JourneyView({ events }: { events: StudentProject[] }) {
  const grouped = events.reduce<Record<string, StudentProject[]>>((all, item) => { const key = `${item.academic_year || "Year not set"}${item.semester ? ` · Semester ${item.semester}` : ""}`; (all[key] ??= []).push(item); return all; }, {});
  return events.length ? <div className="relative max-w-3xl space-y-7 before:absolute before:bottom-4 before:left-[15px] before:top-4 before:w-px before:bg-borderSoft">{Object.entries(grouped).map(([period, items]) => <section key={period} className="relative pl-10"><span className="absolute left-[9px] top-1 grid h-3.5 w-3.5 place-items-center rounded-full border-[3px] border-primary bg-background" /><h2 className="font-heading text-lg font-medium text-ink">{period}</h2><div className="mt-3 space-y-3">{items.map((item) => <Card key={item.id}><CardContent className="flex gap-3 p-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-primary/20 bg-accent-soft text-primary"><BookOpen className="h-4 w-4" /></span><div><h3 className="text-sm font-semibold text-ink">{item.project_name}</h3><p className="mt-1 text-xs leading-5 text-mutedText">{item.description || item.technologies.join(", ") || "Project added to your journey."}</p></div></CardContent></Card>)}</div></section>)}</div> : <Card><CardContent className="p-6"><div className="mx-auto max-w-lg py-8 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-primary/20 bg-accent-soft text-primary"><Compass className="h-5 w-5" /></span><h2 className="mt-4 font-heading text-xl font-medium text-ink">Your journey starts here.</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-mutedText">Add a project, then return here to see your work grouped by academic year and semester.</p></div></CardContent></Card>;
}

function RoadmapView({ analysis }: { analysis: Analysis }) {
  const actions = analysis.entries.filter((entry) => entry.status !== "Matched").sort((a, b) => b.weight - a.weight).slice(0, 5);
  return <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]"><Card className="h-fit"><CardHeader><Badge variant="primary">Rule-based guidance</Badge><CardTitle className="pt-2">Start with one useful step</CardTitle><CardDescription>These suggestions come from your target role and self-assessed skills. Adjust your plan as you learn.</CardDescription></CardHeader><CardContent><div className="rounded-xl border border-borderSoft bg-surface/60 p-4"><p className="text-xs font-medium text-mutedText">Career direction</p><p className="mt-1 text-base font-semibold text-ink">{analysis.career.name}</p><p className="mt-2 text-sm text-mutedText">{analysis.score}% readiness · {analysis.missing + analysis.partial} areas to build</p></div></CardContent></Card><div className="space-y-3">{actions.length ? actions.map((entry, index) => <Card key={entry.name}><CardContent className="flex items-start gap-4 p-4 sm:p-5"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-primary/20 bg-accent-soft text-primary"><span className="font-mono text-xs">{String(index + 1).padStart(2, "0")}</span></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-semibold text-ink">Build {entry.name}</h2><StatusBadge status={entry.status} /></div><p className="mt-1 text-sm leading-6 text-mutedText">{entry.status === "Missing" ? `Start with a short guided course in ${entry.name}, then make one small project that uses it.` : `Practice ${entry.name} in a focused project and revisit your proficiency when you can explain the work.`} This skill carries {entry.weight}% of the {analysis.career.name} readiness score.</p><p className="mt-2 text-xs text-mutedText">Aim for {PROFICIENCY_LEVELS[entry.expected - 1]} · current: {entry.current ? PROFICIENCY_LEVELS[entry.current - 1] : "not recorded"}</p></div><Sparkles aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-primary" /></CardContent></Card>) : <Card><CardContent className="p-5"><p className="text-sm leading-6 text-mutedText">Your recorded skills meet the current requirements. Add a project that demonstrates what you know, then consider another career direction.</p></CardContent></Card>}</div></div>;
}

function ProfileView({ profile, setProfile, saving, onSave }: { profile: StudentProfile; setProfile: (profile: StudentProfile) => void; saving: boolean; onSave: (event: React.FormEvent<HTMLFormElement>) => void }) {
  const field = (key: keyof StudentProfile, label: string, placeholder = "", type = "text") => <label key={key} className="block text-xs font-medium text-mutedText">{label}<input type={type} min={key === "current_semester" ? 1 : key === "graduation_year" ? 2020 : undefined} max={key === "current_semester" ? 12 : key === "graduation_year" ? 2045 : undefined} maxLength={key === "github_profile_url" ? 240 : 160} value={profile[key] ?? ""} onChange={(event) => { const value = event.target.value; const next = { ...profile, [key]: key === "current_semester" || key === "graduation_year" ? value ? Number(value) : null : value } as StudentProfile; setProfile(next); }} className={inputClass} placeholder={placeholder} /></label>;
  return <Card><CardHeader><CardTitle>Student details</CardTitle><CardDescription>These details stay in your private profile and help put your progress in context.</CardDescription></CardHeader><CardContent><form onSubmit={onSave} className="grid gap-x-5 gap-y-4 md:grid-cols-2">
    {field("display_name", "Full name", "Your name")}{field("university", "University", "University or college")}{field("degree", "Degree", "B.Tech")}{field("branch", "Branch or specialization", "Computer Science")}
    <label className="block text-xs font-medium text-mutedText md:col-span-2">Academic achievements<textarea maxLength={1500} rows={3} value={profile.academic_achievements ?? ""} onChange={(event) => setProfile({ ...profile, academic_achievements: event.target.value })} className={`${inputClass} py-2.5`} placeholder="Awards, honors or notable academic work" /></label>
    {field("academic_year", "Academic year", "3rd year")}{field("current_semester", "Current semester", "5", "number")}{field("graduation_year", "Graduation year", "2028", "number")}
    <label className="block text-xs font-medium text-mutedText">Target career<select value={profile.target_career ?? CAREERS[0].id} onChange={(event) => setProfile({ ...profile, target_career: event.target.value })} className={inputClass}>{CAREERS.map((career) => <option key={career.id} value={career.id}>{career.name}</option>)}</select></label>
    {field("github_profile_url", "GitHub profile link", "https://github.com/you", "url")}
    <p className="md:col-span-2 text-xs leading-5 text-mutedText">Adding a GitHub link records the URL only. Repository syncing and automated imports are not connected yet.</p>
    <div className="md:col-span-2"><Button disabled={saving} type="submit" className="min-h-11">{saving ? "Saving…" : <><Check className="h-4 w-4" />Save profile</>}</Button></div>
  </form></CardContent></Card>;
}


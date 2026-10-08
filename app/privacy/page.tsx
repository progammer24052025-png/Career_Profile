import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Database, FileCheck2, LockKeyhole, UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/providers/theme-toggle";
import { GlassHeader } from "@/components/layout/glass-header";

export const metadata: Metadata = {
  title: "Privacy and student data",
  description: "What CareerProfile stores and how your student profile, skills, projects and career readiness are used.",
};

const sections = [
  { icon: UserRound, title: "Information in your profile", text: "Your account email and name, university, degree, branch, academic achievements, academic year, semester, graduation year, target career, skills, proficiency levels, and project details. Project details can include a description, technologies, semester and a link." },
  { icon: Database, title: "How your data is used", text: "Your details are used to show your student profile, compare recorded skills with the selected career requirements, calculate the readiness score, and organize projects in your journey. Career requirements are part of the application. Scores are calculated with a published, deterministic rule." },
  { icon: LockKeyhole, title: "Account access", text: "Sign-in is required for saved student records. The career-profile API checks the signed-in user, and database row policies scope skills and projects to their owner. Do not enter information you do not want stored in your profile." },
  { icon: FileCheck2, title: "Self-assessed skills and connected services", text: "Proficiency is self-reported and is not an independently verified credential. A GitHub profile URL can be recorded, but this version does not fetch repositories. Semester-result uploads, OCR, admin verification, certificates and internship records are not enabled." },
];

export default function PrivacyPage() {
  return <div className="min-h-screen bg-background"><GlassHeader><div className="mx-auto flex h-[68px] max-w-5xl items-center justify-between px-5 sm:px-8"><Link href="/" className="inline-flex min-h-11 items-center gap-2.5"><span className="grid h-8 w-8 place-items-center rounded-lg bg-ink font-display text-[10px] font-semibold text-background">CP</span><span className="font-display text-base font-semibold tracking-tight text-ink">Career<em className="font-normal text-primary">Profile</em></span></Link><div className="flex items-center gap-2"><ThemeToggle /><Button asChild variant="secondary" size="sm"><Link href="/"><ArrowLeft className="h-3.5 w-3.5" />Overview</Link></Button></div></div></GlassHeader>
    <main id="main-content" className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16"><p className="font-mono text-[10px] tracking-[.14em] text-primary">YOUR STUDENT RECORD</p><h1 className="mt-3 max-w-3xl font-heading text-3xl font-medium tracking-tight text-ink sm:text-5xl">Privacy and student data</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-mutedText">This page describes the data flow in the current CareerProfile student experience.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">{sections.map(({ icon: Icon, title, text }) => <Card key={title}><CardHeader><CardTitle className="flex items-center gap-2.5 text-base"><span className="grid h-8 w-8 place-items-center rounded-lg bg-accent-soft text-primary"><Icon className="h-4 w-4" /></span>{title}</CardTitle></CardHeader><CardContent><p className="text-sm leading-6 text-mutedText">{text}</p></CardContent></Card>)}</div>
      <Card className="mt-4 border-warning/25 bg-warning/5"><CardHeader><CardTitle className="text-base">Editing and removal</CardTitle></CardHeader><CardContent><p className="text-sm leading-6 text-mutedText">You can edit your profile, update or remove skills, and edit or remove projects in the app. Account deletion reports whether server-side deletion completed. If the interface reports that permanent deletion is unavailable, signing out or clearing browser data does not delete the account from the server.</p></CardContent></Card>
      <div className="mt-8 flex flex-wrap gap-3"><Button asChild><Link href="/signup">Create a profile</Link></Button><Button asChild variant="secondary"><Link href="/demo">View the sample</Link></Button></div>
    </main></div>;
}

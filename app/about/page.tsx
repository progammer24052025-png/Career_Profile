import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, GraduationCap, Target, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/layout/public-header";

export const metadata: Metadata = {
  title: "About CareerProfile",
  description: "Why CareerProfile helps students connect skills, evidence and their target career.",
};

export default function AboutPage() {
  return <div className="min-h-screen bg-background"><PublicHeader /><main id="main-content" className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24"><p className="font-mono text-[10px] tracking-[.14em] text-primary">ABOUT CAREERPROFILE</p><h1 className="mt-4 max-w-3xl font-heading text-4xl font-medium tracking-tight text-ink sm:text-6xl">A student journey, with the next step in view.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-mutedText">Students collect useful work across classes, clubs, projects and personal learning. CareerProfile brings that work together and compares a student’s self-assessed skills with the requirements of a career they want to explore.</p><div className="mt-14 grid gap-8 border-t border-borderSoft pt-10 sm:grid-cols-3">{[{ icon: UserRound, title: "Start with your profile", body: "Record your academic context and the skills you are working on." }, { icon: Target, title: "Compare with a career", body: "See matched, partial and missing skills alongside each role’s expected level and weight." }, { icon: Compass, title: "Keep your proof", body: "Add projects with tools and semester details, then turn the largest gaps into next steps." }].map(({ icon: Icon, title, body }) => <section key={title}><Icon aria-hidden="true" className="h-5 w-5 text-primary" /><h2 className="mt-4 font-heading text-xl font-medium text-ink">{title}</h2><p className="mt-3 text-sm leading-6 text-mutedText">{body}</p></section>)}</div><div className="mt-12 flex flex-wrap gap-3"><Button asChild><Link href="/signup">Build your profile <ArrowRight className="h-4 w-4" /></Link></Button><Button asChild variant="secondary"><Link href="/demo">Explore the demo</Link></Button></div><p className="mt-8 text-xs leading-5 text-mutedText"><GraduationCap aria-hidden="true" className="mr-1 inline h-4 w-4" />Readiness reflects self-reported skills and is not a verified credential.</p></main></div>;
}

export const PROFICIENCY_LEVELS = ["Exploring", "Learning", "Practicing", "Confident"] as const;
export type Proficiency = 1 | 2 | 3 | 4;

export const CAREERS = [
  { id: "data-analyst", name: "Data Analyst", family: "Data", skills: [["SQL", 3, 25], ["Excel", 3, 15], ["Python", 2, 15], ["Statistics", 3, 20], ["Data visualization", 2, 15], ["Communication", 2, 10]] },
  { id: "data-scientist", name: "Data Scientist", family: "Data", skills: [["Python", 3, 20], ["Statistics", 3, 20], ["Machine learning", 2, 20], ["SQL", 2, 10], ["Data visualization", 2, 10], ["Communication", 2, 10], ["Problem solving", 3, 10]] },
  { id: "software-developer", name: "Software Developer", family: "Engineering", skills: [["Data structures", 3, 20], ["JavaScript", 3, 15], ["Git", 2, 10], ["Problem solving", 3, 20], ["Testing", 2, 10], ["Communication", 2, 10], ["System design", 2, 15]] },
  { id: "machine-learning-engineer", name: "Machine Learning Engineer", family: "Engineering", skills: [["Python", 3, 20], ["Machine learning", 3, 20], ["Statistics", 3, 15], ["SQL", 2, 10], ["Git", 2, 10], ["Cloud computing", 2, 10], ["Data structures", 2, 15]] },
  { id: "cybersecurity-analyst", name: "Cybersecurity Analyst", family: "Security", skills: [["Networking", 3, 20], ["Linux", 2, 15], ["Security fundamentals", 3, 20], ["Python", 2, 10], ["Risk analysis", 2, 15], ["Communication", 2, 10], ["Problem solving", 2, 10]] },
  { id: "ui-ux-designer", name: "UI/UX Designer", family: "Design", skills: [["Figma", 3, 20], ["User research", 3, 20], ["Prototyping", 3, 15], ["Visual design", 3, 15], ["Accessibility", 2, 10], ["Communication", 3, 10], ["Usability testing", 2, 10]] },
  { id: "product-manager", name: "Product Manager", family: "Product", skills: [["Product strategy", 2, 15], ["User research", 2, 15], ["Communication", 3, 20], ["Data analysis", 2, 15], ["Prioritization", 3, 15], ["Problem solving", 3, 20]] },
  { id: "backend-developer", name: "Backend Developer", family: "Engineering", skills: [["Node.js", 3, 20], ["SQL", 3, 15], ["API design", 2, 15], ["Data structures", 2, 15], ["Git", 2, 10], ["Testing", 2, 10], ["System design", 2, 15]] },
  { id: "frontend-developer", name: "Frontend Developer", family: "Engineering", skills: [["React", 3, 20], ["JavaScript", 3, 20], ["HTML & CSS", 3, 15], ["Accessibility", 2, 10], ["Git", 2, 10], ["Testing", 2, 10], ["Design systems", 2, 15]] },
  { id: "full-stack-developer", name: "Full Stack Developer", family: "Engineering", skills: [["JavaScript", 3, 15], ["React", 2, 15], ["Node.js", 2, 15], ["SQL", 2, 15], ["API design", 2, 10], ["Git", 2, 10], ["Testing", 2, 10], ["Cloud computing", 2, 10]] },
] as const;

export type StudentSkill = { id: string; skill_name: string; category: "Technical" | "Soft"; proficiency: Proficiency };
export type StudentProject = { id: string; project_name: string; description: string; technologies: string[]; academic_year: string | null; semester: number | null; project_url: string | null; source: "Manual" | "GitHub" | "Imported"; created_at: string };
export type StudentProfile = { display_name: string | null; university: string | null; degree: string | null; branch: string | null; academic_achievements: string | null; academic_year: string | null; current_semester: number | null; graduation_year: number | null; target_career: string | null; github_profile_url: string | null };

export function analyzeCareer(careerId: string | null, skills: StudentSkill[]) {
  const career = CAREERS.find((item) => item.id === careerId) ?? CAREERS[0];
  const entries = career.skills.map(([name, expected, weight]) => {
    const current = skills.find((skill) => skill.skill_name.toLocaleLowerCase() === name.toLocaleLowerCase())?.proficiency ?? 0;
    const status = current >= expected ? "Matched" : current ? "Partial" : "Missing";
    return { name, expected, weight, current, status };
  });
  const score = Math.round(entries.reduce((total, entry) => total + entry.weight * Math.min(entry.current / entry.expected, 1), 0));
  return { career, entries, score, matched: entries.filter((entry) => entry.status === "Matched").length, partial: entries.filter((entry) => entry.status === "Partial").length, missing: entries.filter((entry) => entry.status === "Missing").length };
}

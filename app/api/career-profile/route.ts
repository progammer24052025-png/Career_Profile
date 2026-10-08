import { createClient } from "@/lib/supabase/server";
import { CAREERS } from "@/lib/career-readiness";

const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
const text = (value: unknown, max = 160) => typeof value === "string" ? value.trim().slice(0, max) : "";
const validSemester = (value: unknown) => Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 12;
function webUrl(value: unknown) {
  const candidate = text(value, 240);
  try { const parsed = new URL(candidate); return ["https:", "http:"].includes(parsed.protocol) ? parsed.toString() : null; }
  catch { return null; }
}

async function signedIn() {
  const supabase = await createClient();
  if (!supabase) return { error: json({ error: "Student data is unavailable until the database is configured." }, 503) };
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { error: json({ error: "Sign in to view your career profile." }, 401) };
  return { supabase, user };
}

export async function GET() {
  const auth = await signedIn();
  if ("error" in auth) return auth.error;
  const [profile, skills, projects] = await Promise.all([
    auth.supabase.from("profiles").select("display_name,university,degree,branch,academic_achievements,academic_year,current_semester,graduation_year,target_career,github_profile_url").eq("id", auth.user.id).maybeSingle(),
    auth.supabase.from("student_skills").select("id,skill_name,category,proficiency").eq("user_id", auth.user.id).order("skill_name"),
    auth.supabase.from("student_projects").select("id,project_name,description,technologies,academic_year,semester,project_url,source,created_at").eq("user_id", auth.user.id).order("created_at", { ascending: false }),
  ]);
  const failure = profile.error ?? skills.error ?? projects.error;
  if (failure) return json({ error: "Could not load your career profile." }, 500);
  return json({ profile: profile.data, skills: skills.data ?? [], projects: projects.data ?? [] });
}

export async function PATCH(request: Request) {
  const auth = await signedIn();
  if ("error" in auth) return auth.error;
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return json({ error: "Enter valid profile details." }, 400);
  const value = body as Record<string, unknown>;
  if (value.current_semester !== null && value.current_semester !== "" && !validSemester(Number(value.current_semester))) return json({ error: "Semester must be between 1 and 12." }, 400);
  const graduation = value.graduation_year === null || value.graduation_year === "" ? null : Number(value.graduation_year);
  if (graduation !== null && (!Number.isInteger(graduation) || graduation < 2020 || graduation > 2045)) return json({ error: "Enter a graduation year between 2020 and 2045." }, 400);
  const targetCareer = text(value.target_career, 80);
  if (targetCareer && !CAREERS.some((career) => career.id === targetCareer)) return json({ error: "Choose a career from the list." }, 400);
  const githubUrl = value.github_profile_url ? webUrl(value.github_profile_url) : null;
  if (value.github_profile_url && !githubUrl) return json({ error: "Use an http or https GitHub profile link." }, 400);
  const row = {
    id: auth.user.id,
    display_name: text(value.display_name, 100) || null,
    university: text(value.university, 160) || null,
    degree: text(value.degree, 100) || null,
    branch: text(value.branch, 120) || null,
    academic_achievements: text(value.academic_achievements, 1500) || null,
    academic_year: text(value.academic_year, 40) || null,
    current_semester: value.current_semester ? Number(value.current_semester) : null,
    graduation_year: graduation,
    github_profile_url: githubUrl,
    target_career: targetCareer || null,
  };
  const { error } = await auth.supabase.from("profiles").upsert(row, { onConflict: "id" });
  if (error) return json({ error: "Could not save your profile." }, 500);
  return json({ profile: row });
}

export async function POST(request: Request) {
  const auth = await signedIn();
  if ("error" in auth) return auth.error;
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return json({ error: "Enter valid details." }, 400);
  const value = body as Record<string, unknown>;
  if (value.type === "skill") {
    const name = text(value.skill_name, 80);
    const category = value.category === "Soft" ? "Soft" : "Technical";
    const proficiency = Number(value.proficiency);
    if (!name || !Number.isInteger(proficiency) || proficiency < 1 || proficiency > 4) return json({ error: "Add a skill and choose its proficiency." }, 400);
    const result = await auth.supabase.from("student_skills").insert({ user_id: auth.user.id, skill_name: name, category, proficiency }).select("id,skill_name,category,proficiency").single();
    if (result.error) return json({ error: result.error.code === "23505" ? "That skill is already in your profile." : "Could not add this skill." }, result.error.code === "23505" ? 409 : 500);
    return json({ skill: result.data }, 201);
  }
  if (value.type === "project") {
    const name = text(value.project_name, 160);
    const semester = value.semester === "" || value.semester === null ? null : Number(value.semester);
    const technologies = Array.isArray(value.technologies) ? value.technologies.map((item) => text(item, 50)).filter(Boolean).slice(0, 20) : [];
    const projectUrl = value.project_url ? webUrl(value.project_url) : null;
    if (!name || (semester !== null && (!Number.isInteger(semester) || semester < 1 || semester > 12))) return json({ error: "Add a project name and a valid semester." }, 400);
    if (value.project_url && !projectUrl) return json({ error: "Use an http or https project link." }, 400);
    const result = await auth.supabase.from("student_projects").insert({ user_id: auth.user.id, project_name: name, description: text(value.description, 1200), technologies, academic_year: text(value.academic_year, 40) || null, semester, project_url: projectUrl }).select("id,project_name,description,technologies,academic_year,semester,project_url,source,created_at").single();
    if (result.error) return json({ error: "Could not save this project." }, 500);
    return json({ project: result.data }, 201);
  }
  return json({ error: "Choose a valid item type." }, 400);
}

export async function PUT(request: Request) {
  const auth = await signedIn();
  if ("error" in auth) return auth.error;
  const body = await request.json().catch(() => null);
  const value = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const id = text(value.id, 40);
  if (!id) return json({ error: "This item could not be found." }, 400);
  if (value.type === "skill") {
    const proficiency = Number(value.proficiency);
    if (!Number.isInteger(proficiency) || proficiency < 1 || proficiency > 4) return json({ error: "Choose a proficiency level." }, 400);
    const result = await auth.supabase.from("student_skills").update({ proficiency }).eq("id", id).eq("user_id", auth.user.id).select("id,skill_name,category,proficiency").maybeSingle();
    if (result.error || !result.data) return json({ error: "Could not update this skill." }, 404);
    return json({ skill: result.data });
  }
  if (value.type === "project") {
    const name = text(value.project_name, 160);
    const semester = value.semester === "" || value.semester === null ? null : Number(value.semester);
    const technologies = Array.isArray(value.technologies) ? value.technologies.map((item) => text(item, 50)).filter(Boolean).slice(0, 20) : [];
    const projectUrl = value.project_url ? webUrl(value.project_url) : null;
    if (!name || (semester !== null && (!Number.isInteger(semester) || semester < 1 || semester > 12))) return json({ error: "Add a project name and a valid semester." }, 400);
    if (value.project_url && !projectUrl) return json({ error: "Use an http or https project link." }, 400);
    const result = await auth.supabase.from("student_projects").update({ project_name: name, description: text(value.description, 1200), technologies, academic_year: text(value.academic_year, 40) || null, semester, project_url: projectUrl }).eq("id", id).eq("user_id", auth.user.id).select("id,project_name,description,technologies,academic_year,semester,project_url,source,created_at").maybeSingle();
    if (result.error || !result.data) return json({ error: "Could not update this project." }, 404);
    return json({ project: result.data });
  }
  return json({ error: "Choose a valid item type." }, 400);
}

export async function DELETE(request: Request) {
  const auth = await signedIn();
  if ("error" in auth) return auth.error;
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const id = url.searchParams.get("id");
  if (!id || !["skill", "project"].includes(type ?? "")) return json({ error: "This item could not be found." }, 400);
  const result = type === "skill"
    ? await auth.supabase.from("student_skills").delete().eq("id", id).eq("user_id", auth.user.id)
    : await auth.supabase.from("student_projects").delete().eq("id", id).eq("user_id", auth.user.id);
  const { error } = result;
  if (error) return json({ error: "Could not remove this item." }, 500);
  return json({ success: true });
}

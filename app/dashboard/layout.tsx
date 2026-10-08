import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/dashboard/app-shell";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Career profile",
  description: "Your skills, career readiness and student journey in one place."
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!supabase || !user) redirect("/login?next=/dashboard");
  if (!user.email_confirmed_at) redirect("/verify-email");

  let profile: { display_name?: string | null } | null = null;
  if (supabase) {
    const { data } = await supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle();
    profile = data;
  }

  return (
    <AppShell email={user.email} profile={profile}>
      {children}
    </AppShell>
  );
}

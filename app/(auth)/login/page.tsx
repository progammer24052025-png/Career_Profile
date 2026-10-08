import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to CareerProfile and continue building your student career map."
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return <AuthShell description="Welcome back. Your skills and journey are ready." title="Sign in"><AuthForm mode="login" next={next} /></AuthShell>;
}

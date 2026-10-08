import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "Create your account",
  description: "Create a CareerProfile account and start mapping your skills to a career."
};

export default function SignUpPage() { return <AuthShell description="Start with your details, then add skills and choose a career to explore." title="Create your account"><AuthForm mode="signup" /></AuthShell>; }

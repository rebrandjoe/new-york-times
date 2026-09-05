import type { Metadata } from "next";
import { AuthTabsPage } from "@/components/form/AuthTabsPage";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your JOSEPH MMWA account.",
};

export default function SignInPage() {
  return <AuthTabsPage defaultTab="sign-in" />;
}

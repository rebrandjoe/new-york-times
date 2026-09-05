import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthTabsPage } from "@/components/form/AuthTabsPage";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your JOSEPH MMWA account.",
};

export default function SignInPage() {
  return (
    <Suspense>
      <AuthTabsPage defaultTab="sign-in" />
    </Suspense>
  );
}

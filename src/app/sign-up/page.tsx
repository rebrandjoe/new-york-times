import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthTabsPage } from "@/components/form/AuthTabsPage";

export const metadata: Metadata = {
  title: "Create Your Account",
  description: "Create your JOSEPH MMWA account.",
};

export default function SignUpPage() {
  return (
    <Suspense>
      <AuthTabsPage defaultTab="sign-up" />
    </Suspense>
  );
}

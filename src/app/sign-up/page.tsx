import type { Metadata } from "next";
import { AuthTabsPage } from "@/components/form/AuthTabsPage";

export const metadata: Metadata = {
  title: "Create Your Account",
  description: "Create your JOSEPH MMWA account.",
};

export default function SignUpPage() {
  return <AuthTabsPage defaultTab="sign-up" />;
}

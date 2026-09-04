import type { Metadata } from "next";
import { SignInForm } from "./SignInForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your JOSEPH MMWA account.",
};

export default function SignInPage() {
  return <SignInForm />;
}

import type { Metadata } from "next";
import { SignUpForm } from "./SignUpForm";

export const metadata: Metadata = {
  title: "Create Your Account",
  description: "Create your JOSEPH MMWA account.",
};

export default function SignUpPage() {
  return <SignUpForm />;
}

import type { Metadata } from "next";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset Your Password",
  description: "Reset the password for your JOSEPH MMWA account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}

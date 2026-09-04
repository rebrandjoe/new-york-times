"use client";

import { useActionState } from "react";
import { AuthLink, AuthShell } from "@/components/form/AuthShell";
import { FormField } from "@/components/form/FormField";
import { FormMessage } from "@/components/form/FormMessage";
import { SubmitButton } from "@/components/form/SubmitButton";
import { forgotPasswordAction } from "@/lib/actions/auth";
import { initialAuthState } from "@/lib/actions/form-state";

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(forgotPasswordAction, initialAuthState);

  return (
    <AuthShell
      heading="Reset your password"
      subtext="Enter your email and we'll send you a link to reset your password."
      footer={<AuthLink href="/sign-in">Back to sign in</AuthLink>}
    >
      <form action={formAction} className="flex flex-col gap-5" noValidate>
        <FormField id="email" name="email" label="Email" type="email" autoComplete="email" />
        <FormMessage status={state.status} message={state.message} />
        <SubmitButton>Send Reset Link</SubmitButton>
      </form>
    </AuthShell>
  );
}

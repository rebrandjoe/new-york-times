"use client";

import { useActionState } from "react";
import { AuthLink, AuthShell } from "@/components/form/AuthShell";
import { FormField } from "@/components/form/FormField";
import { FormMessage } from "@/components/form/FormMessage";
import { SubmitButton } from "@/components/form/SubmitButton";
import { signUpAction } from "@/lib/actions/auth";
import { initialAuthState } from "@/lib/actions/form-state";

export function SignUpForm() {
  const [state, formAction] = useActionState(signUpAction, initialAuthState);

  return (
    <AuthShell
      heading="Create your account"
      subtext="Join JOSEPH MMWA to follow global health and medical journalism."
      footer={
        <>
          Already have an account? <AuthLink href="/sign-in">Sign in</AuthLink>
        </>
      }
    >
      <form action={formAction} className="flex flex-col gap-5" noValidate>
        <FormField id="fullName" name="fullName" label="Full name" autoComplete="name" />
        <FormField id="email" name="email" label="Email" type="email" autoComplete="email" />
        <FormField
          id="password"
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
        />
        <FormField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
        />
        <FormMessage status={state.status} message={state.message} />
        <SubmitButton>Create Account</SubmitButton>
      </form>
    </AuthShell>
  );
}

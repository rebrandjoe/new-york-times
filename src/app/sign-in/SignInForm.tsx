"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AuthLink, AuthShell } from "@/components/form/AuthShell";
import { FormField } from "@/components/form/FormField";
import { FormMessage } from "@/components/form/FormMessage";
import { SubmitButton } from "@/components/form/SubmitButton";
import { signInAction } from "@/lib/actions/auth";
import { initialAuthState } from "@/lib/actions/form-state";

export function SignInForm() {
  const [state, formAction] = useActionState(signInAction, initialAuthState);

  return (
    <AuthShell
      heading="Sign in"
      footer={
        <>
          Don&apos;t have an account? <AuthLink href="/sign-up">Create one</AuthLink>
        </>
      }
    >
      <form action={formAction} className="flex flex-col gap-5" noValidate>
        <FormField id="email" name="email" label="Email" type="email" autoComplete="email" />
        <FormField
          id="password"
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
        />
        <div className="text-right">
          <Link
            href="/forgot-password"
            className="focus-ring text-sm text-gray-secondary-light hover:text-accent"
          >
            Forgot password?
          </Link>
        </div>
        <FormMessage status={state.status} message={state.message} />
        <SubmitButton>Sign In</SubmitButton>
      </form>
    </AuthShell>
  );
}

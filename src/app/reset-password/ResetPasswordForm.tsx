"use client";

import { useActionState } from "react";
import { AuthLink, AuthShell } from "@/components/form/AuthShell";
import { FormMessage } from "@/components/form/FormMessage";
import { PasswordField } from "@/components/form/PasswordField";
import { SubmitButton } from "@/components/form/SubmitButton";
import { SuccessMessage } from "@/components/form/SuccessMessage";
import { updatePasswordAction } from "@/lib/actions/auth";
import { initialAuthState } from "@/lib/actions/form-state";

export function ResetPasswordForm() {
  const [state, formAction] = useActionState(updatePasswordAction, initialAuthState);

  return (
    <AuthShell
      heading="Set a new password"
      subtext="Choose a new password for your JOSEPH MMWA account."
      footer={<AuthLink href="/sign-in">Back to sign in</AuthLink>}
    >
      {state.status === "success" && state.message ? (
        <>
          <SuccessMessage>{state.message}</SuccessMessage>
          <AuthLink href="/account">Continue to your account</AuthLink>
        </>
      ) : (
        <form action={formAction} className="flex flex-col gap-5" noValidate>
          <PasswordField id="password" name="password" label="New password" autoComplete="new-password" />
          <PasswordField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm new password"
            autoComplete="new-password"
          />
          <FormMessage status={state.status} message={state.message} />
          <SubmitButton>Update Password</SubmitButton>
        </form>
      )}
    </AuthShell>
  );
}

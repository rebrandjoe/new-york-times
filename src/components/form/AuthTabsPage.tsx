"use client";

import { useActionState, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { WordmarkLink } from "@/components/Wordmark";
import { FormField } from "@/components/form/FormField";
import { FormMessage } from "@/components/form/FormMessage";
import { PasswordField } from "@/components/form/PasswordField";
import { SuccessMessage } from "@/components/form/SuccessMessage";
import { SubmitButton } from "@/components/form/SubmitButton";
import { signInAction, signUpAction } from "@/lib/actions/auth";
import { initialAuthState } from "@/lib/actions/form-state";

type Tab = "sign-in" | "sign-up";

export function AuthTabsPage({ defaultTab }: { defaultTab: Tab }) {
  const [tab, setTab] = useState<Tab>(defaultTab);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  const [signInState, signInFormAction] = useActionState(signInAction, initialAuthState);
  const [signUpState, signUpFormAction] = useActionState(signUpAction, initialAuthState);

  function selectTab(next: Tab) {
    setTab(next);
    router.replace(next === "sign-in" ? "/sign-in" : "/sign-up");
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-[1440px] flex-col items-center bg-black px-4 py-16 sm:px-6 lg:px-12">
      <div className="w-full max-w-md">
        <WordmarkLink className="text-2xl" />

        <h1 className="mt-6 font-serif text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl">
          Your Front Row to Health News That Matters
        </h1>
        <p className="mt-3 text-base text-gray-secondary-light">
          Sign in or create an account to stay ahead of global health news.
        </p>

        <div role="tablist" aria-label="Sign in or create account" className="mt-10 flex border-b border-charcoal">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "sign-in"}
            onClick={() => selectTab("sign-in")}
            className={`focus-ring flex-1 border-b-2 px-4 py-3 text-sm font-bold tracking-wide transition-colors ${
              tab === "sign-in"
                ? "border-accent text-accent"
                : "border-transparent text-gray-secondary hover:text-offwhite"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "sign-up"}
            onClick={() => selectTab("sign-up")}
            className={`focus-ring flex-1 border-b-2 px-4 py-3 text-sm font-bold tracking-wide transition-colors ${
              tab === "sign-up"
                ? "border-accent text-accent"
                : "border-transparent text-gray-secondary hover:text-offwhite"
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="border border-t-0 border-white/10 bg-charcoal p-6 sm:p-10">
          <div className="h-1 w-12 bg-accent" />

          {tab === "sign-in" ? (
            <>
              <h2 className="mt-4 font-serif text-3xl font-extrabold text-white">Welcome back</h2>
              <form action={signInFormAction} className="mt-6 flex flex-col gap-5" noValidate>
                {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}
                <FormField id="email" name="email" label="Email" type="email" autoComplete="email" />
                <PasswordField
                  id="password"
                  name="password"
                  label="Password"
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
                <FormMessage status={signInState.status} message={signInState.message} />
                <SubmitButton>Sign In</SubmitButton>
              </form>
            </>
          ) : (
            <>
              <h2 className="mt-4 font-serif text-3xl font-extrabold text-white">
                Create your account
              </h2>
              <p className="mt-3 text-sm text-gray-secondary-light">
                Join JOSEPH MMWA to follow global health and medical journalism.
              </p>
              <form action={signUpFormAction} className="mt-6 flex flex-col gap-5" noValidate>
                <FormField id="fullName" name="fullName" label="Full name" autoComplete="name" />
                <FormField id="email" name="email" label="Email" type="email" autoComplete="email" />
                <PasswordField
                  id="password"
                  name="password"
                  label="Password"
                  autoComplete="new-password"
                />
                <PasswordField
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm password"
                  autoComplete="new-password"
                />
                {signUpState.status === "success" && signUpState.message ? (
                  <SuccessMessage>{signUpState.message}</SuccessMessage>
                ) : (
                  <FormMessage status={signUpState.status} message={signUpState.message} />
                )}
                <SubmitButton>Create Account</SubmitButton>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

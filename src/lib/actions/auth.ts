"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AuthFormState } from "./form-state";

function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

export async function signUpAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!fullName || !email || !password || !confirmPassword) {
    return { status: "error", message: "Please fill in every field." };
  }
  if (password.length < 8) {
    return { status: "error", message: "Password must be at least 8 characters." };
  }
  if (password !== confirmPassword) {
    return { status: "error", message: "Passwords do not match." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${getSiteUrl()}/sign-in`,
    },
  });

  if (error) {
    if (error.status === 429) {
      return {
        status: "error",
        message: "Too many attempts. Please wait a moment and try again.",
      };
    }
    if (error.code === "user_already_exists" || error.message.includes("already registered")) {
      return { status: "error", message: "An account with this email already exists." };
    }
    return { status: "error", message: error.message };
  }

  if (data.session) {
    redirect("/");
  }

  return {
    status: "success",
    message: "Account created. Check your email to confirm your registration.",
  };
}

export async function signInAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "");

  if (!email || !password) {
    return { status: "error", message: "Please enter your email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.code === "email_not_confirmed") {
      return {
        status: "error",
        message: "Please confirm your email address before signing in. Check your inbox.",
      };
    }
    if (error.status === 429) {
      return {
        status: "error",
        message: "Too many attempts. Please wait a moment and try again.",
      };
    }
    return { status: "error", message: "Incorrect email or password." };
  }

  // Only ever redirect to a same-site relative path — never an absolute URL,
  // which could be used for an open-redirect if it ever came from elsewhere.
  redirect(redirectTo.startsWith("/") ? redirectTo : "/");
}

export async function forgotPasswordAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { status: "error", message: "Please enter your email address." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getSiteUrl()}/auth/callback?redirectTo=/reset-password`,
  });

  if (error && error.code !== "user_not_found") {
    if (error.status === 429) {
      return {
        status: "error",
        message: "Too many attempts. Please wait a moment and try again.",
      };
    }
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  return {
    status: "success",
    message: "Reset link sent. Check your email to continue.",
  };
}

export async function updatePasswordAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!password || !confirmPassword) {
    return { status: "error", message: "Please fill in both fields." };
  }
  if (password.length < 8) {
    return { status: "error", message: "Password must be at least 8 characters." };
  }
  if (password !== confirmPassword) {
    return { status: "error", message: "Passwords do not match." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error",
      message: "This reset link has expired or was already used. Request a new one.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { status: "error", message: "Could not update your password. Please try again." };
  }

  return {
    status: "success",
    message: "Password updated. You're signed in with your new password.",
  };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

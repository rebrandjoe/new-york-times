"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

/** Apple's official glyph — the approved brand-logo exception, drawn per
 * Apple's Human Interface Guidelines for the "Sign in with Apple" button
 * (white mark on a solid black button). */
function AppleGlyph() {
  return (
    <svg viewBox="0 0 384 512" className="h-4 w-4" fill="#FFFFFF" aria-hidden="true">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141 8 184.8 8 273.5c0 26.2 4.8 53.3 14.4 81.2 12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-65.7-90-65.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

/** "Continue with Apple" — sits alongside Google on both the Sign In and
 * Create Account tabs. Apple's OAuth provider (Services ID + Sign in with
 * Apple key) is configured in Supabase's dashboard, not in this code — this
 * only initiates the standard flow, identical in shape to the Google
 * button. A private-relay email from a user who hid their real address is
 * just an ordinary email address by the time it reaches Supabase, so it
 * needs no special handling here. */
export function AppleButton({ redirectTo }: { redirectTo?: string }) {
  const [isPending, setIsPending] = useState(false);

  async function handleClick() {
    setIsPending(true);
    const supabase = createClient();
    const params = redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : "";
    await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: `${window.location.origin}/auth/callback${params}`,
      },
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="focus-ring flex w-full items-center justify-center gap-2 border border-white/20 bg-black px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      <AppleGlyph />
      {isPending ? "Redirecting…" : "Continue with Apple"}
    </button>
  );
}

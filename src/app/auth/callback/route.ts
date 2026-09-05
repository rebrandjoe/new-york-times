import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Lands here after Google OAuth consent and after clicking a password-reset
 * or signup-confirmation email link — Supabase redirects here with a `code`
 * to exchange for a real session before continuing to the intended page. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirectTo") ?? "/";
  const destination = redirectTo.startsWith("/") ? redirectTo : "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${destination}`);
    }
  }

  return NextResponse.redirect(`${origin}/sign-in`);
}

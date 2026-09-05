import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Lands here after Google/Apple OAuth consent and after clicking a
 * password-reset or signup-confirmation email link — Supabase redirects
 * here with a `code` to exchange for a real session before continuing to
 * the intended page.
 *
 * Supabase also redirects here directly (skipping the provider entirely)
 * when the OAuth request itself was invalid — e.g. the provider isn't
 * enabled yet — passing `error`/`error_description` instead of `code`. That
 * case used to fall through to a bare, unexplained bounce to /sign-in,
 * which looked identical to "the button did nothing" from the user's side.
 * It's surfaced as a real error message now instead of being swallowed. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const oauthError = searchParams.get("error_description") ?? searchParams.get("error");
  const redirectTo = searchParams.get("redirectTo") ?? "/";
  const destination = redirectTo.startsWith("/") ? redirectTo : "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${destination}`);
    }
    return NextResponse.redirect(
      `${origin}/sign-in?authError=${encodeURIComponent(error.message)}`
    );
  }

  if (oauthError) {
    return NextResponse.redirect(`${origin}/sign-in?authError=${encodeURIComponent(oauthError)}`);
  }

  return NextResponse.redirect(`${origin}/sign-in`);
}

import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Session refresh is expensive (Supabase getUser on every matched request).
 * Only run it where auth actually matters — admin, account, auth flows, and
 * payment returns. Public pages stay fully cacheable and use almost no Active CPU.
 */
export function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/account/:path*",
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
    "/auth/:path*",
    "/api/admin/:path*",
    "/api/checkout/:path*",
    "/api/paystack/:path*",
    "/premium/confirm",
    "/preview/:path*",
  ],
};

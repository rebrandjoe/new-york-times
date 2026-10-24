"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Routes where the floating medical-disclaimer tab is hidden. */
const HIDDEN_PREFIXES = [
  "/about",
  "/contact",
  "/advertise",
  "/editorial-standards",
  "/corrections-and-fact-checking",
  "/ai-policy",
  "/privacy-policy",
  "/terms-of-service",
  "/medical-disclaimer",
  "/admin",
  "/sign-in",
  "/sign-up",
  "/reset-password",
  "/account",
  "/premium",
] as const;

function shouldHide(pathname: string | null): boolean {
  if (!pathname) return true;
  return HIDDEN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

/**
 * Distinct edge tab linking to the Medical Disclaimer.
 * Shown on public news pages; hidden on Information, Editorial and auth routes.
 */
export function MedicalDisclaimerTab() {
  const pathname = usePathname();
  if (shouldHide(pathname)) return null;

  return (
    <Link
      href="/medical-disclaimer"
      aria-label="Medical Disclaimer — health information is not medical advice"
      className="group fixed right-0 top-1/2 z-50 -translate-y-1/2 border border-r-0 border-accent bg-black px-2 py-4 shadow-lg transition-colors hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <span
        className="block text-[11px] font-extrabold uppercase tracking-[0.2em] text-accent transition-colors group-hover:text-black"
        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
      >
        Medical Disclaimer
      </span>
    </Link>
  );
}

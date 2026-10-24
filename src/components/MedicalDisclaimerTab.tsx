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
 * Distinct, always-visible edge tab linking to the Medical Disclaimer.
 * Shown on public news pages; hidden on Information, Editorial and auth routes.
 */
export function MedicalDisclaimerTab() {
  const pathname = usePathname();
  if (shouldHide(pathname)) return null;

  return (
    <Link
      href="/medical-disclaimer"
      aria-label="Medical Disclaimer — health information is not medical advice"
      className="fixed right-0 top-1/2 z-50 flex -translate-y-1/2 flex-col items-center gap-1 border border-r-0 border-accent bg-black/95 px-1.5 py-3 shadow-[0_0_0_1px_rgba(119,97,61,0.35)] transition-colors hover:bg-accent hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
    >
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent group-hover:text-black [a:hover_&]:text-black">
        Medical
      </span>
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-offwhite [a:hover_&]:text-black">
        Disclaimer
      </span>
    </Link>
  );
}

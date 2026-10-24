"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const SESSION_KEY = "mmwa_medical_disclaimer_dismissed";

const APPEAR_DELAY_MS = 4500;
const VISIBLE_HOLD_MS = 10000;
const SLIDE_MS = 1400;

function isArticlePath(pathname: string | null): boolean {
  return !!pathname && (pathname === "/article" || pathname.startsWith("/article/"));
}

/**
 * Quiet medical-disclaimer notice on article pages only.
 * Slides in slowly from the left a few seconds after open, holds ≥10s, then
 * slides away. Can be dismissed with X. Upper-left, clear of related stories.
 */
export function MedicalDisclaimerTab() {
  const pathname = usePathname();
  const onArticle = isArticlePath(pathname);

  const [phase, setPhase] = useState<"idle" | "in" | "out" | "gone">("idle");

  const dismiss = useCallback(() => {
    setPhase("out");
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!onArticle) {
      setPhase("idle");
      return;
    }

    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") {
        setPhase("gone");
        return;
      }
    } catch {
      /* ignore */
    }

    setPhase("idle");

    const appearTimer = window.setTimeout(() => setPhase("in"), APPEAR_DELAY_MS);
    const holdTimer = window.setTimeout(
      () => setPhase("out"),
      APPEAR_DELAY_MS + VISIBLE_HOLD_MS
    );

    return () => {
      window.clearTimeout(appearTimer);
      window.clearTimeout(holdTimer);
    };
  }, [onArticle, pathname]);

  useEffect(() => {
    if (phase !== "out") return;
    const done = window.setTimeout(() => setPhase("gone"), SLIDE_MS + 80);
    return () => window.clearTimeout(done);
  }, [phase]);

  if (!onArticle || phase === "idle" || phase === "gone") return null;

  const visible = phase === "in";

  return (
    <div
      role="complementary"
      aria-label="Medical disclaimer notice"
      className="pointer-events-none fixed left-0 top-[20%] z-40 w-[min(100%,20rem)] sm:top-[22%] sm:w-80"
    >
      <div
        className="pointer-events-auto border border-l-0 border-accent/80 bg-black/95 shadow-lg backdrop-blur-sm"
        style={{
          transform: visible ? "translateX(0)" : "translateX(-105%)",
          opacity: visible ? 1 : 0.85,
          transition: `transform ${SLIDE_MS}ms cubic-bezier(0.22, 1, 0.36, 1), opacity ${SLIDE_MS}ms ease`,
        }}
      >
        <div className="relative px-4 pb-4 pt-3">
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss medical disclaimer notice"
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-gray-muted transition-colors hover:bg-white/10 hover:text-offwhite"
          >
            <span aria-hidden className="text-base leading-none">
              ×
            </span>
          </button>

          <p className="pr-7 text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
            Medical disclaimer
          </p>
          <p className="mt-2.5 text-xs leading-relaxed text-gray-secondary-light">
            My health reporting is for informational and educational purposes only and is not a
            substitute for professional medical advice, diagnosis or treatment. Always consult a
            qualified healthcare professional for medical decisions.
          </p>
          <Link
            href="/medical-disclaimer"
            className="mt-3 inline-block text-xs font-semibold text-accent underline-offset-2 transition-colors hover:underline"
          >
            Read our full Medical Disclaimer →
          </Link>
        </div>
      </div>
    </div>
  );
}

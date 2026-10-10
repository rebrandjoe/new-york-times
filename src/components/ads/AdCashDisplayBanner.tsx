"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

/**
 * Adcash Display 728×90 — article pages only (wired from ArticleView).
 *
 * Official:
 *   <script id="aclib" src="//acscdn.com/script/aclib.js"></script>
 *   <div><script>aclib.runBanner({ zoneId: '12296266' });</script></div>
 *
 * Enabled by default. Set NEXT_PUBLIC_ADCASH_DISPLAY_ENABLED=false to disable.
 * Hidden below md — 728px does not fit safely on narrow viewports.
 */
const ZONE_ID = "12296266";
// Default ON so ads work without a Vercel env var. Opt out with "false".
const ENABLED = process.env.NEXT_PUBLIC_ADCASH_DISPLAY_ENABLED !== "false";

declare global {
  interface Window {
    aclib?: {
      runBanner?: (opts: { zoneId: string }) => void;
    };
  }
}

export function AdCashDisplayBanner() {
  const ranRef = useRef(false);

  useEffect(() => {
    if (!ENABLED || ranRef.current) return;

    function tryRun() {
      if (ranRef.current) return;
      if (typeof window === "undefined") return;
      if (window.aclib && typeof window.aclib.runBanner === "function") {
        window.aclib.runBanner({ zoneId: ZONE_ID });
        ranRef.current = true;
      }
    }

    tryRun();
    const id = window.setInterval(() => {
      tryRun();
      if (ranRef.current) window.clearInterval(id);
    }, 100);
    // Stop polling after ~10s if library never loads
    const timeout = window.setTimeout(() => window.clearInterval(id), 10_000);

    return () => {
      window.clearInterval(id);
      window.clearTimeout(timeout);
    };
  }, []);

  if (!ENABLED) return null;

  return (
    <div
      className="mx-auto hidden max-w-3xl overflow-hidden px-4 py-4 sm:px-6 md:block lg:px-8"
      style={{ minHeight: 90 }}
      data-ad-network="adcash"
      data-ad-format="display-728x90"
      data-zone-id={ZONE_ID}
    >
      <Script
        id="aclib"
        src="https://acscdn.com/script/aclib.js"
        strategy="afterInteractive"
      />
      {/* Official wrapper: runBanner injects the creative relative to this area */}
      <div className="mx-auto flex min-h-[90px] w-full max-w-[728px] items-center justify-center overflow-hidden" />
    </div>
  );
}

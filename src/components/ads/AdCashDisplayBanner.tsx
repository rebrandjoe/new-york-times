"use client";

import { useRef } from "react";
import Script from "next/script";

/**
 * Adcash Display 728×90 — article pages only (wired from ArticleView).
 *
 * Official snippets (library + banner):
 *   <script id="aclib" src="//acscdn.com/script/aclib.js"></script>
 *   <div><script>aclib.runBanner({ zoneId: '12296266' });</script></div>
 *
 * Disabled unless NEXT_PUBLIC_ADCASH_DISPLAY_ENABLED=true.
 * Hidden below md — 728px does not fit safely on narrow viewports.
 */
const ZONE_ID = "12296266";
const ENABLED = process.env.NEXT_PUBLIC_ADCASH_DISPLAY_ENABLED === "true";

declare global {
  interface Window {
    aclib?: {
      runBanner?: (opts: { zoneId: string }) => void;
    };
  }
}

export function AdCashDisplayBanner() {
  const ranRef = useRef(false);

  function runOfficialBanner() {
    if (ranRef.current) return;
    if (typeof window === "undefined") return;
    if (window.aclib && typeof window.aclib.runBanner === "function") {
      // Exact official call:
      // aclib.runBanner({ zoneId: '12296266' });
      window.aclib.runBanner({ zoneId: ZONE_ID });
      ranRef.current = true;
    }
  }

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
        onLoad={runOfficialBanner}
      />
      {/* Reserved 728×90 slot — matches official <div> wrapper around runBanner */}
      <div className="mx-auto flex min-h-[90px] w-full max-w-[728px] items-center justify-center overflow-hidden" />
    </div>
  );
}

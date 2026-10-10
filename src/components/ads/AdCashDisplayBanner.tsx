"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

/**
 * Adcash Display 728×90 — article pages only (wired from ArticleView).
 *
 * Disabled unless NEXT_PUBLIC_ADCASH_DISPLAY_ENABLED=true so production stays
 * off until brand-safety exclusions are confirmed with Adcash.
 *
 * Hidden below md: 728px cannot fit safely on narrow viewports; no mobile zone.
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

    return () => window.clearInterval(id);
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
      {/* Official Adcash library — id ensures a single load site-wide */}
      <Script id="aclib" src="https://acscdn.com/script/aclib.js" strategy="afterInteractive" />
      <div className="mx-auto flex w-full max-w-[728px] items-center justify-center overflow-hidden">
        {/* Banner is filled by aclib.runBanner into the page; reserved height reduces CLS */}
        <div id={`adcash-banner-${ZONE_ID}`} className="min-h-[90px] w-full max-w-[728px]" />
      </div>
    </div>
  );
}

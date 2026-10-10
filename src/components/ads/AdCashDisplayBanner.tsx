"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

/**
 * Adcash Display 728×90 — article pages only.
 *
 * Official Adcash note: "Display ads will be rendered inside the parent
 * element of the script that calls the runBanner function."
 * So we must call runBanner from a real <script> child of the slot <div>,
 * not from a React useEffect alone.
 *
 * Step 1: <script id="aclib" src="//acscdn.com/script/aclib.js"></script>
 * Step 2: <div><script>aclib.runBanner({ zoneId: '12296266' });</script></div>
 *
 * Enabled by default. Set NEXT_PUBLIC_ADCASH_DISPLAY_ENABLED=false to disable.
 * Hidden below md — 728px does not fit safely on narrow viewports.
 */
const ZONE_ID = "12296266";
const ENABLED = process.env.NEXT_PUBLIC_ADCASH_DISPLAY_ENABLED !== "false";

declare global {
  interface Window {
    aclib?: {
      runBanner?: (opts: { zoneId: string }) => void;
    };
  }
}

export function AdCashDisplayBanner() {
  const slotRef = useRef<HTMLDivElement>(null);
  const ranRef = useRef(false);

  function injectOfficialBannerScript() {
    if (ranRef.current) return;
    const slot = slotRef.current;
    if (!slot) return;
    if (typeof window === "undefined") return;
    if (!window.aclib || typeof window.aclib.runBanner !== "function") return;

    // Official pattern: script lives inside the div so the ad renders in this parent.
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.text = `aclib.runBanner({ zoneId: '${ZONE_ID}' });`;
    slot.appendChild(script);
    ranRef.current = true;
  }

  useEffect(() => {
    if (!ENABLED) return;

    injectOfficialBannerScript();
    const id = window.setInterval(() => {
      injectOfficialBannerScript();
      if (ranRef.current) window.clearInterval(id);
    }, 100);
    const timeout = window.setTimeout(() => window.clearInterval(id), 12_000);

    return () => {
      window.clearInterval(id);
      window.clearTimeout(timeout);
    };
  }, []);

  if (!ENABLED) return null;

  return (
    <div
      className="mx-auto hidden max-w-3xl overflow-hidden px-4 py-4 sm:px-6 md:block lg:px-8"
      data-ad-network="adcash"
      data-ad-format="display-728x90"
      data-zone-id={ZONE_ID}
    >
      {/* Step 1 — Adcash library (once per page via id="aclib") */}
      <Script
        id="aclib"
        src="https://acscdn.com/script/aclib.js"
        strategy="afterInteractive"
        onLoad={injectOfficialBannerScript}
      />

      {/* Step 2 — parent <div> for runBanner (ad injects into this element) */}
      <div
        ref={slotRef}
        className="mx-auto min-h-[90px] w-full max-w-[728px] overflow-hidden"
        style={{ minHeight: 90 }}
      />
    </div>
  );
}

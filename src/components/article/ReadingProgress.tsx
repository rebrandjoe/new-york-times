"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Two views of one synced percentage — a thin top bar and a thin right-edge
 * bar — tracking how far the reader is through the article content region
 * (from the headline down to just before Related Articles/Comments, marked
 * by #article-progress-start / #article-progress-end). Updated directly on
 * the scroll handler (no CSS transition, no rAF-delayed animation) so the
 * fill tracks scroll speed exactly, not a lagged approximation.
 */
export function ReadingProgress() {
  const topFillRef = useRef<HTMLDivElement>(null);
  const sideFillRef = useRef<HTMLDivElement>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const wasNearEndRef = useRef(false);

  useEffect(() => {
    const startEl = document.getElementById("article-progress-start");
    const endEl = document.getElementById("article-progress-end");
    if (!startEl || !endEl) return;

    let ticking = false;

    function update() {
      ticking = false;
      const start = startEl!.getBoundingClientRect().top + window.scrollY;
      const end = endEl!.getBoundingClientRect().top + window.scrollY;
      // 0% when the content start reaches the top of the viewport, 100%
      // once the end marker has scrolled up into view at the bottom.
      const scrollable = Math.max(end - start - window.innerHeight, 1);
      const percent = Math.min(1, Math.max(0, (window.scrollY - start) / scrollable));

      if (topFillRef.current) topFillRef.current.style.width = `${percent * 100}%`;
      if (sideFillRef.current) sideFillRef.current.style.height = `${percent * 100}%`;

      const nearEnd = percent >= 0.98;
      if (nearEnd !== wasNearEndRef.current) {
        wasNearEndRef.current = nearEnd;
        setShowBackToTop(nearEnd);
      }
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  function scrollToStart() {
    document.getElementById("article-progress-start")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      {/* z-[60]: above the sticky header (z-50) — the bar sits at the true
          top edge of the viewport, not tucked underneath the masthead. */}
      <div className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-white/10" aria-hidden="true">
        <div ref={topFillRef} className="h-full w-0 bg-accent" />
      </div>

      <div className="fixed inset-y-0 right-0 z-[60] w-[3px] bg-white/10" aria-hidden="true">
        <div ref={sideFillRef} className="h-0 w-full bg-accent" />
      </div>

      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToStart}
          aria-label="Back to top of article"
          className="focus-ring fixed bottom-6 right-4 z-40 flex h-10 w-10 items-center justify-center border border-accent/60 bg-black text-accent transition-opacity hover:bg-accent hover:text-black sm:right-6"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      )}
    </>
  );
}

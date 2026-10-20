"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArticleImage } from "@/components/ArticleImage";
import type { Article } from "@/lib/types";

const INTERVAL_MS = 4500;

/**
 * Inline “You may also like” for mobile/tablet — sits mid-article in the reading flow.
 * Horizontal auto-swipe. Hidden on xl+ (desktop uses the fixed right rail).
 */
export function AlsoReadMid({ articles }: { articles: Article[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = articles.length;

  const scrollToIndex = useCallback((i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const child = el.children[i] as HTMLElement | undefined;
    if (!child) return;
    el.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
    setIndex(i);
  }, []);

  useEffect(() => {
    if (count < 2 || paused) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const id = window.setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % count;
        const el = trackRef.current;
        if (el) {
          const child = el.children[next] as HTMLElement | undefined;
          if (child) el.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
        }
        return next;
      });
    }, INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [count, paused]);

  if (count === 0) return null;

  return (
    <aside
      aria-label="You may also like"
      className="my-10 border-y border-charcoal py-6 xl:hidden"
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
          You may also like
        </p>
        <div className="flex gap-1.5">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => scrollToIndex((index - 1 + count) % count)}
            className="focus-ring flex h-7 w-7 items-center justify-center rounded-full border border-charcoal text-sm text-white"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => scrollToIndex((index + 1) % count)}
            className="focus-ring flex h-7 w-7 items-center justify-center rounded-full border border-charcoal text-sm text-white"
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex gap-3 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.slug}`}
            className="focus-ring group w-[min(78vw,260px)] shrink-0"
            style={{ scrollSnapAlign: "start" }}
          >
            <ArticleImage
              image={article.image}
              sizes="260px"
              className="aspect-[16/10] w-full rounded-sm"
            />
            {article.category?.name && (
              <span className="mt-2 block text-[10px] font-bold uppercase tracking-wider text-accent">
                {article.category.name}
              </span>
            )}
            <span className="mt-1 block font-sans text-[13px] font-bold leading-snug tracking-tight text-white">
              {article.headline}
            </span>
          </Link>
        ))}
      </div>

      {count > 1 && (
        <div className="mt-3 flex justify-center gap-1.5" aria-hidden>
          {articles.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-5 bg-accent" : "w-1.5 bg-charcoal"
              }`}
              aria-label={`Story ${i + 1}`}
            />
          ))}
        </div>
      )}
    </aside>
  );
}

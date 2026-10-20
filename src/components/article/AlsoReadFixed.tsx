"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArticleImage } from "@/components/ArticleImage";
import type { Article } from "@/lib/types";

const INTERVAL_MS = 4500;

/**
 * Fixed to the right of the viewport while reading.
 * Horizontal auto-swipe of relevance-ranked stories — does not scroll with the article.
 * Desktop (xl+) only so mobile reading stays uninterrupted.
 */
export function AlsoReadFixed({ articles }: { articles: Article[] }) {
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
      className="pointer-events-none fixed bottom-24 right-3 z-30 hidden w-[220px] xl:block 2xl:right-6 2xl:w-[240px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pointer-events-auto overflow-hidden rounded-lg border border-charcoal bg-[#0f0f0f]/95 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-charcoal px-2.5 py-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-accent">
            You may also like
          </p>
          <div className="flex gap-1">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => scrollToIndex((index - 1 + count) % count)}
              className="focus-ring flex h-6 w-6 items-center justify-center rounded-full border border-charcoal text-xs text-white hover:border-accent hover:text-accent"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => scrollToIndex((index + 1) % count)}
              className="focus-ring flex h-6 w-6 items-center justify-center rounded-full border border-charcoal text-xs text-white hover:border-accent hover:text-accent"
            >
              ›
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.slug}`}
              className="focus-ring group w-full min-w-full shrink-0 p-2.5"
              style={{ scrollSnapAlign: "start" }}
            >
              <ArticleImage
                image={article.image}
                sizes="220px"
                className="aspect-[16/10] w-full rounded-sm"
              />
              {article.category?.name && (
                <span className="mt-2 block text-[10px] font-bold uppercase tracking-wider text-accent">
                  {article.category.name}
                </span>
              )}
              <span className="mt-1 block font-sans text-[12px] font-bold leading-snug tracking-tight text-white transition-colors group-hover:text-accent">
                {article.headline}
              </span>
            </Link>
          ))}
        </div>

        {count > 1 && (
          <div className="flex justify-center gap-1 pb-2" aria-hidden>
            {articles.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollToIndex(i)}
                className={`h-1 w-1 rounded-full ${i === index ? "bg-accent" : "bg-charcoal"}`}
                aria-label={`Story ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArticleImage } from "@/components/ArticleImage";
import type { Article } from "@/lib/types";

const INTERVAL_MS = 4000;

/**
 * Horizontal story strip — auto-swipes left every few seconds.
 * Pauses on hover/focus; respects prefers-reduced-motion.
 */
export function StoryCarousel({
  articles,
  title = "More to read",
}: {
  articles: Article[];
  title?: string;
}) {
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
          if (child) {
            // Scroll so the next card moves in from the right (content shifts left)
            el.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
          }
        }
        return next;
      });
    }, INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [count, paused]);

  if (count === 0) return null;

  const headingId = `story-carousel-${title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <section
      aria-labelledby={headingId}
      className="border-y border-charcoal bg-[#0a0a0a]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
    >
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2
            id={headingId}
            className="text-xs font-bold uppercase tracking-[0.18em] text-accent"
          >
            {title}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous stories"
              onClick={() => scrollToIndex((index - 1 + count) % count)}
              className="focus-ring flex h-8 w-8 items-center justify-center rounded-full border border-charcoal text-white transition-colors hover:border-accent hover:text-accent"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next stories"
              onClick={() => scrollToIndex((index + 1) % count)}
              className="focus-ring flex h-8 w-8 items-center justify-center rounded-full border border-charcoal text-white transition-colors hover:border-accent hover:text-accent"
            >
              ›
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.slug}`}
              className="focus-ring group w-[min(72vw,260px)] shrink-0 sm:w-[240px]"
              style={{ scrollSnapAlign: "start" }}
            >
              <ArticleImage
                image={article.image}
                sizes="240px"
                className="aspect-[16/10] w-full rounded-sm"
              />
              <div className="mt-2.5">
                {article.category?.name && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                    {article.category.name}
                  </span>
                )}
                <h3 className="mt-1 font-sans text-sm font-bold leading-snug tracking-tight text-white transition-colors group-hover:text-accent sm:text-[15px]">
                  {article.headline}
                </h3>
                <p className="mt-1 text-[11px] text-gray-muted">{article.publication.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

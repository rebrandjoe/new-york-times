"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArticleImage } from "@/components/ArticleImage";
import type { Article } from "@/lib/types";

const INTERVAL_MS = 5000;

/**
 * Top Stories — primary homepage interactivity.
 * Horizontal auto-swipe (right → left) of lead stories.
 */
export function LeadNews({ articles }: { articles: Article[] }) {
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
    <section
      aria-labelledby="lead-news-heading"
      className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
    >
      <div className="mb-6 flex items-end justify-between gap-4 border-b border-charcoal pb-4">
        <h2
          id="lead-news-heading"
          className="font-serif text-3xl font-extrabold text-white sm:text-4xl"
        >
          Top Stories
        </h2>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label="Previous story"
            onClick={() => scrollToIndex((index - 1 + count) % count)}
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-charcoal text-lg text-white transition-colors hover:border-accent hover:text-accent"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next story"
            onClick={() => scrollToIndex((index + 1) % count)}
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-charcoal text-lg text-white transition-colors hover:border-accent hover:text-accent"
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex gap-5 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-6"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {articles.map((article, i) => (
          <Link
            key={article.id}
            href={`/article/${article.slug}`}
            className="focus-ring group w-[min(88vw,520px)] shrink-0 sm:w-[min(70vw,480px)] lg:w-[560px]"
            style={{ scrollSnapAlign: "start" }}
            aria-current={i === index ? "true" : undefined}
          >
            <ArticleImage
              image={article.image}
              sizes="(min-width: 1024px) 560px, 88vw"
              priority={i === 0}
              className="aspect-[16/10] w-full rounded-sm"
            />
            <div className="mt-4">
              {article.category?.name && (
                <span className="text-xs font-bold uppercase tracking-wider text-accent">
                  {article.category.name}
                </span>
              )}
              <h3 className="mt-2 font-sans text-xl font-bold leading-tight tracking-tight text-white transition-colors group-hover:text-accent sm:text-2xl">
                {article.headline}
              </h3>
              {article.description && (
                <p className="mt-2 line-clamp-2 text-sm text-gray-secondary-light">
                  {article.description}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-muted">
                {article.publication.date}
                <span aria-hidden className="mx-1.5">
                  ·
                </span>
                {article.publication.readTime}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {count > 1 && (
        <div className="mt-5 flex justify-center gap-1.5" aria-hidden>
          {articles.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-accent" : "w-1.5 bg-charcoal hover:bg-gray-muted"
              }`}
              aria-label={`Go to story ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

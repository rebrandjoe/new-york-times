"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArticleImage } from "@/components/ArticleImage";
import { toHomepageArticle } from "@/lib/cms/mappers";
import type { CmsArticle } from "@/lib/cms/types";

const INTERVAL_MS = 5000;

/**
 * Desktop-only “Just in” rail: related stories by relevance, auto-advances.
 * Hidden below xl so mobile reading stays clean.
 */
export function ArticleJustInRail({ articles }: { articles: CmsArticle[] }) {
  const items = articles.map(toHomepageArticle);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = items.length;

  useEffect(() => {
    if (count < 2 || paused) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % count);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [count, paused]);

  if (count === 0) return null;

  return (
    <aside
      className="hidden w-[260px] shrink-0 xl:block"
      aria-label="Just in — related stories"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="sticky top-28">
        <div className="mb-3 flex items-center gap-2 border-b border-charcoal pb-2">
          <span className="rounded-sm bg-live-red px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
            Just in
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-muted">
            Related
          </span>
        </div>

        <ul className="flex flex-col gap-4">
          {items.map((article, i) => {
            const isActive = i === active;
            return (
              <li key={article.id}>
                <Link
                  href={`/article/${article.slug}`}
                  className={`focus-ring group block rounded-sm border p-2 transition-all ${
                    isActive
                      ? "border-accent/60 bg-white/[0.04] shadow-sm"
                      : "border-transparent opacity-55 hover:border-charcoal hover:opacity-100"
                  }`}
                  aria-current={isActive ? "true" : undefined}
                >
                  <ArticleImage
                    image={article.image}
                    sizes="240px"
                    className="aspect-[16/10] w-full rounded-sm"
                  />
                  {article.category?.name && (
                    <span className="mt-2 block text-[10px] font-bold uppercase tracking-wider text-accent">
                      {article.category.name}
                    </span>
                  )}
                  <span
                    className={`mt-1 block font-sans text-[13px] font-bold leading-snug tracking-tight transition-colors group-hover:text-accent ${
                      isActive ? "text-white" : "text-gray-secondary-light"
                    }`}
                  >
                    {article.headline}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {count > 1 && (
          <div className="mt-3 flex justify-center gap-1.5" aria-hidden>
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  i === active ? "bg-accent" : "bg-charcoal"
                }`}
                aria-label={`Show related story ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

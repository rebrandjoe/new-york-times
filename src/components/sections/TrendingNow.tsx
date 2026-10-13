import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import type { Article } from "@/lib/types";

/**
 * Compact numbered rail of recent highlights.
 * Uses recency (no view-count table in the CMS) so it stays accurate without new infrastructure.
 */
export function TrendingNow({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <section
      aria-labelledby="trending-now-heading"
      className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8 lg:py-12"
    >
      <SectionHeading title="Trending Now" href="/latest" linkLabel="More stories" />
      <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {articles.map((article, index) => (
          <li key={article.id}>
            <Link
              href={`/article/${article.slug}`}
              className="focus-ring group flex gap-3 rounded-sm border border-transparent p-1 transition-colors hover:border-charcoal"
            >
              <span
                className="font-serif text-2xl font-extrabold leading-none text-accent tabular-nums"
                aria-hidden
              >
                {index + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-serif text-base font-bold leading-snug text-white transition-colors group-hover:text-accent sm:text-lg">
                  {article.headline}
                </span>
                {article.category?.name && (
                  <span className="mt-1 block text-[11px] font-semibold uppercase tracking-wide text-gray-muted">
                    {article.category.name}
                  </span>
                )}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

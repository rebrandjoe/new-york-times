"use client";

import { useState } from "react";
import Link from "next/link";
import { FeaturedCard, SecondaryCard } from "@/components/ArticleCard";
import type { Article, RegionSlug } from "@/lib/types";

interface RegionTab {
  slug: RegionSlug;
  label: string;
  href: string;
  featured: Article;
  supporting: Article[];
}

export function RegionalSection({ regions }: { regions: RegionTab[] }) {
  const [active, setActive] = useState<RegionSlug>(regions[0].slug);
  const activeRegion = regions.find((r) => r.slug === active) ?? regions[0];

  return (
    <section aria-labelledby="regional-heading" className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between gap-4 border-b border-charcoal sm:mb-8">
        <h2 id="regional-heading" className="sr-only">
          Regional news
        </h2>
        <div role="tablist" aria-label="Regional news" className="flex gap-1">
          {regions.map((region) => (
            <button
              key={region.slug}
              role="tab"
              type="button"
              aria-selected={active === region.slug}
              onClick={() => setActive(region.slug)}
              className={`focus-ring border-b-2 px-4 py-3 text-sm font-bold tracking-wide transition-colors ${
                active === region.slug
                  ? "border-accent text-accent"
                  : "border-transparent text-gray-secondary hover:text-offwhite"
              }`}
            >
              {region.label}
            </button>
          ))}
        </div>
        <Link
          href={activeRegion.href}
          className="focus-ring mb-3 shrink-0 text-sm font-semibold text-accent hover:underline"
        >
          View {activeRegion.label} →
        </Link>
      </div>

      <div role="tabpanel" className="grid grid-cols-4 gap-x-6 gap-y-8 sm:grid-cols-6 lg:grid-cols-12">
        <FeaturedCard
          article={activeRegion.featured}
          className="col-span-4 sm:col-span-6 lg:col-span-6"
        />
        <div className="col-span-4 grid grid-cols-1 gap-6 sm:col-span-6 sm:grid-cols-3 lg:col-span-6">
          {activeRegion.supporting.map((article) => (
            <SecondaryCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}

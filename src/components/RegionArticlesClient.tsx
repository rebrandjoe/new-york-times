"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ListItemCard } from "@/components/ArticleCard";
import type { Article } from "@/lib/types";

// Same shape ListItemCard already renders everywhere else on the site
// (headline/description/image/publication), plus the one extra field this
// page's live filter needs: the article's country, which isn't part of the
// standard homepage article shape.
export type ArticleItem = Article & { country?: string | null };

interface RegionArticlesClientProps {
  articles: ArticleItem[];
  regionName: string;
}

export function RegionArticlesClient({ articles, regionName }: RegionArticlesClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return articles;
    const q = searchQuery.toLowerCase();
    return articles.filter((a) => (a.country || "").toLowerCase().includes(q));
  }, [articles, searchQuery]);

  return (
    <div>
      <div className="mb-8">
        <Link href="/regions" className="text-xs font-semibold text-accent hover:underline">
          ← All Regions
        </Link>
        <h1 className="mt-2 font-serif text-3xl font-extrabold text-white sm:text-4xl">
          {regionName}
        </h1>
      </div>

      <div className="mb-8 max-w-md">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Search by country..."
          className="w-full rounded-xl border border-charcoal bg-[#0F0F0F] px-4 py-3 text-sm text-white placeholder-gray-muted focus:border-accent focus:outline-none"
        />
      </div>

      <div className="space-y-4">
        {filteredArticles.length === 0 ? (
          <div className="rounded-xl border border-charcoal bg-[#0F0F0F] p-8 text-center text-sm text-gray-muted">
            {searchQuery
              ? `No stories found matching country query "${searchQuery}".`
              : "All stories for this region will appear here immediately upon loading."}
          </div>
        ) : (
          filteredArticles.map((article) => (
            <div key={article.id} className="rounded-xl border border-charcoal bg-[#0F0F0F] p-6">
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-accent">
                {article.country ? `Country: ${article.country}` : regionName}
              </div>
              <ListItemCard article={article as any} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

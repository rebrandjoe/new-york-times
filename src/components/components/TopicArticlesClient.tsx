"use client";

import { useState, useMemo } from "react";
import { ListItemCard } from "@/components/ArticleCard";

export function TopicArticlesClient({
  articles,
  topicName,
  topicSlug,
}: {
  articles: any[];
  topicName: string;
  topicSlug: string;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return articles;
    const q = query.toLowerCase();
    return articles.filter(
      (a) =>
        a.title?.toLowerCase().includes(q) ||
        (a.excerpt && a.excerpt.toLowerCase().includes(q))
    );
  }, [articles, query]);

  return (
    <div className="mt-8">
      <div className="mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Search stories..."
          className="w-full rounded-xl border border-charcoal bg-[#0F0F0F] px-4 py-3 text-sm text-white placeholder-gray-muted focus:border-accent focus:outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-charcoal bg-[#0F0F0F] p-8 text-center text-sm text-gray-muted">
          No stories found matching your filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((article) => (
            <ListItemCard key={article.id} article={article as any} />
          ))}
        </div>
      )}
    </div>
  );
}

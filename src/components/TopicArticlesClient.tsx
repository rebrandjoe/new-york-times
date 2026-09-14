"use client";

import { useState, useMemo } from "react";
import { ListItemCard } from "@/components/ArticleCard";

export interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  read_time_minutes?: number;
  publication_date?: string;
  category?: { name: string; slug: string } | null;
  author?: { name: string; slug: string } | null;
  featured_image?: { url: string; alt_text?: string | null } | null;
}

interface TopicArticlesClientProps {
  articles: ArticleItem[];
  topicName: string;
  topicSlug: string;
}

function getPlaceholder(slug: string): string {
  switch (slug) {
    case "diseases-conditions":
    case "disease-outbreaks-epidemics":
    case "cancer":
      return "Search by disease...";
    case "treatments-medicines":
      return "Search by treatment or medicine...";
    case "medical-innovation-technology":
      return "Search by technology or innovation...";
    case "medical-research":
      return "Search research...";
    case "vaccines-immunization":
      return "Search by vaccine...";
    default:
      return "Search stories...";
  }
}

export function TopicArticlesClient({ articles, topicName, topicSlug }: TopicArticlesClientProps) {
  const [query, setQuery] = useState("");
  const placeholder = getPlaceholder(topicSlug);

  const filtered = useMemo(() => {
    if (!query.trim()) return articles;
    const q = query.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
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
          placeholder={`🔍 ${placeholder}`}
          className="w-full rounded-xl border border-charcoal bg-[#0F0F0F] px-4 py-3 text-sm text-white placeholder-gray-muted focus:border-accent focus:outline-none"
        />
      </div>

      {articles.length === 0 ? (
        <p className="mt-10 text-base text-gray-secondary-light">
          No stories on {topicName} have been published yet. Check back soon.
        </p>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-charcoal bg-[#0F0F0F] p-8 text-center text-sm text-gray-muted">
          No stories found matching &ldquo;{query}&rdquo;.
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

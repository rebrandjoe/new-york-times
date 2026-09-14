"use client";

import type { Metadata } from "next";
import { use, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { majorRegions } from "@/lib/nav";

interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  country?: string;
  region?: string;
  publication_date?: string;
}

export default function RegionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const regionObj = majorRegions.find((r) => r.slug === slug);
  const regionName = regionObj ? regionObj.name : slug.replace("-", " ").toUpperCase();

  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return articles;
    const q = searchQuery.toLowerCase();
    return articles.filter((a) => (a.country || "").toLowerCase().includes(q));
  }, [articles, searchQuery]);

  if (!regionObj) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-16 text-center text-white">
        <h1 className="font-serif text-3xl font-bold">Region Not Found</h1>
        <Link href="/regions" className="mt-4 inline-block text-accent hover:underline">
          ← Back to Regions
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
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
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="block rounded-xl border border-charcoal bg-[#0F0F0F] p-6 transition-colors hover:border-accent"
            >
              <div className="text-xs font-bold uppercase tracking-wider text-accent">
                {article.country ? `Country: ${article.country}` : regionName}
              </div>
              <h2 className="mt-2 font-serif text-xl font-bold text-white">{article.title}</h2>
              {article.excerpt && <p className="mt-2 text-sm text-gray-secondary-light">{article.excerpt}</p>}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

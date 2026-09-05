import type { Metadata } from "next";
import { ListItemCard } from "@/components/ArticleCard";
import { getPublishedArticles } from "@/lib/cms/queries";
import { toHomepageArticle } from "@/lib/cms/mappers";

export const metadata: Metadata = {
  title: "Latest",
  description: "The latest health and medical news from JOSEPH MMWA.",
  alternates: { canonical: "/latest" },
};

export default async function LatestPage() {
  const rows = await getPublishedArticles({ limit: 30 });
  const articles = rows.map(toHomepageArticle);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">JOSEPH MMWA</p>
      <h1 className="mt-3 font-serif text-4xl font-extrabold text-white sm:text-5xl">Latest</h1>

      {articles.length === 0 ? (
        <p className="mt-10 text-base text-gray-secondary-light">
          No stories have been published yet. Check back soon.
        </p>
      ) : (
        <div className="mt-10">
          {articles.map((article) => (
            <ListItemCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

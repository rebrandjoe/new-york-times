import type { Metadata } from "next";
import { ListItemCard } from "@/components/ArticleCard";
import { searchPublishedArticles } from "@/lib/cms/queries";
import { toHomepageArticle } from "@/lib/cms/mappers";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const rows = query ? await searchPublishedArticles(query) : [];
  const articles = rows.map(toHomepageArticle);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">JOSEPH MMWA</p>
      <h1 className="mt-3 font-serif text-4xl font-extrabold text-white sm:text-5xl">Search</h1>

      <form method="get" className="mt-8 flex gap-3">
        <label htmlFor="search-q" className="sr-only">
          Search articles
        </label>
        <input
          id="search-q"
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search health news, topics, authors…"
          className="focus-ring w-full border border-white/10 bg-charcoal-deep px-4 py-3 text-sm text-offwhite placeholder:text-gray-muted focus:border-accent"
        />
        <button
          type="submit"
          className="focus-ring shrink-0 bg-accent px-6 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90"
        >
          Search
        </button>
      </form>

      <div className="mt-10">
        {!query ? (
          <p className="text-base text-gray-secondary-light">
            Enter a search term to find articles, topics, and authors.
          </p>
        ) : articles.length === 0 ? (
          <p className="text-base text-gray-secondary-light">
            No results for &quot;{query}&quot;. Try a different search term.
          </p>
        ) : (
          <>
            <p className="mb-4 text-sm text-gray-muted">
              {articles.length} result{articles.length === 1 ? "" : "s"} for &quot;{query}&quot;
            </p>
            {articles.map((article) => (
              <ListItemCard key={article.id} article={article} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

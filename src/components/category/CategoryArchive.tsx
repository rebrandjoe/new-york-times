import { FeaturedCard, SecondaryCard } from "@/components/ArticleCard";
import { getPublishedArticles, type RegionSlugLike } from "@/lib/cms/queries";
import { toHomepageArticle } from "@/lib/cms/mappers";

/** Shared archive listing for the three regional category pages — one
 * reusable component, not three separate implementations. */
export async function CategoryArchive({
  categorySlug,
  categoryName,
}: {
  categorySlug: RegionSlugLike;
  categoryName: string;
}) {
  const rows = await getPublishedArticles({ categorySlug, limit: 24 });
  const articles = rows.map(toHomepageArticle);

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Region</p>
      <h1 className="mt-3 font-serif text-4xl font-extrabold text-white sm:text-5xl">{categoryName}</h1>

      {articles.length === 0 ? (
        <p className="mt-10 text-base text-gray-secondary-light">
          No {categoryName} stories have been published yet. Check back soon.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-4 gap-x-6 gap-y-10 sm:grid-cols-6 lg:grid-cols-12">
          <FeaturedCard article={articles[0]} className="col-span-4 sm:col-span-6 lg:col-span-7" />
          <div className="col-span-4 flex flex-col gap-8 sm:col-span-6 lg:col-span-5">
            {articles.slice(1, 4).map((article) => (
              <SecondaryCard key={article.id} article={article} />
            ))}
          </div>
          {articles.length > 4 && (
            <div className="col-span-4 grid grid-cols-1 gap-8 border-t border-charcoal pt-10 sm:col-span-6 sm:grid-cols-2 lg:col-span-12 lg:grid-cols-3">
              {articles.slice(4).map((article) => (
                <SecondaryCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

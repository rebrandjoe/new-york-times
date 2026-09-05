import { SecondaryCard } from "@/components/ArticleCard";
import { toHomepageArticle } from "@/lib/cms/mappers";
import type { CmsArticle } from "@/lib/cms/types";

export function RelatedArticles({ articles }: { articles: CmsArticle[] }) {
  if (articles.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
      <h2 className="border-b border-charcoal pb-4 font-serif text-2xl font-extrabold text-white">
        Related Stories
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {articles.map((article) => (
          <SecondaryCard key={article.id} article={toHomepageArticle(article)} />
        ))}
      </div>
    </section>
  );
}

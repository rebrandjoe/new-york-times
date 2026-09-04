import { ListItemCard } from "@/components/ArticleCard";
import { SectionHeading } from "@/components/SectionHeading";
import type { Article } from "@/lib/types";

export function LatestNews({ articles }: { articles: Article[] }) {
  return (
    <section aria-labelledby="latest-news-heading" className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <h2 id="latest-news-heading" className="sr-only">
        Latest health news
      </h2>
      <SectionHeading
        title="Latest Health News"
        href="/latest"
        linkLabel="View all latest news"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-10">
        {articles.map((article) => (
          <ListItemCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}

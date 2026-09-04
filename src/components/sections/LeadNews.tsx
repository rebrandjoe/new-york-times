import { FeaturedCard, SecondaryCard } from "@/components/ArticleCard";
import { SectionHeading } from "@/components/SectionHeading";
import type { Article } from "@/lib/types";

export function LeadNews({
  primary,
  secondary,
}: {
  primary: Article;
  secondary: Article[];
}) {
  return (
    <section aria-labelledby="lead-news-heading" className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <h2 id="lead-news-heading" className="sr-only">
        Lead news
      </h2>
      <SectionHeading title="Top Stories" />
      <div className="grid grid-cols-4 gap-x-6 gap-y-10 sm:grid-cols-6 lg:grid-cols-12">
        <FeaturedCard article={primary} className="col-span-4 sm:col-span-6 lg:col-span-7" />
        <div className="col-span-4 flex flex-col gap-8 sm:col-span-6 lg:col-span-5">
          {secondary.map((article) => (
            <SecondaryCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}

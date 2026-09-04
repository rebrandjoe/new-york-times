import Link from "next/link";
import type { Article } from "@/lib/types";
import { ArticleImage } from "@/components/ArticleImage";

function Meta({ article, className = "" }: { article: Article; className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-muted ${className}`}>
      <time>{article.publication.date}</time>
      <span aria-hidden="true">·</span>
      <span>{article.publication.readTime}</span>
    </div>
  );
}

export function FeaturedCard({ article, className = "" }: { article: Article; className?: string }) {
  return (
    <Link
      href={`/latest/${article.slug}`}
      className={`focus-ring group block ${className}`}
    >
      <ArticleImage
        image={article.image}
        sizes="(min-width: 1024px) 60vw, 100vw"
        className="aspect-[16/10] w-full"
      />
      <div className="mt-4">
        <span className="text-xs font-bold uppercase tracking-wider text-accent">
          {article.category.name}
        </span>
        <h3 className="mt-2 font-serif text-2xl font-bold leading-tight text-white transition-colors group-hover:text-accent sm:text-3xl">
          {article.headline}
        </h3>
        <p className="mt-2 max-w-2xl text-sm text-gray-secondary-light">
          {article.description}
        </p>
        <Meta article={article} className="mt-3" />
      </div>
    </Link>
  );
}

export function SecondaryCard({ article, className = "" }: { article: Article; className?: string }) {
  return (
    <Link href={`/latest/${article.slug}`} className={`focus-ring group block ${className}`}>
      <ArticleImage
        image={article.image}
        sizes="(min-width: 1024px) 30vw, 100vw"
        className="aspect-[16/10] w-full"
      />
      <div className="mt-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
          {article.category.name}
        </span>
        <h4 className="mt-1.5 font-serif text-lg font-bold leading-snug text-white transition-colors group-hover:text-accent">
          {article.headline}
        </h4>
        <Meta article={article} className="mt-2" />
      </div>
    </Link>
  );
}

export function ListItemCard({ article, className = "" }: { article: Article; className?: string }) {
  return (
    <Link
      href={`/latest/${article.slug}`}
      className={`focus-ring group flex items-center gap-4 border-b border-charcoal py-4 sm:gap-6 ${className}`}
    >
      <ArticleImage
        image={article.image}
        sizes="128px"
        className="aspect-square w-20 shrink-0 sm:w-28"
      />
      <div className="min-w-0">
        <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
          {article.category.name}
        </span>
        <h4 className="mt-1 font-serif text-base font-bold leading-snug text-white transition-colors group-hover:text-accent sm:text-lg">
          {article.headline}
        </h4>
        <Meta article={article} className="mt-1.5" />
      </div>
    </Link>
  );
}

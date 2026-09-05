import Image from "next/image";
import Link from "next/link";
import { BlockRenderer } from "@/components/article/BlockRenderer";
import { AuthorBlock } from "@/components/article/AuthorBlock";
import { ShareRow } from "@/components/article/ShareRow";
import { RelatedArticles } from "@/components/article/RelatedArticles";
import { Comments } from "@/components/article/Comments";
import type { CmsArticle } from "@/lib/cms/types";
import type { CommentRow } from "@/lib/actions/comments";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** The real production article layout — shared by the public /article/[slug]
 * route and the admin draft-preview route, so "Preview" is never a
 * different-looking approximation. */
export function ArticleView({
  article,
  related,
  comments,
  articlePath,
  canonicalUrl,
  interactive = true,
}: {
  article: CmsArticle;
  related: CmsArticle[];
  comments: CommentRow[];
  articlePath: string;
  canonicalUrl: string;
  /** Admin preview disables comment posting and related-article/author links
   * navigating away, since drafts aren't real pages yet for readers. */
  interactive?: boolean;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    headline: article.title,
    description: article.excerpt ?? undefined,
    datePublished: article.publicationDate,
    dateModified: article.updatedAt,
    image: article.featuredImage?.url ?? undefined,
    url: canonicalUrl,
    author: {
      "@type": "Person",
      name: article.author.name,
      jobTitle: article.author.title,
    },
    publisher: {
      "@type": "Person",
      name: "Joseph Mmwa",
    },
  };

  return (
    <article>
      {interactive && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <div className="mx-auto max-w-3xl px-4 pt-12 sm:px-6 lg:px-8">
        <Link
          href={`/${article.category.slug}`}
          className="focus-ring text-xs font-bold uppercase tracking-wider text-accent"
        >
          {article.category.name}
        </Link>
        <h1 className="mt-3 font-serif text-3xl font-extrabold leading-[1.1] text-white sm:text-5xl">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="mt-4 text-lg text-gray-secondary-light sm:text-xl">{article.excerpt}</p>
        )}
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-muted">
          <time dateTime={article.publicationDate}>{formatDate(article.publicationDate)}</time>
          <span aria-hidden="true">·</span>
          <span>{article.readTimeMinutes} min read</span>
        </div>
      </div>

      {article.featuredImage && (
        <div className="relative left-1/2 mt-8 aspect-[16/9] max-h-[70vh] w-screen -translate-x-1/2 overflow-hidden bg-charcoal">
          <Image
            src={article.featuredImage.url}
            alt={article.featuredImage.altText ?? article.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}
      {article.featuredImage?.caption || article.featuredImage?.credit ? (
        <p className="mx-auto mt-2 max-w-3xl px-4 text-sm text-gray-muted sm:px-6 lg:px-8">
          {article.featuredImage.caption}
          {article.featuredImage.caption && article.featuredImage.credit && " — "}
          {article.featuredImage.credit}
        </p>
      ) : null}

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <BlockRenderer blocks={article.body} />
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <AuthorBlock name={article.author.name} title={article.author.title} />
        <ShareRow url={canonicalUrl} title={article.title} />
      </div>

      <RelatedArticles articles={related} />

      {interactive && (
        <Comments articleId={article.id} articlePath={articlePath} initialComments={comments} />
      )}
    </article>
  );
}

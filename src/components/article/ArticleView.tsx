import Image from "next/image";
import Link from "next/link";
import { BlockRenderer } from "@/components/article/BlockRenderer";
import { AuthorBlock } from "@/components/article/AuthorBlock";
import { ShareRow } from "@/components/article/ShareRow";
import { RelatedArticles } from "@/components/article/RelatedArticles";
import { Comments } from "@/components/article/Comments";
import { PaywallNotice } from "@/components/article/PaywallNotice";
import { SourceAttribution } from "@/components/article/SourceAttribution";
import { CorrectionNotice } from "@/components/article/CorrectionNotice";
import { ReadingProgress } from "@/components/article/ReadingProgress";
import { MemberAccessCard } from "@/components/MemberAccessCard";
import { Briefing } from "@/components/sections/Briefing";
import { truncateBlocksForPreview } from "@/lib/cms/blocks";
import { majorRegions } from "@/lib/nav";
import type { CmsArticle } from "@/lib/cms/types";
import type { CommentRow } from "@/lib/actions/comments";

function formatDate(iso: string) {
  return (
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "UTC",
    }) + " UTC"
  );
}

function regionHref(regionName: string): string | null {
  const match = majorRegions.find((r) => r.name.toLowerCase() === regionName.toLowerCase());
  return match ? `/regions/${match.slug}` : null;
}

export function ArticleView({
  article,
  related,
  comments,
  articlePath,
  canonicalUrl,
  interactive = true,
  premiumLocked = false,
}: {
  article: CmsArticle;
  related: CmsArticle[];
  comments: CommentRow[];
  articlePath: string;
  canonicalUrl: string;
  interactive?: boolean;
  premiumLocked?: boolean;
}) {
  const bodyBlocks = premiumLocked ? truncateBlocksForPreview(article.body) : article.body;

  const midpoint = Math.ceil(bodyBlocks.length / 2);
  const firstHalfBlocks = bodyBlocks.slice(0, midpoint);
  const secondHalfBlocks = bodyBlocks.slice(midpoint);

  const regionLink = article.region ? regionHref(article.region) : null;

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

      {interactive && <ReadingProgress />}

      <div id="article-progress-start" className="mx-auto max-w-3xl px-4 pt-12 sm:px-6 lg:px-8">
        {article.category && (
          <Link
            href={`/${article.category.slug}`}
            className="focus-ring text-xs font-bold uppercase tracking-wider text-accent"
          >
            {article.category.name}
          </Link>
        )}
        <h1 className="mt-3 font-serif text-3xl font-extrabold leading-[1.1] text-white sm:text-5xl">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="mt-4 text-lg text-gray-secondary-light sm:text-xl">{article.excerpt}</p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-muted">
          <time dateTime={article.publicationDate}>{formatDate(article.publicationDate)}</time>
          <span aria-hidden="true">·</span>
          <span>{article.readTimeMinutes} min read</span>
          {article.region && (
            <>
              <span aria-hidden="true">·</span>
              {regionLink ? (
                <Link href={regionLink} className="focus-ring hover:text-accent">
                  {article.region}
                </Link>
              ) : (
                <span>{article.region}</span>
              )}
            </>
          )}
          {article.country && (
            <>
              <span aria-hidden="true">·</span>
              <span>{article.country}</span>
            </>
          )}
        </div>
        {article.topics.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {article.topics.map((topic) => (
              <Link
                key={topic.id}
                href={`/topics/${topic.slug}`}
                className="focus-ring border border-charcoal px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-secondary-light transition-colors hover:border-accent hover:text-accent"
              >
                {topic.name}
              </Link>
            ))}
          </div>
        )}
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
        <BlockRenderer blocks={firstHalfBlocks} />
        {!premiumLocked && <MemberAccessCard />}
        <BlockRenderer blocks={secondHalfBlocks} />
        {premiumLocked && <PaywallNotice />}
        {!premiumLocked && article.correctionNote && (
          <div className="mt-6">
            <CorrectionNotice note={article.correctionNote} />
          </div>
        )}
      </div>

      {!premiumLocked && (
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SourceAttribution source={article.source} />
        </div>
      )}

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <AuthorBlock name={article.author.name} title={article.author.title} />
        {!premiumLocked && <ShareRow url={canonicalUrl} title={article.title} />}
      </div>

      <div id="article-progress-end" />

      {interactive && !premiumLocked && (
        <Comments articleId={article.id} articlePath={articlePath} initialComments={comments} />
      )}

      {!premiumLocked && <RelatedArticles articles={related} />}

      {interactive && !premiumLocked && <Briefing />}
    </article>
  );
}

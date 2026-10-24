import Image from "next/image";
import Link from "next/link";
import { BlockRenderer } from "@/components/article/BlockRenderer";
import { AuthorBlock } from "@/components/article/AuthorBlock";
import { ShareRow } from "@/components/article/ShareRow";
import { RelatedArticles } from "@/components/article/RelatedArticles";
import { AlsoReadFixed } from "@/components/article/AlsoReadFixed";
import { AlsoReadMid } from "@/components/article/AlsoReadMid";
import { Comments } from "@/components/article/Comments";
import { PaywallNotice } from "@/components/article/PaywallNotice";
import { SourceAttribution } from "@/components/article/SourceAttribution";
import { CorrectionNotice } from "@/components/article/CorrectionNotice";
import { ReadingProgress } from "@/components/article/ReadingProgress";
import { SoftJoinPrompt } from "@/components/article/SoftJoinPrompt";
import { MedicalDisclaimerTab } from "@/components/MedicalDisclaimerTab";
import { shouldShowMedicalDisclaimer } from "@/lib/cms/medical-disclaimer";
import { Briefing } from "@/components/sections/Briefing";
import { truncateBlocksForPreview } from "@/lib/cms/blocks";
import { toHomepageArticle } from "@/lib/cms/mappers";
import { majorRegions } from "@/lib/nav";
import type { CmsArticle } from "@/lib/cms/types";
import type { CommentRow } from "@/lib/actions/comments";

/** Same instant deeplink pattern as major publishers (e.g. citizen.digital). */
const GOOGLE_PREFERRED_SOURCE_URL =
  "https://www.google.com/preferences/source?q=josephmmwa.com";

/** Multicolor Google "G" mark for Preferred Source CTA (brand colors). */
function GoogleGIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

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

/** True when updatedAt is meaningfully later than publication (ignores tiny publish-time skew). */
function wasUpdatedAfterPublish(publishedIso: string, updatedIso: string): boolean {
  const published = new Date(publishedIso).getTime();
  const updated = new Date(updatedIso).getTime();
  if (Number.isNaN(published) || Number.isNaN(updated)) return false;
  return updated - published >= 2 * 60 * 1000;
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

  // Split body so mobile “You may also like” appears mid-article
  const midIndex =
    bodyBlocks.length <= 2 ? bodyBlocks.length : Math.ceil(bodyBlocks.length / 2);
  const bodyFirst = bodyBlocks.slice(0, midIndex);
  const bodySecond = bodyBlocks.slice(midIndex);

  const regionLink = article.region ? regionHref(article.region) : null;
  const showUpdated = wasUpdatedAfterPublish(article.publicationDate, article.updatedAt);
  const alsoRead = related.map(toHomepageArticle);
  const bottomRelated = related.slice(0, 4);
  const showMedicalDisclaimer =
    interactive &&
    !premiumLocked &&
    shouldShowMedicalDisclaimer(article.medicalDisclaimerMode, article);

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
      {showMedicalDisclaimer && <MedicalDisclaimerTab enabled />}
      {interactive && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {interactive && <ReadingProgress />}

      {/* Desktop: fixed right rail */}
      {!premiumLocked && interactive && alsoRead.length > 0 && (
        <AlsoReadFixed articles={alsoRead} />
      )}

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
          {showUpdated && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-gray-muted/80">
                Updated on{" "}
                <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time>
              </span>
            </>
          )}
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

        {interactive && (
          <div className="mt-4">
            <a
              href={GOOGLE_PREFERRED_SOURCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex items-center gap-2 rounded-full bg-[#1f1f1f] px-3 py-1.5 text-[11px] font-medium text-white shadow-sm transition-colors hover:bg-[#2a2a2a] sm:text-xs"
            >
              <GoogleGIcon className="h-4 w-4 shrink-0" />
              Add as a Preferred Source on Google
            </a>
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
        <BlockRenderer blocks={bodyFirst} />

        {/* Mobile/tablet: mid-article swipe (hidden on desktop) */}
        {!premiumLocked && alsoRead.length > 0 && <AlsoReadMid articles={alsoRead} />}

        {bodySecond.length > 0 && <BlockRenderer blocks={bodySecond} />}

        {premiumLocked && <PaywallNotice />}
        {!premiumLocked && article.correctionNote && (
          <div className="mt-6">
            <CorrectionNotice note={article.correctionNote} />
          </div>
        )}
        {!premiumLocked && (
          <div className="mt-6">
            <SourceAttribution sources={article.sources} />
          </div>
        )}
        <AuthorBlock name={article.author.name} title={article.author.title} />
        {!premiumLocked && <ShareRow url={canonicalUrl} title={article.title} />}
        {interactive && !premiumLocked && <SoftJoinPrompt />}
      </div>

      <div id="article-progress-end" />

      {interactive && !premiumLocked && (
        <Comments articleId={article.id} articlePath={articlePath} initialComments={comments} />
      )}

      {!premiumLocked && <RelatedArticles articles={bottomRelated} />}

      {interactive && !premiumLocked && <Briefing />}
    </article>
  );
}

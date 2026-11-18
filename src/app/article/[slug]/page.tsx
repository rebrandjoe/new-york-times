import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/article/ArticleView";
import { getArticleBySlug, getRelatedArticles } from "@/lib/cms/queries";
import { resolveCmsArticleMetaDescription } from "@/lib/cms/seo-description";
import { getPublicComments } from "@/lib/actions/comments";
import { createClient } from "@/lib/supabase/server";
import { hasActivePremiumAccess } from "@/lib/premium/access";
import { SUPABASE_LOGO_URL } from "@/components/Wordmark";

const SITE_URL = "https://josephmmwa.com";
/** Fallback share image when an article has no featured image. */
const DEFAULT_SHARE_IMAGE = `${SITE_URL}/images/joseph-mmwa.jpg`;
/** Brand mark for publisher logo in schema (prefer square JM logo). */
const PUBLISHER_LOGO_URL = SUPABASE_LOGO_URL;

// Cache public article HTML for 6 hours — publish still revalidates paths.
export const revalidate = 21600;

/**
 * Social crawlers often refuse Supabase Storage URLs because responses include
 * `x-robots-tag: none`. Proxy via our domain for Open Graph / Twitter cards only.
 * On-page article images still load directly from Supabase.
 */
function toShareImageUrl(sourceUrl: string | undefined | null): string {
  if (!sourceUrl) return DEFAULT_SHARE_IMAGE;
  try {
    const u = new URL(sourceUrl);
    if (u.hostname.endsWith(".supabase.co") && u.pathname.includes("/storage/v1/object/public/")) {
      return `${SITE_URL}/share-image?u=${encodeURIComponent(sourceUrl)}`;
    }
  } catch {
    // fall through
  }
  if (sourceUrl.startsWith("http://") || sourceUrl.startsWith("https://")) {
    return sourceUrl;
  }
  return sourceUrl.startsWith("/") ? `${SITE_URL}${sourceUrl}` : DEFAULT_SHARE_IMAGE;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article" };

  const title = article.title;
  const description = resolveCmsArticleMetaDescription(article);
  const canonical = `/article/${article.slug}`;
  const image = toShareImageUrl(article.featuredImage?.url);
  const alt = article.featuredImage?.altText || article.title;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      siteName: "JOSEPH MMWA",
      images: [
        {
          url: image,
          alt,
          width: 1200,
          height: 630,
        },
      ],
      publishedTime: article.publicationDate,
      modifiedTime: article.updatedAt,
      authors: [article.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const articlePath = `/article/${article.slug}`;

  // Avoid session/cookies on free public articles so the page can be cached.
  // Premium stories still check access when needed.
  // Fetch extra related for the desktop Just in rail (relevance-ranked).
  const [related, comments, premiumAccess] = await Promise.all([
    getRelatedArticles(article, 8),
    getPublicComments(article.id),
    article.premium
      ? (async () => {
          const supabase = await createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          return hasActivePremiumAccess(user?.id ?? null);
        })()
      : Promise.resolve(true),
  ]);

  const canonicalUrl = `${SITE_URL}${articlePath}`;
  const imageUrl = toShareImageUrl(article.featuredImage?.url);
  const metaDescription = resolveCmsArticleMetaDescription(article);
  const sectionName =
    article.category?.name ||
    article.topics[0]?.name ||
    (article.region ? article.region : null) ||
    "Health";
  const keywords = [
    ...article.topics.map((t) => t.name),
    article.category?.name,
    article.region,
    article.country,
  ].filter((v): v is string => Boolean(v && v.trim()));

  const newsArticleLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: metaDescription,
    image: [imageUrl],
    datePublished: article.publicationDate,
    dateModified: article.updatedAt || article.publicationDate,
    inLanguage: "en",
    isAccessibleForFree: !article.premium,
    articleSection: sectionName,
    keywords: keywords.length ? keywords.join(", ") : undefined,
    author: {
      "@type": "Person",
      name: article.author?.name || "Joseph Mmwa",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "JOSEPH MMWA",
      logo: {
        "@type": "ImageObject",
        url: PUBLISHER_LOGO_URL,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: sectionName,
        item: article.category?.slug
          ? `${SITE_URL}/${article.category.slug === "kenya" || article.category.slug === "global" ? article.category.slug : `topics/${article.category.slug}`}`
          : `${SITE_URL}/latest`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <ArticleView
        article={article}
        related={related}
        comments={comments}
        articlePath={articlePath}
        canonicalUrl={canonicalUrl}
        premiumLocked={article.premium && !premiumAccess}
      />
    </>
  );
}

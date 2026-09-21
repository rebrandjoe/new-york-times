import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/article/ArticleView";
import { getArticleBySlug, getRelatedArticles } from "@/lib/cms/queries";
import { getComments } from "@/lib/actions/comments";
import { createClient } from "@/lib/supabase/server";
import { hasActivePremiumAccess } from "@/lib/premium/access";

const SITE_URL = "https://josephmmwa.com";
/** Public asset that exists in production (logo.png / og-default.jpg currently 404). */
const DEFAULT_SHARE_IMAGE = `${SITE_URL}/images/joseph-mmwa.jpg`;

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
  const description = article.excerpt || undefined;
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
          // Typical share crop; actual dimensions may differ
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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [related, comments, premiumAccess] = await Promise.all([
    getRelatedArticles(article, 4),
    getComments(article.id),
    article.premium ? hasActivePremiumAccess(user?.id ?? null) : Promise.resolve(true),
  ]);

  const canonicalUrl = `${SITE_URL}${articlePath}`;
  const imageUrl = toShareImageUrl(article.featuredImage?.url);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: [imageUrl],
    datePublished: article.publicationDate,
    dateModified: article.updatedAt || article.publicationDate,
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
        url: DEFAULT_SHARE_IMAGE,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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

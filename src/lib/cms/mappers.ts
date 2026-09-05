import type { Article as HomepageArticle } from "@/lib/types";
import type { ContentBlock } from "./blocks";
import type { ArticleStatus, CmsArticle, CmsMedia } from "./types";

export const ARTICLE_SELECT = `
  id, slug, title, excerpt, body, region, country,
  publication_date, updated_at, read_time_minutes, status, scheduled_at, premium,
  seo_title, seo_description, canonical_url, correction_note,
  source_name, source_author, source_institution, source_url, source_published_at, source_additional,
  category:categories!articles_category_id_fkey(id, name, slug),
  author:authors!articles_author_id_fkey(id, name, slug, title),
  featured_image:media!articles_featured_image_id_fkey(id, type, url, alt_text, caption, credit, source, link_url),
  social_image:media!articles_social_image_id_fkey(id, type, url, alt_text, caption, credit, source, link_url),
  article_topics(topic:topics(id, name, slug))
`;

// Loosely typed to the shape ARTICLE_SELECT produces — Supabase's inference on
// aliased/nested foreign-key joins doesn't fully resolve at the type level.
export interface RawArticleRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: unknown;
  region: string | null;
  country: string | null;
  publication_date: string;
  updated_at: string;
  read_time_minutes: number | null;
  status: string;
  scheduled_at: string | null;
  premium: boolean;
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
  correction_note: string | null;
  source_name: string | null;
  source_author: string | null;
  source_institution: string | null;
  source_url: string | null;
  source_published_at: string | null;
  source_additional: string | null;
  category: { id: string; name: string; slug: string } | null;
  author: { id: string; name: string; slug: string; title: string } | null;
  featured_image: RawMediaRow | null;
  social_image: RawMediaRow | null;
  article_topics: { topic: { id: string; name: string; slug: string } | null }[] | null;
}

interface RawMediaRow {
  id: string;
  type: string;
  url: string;
  alt_text: string | null;
  caption: string | null;
  credit: string | null;
  source: string | null;
  link_url: string | null;
}

function mapMedia(row: RawMediaRow | null): CmsMedia | null {
  if (!row) return null;
  return {
    id: row.id,
    type: row.type === "video" ? "video" : "image",
    url: row.url,
    altText: row.alt_text,
    caption: row.caption,
    credit: row.credit,
    source: row.source,
    linkUrl: row.link_url,
  };
}

export function mapRowToCmsArticle(row: RawArticleRow): CmsArticle {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: Array.isArray(row.body) ? (row.body as ContentBlock[]) : [],
    featuredImage: mapMedia(row.featured_image),
    category: row.category ?? { id: "", name: "Category", slug: "category" },
    topics: (row.article_topics ?? [])
      .map((t) => t.topic)
      .filter((t): t is { id: string; name: string; slug: string } => t !== null),
    region: row.region,
    country: row.country,
    author: row.author ?? { id: "", name: "Joseph Mmwa", slug: "joseph-mmwa", title: "Health & Medical Journalist" },
    publicationDate: row.publication_date,
    updatedAt: row.updated_at,
    readTimeMinutes: row.read_time_minutes ?? 1,
    status: row.status as ArticleStatus,
    scheduledAt: row.scheduled_at,
    premium: row.premium,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    canonicalUrl: row.canonical_url,
    correctionNote: row.correction_note,
    socialImage: mapMedia(row.social_image),
    source: {
      name: row.source_name,
      author: row.source_author,
      institution: row.source_institution,
      url: row.source_url,
      publishedAt: row.source_published_at,
      additional: row.source_additional,
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Adapts a CmsArticle to the existing homepage `Article` shape so the
 * homepage's card/section components can render real CMS data unchanged. */
export function toHomepageArticle(article: CmsArticle): HomepageArticle {
  return {
    id: article.id,
    slug: article.slug,
    headline: article.title,
    description: article.excerpt ?? "",
    category: article.category,
    topics: article.topics,
    region: article.category.slug as HomepageArticle["region"],
    author: { id: article.author.id, name: article.author.name, slug: article.author.slug },
    image: {
      src: article.featuredImage?.url ?? null,
      alt: article.featuredImage?.altText ?? article.title,
    },
    publication: {
      date: formatDate(article.publicationDate),
      readTime: `${article.readTimeMinutes} min read`,
    },
  };
}

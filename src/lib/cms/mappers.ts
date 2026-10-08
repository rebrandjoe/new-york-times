import type { Article as HomepageArticle } from "@/lib/types";
import type { ContentBlock } from "./blocks";
import type { ArticleSource, ArticleStatus, CmsArticle, CmsMedia } from "./types";

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

/** Parse multi-source list from storage (JSON in source_additional) or legacy fields. */
export function parseArticleSources(row: {
  source_name: string | null;
  source_author: string | null;
  source_institution: string | null;
  source_url: string | null;
  source_additional: string | null;
}): ArticleSource[] {
  const additional = row.source_additional?.trim() || null;
  if (additional?.startsWith("[")) {
    try {
      const parsed = JSON.parse(additional) as unknown;
      if (Array.isArray(parsed)) {
        const items = parsed
          .filter((item): item is Record<string, unknown> => item !== null && typeof item === "object")
          .map((item) => {
            if ("publication" in item || "author" in item) {
              return {
                author:
                  typeof item.author === "string" && item.author.trim()
                    ? item.author.trim()
                    : null,
                publication:
                  typeof item.publication === "string" ? item.publication.trim() : "",
                url:
                  typeof item.url === "string" && item.url.trim() ? item.url.trim() : null,
              };
            }
            // Previous shape: name + url → publication = name (title dropped)
            return {
              author: null,
              publication: typeof item.name === "string" ? item.name.trim() : "",
              url: typeof item.url === "string" && item.url.trim() ? item.url.trim() : null,
            };
          })
          .filter((item) => item.publication || item.author || item.url);
        if (items.length > 0) return items;
      }
    } catch {
      // fall through
    }
  }

  const hasLegacy =
    row.source_name ||
    row.source_author ||
    row.source_institution ||
    row.source_url ||
    (additional && !additional.startsWith("["));
  if (!hasLegacy) return [];

  const publication =
    (row.source_name && row.source_name.trim()) ||
    (row.source_institution && row.source_institution.trim()) ||
    "";
  const author = (row.source_author && row.source_author.trim()) || null;

  if (!publication && !author && !row.source_url) return [];

  return [
    {
      author: author && author !== publication ? author : null,
      publication: publication || author || "Source",
      url: row.source_url?.trim() || null,
    },
  ];
}

/** Serialize sources for DB: JSON in source_additional + first source mirrored to legacy columns. */
export function serializeArticleSources(sources: ArticleSource[]): {
  source_name: string | null;
  source_author: string | null;
  source_institution: string | null;
  source_url: string | null;
  source_additional: string | null;
} {
  const cleaned = sources
    .map((s) => ({
      author: s.author?.trim() || null,
      publication: s.publication.trim(),
      url: s.url?.trim() || null,
    }))
    .filter((s) => s.publication || s.author || s.url);

  if (cleaned.length === 0) {
    return {
      source_name: null,
      source_author: null,
      source_institution: null,
      source_url: null,
      source_additional: null,
    };
  }

  const first = cleaned[0];
  return {
    source_name: first.publication || null,
    source_author: first.author,
    source_institution: null,
    source_url: first.url,
    source_additional: JSON.stringify(cleaned),
  };
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
    category: row.category,
    topics: (row.article_topics ?? [])
      .map((t) => t.topic)
      .filter((t): t is { id: string; name: string; slug: string } => t !== null),
    region: row.region,
    country: row.country,
    author: row.author ?? {
      id: "",
      name: "Joseph Mmwa",
      slug: "joseph-mmwa",
      title: "Health & Medical Journalist",
    },
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
    sources: parseArticleSources(row),
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

import { getPublishedArticles } from "@/lib/cms/queries";

const SITE_URL = "https://josephmmwa.com";
const PUBLICATION_NAME = "JOSEPH MMWA";
const LANGUAGE = "en";

/** Prefer articles from the last 7 days (publish or update). */
const NEWS_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

/** If the window is empty (slow publish week), still list this many newest stories. */
const FALLBACK_MIN_URLS = 10;

/** Google allows up to 1,000 URLs per news sitemap. */
const MAX_NEWS_URLS = 1000;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&" + "amp;")
    .replace(/</g, "&" + "lt;")
    .replace(/>/g, "&" + "gt;")
    .replace(/"/g, "&" + "quot;")
    .replace(/'/g, "&" + "apos;");
}

function articleNewsTimestamp(article: {
  publicationDate: string;
  updatedAt?: string | null;
}): number {
  const published = new Date(article.publicationDate).getTime();
  const updated = article.updatedAt ? new Date(article.updatedAt).getTime() : NaN;
  const times = [published, updated].filter((t) => !Number.isNaN(t));
  return times.length ? Math.max(...times) : NaN;
}

/**
 * Google News sitemap (news: namespace).
 * Served at /news-sitemap and /news-sitemap.xml.
 */
export async function GET() {
  const articles = await getPublishedArticles({ limit: 500 });
  const cutoff = Date.now() - NEWS_WINDOW_MS;

  const scored = articles
    .map((article) => ({
      article,
      ts: articleNewsTimestamp(article),
    }))
    .filter(({ ts }) => !Number.isNaN(ts))
    .sort((a, b) => b.ts - a.ts);

  let recent = scored.filter(({ ts }) => ts >= cutoff).map(({ article }) => article);

  // Sparse cadence: never leave the map empty while published stories exist.
  if (recent.length < FALLBACK_MIN_URLS) {
    const seen = new Set(recent.map((a) => a.id));
    for (const { article } of scored) {
      if (recent.length >= FALLBACK_MIN_URLS) break;
      if (seen.has(article.id)) continue;
      seen.add(article.id);
      recent.push(article);
    }
  }

  recent = recent.slice(0, MAX_NEWS_URLS);

  const urls = recent
    .map((article) => {
      const loc = `${SITE_URL}/article/${article.slug}`;
      const title = escapeXml(article.title.trim());
      const publicationDate = new Date(article.publicationDate).toISOString();

      return [
        "  <url>",
        `    <loc>${escapeXml(loc)}</loc>`,
        "    <news:news>",
        "      <news:publication>",
        `        <news:name>${escapeXml(PUBLICATION_NAME)}</news:name>`,
        `        <news:language>${LANGUAGE}</news:language>`,
        "      </news:publication>",
        `      <news:publication_date>${publicationDate}</news:publication_date>`,
        `      <news:title>${title}</news:title>`,
        "    </news:news>",
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">',
    urls,
    "</urlset>",
    "",
  ].join("\n");

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}

import { getPublishedArticles } from "@/lib/cms/queries";

const SITE_URL = "https://josephmmwa.com";
const PUBLICATION_NAME = "JOSEPH MMWA";
const LANGUAGE = "en";

/** Google News only wants very recent articles (typically last 2 days). */
const NEWS_WINDOW_MS = 2 * 24 * 60 * 60 * 1000;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&" + "amp;")
    .replace(/</g, "&" + "lt;")
    .replace(/>/g, "&" + "gt;")
    .replace(/"/g, "&" + "quot;")
    .replace(/'/g, "&" + "apos;");
}

/**
 * Google News sitemap (news: namespace).
 * Served at /news-sitemap — avoids Next.js issues with ".xml" in the route segment.
 */
export async function GET() {
  const articles = await getPublishedArticles({ limit: 100 });
  const cutoff = Date.now() - NEWS_WINDOW_MS;

  const recent = articles.filter((article) => {
    const published = new Date(article.publicationDate).getTime();
    return !Number.isNaN(published) && published >= cutoff;
  });

  const urls = recent
    .map((article) => {
      const loc = `${SITE_URL}/article/${article.slug}`;
      const title = escapeXml(article.title);
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
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

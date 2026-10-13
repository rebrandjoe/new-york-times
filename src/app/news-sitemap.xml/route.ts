import { getPublishedArticles } from "@/lib/cms/queries";

const SITE_URL = "https://josephmmwa.com";
const PUBLICATION_NAME = "JOSEPH MMWA";
const LANGUAGE = "en";

/** Google News only wants very recent articles (typically last 2 days). */
const NEWS_WINDOW_MS = 2 * 24 * 60 * 60 * 1000;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, """)
    .replace(/'/g, "'");
}

/**
 * Google News sitemap (news: namespace).
 * Separate from the general sitemap.xml — does not alter existing SEO routes.
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
      // W3C datetime; publication_date is already ISO from CMS
      const publicationDate = new Date(article.publicationDate).toISOString();

      return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(PUBLICATION_NAME)}</news:name>
        <news:language>${LANGUAGE}</news:language>
      </news:publication>
      <news:publication_date>${publicationDate}</news:publication_date>
      <news:title>${title}</news:title>
    </news:news>
  </url>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>
`;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

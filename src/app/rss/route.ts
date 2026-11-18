import { getPublishedArticles } from "@/lib/cms/queries";
import { resolveCmsArticleMetaDescription } from "@/lib/cms/seo-description";

const SITE_URL = "https://josephmmwa.com";
const SITE_NAME = "JOSEPH MMWA";
const SITE_DESCRIPTION =
  "The world's biggest health and medical news explained as they happen.";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&" + "amp;")
    .replace(/</g, "&" + "lt;")
    .replace(/>/g, "&" + "gt;")
    .replace(/"/g, "&" + "quot;")
    .replace(/'/g, "&" + "apos;");
}

/** RSS 2.0 feed — latest published articles. */
export async function GET() {
  const articles = await getPublishedArticles({ limit: 40 });
  const lastBuild = articles[0]?.publicationDate
    ? new Date(articles[0].publicationDate).toUTCString()
    : new Date().toUTCString();

  const items = articles
    .map((article) => {
      const link = `${SITE_URL}/article/${article.slug}`;
      const title = escapeXml(article.title.trim());
      const description = escapeXml(
        resolveCmsArticleMetaDescription(article) ?? article.excerpt?.trim() ?? article.title
      );
      const pubDate = new Date(article.publicationDate).toUTCString();
      const author = escapeXml(article.author?.name || "Joseph Mmwa");
      const category = article.category?.name
        ? `      <category>${escapeXml(article.category.name)}</category>`
        : "";

      return [
        "    <item>",
        `      <title>${title}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `      <pubDate>${pubDate}</pubDate>`,
        `      <author>${author}</author>`,
        category,
        `      <description>${description}</description>`,
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const body = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">`,
    "  <channel>",
    `    <title>${escapeXml(SITE_NAME)}</title>`,
    `    <link>${SITE_URL}</link>`,
    `    <description>${escapeXml(SITE_DESCRIPTION)}</description>`,
    "    <language>en</language>",
    `    <lastBuildDate>${lastBuild}</lastBuildDate>`,
    `    <atom:link href="${SITE_URL}/rss" rel="self" type="application/rss+xml" />`,
    items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1800",
    },
  });
}

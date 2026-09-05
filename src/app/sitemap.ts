import type { MetadataRoute } from "next";
import { getPublishedArticles, getTopics } from "@/lib/cms/queries";

const SITE_URL = "https://josephmmwa.com";

const STATIC_ROUTES = [
  "",
  "/latest",
  "/africa",
  "/kenya",
  "/global",
  "/topics",
  "/about",
  "/contact",
  "/advertise",
  "/editorial-standards",
  "/ai-policy",
  "/corrections-and-fact-checking",
  "/terms-of-service",
  "/privacy-policy",
  "/premium",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, topics] = await Promise.all([
    getPublishedArticles({ limit: 500 }),
    getTopics(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/article/${article.slug}`,
    lastModified: new Date(article.updatedAt),
  }));

  const topicEntries: MetadataRoute.Sitemap = topics.map((topic) => ({
    url: `${SITE_URL}/topics/${topic.slug}`,
    lastModified: new Date(),
  }));

  return [...staticEntries, ...articleEntries, ...topicEntries];
}

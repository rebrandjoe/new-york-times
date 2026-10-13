import type { MetadataRoute } from "next";

const SITE_URL = "https://josephmmwa.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/account",
          "/preview",
          "/preview/",
          "/api",
          "/api/",
          "/sign-in",
          "/sign-up",
          "/reset-password",
        ],
      },
    ],
    // General crawl map + Google News–specific recent articles map
    sitemap: [`${SITE_URL}/sitemap.xml`, `${SITE_URL}/news-sitemap.xml`],
  };
}

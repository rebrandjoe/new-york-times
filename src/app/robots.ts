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
    // Primary crawl map. News map is also listed so crawlers can discover it.
    // (Some Next MetadataRoute typings are stricter about string[] for sitemap.)
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

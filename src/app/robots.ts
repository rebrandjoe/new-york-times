import type { MetadataRoute } from "next";

const SITE_URL = "https://josephmmwa.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/account", "/preview", "/preview/", "/api", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

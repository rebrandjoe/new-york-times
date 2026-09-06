import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uhkmgirkogzmnkkidcgm.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/editorial-policy", destination: "/editorial-standards", permanent: true },
      { source: "/corrections", destination: "/corrections-and-fact-checking", permanent: true },
      { source: "/fact-checking", destination: "/corrections-and-fact-checking", permanent: true },
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/subscribe", destination: "/premium", permanent: true },
      { source: "/latest/:slug", destination: "/article/:slug", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        // Force the browser to revalidate the service worker on every visit,
        // so a new deploy reaches returning users instead of an indefinitely
        // stale cached copy.
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
        ],
      },
    ];
  },
};

export default nextConfig;

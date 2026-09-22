import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(self)",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  // Admin media uploads send the file through a Server Action.
  // Next.js 16 reads this at the top level (experimental is ignored for this).
  serverActions: {
    bodySizeLimit: "10mb",
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
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
      { source: "/africa", destination: "/regions/africa", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
        ],
      },
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

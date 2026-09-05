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
};

export default nextConfig;

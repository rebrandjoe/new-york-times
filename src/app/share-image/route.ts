import { NextRequest, NextResponse } from "next/server";

/** Allowed origins for share-image proxy — prevents open-proxy abuse. */
const ALLOWED_HOSTS = new Set([
  "uhkmgirkogzmnkkidcgm.supabase.co",
]);

/**
 * Proxies public article media for social previews.
 *
 * Supabase Storage returns `x-robots-tag: none` on public objects, which
 * causes WhatsApp / Facebook / LinkedIn / X to refuse the image in link
 * previews. Serving the same bytes from josephmmwa.com avoids that header.
 *
 * Not under /api so robots.txt Disallow: /api does not block crawlers.
 */
export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("u");
  if (!raw) {
    return new NextResponse("Missing image URL", { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return new NextResponse("Invalid URL", { status: 400 });
  }

  if (target.protocol !== "https:" || !ALLOWED_HOSTS.has(target.hostname)) {
    return new NextResponse("Host not allowed", { status: 403 });
  }

  // Only public storage objects
  if (!target.pathname.includes("/storage/v1/object/public/")) {
    return new NextResponse("Path not allowed", { status: 403 });
  }

  try {
    const upstream = await fetch(target.toString(), {
      headers: { Accept: "image/*,*/*" },
      // Revalidate occasionally so CDN can cache
      next: { revalidate: 86400 },
    });

    if (!upstream.ok) {
      return new NextResponse("Upstream image error", { status: 502 });
    }

    const contentType = upstream.headers.get("content-type") || "image/jpeg";
    if (!contentType.startsWith("image/")) {
      return new NextResponse("Not an image", { status: 400 });
    }

    const body = await upstream.arrayBuffer();

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        // Explicitly allow indexing/crawling of the share asset
        "X-Robots-Tag": "all",
      },
    });
  } catch (err) {
    console.error("[share-image] proxy failed", err);
    return new NextResponse("Proxy error", { status: 502 });
  }
}

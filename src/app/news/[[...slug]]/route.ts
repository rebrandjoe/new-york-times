import { NextResponse } from "next/server";

/**
 * Legacy Lovable paths under /news/ no longer exist.
 * Return 410 Gone (permanent) so Google deindexes them faster than 404.
 * Do not redirect to homepage.
 */
export function GET() {
  return new NextResponse("Gone", {
    status: 410,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

export function HEAD() {
  return new NextResponse(null, {
    status: 410,
    headers: {
      "Cache-Control": "public, max-age=86400",
    },
  });
}

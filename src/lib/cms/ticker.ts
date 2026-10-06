import { createPublicClient as createClient } from "@/lib/supabase/public";

export type ActiveTicker = {
  headline: string;
  href: string | null;
};

/** Normalize admin-entered links to a safe site path or absolute https URL. */
export function normalizeTickerHref(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const value = raw.trim();
  if (!value) return null;

  if (value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }

  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    // Prefer relative path for our own domain so the app stays on-site.
    if (url.hostname === "josephmmwa.com" || url.hostname === "www.josephmmwa.com") {
      return `${url.pathname}${url.search}${url.hash}` || "/";
    }
    return url.toString();
  } catch {
    // Treat bare slugs as article paths.
    if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(value)) {
      return `/article/${value}`;
    }
    return null;
  }
}

export async function getActiveTicker(): Promise<ActiveTicker | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ticker_items")
    .select("headline, href")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data?.headline) return null;

  return {
    headline: data.headline,
    href: normalizeTickerHref((data as { href?: string | null }).href),
  };
}

/** @deprecated Prefer getActiveTicker() — kept for any remaining callers. */
export async function getActiveTickerHeadline(): Promise<string | null> {
  const ticker = await getActiveTicker();
  return ticker?.headline ?? null;
}

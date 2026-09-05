import { createPublicClient as createClient } from "@/lib/supabase/public";
import { ARTICLE_SELECT, mapRowToCmsArticle, type RawArticleRow } from "./mappers";
import type { CmsArticle, CmsAuthor, CmsCategory, CmsTopic } from "./types";

export type RegionSlugLike = "africa" | "kenya" | "global";

/** Published-now, or scheduled-and-due — matches the public RLS SELECT policy. */
function publicVisibilityFilter(): string {
  const now = new Date().toISOString();
  return `and(status.eq.published,publication_date.lte.${now}),and(status.eq.scheduled,scheduled_at.lte.${now})`;
}

export async function getPublishedArticles(options?: {
  categorySlug?: RegionSlugLike;
  topicSlug?: string;
  limit?: number;
  offset?: number;
}): Promise<CmsArticle[]> {
  const supabase = await createClient();
  let query = supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .or(publicVisibilityFilter())
    .order("publication_date", { ascending: false });

  if (options?.categorySlug) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", options.categorySlug)
      .single();
    if (category) query = query.eq("category_id", category.id);
  }

  if (options?.limit) query = query.limit(options.limit);
  if (options?.offset) query = query.range(options.offset, options.offset + (options.limit ?? 20) - 1);

  const { data, error } = await query;
  if (error || !data) return [];

  let articles = (data as unknown as RawArticleRow[]).map(mapRowToCmsArticle);

  if (options?.topicSlug) {
    articles = articles.filter((a) => a.topics.some((t) => t.slug === options.topicSlug));
  }

  return articles;
}

export async function getArticleBySlug(slug: string): Promise<CmsArticle | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("slug", slug)
    .or(publicVisibilityFilter())
    .maybeSingle();

  if (error || !data) return null;
  return mapRowToCmsArticle(data as unknown as RawArticleRow);
}

/**
 * Related-article ordering: topic match, then region/category match, then
 * recency as the final tiebreaker. Editorial significance has no numeric
 * signal in the schema yet, so it's approximated by recency for now.
 */
export async function getRelatedArticles(article: CmsArticle, limit = 4): Promise<CmsArticle[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .or(publicVisibilityFilter())
    .neq("id", article.id)
    .order("publication_date", { ascending: false })
    .limit(40);

  if (error || !data) return [];

  const candidates = (data as unknown as RawArticleRow[]).map(mapRowToCmsArticle);
  const topicSlugs = new Set(article.topics.map((t) => t.slug));

  const scored = candidates.map((candidate) => {
    const sharedTopics = candidate.topics.filter((t) => topicSlugs.has(t.slug)).length;
    const sameCategory = candidate.category.slug === article.category.slug ? 1 : 0;
    const sameCountry = candidate.country && candidate.country === article.country ? 1 : 0;
    return { candidate, score: sharedTopics * 100 + sameCategory * 10 + sameCountry };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.candidate);
}

export async function getCategories(): Promise<CmsCategory[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("id, name, slug").order("name");
  return data ?? [];
}

export async function getTopics(): Promise<CmsTopic[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("topics").select("id, name, slug").order("name");
  return data ?? [];
}

export async function getAuthors(): Promise<CmsAuthor[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("authors").select("id, name, slug, title").order("name");
  return data ?? [];
}

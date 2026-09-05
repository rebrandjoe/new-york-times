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

  // Topic filtering happens in memory below (no join-table filter at the
  // query level), so fetch a larger candidate pool first rather than
  // limiting before we know how many will actually match the topic.
  if (options?.topicSlug) {
    query = query.limit(200);
  } else {
    if (options?.limit) query = query.limit(options.limit);
    if (options?.offset) query = query.range(options.offset, options.offset + (options.limit ?? 20) - 1);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  let articles = (data as unknown as RawArticleRow[]).map(mapRowToCmsArticle);

  if (options?.topicSlug) {
    articles = articles.filter((a) => a.topics.some((t) => t.slug === options.topicSlug));
    if (options?.offset) articles = articles.slice(options.offset);
    if (options?.limit) articles = articles.slice(0, options.limit);
  }

  return articles;
}

/** Searches published-only content by headline, excerpt, topic, category,
 * and author name — never drafts or unpublished articles. */
export async function searchPublishedArticles(rawQuery: string): Promise<CmsArticle[]> {
  const query = rawQuery.trim();
  if (!query) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .or(publicVisibilityFilter())
    .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
    .order("publication_date", { ascending: false })
    .limit(50);

  if (error || !data) return [];

  const titleMatches = (data as unknown as RawArticleRow[]).map(mapRowToCmsArticle);
  const matchedIds = new Set(titleMatches.map((a) => a.id));

  const [categories, topics, authors] = await Promise.all([
    supabase.from("categories").select("id").ilike("name", `%${query}%`),
    supabase.from("topics").select("id").ilike("name", `%${query}%`),
    supabase.from("authors").select("id").ilike("name", `%${query}%`),
  ]);

  const extraFilters: string[] = [];
  for (const id of (categories.data ?? []).map((c) => c.id)) extraFilters.push(`category_id.eq.${id}`);
  for (const id of (authors.data ?? []).map((a) => a.id)) extraFilters.push(`author_id.eq.${id}`);

  let extraArticles: CmsArticle[] = [];
  if (extraFilters.length > 0) {
    const { data: extraData } = await supabase
      .from("articles")
      .select(ARTICLE_SELECT)
      .or(publicVisibilityFilter())
      .or(extraFilters.join(","))
      .order("publication_date", { ascending: false })
      .limit(50);
    extraArticles = (extraData as unknown as RawArticleRow[] | null)?.map(mapRowToCmsArticle) ?? [];
  }

  const topicIds = (topics.data ?? []).map((t) => t.id);
  let topicArticles: CmsArticle[] = [];
  if (topicIds.length > 0) {
    const { data: topicLinks } = await supabase
      .from("article_topics")
      .select("article_id")
      .in("topic_id", topicIds);
    const articleIds = [...new Set((topicLinks ?? []).map((l) => l.article_id))];
    if (articleIds.length > 0) {
      const { data: topicArticleData } = await supabase
        .from("articles")
        .select(ARTICLE_SELECT)
        .or(publicVisibilityFilter())
        .in("id", articleIds)
        .order("publication_date", { ascending: false })
        .limit(50);
      topicArticles = (topicArticleData as unknown as RawArticleRow[] | null)?.map(mapRowToCmsArticle) ?? [];
    }
  }

  const combined = [...titleMatches];
  for (const article of [...extraArticles, ...topicArticles]) {
    if (!matchedIds.has(article.id)) {
      matchedIds.add(article.id);
      combined.push(article);
    }
  }

  combined.sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
  return combined;
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

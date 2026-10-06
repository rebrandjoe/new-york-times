import { createPublicClient as createClient } from "@/lib/supabase/public";
import { ARTICLE_SELECT, mapRowToCmsArticle, type RawArticleRow } from "./mappers";
import type { CmsArticle, CmsAuthor, CmsCategory, CmsTopic } from "./types";

export type RegionSlugLike = "kenya" | "global";

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
    // Fully automatic: sorted purely by recency, no manual pin. Multiple
    // articles can share the same publication_date to the minute (or, for
    // older articles saved with the old date-only picker, the same
    // midnight timestamp) — created_at breaks the tie so the most recently
    // published article always sorts first.
    .order("publication_date", { ascending: false })
    .order("created_at", { ascending: false });

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
    .order("created_at", { ascending: false })
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
      .order("created_at", { ascending: false })
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
        .order("created_at", { ascending: false })
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

// ---------------------------------------------------------------------------
// Related Stories — editorial ranking (region + topic family + significance + recency)
// Only this function’s ranking logic is intentional product behaviour change.
// ---------------------------------------------------------------------------

/** Sub-regional country groups derived from standard African geography. */
const SUBREGIONS: Record<string, readonly string[]> = {
  "east-africa": [
    "Kenya",
    "Uganda",
    "Tanzania",
    "Rwanda",
    "Burundi",
    "South Sudan",
    "Ethiopia",
    "Somalia",
    "Djibouti",
    "Eritrea",
  ],
  "west-africa": [
    "Nigeria",
    "Ghana",
    "Senegal",
    "Ivory Coast",
    "Mali",
    "Niger",
    "Guinea",
    "Sierra Leone",
    "Liberia",
    "Benin",
    "Togo",
    "Burkina Faso",
    "Gambia",
    "Guinea-Bissau",
    "Cabo Verde",
  ],
  "southern-africa": [
    "South Africa",
    "Zimbabwe",
    "Zambia",
    "Botswana",
    "Namibia",
    "Malawi",
    "Mozambique",
    "Lesotho",
    "Eswatini",
    "Angola",
  ],
  "central-africa": [
    "DR Congo",
    "Congo",
    "Cameroon",
    "Chad",
    "Central African Republic",
    "Gabon",
    "Equatorial Guinea",
    "Sao Tome and Principe",
  ],
  "north-africa": ["Egypt", "Morocco", "Tunisia", "Algeria", "Libya", "Sudan"],
};

/**
 * Broader health-topic families from existing site topic slugs.
 * Same-family articles are related without requiring the same disease name.
 */
const TOPIC_FAMILIES: readonly (readonly string[])[] = [
  [
    "disease-outbreaks-epidemics",
    "diseases-conditions",
    "infectious-diseases",
    "vaccines-immunization",
    "public-health",
    "hiv-aids",
  ],
  ["cancer", "treatments-medicines", "medical-research", "diseases-conditions"],
  ["maternal-child-health", "nutrition", "public-health", "health-policy-systems"],
  ["mental-health", "public-health", "health-policy-systems"],
  [
    "medical-innovation-technology",
    "ai-in-healthcare-and-telemedicine",
    "medical-research",
    "treatments-medicines",
  ],
  ["health-policy-systems", "public-health", "health-environment"],
  ["health-environment", "public-health", "nutrition"],
];

const SIGNIFICANCE_PATTERNS: readonly RegExp[] = [
  /\boutbreak\b/i,
  /\bepidemic\b/i,
  /\bpandemic\b/i,
  /\bdeaths?\b/i,
  /\bfatalit/i,
  /\bemergency\b/i,
  /\bWHO\b/,
  /\bAfrica CDC\b/i,
  /\bvaccine\b/i,
  /\bsurveillance\b/i,
  /\bconfirm(s|ed)?\b/i,
  /\bfirst case\b/i,
  /\bpublic.?health\b/i,
];

function normalizeGeo(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function subregionOf(country: string | null | undefined): string | null {
  if (!country) return null;
  const c = country.trim();
  for (const [key, members] of Object.entries(SUBREGIONS)) {
    if (members.some((m) => m.toLowerCase() === c.toLowerCase())) return key;
  }
  return null;
}

function topicFamilyIds(slugs: Set<string>): Set<number> {
  const ids = new Set<number>();
  TOPIC_FAMILIES.forEach((family, index) => {
    if (family.some((s) => slugs.has(s))) ids.add(index);
  });
  return ids;
}

function significanceBoost(text: string): number {
  let boost = 0;
  for (const pattern of SIGNIFICANCE_PATTERNS) {
    if (pattern.test(text)) boost += 6;
  }
  return Math.min(boost, 24);
}

function daysSince(iso: string): number {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return 365;
  return Math.max(0, (Date.now() - t) / (1000 * 60 * 60 * 24));
}

function scoreRelatedCandidate(source: CmsArticle, candidate: CmsArticle): number {
  let score = 0;

  // Level 1 — same country
  if (source.country && candidate.country && source.country === candidate.country) {
    score += 55;
  }

  // Level 2 — same sub-region (e.g. East Africa)
  const srcSub = subregionOf(source.country);
  const candSub = subregionOf(candidate.country);
  if (srcSub && candSub && srcSub === candSub && source.country !== candidate.country) {
    score += 32;
  }

  // Level 3 — same continental / free-text region field
  const srcRegion = normalizeGeo(source.region);
  const candRegion = normalizeGeo(candidate.region);
  if (srcRegion && candRegion && srcRegion === candRegion) {
    score += 18;
  } else if (
    srcRegion &&
    candRegion &&
    (srcRegion.includes("africa") || candRegion.includes("africa")) &&
    (srcRegion.includes("africa") && candRegion.includes("africa"))
  ) {
    score += 14;
  }

  // Editorial category tabs (Kenya / Africa / Global)
  if (
    source.category &&
    candidate.category &&
    source.category.slug === candidate.category.slug
  ) {
    score += 8;
  }

  // Topic: exact shared topics (strong but not exclusive)
  const sourceTopics = new Set(source.topics.map((t) => t.slug));
  const candidateTopics = candidate.topics.map((t) => t.slug);
  const sharedExact = candidateTopics.filter((s) => sourceTopics.has(s)).length;
  score += sharedExact * 28;

  // Topic families: e.g. outbreaks ↔ infectious disease ↔ vaccines
  const sourceFamilies = topicFamilyIds(sourceTopics);
  const candidateFamilies = topicFamilyIds(new Set(candidateTopics));
  let familyHits = 0;
  for (const id of sourceFamilies) {
    if (candidateFamilies.has(id)) familyHits += 1;
  }
  score += familyHits * 22;

  // Editorial significance from existing title/excerpt wording (no new DB fields)
  const sourceText = `${source.title} ${source.excerpt ?? ""}`;
  const candidateText = `${candidate.title} ${candidate.excerpt ?? ""}`;
  if (significanceBoost(sourceText) > 0) {
    score += significanceBoost(candidateText);
  } else {
    score += Math.floor(significanceBoost(candidateText) / 2);
  }

  // Recency: meaningful but secondary to geography/topic
  const age = daysSince(candidate.publicationDate);
  if (age <= 2) score += 20;
  else if (age <= 7) score += 14;
  else if (age <= 30) score += 8;
  else if (age <= 90) score += 3;

  return score;
}

/**
 * Prefer a balanced set: avoid filling every slot with the same exact topic
 * when higher-scoring alternatives from other relevant families exist.
 */
function diversifyRelated(
  ranked: { candidate: CmsArticle; score: number }[],
  limit: number
): CmsArticle[] {
  const picked: CmsArticle[] = [];
  const usedIds = new Set<string>();
  const topicCounts = new Map<string, number>();

  const primaryTopic = (a: CmsArticle) => a.topics[0]?.slug ?? "_none";

  for (const { candidate, score } of ranked) {
    if (picked.length >= limit) break;
    if (score < 8) continue; // weak matches: prefer empty slot over noise
    if (usedIds.has(candidate.id)) continue;

    const key = primaryTopic(candidate);
    const count = topicCounts.get(key) ?? 0;
    // Cap near-identical topic dominance (e.g. five Ebola-only stories)
    if (count >= 2 && picked.length + 1 < limit) {
      continue;
    }

    picked.push(candidate);
    usedIds.add(candidate.id);
    topicCounts.set(key, count + 1);
  }

  // Second pass: fill remaining slots with next-best scores if still short
  if (picked.length < limit) {
    for (const { candidate, score } of ranked) {
      if (picked.length >= limit) break;
      if (score < 5) continue;
      if (usedIds.has(candidate.id)) continue;
      picked.push(candidate);
      usedIds.add(candidate.id);
    }
  }

  return picked;
}

/**
 * Related Stories: ranks published candidates by country → sub-region →
 * continent → topic family → editorial significance signals → recency.
 * Does not require the same disease; uses existing article fields only.
 */
export async function getRelatedArticles(article: CmsArticle, limit = 4): Promise<CmsArticle[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .or(publicVisibilityFilter())
    .neq("id", article.id)
    .order("publication_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(60);

  if (error || !data) return [];

  const candidates = (data as unknown as RawArticleRow[]).map(mapRowToCmsArticle);

  const scored = candidates.map((candidate) => ({
    candidate,
    score: scoreRelatedCandidate(article, candidate),
  }));

  scored.sort((a, b) => b.score - a.score || daysSince(a.candidate.publicationDate) - daysSince(b.candidate.publicationDate));

  return diversifyRelated(scored, limit);
}

/**
 * Fetches articles by geographic region (Africa, Asia, Europe, North America,
 * South America, Oceania) — matched against the free-text `region` column.
 * This is distinct from `categorySlug` above, which filters by the
 * Kenya/Africa/Global editorial category tabs; a single article can belong
 * to one category ("Africa" tab) while its `region` column also reads
 * "Africa" for geographic browsing. Both are correct at once, by design.
 */
export async function getArticlesByRegion(regionName: string, limit = 100): Promise<CmsArticle[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .or(publicVisibilityFilter())
    .ilike("region", regionName)
    .order("publication_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return (data as unknown as RawArticleRow[]).map(mapRowToCmsArticle);
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

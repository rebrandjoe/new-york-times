import type { SupabaseClient } from "@supabase/supabase-js";
import { ARTICLE_SELECT, mapRowToCmsArticle, type RawArticleRow } from "./mappers";
import type { ArticleListItem, ArticleStatus, CmsArticle } from "./types";

const LIST_SELECT = `
  id, slug, title, status, publication_date, updated_at,
  category:categories!articles_category_id_fkey(id, name, slug),
  author:authors!articles_author_id_fkey(id, name, slug, title)
`;

interface RawListRow {
  id: string;
  slug: string;
  title: string;
  status: string;
  publication_date: string;
  updated_at: string;
  category: { id: string; name: string; slug: string } | null;
  author: { id: string; name: string; slug: string; title: string } | null;
}

export interface AdminArticleFilters {
  status?: ArticleStatus;
  categoryId?: string;
  topicId?: string;
  search?: string;
  sort?: "publication_date" | "updated_at" | "title";
  sortDirection?: "asc" | "desc";
}

export async function getAdminArticles(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>,
  filters: AdminArticleFilters = {}
): Promise<ArticleListItem[]> {
  let query = supabase.from("articles").select(LIST_SELECT);

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.categoryId) query = query.eq("category_id", filters.categoryId);
  if (filters.search) query = query.ilike("title", `%${filters.search}%`);

  const sortColumn = filters.sort ?? "updated_at";
  query = query.order(sortColumn, { ascending: filters.sortDirection === "asc" });

  const { data, error } = await query;
  if (error || !data) return [];

  let rows = data as unknown as RawListRow[];

  if (filters.topicId) {
    const { data: topicLinks } = await supabase
      .from("article_topics")
      .select("article_id")
      .eq("topic_id", filters.topicId);
    const ids = new Set((topicLinks ?? []).map((t: { article_id: string }) => t.article_id));
    rows = rows.filter((r) => ids.has(r.id));
  }

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    status: row.status as ArticleStatus,
    category: row.category ?? { id: "", name: "—", slug: "" },
    author: row.author ?? { id: "", name: "Joseph Mmwa", slug: "joseph-mmwa", title: "" },
    publicationDate: row.publication_date,
    updatedAt: row.updated_at,
  }));
}

export interface DashboardCounts {
  published: number;
  drafts: number;
  scheduled: number;
}

export async function getDashboardCounts(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>
): Promise<DashboardCounts> {
  const [published, drafts, scheduled] = await Promise.all([
    supabase.from("articles").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("articles").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("articles").select("id", { count: "exact", head: true }).eq("status", "scheduled"),
  ]);

  return {
    published: published.count ?? 0,
    drafts: drafts.count ?? 0,
    scheduled: scheduled.count ?? 0,
  };
}

export async function getRecentArticles(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>,
  limit = 5
): Promise<ArticleListItem[]> {
  return getAdminArticles(supabase, { sort: "updated_at", sortDirection: "desc" }).then((rows) =>
    rows.slice(0, limit)
  );
}

export async function getArticleForEdit(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>,
  id: string
): Promise<CmsArticle | null> {
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return mapRowToCmsArticle(data as unknown as RawArticleRow);
}

export async function getArticleTopicIds(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>,
  articleId: string
): Promise<string[]> {
  const { data } = await supabase.from("article_topics").select("topic_id").eq("article_id", articleId);
  return (data ?? []).map((r: { topic_id: string }) => r.topic_id);
}

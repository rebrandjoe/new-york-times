"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, logAdminAction } from "@/lib/cms/admin-guard";
import { getArticleForEdit, getAdminArticles } from "@/lib/cms/admin-queries";
import { estimateReadTimeMinutes, type ContentBlock } from "@/lib/cms/blocks";
import { ARTICLE_SELECT, mapRowToCmsArticle, type RawArticleRow } from "@/lib/cms/mappers";
import { sendNewArticlePush } from "@/lib/push/send";
import type { Json } from "@/lib/supabase/database.types";

// Content blocks are a closed set of interfaces, not an index-signature type,
// so they don't structurally satisfy Json — but they're always plain
// JSON-serializable data, so this cast is safe.
function toJson(blocks: ContentBlock[]): Json {
  return blocks as unknown as Json;
}

/** Category is no longer an editor choice — it's derived automatically from
 * the article's country, the way the site's Kenya/Global sections are
 * actually meant to work: Kenya-specific stories vs. everything else.
 * Falls back to Global if, for any reason, neither category row exists
 * (shouldn't happen — both are seeded — but this keeps article creation
 * from hard-failing on a missing lookup). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function resolveCategoryId(supabase: any, country: string | null): Promise<string> {
  const slug = country?.trim().toLowerCase() === "kenya" ? "kenya" : "global";
  const { data } = await supabase.from("categories").select("id").eq("slug", slug).single();
  if (data?.id) return data.id;
  const fallback = await supabase.from("categories").select("id").eq("slug", "global").single();
  return fallback.data.id;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function uniqueSlug(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  base: string,
  excludeId?: string
): Promise<string> {
  let slug = slugify(base) || "article";
  let suffix = 1;
  for (;;) {
    let query = supabase.from("articles").select("id").eq("slug", slug);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.maybeSingle();
    if (!data) return slug;
    suffix += 1;
    slug = `${slugify(base)}-${suffix}`;
  }
}

interface ArticleInput {
  title: string;
  slug?: string;
  excerpt: string;
  body: ContentBlock[];
  featuredImageId: string | null;
  topicIds: string[];
  region: string | null;
  country: string | null;
  authorId: string;
  publicationDate: string;
  readTimeMinutes: number | null;
  premium: boolean;
  correctionNote: string | null;
  sourceName: string | null;
  sourceAuthor: string | null;
  sourceInstitution: string | null;
  sourceUrl: string | null;
  sourcePublishedAt: string | null;
  sourceAdditional: string | null;
}

async function saveTopics(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  articleId: string,
  topicIds: string[]
) {
  await supabase.from("article_topics").delete().eq("article_id", articleId);
  if (topicIds.length > 0) {
    await supabase
      .from("article_topics")
      .insert(topicIds.map((topic_id) => ({ article_id: articleId, topic_id })));
  }
}

export async function createArticle(input: ArticleInput): Promise<{ id: string } | { error: string }> {
  const { supabase, user } = await requireAdmin();

  const slug = await uniqueSlug(supabase, input.slug || input.title);
  const readTime = input.readTimeMinutes ?? estimateReadTimeMinutes(input.body);

  const { data, error } = await supabase
    .from("articles")
    .insert({
      title: input.title,
      slug,
      excerpt: input.excerpt || null,
      body: toJson(input.body),
      featured_image_id: input.featuredImageId,
      category_id: await resolveCategoryId(supabase, input.country),
      region: input.region,
      country: input.country,
      author_id: input.authorId,
      publication_date: input.publicationDate,
      read_time_minutes: readTime,
      status: "draft",
      premium: input.premium,
      correction_note: input.correctionNote,
      source_name: input.sourceName,
      source_author: input.sourceAuthor,
      source_institution: input.sourceInstitution,
      source_url: input.sourceUrl,
      source_published_at: input.sourcePublishedAt,
      source_additional: input.sourceAdditional,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !data) return { error: error?.message ?? "Could not create article." };

  await saveTopics(supabase, data.id, input.topicIds);
  revalidatePath("/admin/articles");
  return { id: data.id };
}

async function snapshotRevision(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  articleId: string,
  userId: string
) {
  const { data } = await supabase.from("articles").select(ARTICLE_SELECT).eq("id", articleId).maybeSingle();
  if (data) {
    await supabase.from("article_revisions").insert({
      article_id: articleId,
      snapshot: mapRowToCmsArticle(data as unknown as RawArticleRow),
      edited_by: userId,
    });
  }
}

export async function updateArticle(
  articleId: string,
  input: ArticleInput,
  options: { snapshotRevisionFirst?: boolean } = {}
): Promise<{ ok: true } | { error: string }> {
  const { supabase, user } = await requireAdmin();

  if (options.snapshotRevisionFirst) {
    await snapshotRevision(supabase, articleId, user.id);
  }

  const slug = await uniqueSlug(supabase, input.slug || input.title, articleId);
  const readTime = input.readTimeMinutes ?? estimateReadTimeMinutes(input.body);

  const { error } = await supabase
    .from("articles")
    .update({
      title: input.title,
      slug,
      excerpt: input.excerpt || null,
      body: toJson(input.body),
      featured_image_id: input.featuredImageId,
      category_id: await resolveCategoryId(supabase, input.country),
      region: input.region,
      country: input.country,
      author_id: input.authorId,
      publication_date: input.publicationDate,
      read_time_minutes: readTime,
      premium: input.premium,
      correction_note: input.correctionNote,
      source_name: input.sourceName,
      source_author: input.sourceAuthor,
      source_institution: input.sourceInstitution,
      source_url: input.sourceUrl,
      source_published_at: input.sourcePublishedAt,
      source_additional: input.sourceAdditional,
      updated_at: new Date().toISOString(),
    })
    .eq("id", articleId);

  if (error) return { error: error.message };

  await saveTopics(supabase, articleId, input.topicIds);
  revalidatePath("/admin/articles");
  revalidatePath(`/admin/articles/${articleId}`);
  return { ok: true };
}

export async function setArticleStatus(
  articleId: string,
  status: "draft" | "scheduled" | "published" | "unpublished",
  scheduledAt?: string | null
): Promise<{ ok: true } | { error: string }> {
  const { supabase, user } = await requireAdmin();

  const { error } = await supabase
    .from("articles")
    .update({
      status,
      scheduled_at: status === "scheduled" ? scheduledAt : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", articleId);

  if (error) return { error: error.message };

  await logAdminAction(supabase, user.email!, "set_article_status", "articles", articleId, { status });

  if (status === "published") {
    // Fire-and-forget: never let a push-sending problem block or fail the
    // publish action itself — every individual send failure is already
    // caught inside sendNewArticlePush, this just guards the lookup above it.
    try {
      const { data: article } = await supabase
        .from("articles")
        .select("title, slug")
        .eq("id", articleId)
        .single();
      if (article) await sendNewArticlePush(article);
    } catch (err) {
      console.error("[push] failed to send new-article notification:", err);
    }
  }

  revalidatePath("/admin/articles");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteArticle(articleId: string): Promise<{ ok: true } | { error: string }> {
  const { supabase, user } = await requireAdmin();
  const { error } = await supabase.from("articles").delete().eq("id", articleId);
  if (error) return { error: error.message };
  await logAdminAction(supabase, user.email!, "delete_article", "articles", articleId);
  revalidatePath("/admin/articles");
  return { ok: true };
}

export async function duplicateArticle(articleId: string): Promise<{ id: string } | { error: string }> {
  const { supabase, user } = await requireAdmin();
  const original = await getArticleForEdit(supabase, articleId);
  if (!original) return { error: "Article not found." };

  const slug = await uniqueSlug(supabase, `${original.title}-copy`);

  const { data, error } = await supabase
    .from("articles")
    .insert({
      title: `${original.title} (Copy)`,
      slug,
      excerpt: original.excerpt,
      body: toJson(original.body as ContentBlock[]),
      featured_image_id: original.featuredImage?.id ?? null,
      category_id: await resolveCategoryId(supabase, original.country),
      region: original.region,
      country: original.country,
      author_id: original.author.id,
      publication_date: new Date().toISOString(),
      read_time_minutes: original.readTimeMinutes,
      status: "draft",
      premium: original.premium,
      source_name: original.source.name,
      source_author: original.source.author,
      source_institution: original.source.institution,
      source_url: original.source.url,
      source_published_at: original.source.publishedAt,
      source_additional: original.source.additional,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !data) return { error: error?.message ?? "Could not duplicate article." };

  await saveTopics(
    supabase,
    data.id,
    original.topics.map((t) => t.id)
  );
  revalidatePath("/admin/articles");
  return { id: data.id };
}

export async function deleteArticleAndRedirect(articleId: string) {
  await deleteArticle(articleId);
  redirect("/admin/articles");
}

/** Used by the article body editor's "link to another article" search —
 * only searches published articles, so an internal link never points at a
 * draft a reader can't actually see. */
export async function searchArticlesForLinking(
  query: string,
  excludeId?: string
): Promise<{ id: string; title: string; slug: string }[]> {
  const { supabase } = await requireAdmin();
  if (!query.trim()) return [];

  const rows = await getAdminArticles(supabase, {
    status: "published",
    search: query.trim(),
    sort: "publication_date",
    sortDirection: "desc",
  });

  return rows
    .filter((r) => r.id !== excludeId)
    .slice(0, 8)
    .map((r) => ({ id: r.id, title: r.title, slug: r.slug }));
}

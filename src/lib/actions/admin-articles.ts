"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, logAdminAction } from "@/lib/cms/admin-guard";
import { getArticleForEdit, getAdminArticles } from "@/lib/cms/admin-queries";
import { estimateReadTimeMinutes, type ContentBlock } from "@/lib/cms/blocks";
import {
  classifyMedicalDisclaimerRelevance,
  parseMedicalDisclaimerMode,
  type MedicalDisclaimerMode,
} from "@/lib/cms/medical-disclaimer";
import { ARTICLE_SELECT, mapRowToCmsArticle, serializeArticleSources, type RawArticleRow } from "@/lib/cms/mappers";
import type { ArticleSource } from "@/lib/cms/types";
import { sendNewArticlePush } from "@/lib/push/send";
import type { Json } from "@/lib/supabase/database.types";

function toJson(blocks: ContentBlock[]): Json {
  return blocks as unknown as Json;
}

async function resolveCategoryId(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  country: string | null,
  isGlobalStory: boolean
): Promise<string | null> {
  const isKenya = country?.trim().toLowerCase() === "kenya";
  if (!isKenya && !isGlobalStory) return null;

  const slug = isKenya ? "kenya" : "global";
  const { data } = await supabase.from("categories").select("id").eq("slug", slug).single();
  return data?.id ?? null;
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
  seoDescription?: string | null;
  body: ContentBlock[];
  featuredImageId: string | null;
  topicIds: string[];
  region: string | null;
  country: string | null;
  isGlobalStory: boolean;
  authorId: string;
  publicationDate: string;
  readTimeMinutes: number | null;
  premium: boolean;
  correctionNote: string | null;
  /** auto | show | hide — article-level medical disclaimer control. */
  medicalDisclaimerMode?: MedicalDisclaimerMode;
  sources: ArticleSource[];
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
  const medicalMode = parseMedicalDisclaimerMode(input.medicalDisclaimerMode ?? "auto");

  const { data, error } = await supabase
    .from("articles")
    .insert({
      title: input.title,
      slug,
      excerpt: input.excerpt || null,
      seo_description: input.seoDescription?.trim() || null,
      body: toJson(input.body),
      featured_image_id: input.featuredImageId,
      category_id: await resolveCategoryId(supabase, input.country, input.isGlobalStory),
      region: input.region,
      country: input.country,
      author_id: input.authorId,
      publication_date: input.publicationDate,
      read_time_minutes: readTime,
      status: "draft",
      premium: input.premium,
      correction_note: input.correctionNote,
      medical_disclaimer_mode: medicalMode,
      ...serializeArticleSources(input.sources ?? []),
      source_published_at: null,
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
  const medicalMode = parseMedicalDisclaimerMode(input.medicalDisclaimerMode ?? "auto");

  const { error } = await supabase
    .from("articles")
    .update({
      title: input.title,
      slug,
      excerpt: input.excerpt || null,
      seo_description: input.seoDescription?.trim() || null,
      body: toJson(input.body),
      featured_image_id: input.featuredImageId,
      category_id: await resolveCategoryId(supabase, input.country, input.isGlobalStory),
      region: input.region,
      country: input.country,
      author_id: input.authorId,
      publication_date: input.publicationDate,
      read_time_minutes: readTime,
      premium: input.premium,
      correction_note: input.correctionNote,
      medical_disclaimer_mode: medicalMode,
      ...serializeArticleSources(input.sources ?? []),
      source_published_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", articleId);

  if (error) return { error: error.message };

  await saveTopics(supabase, articleId, input.topicIds);
  revalidatePath("/admin/articles");
  revalidatePath(`/admin/articles/${articleId}`);
  revalidatePath(`/article/${slug}`);
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
      seo_description: original.seoDescription,
      body: toJson(original.body as ContentBlock[]),
      featured_image_id: original.featuredImage?.id ?? null,
      category_id: await resolveCategoryId(supabase, original.country, original.category?.slug === "global"),
      region: original.region,
      country: original.country,
      author_id: original.author.id,
      publication_date: new Date().toISOString(),
      read_time_minutes: original.readTimeMinutes,
      status: "draft",
      premium: original.premium,
      medical_disclaimer_mode: original.medicalDisclaimerMode ?? "auto",
      ...serializeArticleSources(original.sources ?? []),
      source_published_at: null,
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

export type MedicalDisclaimerPreviewRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  currentMode: MedicalDisclaimerMode;
  suggested: "show" | "hide";
  reason: string;
  uncertain: boolean;
};

/** Preview auto-classification for existing articles (no writes). */
export async function previewMedicalDisclaimerClassifications(): Promise<
  | { rows: MedicalDisclaimerPreviewRow[] }
  | { error: string }
> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("articles").select(ARTICLE_SELECT).order("publication_date", {
    ascending: false,
  });

  if (error) return { error: error.message };

  const rows: MedicalDisclaimerPreviewRow[] = (data ?? []).map((raw) => {
    const article = mapRowToCmsArticle(raw as unknown as RawArticleRow);
    const classification = classifyMedicalDisclaimerRelevance({
      title: article.title,
      excerpt: article.excerpt,
      body: article.body,
      topicNames: article.topics.map((t) => t.name),
    });
    return {
      id: article.id,
      title: article.title,
      slug: article.slug,
      status: article.status,
      currentMode: article.medicalDisclaimerMode,
      suggested: classification.suggested,
      reason: classification.reason,
      uncertain: classification.uncertain,
    };
  });

  return { rows };
}

/**
 * Apply classifications as explicit show/hide modes for rows still on "auto".
 * Does not overwrite manual show/hide overrides unless forceAll is true.
 */
export async function applyMedicalDisclaimerClassifications(options?: {
  forceAll?: boolean;
}): Promise<{ updated: number } | { error: string }> {
  const { supabase, user } = await requireAdmin();
  const preview = await previewMedicalDisclaimerClassifications();
  if ("error" in preview) return preview;

  let updated = 0;
  for (const row of preview.rows) {
    if (!options?.forceAll && row.currentMode !== "auto") continue;
    const mode: MedicalDisclaimerMode = row.suggested;
    const { error } = await supabase
      .from("articles")
      .update({ medical_disclaimer_mode: mode, updated_at: new Date().toISOString() })
      .eq("id", row.id);
    if (!error) updated += 1;
  }

  await logAdminAction(supabase, user.email!, "apply_medical_disclaimer_modes", "articles", null, {
    updated,
    forceAll: !!options?.forceAll,
  });
  revalidatePath("/admin/articles");
  revalidatePath("/");
  return { updated };
}

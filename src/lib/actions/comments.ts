"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, logAdminAction } from "@/lib/cms/admin-guard";
import type { CommentFormState } from "./form-state";

export interface CommentRow {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
  isOwn: boolean;
}

export async function getComments(articleId: string): Promise<CommentRow[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("comments")
    .select("id, author_name, body, created_at, user_id, status")
    .eq("article_id", articleId)
    .order("created_at", { ascending: false });

  return (data ?? [])
    .filter((row) => row.status === "visible" || row.user_id === user?.id)
    .map((row) => ({
      id: row.id,
      authorName: row.author_name,
      body: row.body,
      createdAt: row.created_at,
      isOwn: row.user_id === user?.id,
    }));
}

export async function postComment(
  articleId: string,
  articlePath: string,
  _prevState: CommentFormState,
  formData: FormData
): Promise<CommentFormState> {
  const body = String(formData.get("body") ?? "").trim();

  if (!body) {
    return { status: "error", message: "Please write something before posting." };
  }
  if (body.length > 2000) {
    return { status: "error", message: "Comments are limited to 2000 characters." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "auth_required" };
  }

  // Basic abuse throttle: one comment per user every 15 seconds.
  const { data: recent } = await supabase
    .from("comments")
    .select("id")
    .eq("user_id", user.id)
    .gte("created_at", new Date(Date.now() - 15_000).toISOString())
    .limit(1)
    .maybeSingle();

  if (recent) {
    return { status: "error", message: "You're posting too quickly. Please wait a moment and try again." };
  }

  const authorName =
    (user.user_metadata?.full_name as string | undefined)?.trim() || user.email?.split("@")[0] || "Reader";

  const { error } = await supabase.from("comments").insert({
    article_id: articleId,
    user_id: user.id,
    author_name: authorName,
    body,
  });

  if (error) {
    return { status: "error", message: "Could not post your comment. Please try again." };
  }

  revalidatePath(articlePath);
  return { status: "success" };
}

export async function hideComment(commentId: string, articlePath: string) {
  const { supabase, user } = await requireAdmin();
  await supabase.from("comments").update({ status: "hidden" }).eq("id", commentId);
  await logAdminAction(supabase, user.email!, "hide_comment", "comments", commentId);
  revalidatePath(articlePath);
  revalidatePath("/admin/comments");
}

export async function unhideComment(commentId: string, articlePath: string) {
  const { supabase, user } = await requireAdmin();
  await supabase.from("comments").update({ status: "visible" }).eq("id", commentId);
  await logAdminAction(supabase, user.email!, "unhide_comment", "comments", commentId);
  revalidatePath(articlePath);
  revalidatePath("/admin/comments");
}

export async function deleteComment(commentId: string, articlePath: string) {
  const { supabase, user } = await requireAdmin();
  await supabase.from("comments").delete().eq("id", commentId);
  await logAdminAction(supabase, user.email!, "delete_comment", "comments", commentId);
  revalidatePath(articlePath);
  revalidatePath("/admin/comments");
}

export interface AdminCommentRow extends CommentRow {
  articleId: string;
  articleTitle: string;
  articleSlug: string;
  status: "visible" | "hidden";
}

export async function getAllCommentsForAdmin(): Promise<AdminCommentRow[]> {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("comments")
    .select("id, author_name, body, created_at, status, article:articles(id, title, slug)")
    .order("created_at", { ascending: false });

  return (data ?? []).map((row) => {
    const article = row.article as unknown as { id: string; title: string; slug: string } | null;
    return {
      id: row.id,
      authorName: row.author_name,
      body: row.body,
      createdAt: row.created_at,
      isOwn: false,
      status: row.status as "visible" | "hidden",
      articleId: article?.id ?? "",
      articleTitle: article?.title ?? "Untitled",
      articleSlug: article?.slug ?? "",
    };
  });
}

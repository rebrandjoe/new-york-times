"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/cms/admin-guard";
import type { CmsMedia } from "@/lib/cms/types";
import type { MediaFormState } from "./form-state";

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_PREFIXES = ["image/", "video/"];

export async function uploadMedia(
  _prevState: MediaFormState,
  formData: FormData
): Promise<MediaFormState> {
  try {
    const { supabase } = await requireAdmin();

    const file = formData.get("file") as File | null;
    const altText = String(formData.get("altText") ?? "").trim();
    const caption = String(formData.get("caption") ?? "").trim();
    const credit = String(formData.get("credit") ?? "").trim();
    const source = String(formData.get("source") ?? "").trim();

    if (!file || file.size === 0) {
      return { status: "error", message: "Please choose a file to upload." };
    }
    if (!altText) {
      return { status: "error", message: "Alt text is required for accessibility." };
    }
    if (file.size > MAX_FILE_BYTES) {
      return { status: "error", message: "File is too large — the limit is 10MB." };
    }
    if (!ACCEPTED_PREFIXES.some((p) => file.type.startsWith(p))) {
      return { status: "error", message: "Unsupported file type — use an image or video." };
    }

    const type = file.type.startsWith("video/") ? "video" : "image";
    const extension = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = `${type}s/${randomUUID()}.${extension || "bin"}`;

    const { error: uploadError } = await supabase.storage.from("article-media").upload(path, file, {
      contentType: file.type || undefined,
      upsert: false,
    });

    if (uploadError) {
      console.error("[admin-media] storage upload failed", uploadError.message);
      return {
        status: "error",
        message: `Upload failed: ${uploadError.message}. Check the article-media bucket policies and that you are signed in as admin.`,
      };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("article-media").getPublicUrl(path);

    const { data: inserted, error: insertError } = await supabase
      .from("media")
      .insert({
        type,
        url: publicUrl,
        alt_text: altText,
        caption: caption || null,
        credit: credit || null,
        source: source || null,
      })
      .select("id, type, url, alt_text, caption, credit, source, link_url")
      .single();

    if (insertError || !inserted) {
      console.error("[admin-media] media row insert failed", insertError?.message);
      return {
        status: "error",
        message: insertError?.message
          ? `File uploaded but library record failed: ${insertError.message}`
          : "Saved the file but could not record it in the library.",
      };
    }

    revalidatePath("/admin/media");
    return {
      status: "success",
      message: "Uploaded to the media library.",
      media: {
        id: inserted.id,
        type: inserted.type === "video" ? "video" : "image",
        url: inserted.url,
        altText: inserted.alt_text,
        caption: inserted.caption,
        credit: inserted.credit,
        source: inserted.source,
        linkUrl: inserted.link_url,
      },
    };
  } catch (err) {
    console.error("[admin-media] unexpected upload error", err);
    const hint = err instanceof Error ? err.message : "unknown error";
    // requireAdmin() redirect throws NEXT_REDIRECT — surface a clear auth message
    if (hint.includes("NEXT_REDIRECT") || hint.includes("NEXT_HTTP_ERROR_FALLBACK")) {
      return { status: "error", message: "Your session expired. Sign in again, then retry the upload." };
    }
    return {
      status: "error",
      message: `Upload failed (${hint}). Try a smaller JPEG/PNG under 10MB, or refresh and sign in again.`,
    };
  }
}

export async function listMedia(): Promise<CmsMedia[]> {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("media")
    .select("id, type, url, alt_text, caption, credit, source, link_url")
    .order("created_at", { ascending: false });

  return (data ?? []).map((row) => ({
    id: row.id,
    type: row.type === "video" ? "video" : "image",
    url: row.url,
    altText: row.alt_text,
    caption: row.caption,
    credit: row.credit,
    source: row.source,
    linkUrl: row.link_url,
  }));
}

export async function deleteMedia(mediaId: string): Promise<{ ok: true } | { error: string }> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("media").delete().eq("id", mediaId);
  if (error) {
    return {
      error: "Could not delete — this file may still be used by an article.",
    };
  }
  revalidatePath("/admin/media");
  return { ok: true };
}

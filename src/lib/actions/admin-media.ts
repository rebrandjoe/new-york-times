"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/cms/admin-guard";
import type { CmsMedia } from "@/lib/cms/types";
import type { MediaFormState } from "./form-state";

export async function uploadMedia(
  _prevState: MediaFormState,
  formData: FormData
): Promise<MediaFormState> {
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

  const type = file.type.startsWith("video/") ? "video" : "image";
  const extension = file.name.split(".").pop() ?? "bin";
  const path = `${type}s/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage.from("article-media").upload(path, file);
  if (uploadError) {
    return { status: "error", message: "Upload failed. Please try again." };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("article-media").getPublicUrl(path);

  const { error: insertError } = await supabase.from("media").insert({
    type,
    url: publicUrl,
    alt_text: altText,
    caption: caption || null,
    credit: credit || null,
    source: source || null,
  });

  if (insertError) {
    return { status: "error", message: "Saved the file but could not record it in the library." };
  }

  revalidatePath("/admin/media");
  return { status: "success", message: "Uploaded to the media library." };
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

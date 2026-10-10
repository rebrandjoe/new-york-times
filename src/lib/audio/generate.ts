import type { ContentBlock } from "@/lib/cms/blocks";
import { createServiceClient, isServiceRoleConfigured } from "@/lib/supabase/service";
import { contentHash } from "./hash";
import { buildAudioSourceText } from "./text-from-blocks";
import { estimateDurationSeconds, isTtsConfigured, synthesizeSpeech } from "./tts";

const BUCKET = "article-audio";

export type AudioRow = {
  article_id: string;
  content_hash: string;
  storage_path: string | null;
  duration_seconds: number | null;
  status: "pending" | "ready" | "failed" | "none";
  error: string | null;
  generated_at: string | null;
};

export async function getArticleAudioRow(articleId: string): Promise<AudioRow | null> {
  if (!isServiceRoleConfigured()) return null;
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("article_audio")
      .select("article_id, content_hash, storage_path, duration_seconds, status, error, generated_at")
      .eq("article_id", articleId)
      .maybeSingle();
    if (error || !data) return null;
    return {
      article_id: data.article_id,
      content_hash: data.content_hash,
      storage_path: data.storage_path,
      duration_seconds: data.duration_seconds,
      status: data.status as AudioRow["status"],
      error: data.error,
      generated_at: data.generated_at,
    };
  } catch {
    return null;
  }
}

/**
 * Generate (or re-generate) MP3 for an article when content hash changes.
 * Safe to call fire-and-forget from publish/update.
 */
export async function ensureArticleAudio(params: {
  articleId: string;
  title: string;
  body: ContentBlock[];
  force?: boolean;
}): Promise<{ ok: true; status: string } | { ok: false; error: string }> {
  if (!isTtsConfigured()) {
    return { ok: false, error: "TTS is not configured (OPENAI_API_KEY)." };
  }
  if (!isServiceRoleConfigured()) {
    return { ok: false, error: "SUPABASE_SERVICE_ROLE_KEY is not configured." };
  }

  const text = buildAudioSourceText(params.title, params.body);
  if (!text.trim()) {
    return { ok: false, error: "Article has no speakable text." };
  }

  const hash = contentHash(text);
  const supabase = createServiceClient();

  const existing = await getArticleAudioRow(params.articleId);
  if (
    !params.force &&
    existing?.status === "ready" &&
    existing.content_hash === hash &&
    existing.storage_path
  ) {
    return { ok: true, status: "cached" };
  }

  await supabase.from("article_audio").upsert(
    {
      article_id: params.articleId,
      content_hash: hash,
      status: "pending",
      error: null,
      storage_path: existing?.storage_path ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "article_id" }
  );

  try {
    const mp3 = await synthesizeSpeech(text);
    const path = `${params.articleId}/${hash}.mp3`;

    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, mp3, {
      contentType: "audio/mpeg",
      upsert: true,
    });

    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    if (existing?.storage_path && existing.storage_path !== path) {
      await supabase.storage.from(BUCKET).remove([existing.storage_path]).catch(() => {});
    }

    const duration = estimateDurationSeconds(text);

    await supabase.from("article_audio").upsert(
      {
        article_id: params.articleId,
        content_hash: hash,
        storage_path: path,
        duration_seconds: duration,
        status: "ready",
        error: null,
        generated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "article_id" }
    );

    return { ok: true, status: "ready" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "TTS generation failed";
    console.error("[audio] generation failed", params.articleId, message);
    await supabase.from("article_audio").upsert(
      {
        article_id: params.articleId,
        content_hash: hash,
        status: "failed",
        error: message.slice(0, 500),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "article_id" }
    );
    return { ok: false, error: message };
  }
}

export async function createAudioSignedUrl(
  storagePath: string,
  expiresIn = 3600
): Promise<string | null> {
  if (!isServiceRoleConfigured()) return null;
  const supabase = createServiceClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, expiresIn);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

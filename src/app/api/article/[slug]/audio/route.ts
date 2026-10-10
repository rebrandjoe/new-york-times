import { NextResponse, type NextRequest } from "next/server";
import { getArticleBySlug } from "@/lib/cms/queries";
import { createClient } from "@/lib/supabase/server";
import { hasActivePremiumAccess } from "@/lib/premium/access";
import {
  createAudioSignedUrl,
  ensureArticleAudio,
  getArticleAudioRow,
} from "@/lib/audio/generate";
import { isTtsConfigured } from "@/lib/audio/tts";
import type { ContentBlock } from "@/lib/cms/blocks";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * GET /api/article/[slug]/audio
 * - ?meta=1 → JSON status (no binary)
 * - ?generate=1 → attempt generation if missing/stale
 * - default → 302 to short-lived signed URL, or JSON error
 *
 * Premium articles require an active subscription. Audio is never served
 * from a public bucket URL.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const article = await getArticleBySlug(slug);
  if (!article) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (article.premium) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const allowed = await hasActivePremiumAccess(user?.id ?? null);
    if (!allowed) {
      return NextResponse.json({ error: "premium_required" }, { status: 403 });
    }
  }

  const metaOnly = request.nextUrl.searchParams.get("meta") === "1";
  const doGenerate = request.nextUrl.searchParams.get("generate") === "1";

  let row = await getArticleAudioRow(article.id);

  if (doGenerate && isTtsConfigured()) {
    const result = await ensureArticleAudio({
      articleId: article.id,
      title: article.title,
      body: article.body as ContentBlock[],
    });
    row = await getArticleAudioRow(article.id);
    if (!result.ok && !row) {
      return NextResponse.json({ error: result.error, status: "failed" }, { status: 502 });
    }
  }

  if (metaOnly) {
    return NextResponse.json({
      status: row?.status ?? "none",
      durationSeconds: row?.duration_seconds ?? null,
      ready: row?.status === "ready" && Boolean(row.storage_path),
      configured: isTtsConfigured(),
      error: row?.status === "failed" ? row.error : null,
    });
  }

  if (row?.status === "ready" && row.storage_path) {
    const signed = await createAudioSignedUrl(row.storage_path, 3600);
    if (!signed) {
      return NextResponse.json({ error: "signed_url_failed" }, { status: 500 });
    }
    return NextResponse.redirect(signed, 302);
  }

  if (row?.status === "pending") {
    return NextResponse.json({ error: "generating", status: "pending" }, { status: 202 });
  }

  if (row?.status === "failed") {
    return NextResponse.json(
      { error: row.error ?? "generation_failed", status: "failed" },
      { status: 502 }
    );
  }

  if (isTtsConfigured()) {
    const result = await ensureArticleAudio({
      articleId: article.id,
      title: article.title,
      body: article.body as ContentBlock[],
    });
    if (result.ok) {
      row = await getArticleAudioRow(article.id);
      if (row?.storage_path) {
        const signed = await createAudioSignedUrl(row.storage_path, 3600);
        if (signed) return NextResponse.redirect(signed, 302);
      }
    }
    return NextResponse.json(
      { error: result.ok ? "not_ready" : result.error, status: result.ok ? "pending" : "failed" },
      { status: result.ok ? 202 : 502 }
    );
  }

  return NextResponse.json({ error: "audio_unavailable", status: "none" }, { status: 404 });
}

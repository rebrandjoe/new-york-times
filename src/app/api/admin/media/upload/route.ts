import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ADMIN_EMAIL } from "@/lib/constants";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { status: "error", message: "Not authorized. Sign in as admin and try again." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const altText = String(formData.get("altText") ?? "").trim();
    const caption = String(formData.get("caption") ?? "").trim();
    const credit = String(formData.get("credit") ?? "").trim();
    const source = String(formData.get("source") ?? "").trim();

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { status: "error", message: "Please choose a file to upload." },
        { status: 400 }
      );
    }

    const resolvedAlt =
      altText ||
      file.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim() ||
      "Article image";

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { status: "error", message: "File is too large — the limit is 10MB." },
        { status: 400 }
      );
    }

    const isImage = file.type.startsWith("image/") || /\.(jpe?g|png|webp|gif)$/i.test(file.name);
    const isVideo = file.type.startsWith("video/");
    if (!isImage && !isVideo) {
      return NextResponse.json(
        { status: "error", message: "Unsupported file type — use an image or video." },
        { status: 400 }
      );
    }

    const type = isVideo ? "video" : "image";
    const extension = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = `${type}s/${randomUUID()}.${extension || "bin"}`;

    const { error: uploadError } = await supabase.storage.from("article-media").upload(path, file, {
      contentType: file.type || undefined,
      upsert: false,
    });

    if (uploadError) {
      console.error("[admin-media] storage upload failed", uploadError.message);
      return NextResponse.json(
        {
          status: "error",
          message: `Upload failed: ${uploadError.message}. Check the article-media bucket policies.`,
        },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("article-media").getPublicUrl(path);

    const { data: inserted, error: insertError } = await supabase
      .from("media")
      .insert({
        type,
        url: publicUrl,
        alt_text: resolvedAlt,
        caption: caption || null,
        credit: credit || null,
        source: source || null,
      })
      .select("id, type, url, alt_text, caption, credit, source, link_url")
      .single();

    if (insertError || !inserted) {
      console.error("[admin-media] media row insert failed", insertError?.message);
      return NextResponse.json(
        {
          status: "error",
          message: insertError?.message
            ? `File uploaded but library record failed: ${insertError.message}`
            : "Saved the file but could not record it in the library.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
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
    });
  } catch (err) {
    console.error("[admin-media] unexpected upload error", err);
    const hint = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json(
      {
        status: "error",
        message: `Upload failed (${hint}). Try a smaller JPEG under 5MB, or refresh and sign in again.`,
      },
      { status: 500 }
    );
  }
}

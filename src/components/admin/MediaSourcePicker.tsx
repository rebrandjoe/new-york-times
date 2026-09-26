"use client";

import { useRef, useState } from "react";
import type { CmsMedia } from "@/lib/cms/types";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/jpg"];
const MAX_FILE_BYTES = 10 * 1024 * 1024;

function fieldClass() {
  return "focus-ring w-full border border-white/10 bg-black px-3 py-2 text-sm text-offwhite placeholder:text-gray-muted focus:border-accent";
}

function tabClass(active: boolean) {
  return `focus-ring border-b-2 px-1 pb-1.5 text-xs font-bold uppercase tracking-wide ${
    active ? "border-accent text-accent" : "border-transparent text-gray-muted hover:text-gray-secondary-light"
  }`;
}

export function MediaSourcePicker({
  media,
  value,
  onChange,
  onUploaded,
}: {
  media: CmsMedia[];
  value: string;
  onChange: (media: CmsMedia | null) => void;
  onUploaded?: (media: CmsMedia) => void;
}) {
  const [tab, setTab] = useState<"library" | "upload">("library");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function validateFile(file: File): string | null {
    const typeOk =
      ACCEPTED_TYPES.includes(file.type) ||
      file.type.startsWith("image/") ||
      /\.(jpe?g|png|webp|gif)$/i.test(file.name);
    if (!typeOk) {
      return "Unsupported file type — use JPEG, PNG, WebP, or GIF.";
    }
    if (file.size > MAX_FILE_BYTES) {
      return "File is too large — the limit is 10MB. Compress the image and try again.";
    }
    if (file.size === 0) {
      return "That file appears empty. Choose another image.";
    }
    return null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const file = formData.get("file") as File | null;

    if (!file || file.size === 0) {
      setError("Please choose a file to upload.");
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    const alt = String(formData.get("altText") ?? "").trim();
    if (!alt) {
      const guess = file.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();
      formData.set("altText", guess || "Article image");
    }

    setError(null);
    setIsPending(true);

    try {
      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
        credentials: "same-origin",
      });

      let result: {
        status?: string;
        message?: string;
        media?: CmsMedia;
      } = {};
      try {
        result = await res.json();
      } catch {
        setError(`Upload failed (HTTP ${res.status}). Refresh the page and try again.`);
        return;
      }

      if (!res.ok || result.status === "error") {
        setError(result.message ?? `Upload failed (HTTP ${res.status}).`);
        return;
      }

      if (result.media) {
        onUploaded?.(result.media);
        onChange(result.media);
        setTab("library");
        setFileName(null);
        formRef.current?.reset();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(`Upload failed (${msg}). Refresh the page, sign in again, and retry.`);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div>
      <div className="flex gap-4 border-b border-charcoal">
        <button type="button" onClick={() => setTab("library")} className={tabClass(tab === "library")}>
          Select from library
        </button>
        <button type="button" onClick={() => setTab("upload")} className={tabClass(tab === "upload")}>
          Upload new
        </button>
      </div>

      {tab === "library" ? (
        <select
          value={value}
          onChange={(e) => onChange(media.find((m) => m.id === e.target.value) ?? null)}
          className={`${fieldClass()} mt-3`}
        >
          <option value="">Select from media library…</option>
          {media.map((m) => (
            <option key={m.id} value={m.id}>
              {m.altText || m.url.split("/").pop()}
            </option>
          ))}
        </select>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} className="mt-3 space-y-2">
          <input
            type="file"
            name="file"
            accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
            required
            className={fieldClass()}
            onChange={(e) => {
              const f = e.target.files?.[0] ?? null;
              setFileName(f ? `${f.name} (${(f.size / 1024).toFixed(0)} KB)` : null);
              setError(null);
            }}
          />
          {fileName && <p className="text-xs text-gray-muted">Selected: {fileName}</p>}
          <input
            type="text"
            name="altText"
            placeholder="Alt text (optional — defaults from filename)"
            className={fieldClass()}
          />
          <input type="text" name="caption" placeholder="Caption (optional)" className={fieldClass()} />
          <input type="text" name="credit" placeholder="Credit (optional)" className={fieldClass()} />

          {error && (
            <p role="alert" className="border border-live-red/40 bg-live-red/10 px-3 py-2 text-sm text-live-red">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="focus-ring bg-accent px-4 py-2 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? "Uploading…" : "Upload"}
          </button>
          <p className="text-[11px] text-gray-muted">JPEG, PNG, WebP or GIF · max 10MB</p>
        </form>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { uploadMedia } from "@/lib/actions/admin-media";
import { initialMediaFormState } from "@/lib/actions/form-state";
import type { CmsMedia } from "@/lib/cms/types";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_BYTES = 10 * 1024 * 1024;

function fieldClass() {
  return "focus-ring w-full border border-white/10 bg-black px-3 py-2 text-sm text-offwhite placeholder:text-gray-muted focus:border-accent";
}

function tabClass(active: boolean) {
  return `focus-ring border-b-2 px-1 pb-1.5 text-xs font-bold uppercase tracking-wide ${
    active ? "border-accent text-accent" : "border-transparent text-gray-muted hover:text-gray-secondary-light"
  }`;
}

/** Shared "pick from the media library, or upload a new file" control —
 * used by the Featured Image field and every inline image node in the
 * article body editor, so device upload isn't limited to the standalone
 * /admin/media page. */
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

  function validateFile(file: File): string | null {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Unsupported file type — please use JPEG, PNG, WebP, or GIF.";
    }
    if (file.size > MAX_FILE_BYTES) {
      return "File is too large — the limit is 10MB.";
    }
    return null;
  }

  async function handleUpload(formData: FormData) {
    const file = formData.get("file") as File | null;
    const validationError = file ? validateFile(file) : "Please choose a file to upload.";
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsPending(true);
    const result = await uploadMedia(initialMediaFormState, formData);
    setIsPending(false);

    if (result.status === "error") {
      setError(result.message ?? "Upload failed. Please try again.");
      return;
    }
    if (result.media) {
      onUploaded?.(result.media);
      onChange(result.media);
      setTab("library");
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
        <form action={handleUpload} className="mt-3 space-y-2">
          <input
            type="file"
            name="file"
            accept={ACCEPTED_TYPES.join(",")}
            required
            className={fieldClass()}
          />
          <input type="text" name="altText" placeholder="Alt text (required)" required className={fieldClass()} />
          <input type="text" name="caption" placeholder="Caption (optional)" className={fieldClass()} />
          <input type="text" name="credit" placeholder="Credit (optional)" className={fieldClass()} />

          {error && <p className="text-sm text-live-red">{error}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="focus-ring bg-accent px-4 py-2 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? "Uploading…" : "Upload"}
          </button>
        </form>
      )}
    </div>
  );
}

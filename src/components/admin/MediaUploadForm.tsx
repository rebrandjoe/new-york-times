"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

function fieldClass() {
  return "focus-ring mt-1.5 w-full border border-white/10 bg-black px-3 py-2 text-sm text-offwhite placeholder:text-gray-muted focus:border-accent";
}

export function MediaUploadForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    setError(null);
    setSuccess(null);
    setIsPending(true);

    try {
      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
        credentials: "same-origin",
      });
      const result = await res.json().catch(() => ({}));

      if (!res.ok || result.status === "error") {
        setError(result.message ?? `Upload failed (HTTP ${res.status}).`);
        return;
      }

      setSuccess(result.message ?? "Uploaded to the media library.");
      formRef.current?.reset();
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(`Upload failed (${msg}). Refresh and try again.`);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-4 border border-charcoal bg-charcoal-deep p-6 sm:grid-cols-2"
    >
      <div className="sm:col-span-2">
        <label className="text-xs font-bold uppercase tracking-wide text-gray-muted">File</label>
        <input type="file" name="file" accept="image/*,video/*" required className={fieldClass()} />
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs font-bold uppercase tracking-wide text-gray-muted">Alt text</label>
        <input type="text" name="altText" placeholder="Optional — defaults from filename" className={fieldClass()} />
      </div>
      <div>
        <label className="text-xs font-bold uppercase tracking-wide text-gray-muted">Caption</label>
        <input type="text" name="caption" className={fieldClass()} />
      </div>
      <div>
        <label className="text-xs font-bold uppercase tracking-wide text-gray-muted">Credit</label>
        <input type="text" name="credit" className={fieldClass()} />
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs font-bold uppercase tracking-wide text-gray-muted">Source</label>
        <input type="text" name="source" className={fieldClass()} />
      </div>

      {error && <p className="text-sm text-live-red sm:col-span-2">{error}</p>}
      {success && <p className="text-sm text-accent sm:col-span-2">{success}</p>}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={isPending}
          className="focus-ring bg-accent px-5 py-2.5 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? "Uploading…" : "Upload"}
        </button>
      </div>
    </form>
  );
}

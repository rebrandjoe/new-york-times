"use client";

import { useActionState } from "react";
import { uploadMedia } from "@/lib/actions/admin-media";
import { initialMediaFormState } from "@/lib/actions/form-state";

function fieldClass() {
  return "focus-ring mt-1.5 w-full border border-white/10 bg-black px-3 py-2 text-sm text-offwhite placeholder:text-gray-muted focus:border-accent";
}

export function MediaUploadForm() {
  const [state, formAction, isPending] = useActionState(uploadMedia, initialMediaFormState);

  return (
    <form
      action={formAction}
      className="grid grid-cols-1 gap-4 border border-charcoal bg-charcoal-deep p-6 sm:grid-cols-2"
    >
      <div className="sm:col-span-2">
        <label className="text-xs font-bold uppercase tracking-wide text-gray-muted">File</label>
        <input type="file" name="file" accept="image/*,video/*" required className={fieldClass()} />
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs font-bold uppercase tracking-wide text-gray-muted">Alt text (required)</label>
        <input type="text" name="altText" required className={fieldClass()} />
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

      {state.status === "error" && <p className="text-sm text-live-red sm:col-span-2">{state.message}</p>}
      {state.status === "success" && <p className="text-sm text-accent sm:col-span-2">{state.message}</p>}

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

"use client";

import Link from "next/link";

export function AboutPageActions() {
  return (
    <div className="mt-10 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="focus-ring border border-charcoal px-5 py-2.5 text-sm font-semibold text-offwhite transition-colors hover:border-accent hover:text-accent"
      >
        Back to top
      </button>
      <Link
        href="/latest"
        className="focus-ring bg-accent px-5 py-2.5 text-sm font-bold text-black transition-opacity hover:opacity-90"
      >
        View latest health stories
      </Link>
    </div>
  );
}

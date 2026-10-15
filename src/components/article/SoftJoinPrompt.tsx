import Link from "next/link";

/**
 * Soft conversion after the full article — never interrupts reading.
 * Full body stays in HTML for crawlers and readers.
 */
export function SoftJoinPrompt() {
  return (
    <div className="my-10 rounded-lg border border-charcoal bg-[#0F0F0F] px-5 py-6 sm:px-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
        Stay connected
      </p>
      <h3 className="mt-2 font-serif text-lg font-bold text-white sm:text-xl">
        Create a free account to follow health news that matters
      </h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-secondary-light">
        Sign in for a personalised experience, comments, and updates. The full article above stays free
        to read — no wall.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Link
          href="/sign-up"
          className="focus-ring inline-flex items-center rounded-full bg-accent px-4 py-2 text-xs font-bold text-black transition-opacity hover:opacity-90"
        >
          Create free account
        </Link>
        <Link
          href="/sign-in"
          className="focus-ring inline-flex items-center rounded-full border border-charcoal px-4 py-2 text-xs font-semibold text-white transition-colors hover:border-accent hover:text-accent"
        >
          Sign in
        </Link>
        <Link
          href="/premium"
          className="focus-ring text-xs font-medium text-gray-muted underline-offset-2 hover:text-accent hover:underline"
        >
          Support independent journalism →
        </Link>
      </div>
    </div>
  );
}

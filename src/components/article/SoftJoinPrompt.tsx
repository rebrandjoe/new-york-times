import Link from "next/link";

/**
 * Soft conversion after the full article — never interrupts reading.
 * Full body stays in HTML for crawlers and readers.
 */
export function SoftJoinPrompt() {
  return (
    <div className="my-10 rounded-lg border border-charcoal bg-[#0F0F0F] px-5 py-6 sm:px-6">
      <h3 className="font-serif text-lg font-extrabold text-white sm:text-xl">
        Never miss health news that matters
      </h3>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-gray-secondary-light">
        Create a free account to follow stories shaping health in Kenya, Africa and around the world.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm">
        <Link
          href="/sign-up"
          className="focus-ring inline-flex items-center rounded-full bg-accent px-4 py-2 text-xs font-bold text-black transition-opacity hover:opacity-90"
        >
          Create your free account
        </Link>
        <span className="text-gray-muted" aria-hidden="true">
          ·
        </span>
        <p className="text-xs text-gray-secondary-light sm:text-sm">
          Already a member?{" "}
          <Link
            href="/sign-in"
            className="focus-ring font-semibold text-accent underline-offset-2 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

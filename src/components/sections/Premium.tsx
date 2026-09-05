import Link from "next/link";

export function Premium() {
  return (
    <section aria-labelledby="premium-heading" className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="flex flex-col items-start gap-6 border border-accent p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Premium
          </p>
          <h2 id="premium-heading" className="mt-3 font-serif text-2xl font-extrabold text-white sm:text-3xl">
            Go deeper with a JOSEPH MMWA subscription
          </h2>
          <p className="mt-3 max-w-xl text-sm text-gray-secondary-light sm:text-base">
            Unlock full access to in-depth reporting, expert analysis, and the complete
            archive.
          </p>
        </div>
        <Link
          href="/premium"
          className="focus-ring shrink-0 bg-accent px-6 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90"
        >
          Subscribe
        </Link>
      </div>
    </section>
  );
}

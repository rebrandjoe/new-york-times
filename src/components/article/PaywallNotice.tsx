import Link from "next/link";

export function PaywallNotice() {
  return (
    <div className="relative mt-2">
      <div className="pointer-events-none absolute -top-24 h-24 w-full bg-gradient-to-t from-black to-transparent" />
      <div className="border border-charcoal bg-charcoal-deep p-8 text-center sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Premium article</p>
        <h2 className="mt-3 font-serif text-2xl font-extrabold text-white sm:text-3xl">
          Continue reading with JOSEPH MMWA Premium
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-gray-secondary-light sm:text-base">
          A membership unlocks this story and every other premium article, with no separate purchase
          per story.
        </p>
        <Link
          href="/premium"
          className="focus-ring mt-6 inline-block bg-accent px-6 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90"
        >
          Become a member
        </Link>
      </div>
    </div>
  );
}

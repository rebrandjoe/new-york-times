import Link from "next/link";

export function MemberAccessCard() {
  return (
    <div className="my-10 rounded-2xl border border-charcoal bg-[#0F0F0F] p-8 text-center sm:p-10">
      <div className="inline-flex items-center gap-1.5 rounded-full border border-charcoal bg-black/60 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-accent">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        SUPPORT INDEPENDENT JOURNALISM
      </div>

      <h3 className="mt-4 font-serif text-2xl font-bold text-white sm:text-3xl">
        Help keep health journalism independent
      </h3>

      <p className="mx-auto mt-3 max-w-md text-sm text-gray-secondary-light leading-relaxed">
        Your support helps me continue researching, verifying and reporting important health and medical stories independently.
      </p>

      <div className="mt-6">
        <Link
          href="/premium"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-[1.02] focus-ring"
        >
          <span>Support my journalism</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}

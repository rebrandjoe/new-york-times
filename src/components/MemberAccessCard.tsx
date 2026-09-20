import Link from "next/link";

export function MemberAccessCard() {
  return (
    <div className="my-8 rounded-xl border border-charcoal bg-[#0F0F0F] p-6 text-center sm:p-8">
      <div className="inline-flex items-center gap-1 rounded-full border border-charcoal bg-black/60 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-accent">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        SUPPORT INDEPENDENT JOURNALISM
      </div>

      <h4 className="mt-3 font-serif text-lg font-bold text-white sm:text-xl">
        Help keep health journalism independent
      </h4>

      <p className="mx-auto mt-2 max-w-sm text-xs text-gray-secondary-light leading-relaxed">
        I report and explain important health and medical stories independently, with accuracy, context and African relevance. Your support helps me continue this work.
      </p>

      <div className="mt-4">
        <Link
          href="/premium"
          className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-xs font-bold text-black transition-transform hover:scale-[1.02] focus-ring"
        >
          <span>Support my journalism</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}

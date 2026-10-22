import type { Metadata } from "next";
import Link from "next/link";
import { majorRegions } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Regions | JOSEPH MMWA",
  description: "Browse health journalism coverage across major global regions.",
};

export default function RegionsIndexPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Coverage</p>
        <h1 className="mt-2 font-serif text-3xl font-extrabold text-white sm:text-4xl">
          Global Regions
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-secondary">
          Select a region to view live health coverage.
        </p>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {majorRegions.map((region) => (
          <Link
            key={region.slug}
            href={`/regions/${region.slug}`}
            className="group relative rounded-2xl border border-neutral-800 bg-[#0F0F0F] p-6 transition-colors duration-200 hover:border-accent/70 hover:bg-[#141210] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <h2 className="font-serif text-2xl font-bold text-white transition-colors duration-200 group-hover:text-accent">
              {region.name}
            </h2>
            <span
              aria-hidden
              className="mt-3 inline-flex items-center text-xs font-medium tracking-wide text-gray-muted transition-colors duration-200 group-hover:text-accent"
            >
              View coverage
              <span className="ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

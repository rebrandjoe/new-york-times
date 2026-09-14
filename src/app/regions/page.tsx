import type { Metadata } from "next";
import Link from "next/link";
import { majorRegions } from "@/lib/nav";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Regions | JOSEPH MMWA",
  description: "Browse health journalism coverage across major global regions.",
};

export default function RegionsIndexPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading title="Global Regions" />
      <p className="mt-2 text-sm text-gray-secondary-light">
        Select a region to view live health coverage and search by country.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {majorRegions.map((region) => (
          <Link
            key={region.slug}
            href={`/regions/${region.slug}`}
            className="group rounded-2xl border border-charcoal bg-[#0F0F0F] p-6 transition-colors hover:border-accent"
          >
            <h2 className="font-serif text-2xl font-bold text-white group-hover:text-accent">
              {region.name}
            </h2>
            <p className="mt-2 text-xs text-gray-muted">Explore regional reports &amp; country dispatches</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

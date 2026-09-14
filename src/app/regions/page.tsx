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
      <h1 className="font-serif text-3xl font-extrabold text-white sm:text-4xl">Global Regions</h1>
      <p className="mt-2 text-sm text-gray-400">Select a region to view live health coverage.</p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {majorRegions.map((region) => (
          <Link
            key={region.slug}
            href={`/regions/${region.slug}`}
            className="group rounded-2xl border border-neutral-800 bg-[#0F0F0F] p-6 transition-colors hover:border-emerald-500"
          >
            <h2 className="font-serif text-2xl font-bold text-white group-hover:text-emerald-400">
              {region.name}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { getTopics } from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "Topics",
  description: "Browse all health topics covered by JOSEPH MMWA.",
  alternates: { canonical: "/topics" },
};

export default async function TopicsIndexPage() {
  const topics = await getTopics();

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
        JOSEPH MMWA
      </p>
      <h1 className="mt-4 font-serif text-4xl font-extrabold text-white sm:text-5xl">
        All Topics
      </h1>
      <p className="mt-4 max-w-xl text-base text-gray-secondary-light">
        Browse health news by topic.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        {topics.map((topic) => (
          <Link
            key={topic.id}
            href={`/topics/${topic.slug}`}
            className="focus-ring border border-charcoal px-4 py-2 text-sm text-gray-secondary-light transition-colors hover:border-accent hover:text-accent"
          >
            {topic.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

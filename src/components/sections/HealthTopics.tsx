import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { healthTopics } from "@/lib/mock-data";

export function HealthTopics() {
  return (
    <section aria-labelledby="topics-heading" className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
      <h2 id="topics-heading" className="sr-only">
        Health topics
      </h2>
      <SectionHeading title="Health Topics" />
      <div className="flex flex-wrap gap-3">
        {healthTopics.map((topic) => (
          <Link
            key={topic.id}
            href={`/topics/${topic.slug}`}
            className="focus-ring border border-charcoal px-4 py-2 text-sm text-gray-secondary-light transition-colors hover:border-accent hover:text-accent"
          >
            {topic.name}
          </Link>
        ))}
        <Link
          href="/topics"
          className="focus-ring border border-accent px-4 py-2 text-sm font-semibold text-accent transition-opacity hover:opacity-80"
        >
          + More topics
        </Link>
      </div>
    </section>
  );
}

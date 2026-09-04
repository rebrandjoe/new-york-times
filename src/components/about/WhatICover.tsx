import { SectionHeading } from "@/components/SectionHeading";
import { healthTopics } from "@/lib/mock-data";

export function WhatICover() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <SectionHeading title="What I Cover" />
      <div className="flex flex-wrap gap-3">
        {healthTopics.map((topic) => (
          <span
            key={topic.id}
            className="border border-charcoal px-4 py-2 text-sm text-gray-secondary-light"
          >
            {topic.name}
          </span>
        ))}
      </div>
    </section>
  );
}

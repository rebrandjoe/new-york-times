import { SectionHeading } from "@/components/SectionHeading";

const topics = [
  "Global health and public health",
  "Medical research and clinical developments",
  "Infectious diseases and emerging outbreaks",
  "HIV and AIDS",
  "Vaccines and immunisation",
  "Cancer and other major diseases",
  "Health policy and healthcare systems",
  "Artificial intelligence and health technology",
  "Maternal and child health",
  "Nutrition and mental health",
  "Medical breakthroughs and emerging treatments",
];

export function WhatICover() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <SectionHeading title="What I Cover" />
      <p className="mb-6 max-w-3xl text-base leading-relaxed text-gray-secondary-light sm:text-lg">
        My reporting covers the issues shaping health and medicine, including:
      </p>
      <div className="flex flex-wrap gap-3">
        {topics.map((topic) => (
          <span
            key={topic}
            className="border border-charcoal px-4 py-2 text-sm text-gray-secondary-light"
          >
            {topic}
          </span>
        ))}
      </div>
    </section>
  );
}

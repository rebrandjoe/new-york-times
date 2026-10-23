import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";

/** Display label → site topic slug (matches primaryTopics in nav). */
const topics: { label: string; slug: string }[] = [
  { label: "Global health and public health", slug: "public-health" },
  { label: "Medical research and clinical developments", slug: "medical-research" },
  {
    label: "Infectious diseases and emerging outbreaks",
    slug: "disease-outbreaks-epidemics",
  },
  { label: "HIV and AIDS", slug: "hiv-aids" },
  { label: "Vaccines and immunisation", slug: "vaccines-immunization" },
  { label: "Cancer and other major diseases", slug: "cancer" },
  { label: "Health policy and healthcare systems", slug: "health-policy-systems" },
  {
    label: "Artificial intelligence and health technology",
    slug: "ai-in-healthcare-and-telemedicine",
  },
  { label: "Maternal and child health", slug: "maternal-child-health" },
  { label: "Nutrition", slug: "nutrition" },
  { label: "Mental health", slug: "mental-health" },
  {
    label: "Medical breakthroughs and emerging treatments",
    slug: "treatments-medicines",
  },
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
          <Link
            key={topic.slug}
            href={`/topics/${topic.slug}`}
            className="focus-ring border border-charcoal px-4 py-2 text-sm text-gray-secondary-light transition-colors hover:border-accent hover:text-accent active:border-accent"
          >
            {topic.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

import { SectionHeading } from "@/components/SectionHeading";

const regions = [
  {
    name: "Kenya",
    description:
      "Health and medical developments affecting people, communities, and healthcare systems in Kenya.",
  },
  {
    name: "Africa",
    description:
      "Outbreaks, medical research, vaccines, healthcare systems, policy, and innovation across the continent.",
  },
  {
    name: "Global",
    description:
      "Major developments from the United States, Europe, Asia, Latin America, the Middle East, and beyond.",
  },
];

export function GlobalCoverage() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <SectionHeading title="Global Health. Local Relevance." />
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
        {regions.map((region) => (
          <div key={region.name} className="border-t-2 border-accent pt-5">
            <h3 className="font-serif text-2xl font-bold text-white">
              {region.name}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-secondary-light sm:text-base">
              {region.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

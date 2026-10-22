import { SectionHeading } from "@/components/SectionHeading";

const regions = [
  {
    name: "Kenya",
    description:
      "Health and medical developments affecting people, communities and healthcare systems in Kenya, including public health policy, disease outbreaks, healthcare access and medical research.",
  },
  {
    name: "Africa",
    description:
      "Outbreaks, medical research, vaccines, healthcare systems, health policy and scientific innovation across the continent, with attention to the people and communities behind the developments.",
  },
  {
    name: "Global",
    description:
      "Major health and medical developments from the United States, Europe, Asia, Latin America, the Middle East and beyond, including discoveries, emerging diseases, medical technologies and decisions shaping global health.",
  },
];

export function GlobalCoverage() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <SectionHeading title="Health News Without Borders" />
      <p className="-mt-2 mb-8 max-w-3xl text-base font-medium text-gray-secondary-light sm:-mt-4 sm:mb-10 sm:text-lg">
        My reporting spans Kenya, Africa and the wider world, connecting local
        health concerns with regional developments and global medical advances.
      </p>
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

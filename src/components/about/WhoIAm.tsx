import { SectionHeading } from "@/components/SectionHeading";

export function WhoIAm() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <SectionHeading title="About Joseph Mmwa" />
      <div className="max-w-3xl space-y-5 text-base leading-relaxed text-gray-secondary-light sm:text-lg">
        <p>
          Joseph Mmwa is a Kenyan health news editor and aggregator focused on
          making health and medical news clear, accessible and meaningful to
          everyone.
        </p>
        <p>
          I follow important health developments across Kenya, Africa and the
          world — from medical research and vaccines to HIV, cancer, infectious
          diseases, public health and emerging healthcare technologies.
        </p>
        <p>
          My work is about finding the stories that matter, understanding what
          they mean, verifying the information and presenting them clearly so
          people can better understand the health issues affecting their lives.
        </p>
      </div>
    </section>
  );
}

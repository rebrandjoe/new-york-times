import { SectionHeading } from "@/components/SectionHeading";

export function WhoIAm() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <SectionHeading title="Who I Am" />
      <div className="max-w-3xl space-y-5 text-base leading-relaxed text-gray-secondary-light sm:text-lg">
        <p>
          I&apos;m a health and medical journalist. My job is to help people
          understand important developments in medicine and health — the kind of
          news that affects how diseases are treated, how healthcare systems
          respond, and how people make decisions about their own health.
        </p>
        <p>
          I cover medical research, public health, diseases, vaccines, healthcare,
          health policy, medical breakthroughs, emerging health threats, scientific
          developments, health systems, and the growing role of AI in healthcare.
        </p>
        <p>
          I&apos;m not a doctor and I don&apos;t offer medical advice. My role is to
          report, explain, and put developments in context — clearly and
          accurately, so readers can understand what&apos;s happening and why it
          matters.
        </p>
      </div>
    </section>
  );
}

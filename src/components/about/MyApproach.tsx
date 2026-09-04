import { SectionHeading } from "@/components/SectionHeading";

const steps = ["Read", "Understand", "Verify", "Attribute", "Write", "Publish"];

export function MyApproach() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <SectionHeading title="My Approach" />

      <div className="flex flex-wrap items-center gap-x-3 gap-y-4">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center gap-3">
            <span className="border border-charcoal px-4 py-2 text-sm font-semibold text-offwhite">
              {step}
            </span>
            {i < steps.length - 1 && (
              <span className="text-accent" aria-hidden="true">
                →
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 max-w-3xl space-y-5 text-base leading-relaxed text-gray-secondary-light sm:text-lg">
        <p>
          Health and medical journalism requires care. I take the time to
          understand a development before I write about it, verify important
          claims, and properly attribute sources — rather than rushing a story
          into print.
        </p>
        <p>
          Complex medical and scientific developments deserve to be explained in
          language people can actually use. Accuracy, verification, attribution,
          context, clarity, and responsibility guide every story I publish.
        </p>
      </div>
    </section>
  );
}

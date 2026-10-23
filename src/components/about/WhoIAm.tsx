const steps = ["Read", "Understand", "Verify", "Attribute", "Write", "Publish"];

export function WhoIAm() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-3xl space-y-5 text-base leading-relaxed text-gray-secondary-light sm:text-lg">
        <p>
          Joseph Mmwa is a Kenyan health journalist and the founder and editor of
          Joseph Mmwa, a Kenyan health news publication focused on making health
          and medical news clear, accessible and meaningful to everyone.
        </p>
        <p>
          I follow important health developments across Kenya, Africa and the
          world, from medical research and vaccines to HIV, cancer, infectious
          diseases, public health, healthcare policy and emerging medical
          technologies.
        </p>
        <p>
          My work is about finding the stories that matter, understanding what
          they mean, verifying information, tracing claims to their original
          sources and presenting the evidence clearly. I aim to put people at
          the centre of health reporting, helping readers understand not only
          what is happening, but why it matters.
        </p>
        <p>
          Through my digital platforms, I reach a combined audience of more than
          180,000 followers.
        </p>

        <p className="!mt-8 font-semibold text-offwhite">
          My approach to journalism is simple:
        </p>

        <div className="!mt-3 flex flex-wrap items-center gap-x-3 gap-y-3">
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

        <p className="!mt-8">
          I envision a health news platform that takes African health stories to
          the world and brings important global health developments to African
          audiences, making health and medicine better understood across borders.
        </p>
      </div>
    </section>
  );
}

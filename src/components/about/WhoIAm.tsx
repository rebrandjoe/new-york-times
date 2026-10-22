import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";
import { AUTHOR_PHOTO_ALT, AUTHOR_PHOTO_SRC } from "@/lib/constants";

const steps = ["Read", "Understand", "Verify", "Attribute", "Write", "Publish"];

export function WhoIAm() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <SectionHeading title="Who I Am" />
      <div className="max-w-3xl space-y-5 text-base leading-relaxed text-gray-secondary-light sm:text-lg">
        <p className="pt-2">
          Joseph Mmwa is a Kenyan health journalist focused on making health and
          medical news clear, accessible and meaningful to everyone.
        </p>
        <p>
          I follow important health developments across Kenya, Africa and the
          world — from medical research and vaccines to HIV, cancer, infectious
          diseases, public health and emerging healthcare technologies.
        </p>
        <p>
          My work is about finding the stories that matter, understanding what
          they mean, verifying the information, attributing it to the original
          sources and presenting it clearly — with people at the centre, helping
          them understand the health issues around them and why they matter.
        </p>
        <p>
          Through my digital platforms, I reach a combined audience of more than
          180,000 followers, sharing health and medical news with audiences in
          Kenya, across Africa and around the world.
        </p>

        <p className="!mt-8 font-semibold text-offwhite">My approach:</p>

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
          audiences — making health and medicine better understood across
          borders.
        </p>
      </div>

      {/* Portrait — clean borders matching site chrome */}
      <div className="mt-12 max-w-md">
        <div className="h-1 w-16 bg-accent" aria-hidden />
        <div className="relative mt-4 aspect-[4/5] w-full overflow-hidden border border-charcoal bg-charcoal-deep">
          <Image
            src={AUTHOR_PHOTO_SRC}
            alt={AUTHOR_PHOTO_ALT}
            fill
            sizes="(min-width: 768px) 28rem, 100vw"
            className="object-cover object-top"
            priority
          />
        </div>
        <p className="mt-3 text-sm text-gray-muted">Joseph Mmwa · Health journalist</p>
      </div>
    </section>
  );
}

import { SectionHeading } from "@/components/SectionHeading";

const steps = ["Read", "Understand", "Verify", "Attribute", "Write", "Publish"];

/** Public Supabase Storage URL — Facebook page screenshot (audience reach). */
const FACEBOOK_REACH_IMAGE_URL =
  "https://uhkmgirkogzmnkkidcgm.supabase.co/storage/v1/object/public/logo/WhatsApp%20Image%202026-10-22%20at%2011.16.49.jpeg";

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
          180,000 followers.
        </p>

        <p className="!mt-8 font-semibold text-offwhite">My approach is simple:</p>

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

      {/* Facebook page screenshot — supports the combined audience figure */}
      <figure className="mt-12 max-w-md">
        <div className="h-1 w-16 bg-accent" aria-hidden />
        <div className="mt-4 overflow-hidden rounded-xl border border-charcoal bg-[#0F0F0F]">
          {/* eslint-disable-next-line @next/next/no-img-element -- Supabase public Storage URL */}
          <img
            src={FACEBOOK_REACH_IMAGE_URL}
            alt="Joseph Mmwa Facebook page — 153K followers, part of a combined digital audience of more than 180,000"
            className="block h-auto w-full"
            width={720}
            height={960}
            loading="lazy"
          />
        </div>
        <figcaption className="mt-3 text-sm text-gray-muted">
          Facebook · 153K followers — part of a combined audience of more than 180,000 across digital platforms
        </figcaption>
      </figure>
    </section>
  );
}

import Link from "next/link";
import { LogoMark, Tagline } from "@/components/Wordmark";
import { SocialFollow } from "@/components/SocialFollow";
import { AboutPageActions } from "./AboutPageActions";

export function AboutContactCta() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="text-center">
        <h2 className="font-serif text-3xl font-extrabold text-white sm:text-4xl">
          Have Something to Share?
        </h2>
        <div className="mx-auto mt-4 max-w-2xl space-y-4 text-base text-gray-secondary-light sm:text-lg">
          <p>
            If you are a reader, researcher, healthcare professional, institution or
            organisation with health information worth investigating, a research
            finding to share, a story tip, a correction or a professional enquiry, I
            welcome hearing from you.
          </p>
          <p>
            Relevant information, expert perspectives and firsthand accounts can help
            identify important stories and improve public understanding of health and
            medicine.
          </p>
        </div>
        <Link
          href="/contact"
          className="focus-ring mt-8 inline-block bg-accent px-6 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90"
        >
          Contact Joseph Mmwa
        </Link>
        <p className="mt-3 text-sm text-gray-muted">
          Share a tip, suggest a story or discuss a professional enquiry.
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-2xl border-t border-charcoal pt-12 text-center">
        <h2 className="font-serif text-2xl font-extrabold text-white sm:text-3xl">
          Advertise with me
        </h2>
        <p className="mt-4 text-base leading-relaxed text-gray-secondary-light sm:text-lg">
          Reach audiences engaged with the stories shaping health and medicine through
          digital advertising, sponsored campaigns and strategic partnerships.
        </p>
        <Link
          href="/advertise"
          className="focus-ring mt-6 inline-block border border-charcoal px-6 py-3 text-sm font-semibold text-offwhite transition-colors hover:border-accent hover:text-accent"
        >
          Advertise with me →
        </Link>
      </div>

      <div className="mt-16 border-t border-charcoal pt-8 text-left">
        <SocialFollow iconSize="sm" />
        <AboutPageActions />
      </div>

      <div className="mt-20 flex flex-col items-center border-t border-charcoal pt-12 text-center">
        <LogoMark size={72} className="ring-1 ring-charcoal" />
        <p className="mt-4 font-serif text-lg font-bold text-white">Joseph Mmwa</p>
        <Tagline className="mt-1 text-sm text-gray-secondary sm:text-base" />
      </div>
    </section>
  );
}

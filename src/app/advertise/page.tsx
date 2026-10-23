import type { Metadata } from "next";
import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/icons";
import { socialLinks } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Advertise with Joseph Mmwa",
  description:
    "Advertising and partnership opportunities with Joseph Mmwa — reach a combined social media following of over 180,000 interested in health, medicine and public health across Kenya, Africa and the world.",
  alternates: { canonical: "/advertise" },
  openGraph: {
    title: "Advertise with Joseph Mmwa",
    description:
      "Advertising and partnership opportunities with Joseph Mmwa — reach a combined social media following of over 180,000 interested in health, medicine and public health.",
    url: "/advertise",
  },
};

const socialIconMap = {
  Facebook: FacebookIcon,
  LinkedIn: LinkedInIcon,
  YouTube: YouTubeIcon,
  X: XIcon,
  Instagram: InstagramIcon,
  TikTok: TikTokIcon,
};

const body = "text-base leading-relaxed text-gray-secondary-light sm:text-lg";
const h2 = "font-serif text-2xl font-extrabold text-white sm:text-3xl";
const h3 = "font-semibold text-offwhite";

export default function AdvertisePage() {
  return (
    <>
      <section className="border-y border-charcoal bg-charcoal-deep">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <h1 className="font-serif text-3xl font-extrabold text-white sm:text-4xl">
              Advertise with Joseph Mmwa
            </h1>
            <div className={`mt-6 space-y-5 ${body}`}>
              <p>
                Are you a brand or organisation seeking to reach an audience interested in
                health, medicine and public health? Joseph Mmwa offers advertising and
                partnership opportunities to connect your organisation with an established
                digital audience across Kenya, Africa and around the world.
              </p>
              <p>
                With a{" "}
                <a
                  href="#follow"
                  className="font-semibold text-accent underline-offset-2 hover:underline"
                >
                  combined following
                </a>{" "}
                of <strong className="font-semibold text-offwhite">over 180,000</strong>, Joseph
                Mmwa provides a platform for organisations looking to increase visibility,
                raise awareness and communicate with audiences interested in healthcare,
                medical research, pharmaceuticals, health technology and public health.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="max-w-3xl">
          <h2 className={h2}>About Joseph Mmwa</h2>
          <div className={`mt-5 space-y-5 ${body}`}>
            <p>
              Joseph Mmwa is a health journalism platform covering major developments in
              Kenya, Africa and around the world. Through breaking health news, medical
              research reporting and explainers on healthcare policy, diseases, vaccines and
              scientific developments, the platform helps audiences understand what is
              happening in health and why it matters.
            </p>
            <p>
              This focus creates opportunities for relevant brands and organisations to
              connect their messages with an audience that actively follows health and medical
              developments.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-charcoal bg-charcoal-deep">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <h2 className={h2}>Why advertise with Joseph Mmwa?</h2>
            <div className={`mt-6 space-y-6 ${body}`}>
              <div>
                <p className={h3}>An established digital audience</p>
                <p className="mt-2">
                  Reach a{" "}
                  <a
                    href="#follow"
                    className="font-semibold text-accent underline-offset-2 hover:underline"
                  >
                    combined following
                  </a>{" "}
                  of over 180,000 across multiple platforms, extending your organisation's
                  visibility beyond a single channel.
                </p>
              </div>
              <div>
                <p className={h3}>A specialised health audience</p>
                <p className="mt-2">
                  Connect with audiences interested in medical discoveries, healthcare
                  innovation, pharmaceuticals, vaccines, diseases, research and public health.
                </p>
              </div>
              <div>
                <p className={h3}>Reach across Kenya, Africa and beyond</p>
                <p className="mt-2">
                  Communicate with audiences following health developments locally, regionally
                  and internationally through a platform with a global health news focus.
                </p>
              </div>
              <div>
                <p className={h3}>Relevant brand visibility</p>
                <p className="mt-2">
                  Position your organisation, products, services or initiatives alongside health
                  journalism that informs audiences about important medical and public health
                  developments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="max-w-3xl">
          <h2 className={h2}>Advertising and partnership opportunities</h2>
          <p className={`mt-5 ${body}`}>
            Joseph Mmwa offers opportunities for organisations working across healthcare,
            pharmaceuticals, biotechnology, medical technology, research and public health.
          </p>
          <ul className={`mt-6 list-disc space-y-3 pl-5 ${body}`}>
            <li>
              <strong className="font-semibold text-offwhite">Digital advertising:</strong>{" "}
              Advertising placements on JosephMmwa.com, subject to availability.
            </li>
            <li>
              <strong className="font-semibold text-offwhite">Sponsored campaigns:</strong>{" "}
              Clearly disclosed sponsored communications designed around your campaign
              objectives.
            </li>
            <li>
              <strong className="font-semibold text-offwhite">Public health awareness:</strong>{" "}
              Campaigns supporting health education, disease prevention and public health
              initiatives.
            </li>
            <li>
              <strong className="font-semibold text-offwhite">
                Research and innovation communication:
              </strong>{" "}
              Opportunities to increase awareness of medical research, healthcare technologies
              and scientific developments.
            </li>
            <li>
              <strong className="font-semibold text-offwhite">Strategic partnerships:</strong>{" "}
              Tailored digital communication collaborations for organisations seeking to engage
              health-focused audiences.
            </li>
          </ul>
          <p className={`mt-6 ${body}`}>
            Each opportunity can be discussed according to your objectives, target audience,
            preferred platforms, campaign duration and budget.
          </p>
        </div>
      </section>

      <section className="border-y border-charcoal bg-charcoal-deep">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <h2 className={h2}>Our commitment to editorial integrity</h2>
            <div className={`mt-5 space-y-5 ${body}`}>
              <p>
                Advertising and commercial partnerships are handled separately from independent
                editorial decisions. Sponsored content and paid promotions are identified
                transparently where applicable. Commercial partnerships do not guarantee
                favourable news coverage or influence independent reporting.
              </p>
              <p>
                All proposed collaborations are subject to relevance, suitability and editorial
                standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="max-w-3xl">
          <h2 className={h2}>Let's work together</h2>
          <div className={`mt-5 space-y-5 ${body}`}>
            <p>
              Whether you are promoting a healthcare product, launching a campaign, raising
              awareness of a public health initiative or communicating a medical innovation,
              Joseph Mmwa can help you explore ways to reach an audience interested in health
              and medicine.
            </p>
            <p className="font-semibold text-offwhite">Are you ready to reach your audience?</p>
          </div>
          <Link
            href="/contact"
            className="focus-ring mt-8 inline-block bg-accent px-6 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90"
          >
            Enquire About Advertising & Partnerships
          </Link>
          <p className={`mt-4 ${body}`}>
            Email:{" "}
            <a
              href="mailto:contact@josephmmwa.com"
              className="font-semibold text-accent hover:underline"
            >
              contact@josephmmwa.com
            </a>
          </p>
        </div>
      </section>

      {/* Follow me — target of “combined following” links */}
      <section
        id="follow"
        className="scroll-mt-24 border-t border-charcoal bg-charcoal-deep"
      >
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-muted">
              Follow me
            </p>
            <p className={`mt-3 ${body}`}>
              Connect on the platforms that make up the combined following of over 180,000.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-5">
              {socialLinks.map((social) => {
                const Icon = socialIconMap[social.label as keyof typeof socialIconMap];
                if (!Icon) return null;
                return (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="focus-ring text-gray-secondary transition-colors hover:text-accent"
                  >
                    <Icon className="h-6 w-6" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

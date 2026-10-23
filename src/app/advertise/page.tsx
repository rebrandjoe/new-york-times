import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Advertise With Me",
  description:
    "Advertising and partnership opportunities with Joseph Mmwa — reach audiences engaged with health and medical news across Kenya, Africa and the world.",
  alternates: { canonical: "/advertise" },
  openGraph: {
    title: "Advertise With Me — Joseph Mmwa",
    description:
      "Advertising and partnership opportunities with Joseph Mmwa — reach audiences engaged with health and medical news across Kenya, Africa and the world.",
    url: "/advertise",
  },
};

export default function AdvertisePage() {
  return (
    <>
      <section className="border-y border-charcoal bg-charcoal-deep">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <h1 className="font-serif text-3xl font-extrabold text-white sm:text-4xl">
              Advertise With Me
            </h1>
            <p className="mt-5 text-base leading-relaxed text-gray-secondary-light sm:text-lg">
              Reach audiences engaged with the stories shaping health and medicine.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="max-w-3xl space-y-5 text-base leading-relaxed text-gray-secondary-light sm:text-lg">
          <p>
            Joseph Mmwa offers advertising and partnership opportunities for organisations
            working across healthcare, pharmaceuticals, medical technology, research and
            public health.
          </p>
          <p>
            Connect your organisation with an audience interested in health developments
            across Kenya, Africa and the world through digital advertising, sponsored
            campaigns and tailored communication partnerships.
          </p>
          <p>
            All commercial collaborations are subject to editorial independence and
            transparent disclosure. Advertising and sponsorship do not guarantee favourable
            editorial coverage or influence independent reporting.
          </p>
        </div>
      </section>

      <section className="border-y border-charcoal bg-charcoal-deep">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <h2 className="font-serif text-2xl font-extrabold text-white sm:text-3xl">
              Interested in working with Joseph Mmwa?
            </h2>
            <p className="mt-5 text-base leading-relaxed text-gray-secondary-light sm:text-lg">
              Contact us to discuss advertising placements, campaign opportunities and
              strategic partnerships.
            </p>
            <Link
              href="/contact"
              className="focus-ring mt-8 inline-block bg-accent px-6 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90"
            >
              Enquire About Advertising & Partnerships
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Joseph Mmwa",
  description:
    "Get in touch with Joseph Mmwa for news tips, story submissions, corrections, research and media enquiries, partnership opportunities, or other professional matters.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Joseph Mmwa",
    description:
      "Get in touch with Joseph Mmwa for news tips, story submissions, corrections, research and media enquiries, partnership opportunities, or other professional matters.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <section className="border-y border-charcoal bg-charcoal-deep">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-2xl">
            <h1 className="font-serif text-4xl font-extrabold leading-tight text-white sm:text-5xl">
              Contact Joseph Mmwa
            </h1>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-gray-secondary-light sm:text-lg">
              <p>
                Get in touch with Joseph Mmwa for news tips, story submissions, corrections,
                research and media enquiries, partnership opportunities, or other professional
                matters.
              </p>
              <p>
                Whether you have a health story to share, information about a medical
                development, a correction to report, or a proposal for collaboration, your
                message is welcome.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="border border-charcoal bg-black/40 p-6 transition-colors hover:border-accent/40">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-muted">
                  Email
                </p>
                <a
                  href="mailto:contact@josephmmwa.com"
                  className="focus-ring mt-3 block break-all text-base font-semibold text-accent transition-opacity hover:opacity-90 sm:text-lg"
                >
                  contact@josephmmwa.com
                </a>
                <p className="mt-2 text-xs text-gray-muted">Opens your email app</p>
              </div>
              <div className="border border-charcoal bg-black/40 p-6 transition-colors hover:border-accent/40">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-muted">
                  Phone
                </p>
                <a
                  href="tel:+254729147765"
                  className="focus-ring mt-3 block text-base font-semibold text-accent transition-opacity hover:opacity-90 sm:text-lg"
                >
                  +254 729 147 765
                </a>
                <p className="mt-2 text-xs text-gray-muted">Opens your phone dialler</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-serif text-2xl font-extrabold text-white sm:text-3xl">
            Send us a message
          </h2>
          <p className="mt-3 text-sm text-gray-muted sm:text-base">
            Fill in the form below and your message will be sent directly.
          </p>
          <div className="mt-8 border border-charcoal bg-charcoal-deep/50 p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}

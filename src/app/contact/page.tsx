import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Joseph Mmwa",
  description:
    "Get in touch with Joseph Mmwa directly for story tips, corrections, research collaborations, or professional inquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Get in touch
        </p>
        <h1 className="mt-3 font-serif text-4xl font-extrabold text-white sm:text-5xl">
          Contact Joseph Mmwa
        </h1>
        <p className="mt-4 text-base text-gray-secondary-light">
          Get in touch with Joseph Mmwa directly for story tips, corrections,
          research collaborations, or professional inquiries.
        </p>

        <div className="mt-8 flex flex-col gap-4 border border-charcoal p-6 sm:flex-row sm:gap-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-muted">
              Email
            </p>
            <a
              href="mailto:contact@josephmmwa.com"
              className="focus-ring mt-1 block text-base font-semibold text-accent hover:underline"
            >
              contact@josephmmwa.com
            </a>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-muted">
              Phone
            </p>
            <a
              href="tel:+254729147765"
              className="focus-ring mt-1 block text-base font-semibold text-accent hover:underline"
            >
              +254 729 147 765
            </a>
          </div>
        </div>

        <div className="mt-10">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

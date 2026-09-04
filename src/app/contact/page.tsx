import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Joseph Mmwa",
  description:
    "Get in touch with Joseph Mmwa, Health & Medical Journalist, with story tips, corrections, or professional enquiries.",
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
          Reach out directly with story tips, corrections, research to share, or a
          professional enquiry — every message here goes to Joseph Mmwa, not a
          communications team.
        </p>

        <div className="mt-10">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

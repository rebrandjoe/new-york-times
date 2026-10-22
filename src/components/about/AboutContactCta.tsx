import Link from "next/link";

export function AboutContactCta() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-20">
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

      <div className="mx-auto mt-16 max-w-xl border-t border-charcoal pt-10">
        <p className="font-serif text-xl font-bold text-white sm:text-2xl">
          Joseph Mmwa — Independent Health Journalism.
        </p>
        <p className="mt-2 text-base font-medium text-accent">
          If it's health, it's here.
        </p>
      </div>
    </section>
  );
}

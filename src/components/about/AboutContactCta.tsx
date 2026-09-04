import Link from "next/link";

export function AboutContactCta() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-20">
      <h2 className="font-serif text-3xl font-extrabold text-white sm:text-4xl">
        Have something to share?
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-base text-gray-secondary-light sm:text-lg">
        If you&apos;re a reader, researcher, institution, or professional with
        health or medical information worth covering, a journalism enquiry, a
        correction, or a professional matter to raise — I&apos;d like to hear from
        you.
      </p>
      <Link
        href="/contact"
        className="focus-ring mt-8 inline-block bg-accent px-6 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90"
      >
        Contact Joseph Mmwa
      </Link>
    </section>
  );
}

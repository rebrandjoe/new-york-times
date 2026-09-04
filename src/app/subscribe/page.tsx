import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Subscribe",
  description:
    "Go deeper with a JOSEPH MMWA subscription — in-depth reporting, expert analysis, and the complete archive.",
  alternates: { canonical: "/subscribe" },
};

const benefits = [
  {
    name: "In-Depth Reporting",
    description: "Full stories with the context and analysis behind the headline.",
  },
  {
    name: "Expert Analysis",
    description: "Complex health and medical developments explained clearly.",
  },
  {
    name: "Complete Archive",
    description: "Every story published, always available to read.",
  },
];

export default function SubscribePage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Premium
        </p>
        <h1 className="mt-4 font-serif text-4xl font-extrabold text-white sm:text-5xl">
          Go deeper with a JOSEPH MMWA subscription
        </h1>
        <p className="mt-5 text-base text-gray-secondary-light sm:text-lg">
          Unlock full access to in-depth reporting, expert analysis, and the
          complete archive.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3">
        {benefits.map((benefit) => (
          <div key={benefit.name} className="border-t-2 border-accent pt-5">
            <h2 className="font-serif text-xl font-bold text-white">
              {benefit.name}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-secondary-light">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-2xl border border-accent p-8 text-center sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Coming soon
        </p>
        <h2 className="mt-3 font-serif text-2xl font-extrabold text-white sm:text-3xl">
          Subscriptions aren&apos;t open yet
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-gray-secondary-light sm:text-base">
          Get in touch and I&apos;ll let you know as soon as they launch.
        </p>
        <Link
          href="/contact"
          className="focus-ring mt-6 inline-block bg-accent px-6 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90"
        >
          Get in Touch
        </Link>
      </div>
    </div>
  );
}

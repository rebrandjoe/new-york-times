import type { ReactNode } from "react";

/** Shared shell for the site's long-form policy pages (editorial policy,
 * AI policy, fact-checking, corrections, terms of service) — single
 * reading column, no card grids, thin dividers between sections. */
export function PolicyPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
      <h1 className="mt-3 font-serif text-3xl font-extrabold leading-[1.1] text-white sm:text-4xl">
        {title}
      </h1>
      <p className="mt-6 font-serif text-lg font-bold text-white sm:text-xl">{intro}</p>
      <div className="mt-10">{children}</div>
    </div>
  );
}

export function PolicySection({
  heading,
  children,
  headingLevel = 2,
}: {
  heading: string;
  children: ReactNode;
  /** Use 3 when nested inside a PolicyGroup, so the page's heading outline stays correct. */
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 3 ? "h3" : "h2";
  return (
    <section className="mt-10 border-t border-charcoal pt-10 first:mt-0 first:border-t-0 first:pt-0">
      <Heading className="font-serif text-xl font-bold text-white sm:text-2xl">{heading}</Heading>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

/** Groups several PolicySections under one major heading — for pages that
 * merge more than one former policy into distinct parts (e.g. Corrections
 * & Fact-Checking). */
export function PolicyGroup({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div className="mt-14 border-t-2 border-accent/30 pt-10 first:mt-10">
      <h2 className="font-serif text-2xl font-extrabold text-white sm:text-3xl">{heading}</h2>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export function PolicyParagraph({ children }: { children: ReactNode }) {
  return <p className="text-base leading-relaxed text-gray-secondary-light sm:text-lg">{children}</p>;
}

export function PolicyLead({ children }: { children: ReactNode }) {
  return <p className="font-serif text-lg font-bold text-white sm:text-xl">{children}</p>;
}

export function PolicyList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed text-gray-secondary-light sm:text-lg">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

import type { ReactNode } from "react";

/** Shared shell for long-form policy pages — single reading column. */
export function PolicyPage({
  eyebrow,
  title,
  intro,
  updatedOn,
  effectiveOn,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  /** Faint date under headline, e.g. "2026-10-24". */
  updatedOn?: string;
  /** Alternate label: Effective on … */
  effectiveOn?: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
      )}
      <h1
        className={`font-serif text-3xl font-extrabold leading-[1.1] text-white sm:text-4xl ${
          eyebrow ? "mt-3" : ""
        }`}
      >
        {title}
      </h1>
      {updatedOn && (
        <p className="mt-3 text-sm text-gray-muted/90">
          Updated on <time dateTime={updatedOn}>{formatPolicyDate(updatedOn)}</time>
        </p>
      )}
      {effectiveOn && (
        <p className="mt-3 text-sm text-gray-muted/90">
          Effective on <time dateTime={effectiveOn}>{formatPolicyDate(effectiveOn)}</time>
        </p>
      )}
      {intro && (
        <p className="mt-6 font-serif text-lg font-bold text-white sm:text-xl">{intro}</p>
      )}
      <div className={intro || updatedOn || effectiveOn ? "mt-10" : "mt-8"}>{children}</div>
    </div>
  );
}

function formatPolicyDate(isoOrDisplay: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(isoOrDisplay)) {
    const d = new Date(`${isoOrDisplay}T12:00:00Z`);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      });
    }
  }
  return isoOrDisplay;
}

export function PolicySection({
  heading,
  children,
  headingLevel = 2,
}: {
  heading: string;
  children: ReactNode;
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

/** Subheading inside a PolicySection (e.g. Account information under §1). */
export function PolicySubheading({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-6 font-serif text-lg font-bold text-white first:mt-0 sm:text-xl">{children}</h3>
  );
}

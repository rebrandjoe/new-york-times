import Link from "next/link";

export function SectionHeading({
  title,
  href,
  linkLabel,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 border-b border-charcoal pb-4 sm:mb-8">
      <h2 className="font-serif text-2xl font-extrabold text-white sm:text-3xl">
        {title}
      </h2>
      {href && linkLabel && (
        <Link
          href={href}
          className="focus-ring shrink-0 text-sm font-semibold text-accent hover:underline"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}

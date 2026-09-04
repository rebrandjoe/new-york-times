import Link from "next/link";

export function AuthShell({
  heading,
  subtext,
  children,
  footer,
}: {
  heading: string;
  subtext?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-[1440px] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          JOSEPH MMWA
        </p>
        <h1 className="mt-3 font-serif text-3xl font-extrabold text-white sm:text-4xl">
          {heading}
        </h1>
        {subtext && (
          <p className="mt-3 text-sm text-gray-secondary-light">{subtext}</p>
        )}

        <div className="mt-8">{children}</div>

        {footer && <div className="mt-6 text-sm text-gray-secondary">{footer}</div>}
      </div>
    </div>
  );
}

export function AuthLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="focus-ring font-semibold text-accent hover:underline">
      {children}
    </Link>
  );
}

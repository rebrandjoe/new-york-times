import Link from "next/link";
import { Tagline, WordmarkLink } from "@/components/Wordmark";

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
    <div className="mx-auto grid min-h-[75vh] max-w-[1440px] grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-charcoal bg-charcoal-deep p-12 lg:flex">
        <WordmarkLink className="text-2xl" />

        <div>
          <div className="h-1 w-16 bg-accent" />
          <p className="mt-6 max-w-sm font-serif text-3xl font-bold leading-snug text-white">
            Global health news you can trust — from Kenya, across Africa, and
            around the world.
          </p>
        </div>

        <Tagline className="text-sm text-gray-secondary" />
      </div>

      <div className="flex items-center justify-center bg-black px-4 py-16 sm:px-6 lg:px-12">
        <div className="w-full max-w-md">
          <WordmarkLink className="text-2xl" />

          <div className="mt-8 border border-white/10 bg-charcoal p-6 sm:p-10">
            <div className="h-1 w-12 bg-accent" />
            <h1 className="mt-4 font-serif text-3xl font-extrabold text-white sm:text-4xl">
              {heading}
            </h1>
            {subtext && (
              <p className="mt-3 text-sm text-gray-secondary-light">{subtext}</p>
            )}

            <div className="mt-8">{children}</div>
          </div>

          {footer && (
            <div className="mt-6 text-center text-sm text-gray-secondary">{footer}</div>
          )}
        </div>
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

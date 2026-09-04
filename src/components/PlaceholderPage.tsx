import Link from "next/link";

export function PlaceholderPage({
  title,
  message = "This page is coming soon.",
}: {
  title: string;
  message?: string;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[1440px] flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
        JOSEPH MMWA
      </p>
      <h1 className="mt-4 font-serif text-4xl font-extrabold text-white sm:text-5xl">
        {title}
      </h1>
      <p className="mt-4 max-w-md text-base text-gray-secondary-light">{message}</p>
      <Link
        href="/"
        className="focus-ring mt-8 border border-accent px-6 py-3 text-sm font-semibold text-accent transition-opacity hover:opacity-80"
      >
        Back to homepage
      </Link>
    </div>
  );
}

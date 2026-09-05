import Link from "next/link";

export function AlreadyMember() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-success">Premium member</p>
      <h1 className="mt-4 font-serif text-3xl font-extrabold text-white sm:text-4xl">
        You&apos;re already a JOSEPH MMWA Premium member
      </h1>
      <p className="mt-4 text-base text-gray-secondary-light">
        Thank you for supporting independent health journalism. You have full access to every story.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/account"
          className="focus-ring bg-accent px-6 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90"
        >
          Go to your account
        </Link>
        <Link
          href="/latest"
          className="focus-ring border border-charcoal px-6 py-3 text-sm font-semibold text-offwhite hover:border-accent hover:text-accent"
        >
          Explore premium journalism
        </Link>
      </div>
    </div>
  );
}

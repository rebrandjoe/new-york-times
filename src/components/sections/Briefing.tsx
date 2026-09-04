"use client";

export function Briefing() {
  return (
    <section
      aria-labelledby="briefing-heading"
      className="border-y border-charcoal bg-charcoal-deep"
    >
      <div className="mx-auto max-w-[1440px] px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Newsletter
        </p>
        <h2
          id="briefing-heading"
          className="mt-3 font-serif text-3xl font-extrabold text-white sm:text-4xl"
        >
          The MMWA Briefing
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-gray-secondary-light">
          The week&apos;s most important health stories, explained — delivered to your
          inbox.
        </p>
        <form
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor="briefing-email" className="sr-only">
            Email address
          </label>
          <input
            id="briefing-email"
            type="email"
            required
            placeholder="Your email address"
            className="focus-ring w-full border border-charcoal bg-black px-4 py-3 text-sm text-offwhite placeholder:text-gray-muted"
          />
          <button
            type="submit"
            className="focus-ring shrink-0 bg-accent px-6 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90"
          >
            Sign up
          </button>
        </form>
      </div>
    </section>
  );
}

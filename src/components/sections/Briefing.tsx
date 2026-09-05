"use client";

import { useActionState } from "react";
import { subscribeToNewsletter } from "@/lib/actions/newsletter";
import { initialNewsletterState } from "@/lib/actions/form-state";
import { SuccessMessage } from "@/components/form/SuccessMessage";

export function Briefing() {
  const [state, formAction, isPending] = useActionState(subscribeToNewsletter, initialNewsletterState);

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

        {state.status === "success" ? (
          <div className="mx-auto mt-8 max-w-md text-left">
            <SuccessMessage>{state.message}</SuccessMessage>
          </div>
        ) : (
          <form action={formAction} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <label htmlFor="briefing-email" className="sr-only">
              Email address
            </label>
            <input
              id="briefing-email"
              name="email"
              type="email"
              required
              placeholder="Your email address"
              className="focus-ring w-full border border-charcoal bg-black px-4 py-3 text-sm text-offwhite placeholder:text-gray-muted"
            />
            <button
              type="submit"
              disabled={isPending}
              className="focus-ring shrink-0 bg-accent px-6 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isPending ? "Signing up…" : "Sign up"}
            </button>
          </form>
        )}
        {state.status === "error" && (
          <p role="alert" className="mx-auto mt-4 max-w-md border border-live-red/40 bg-live-red/10 px-4 py-3 text-sm text-live-red">
            {state.message}
          </p>
        )}
      </div>
    </section>
  );
}

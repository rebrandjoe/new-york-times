import type { Metadata } from "next";
import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/public";

export const metadata: Metadata = {
  title: "Confirm Subscription",
  robots: { index: false, follow: false },
};

async function confirmSubscription(token: string | undefined) {
  if (!token) return false;
  const supabase = createPublicClient();
  // A narrow SECURITY DEFINER function, not a table update+select: the anon
  // role has no SELECT policy on this table (subscriber lists are
  // admin-only), so a normal update-then-read-back would always look like
  // it failed even when it succeeded.
  const { data, error } = await supabase.rpc("confirm_newsletter_subscription", { p_token: token });
  return !error && data === true;
}

export default async function NewsletterConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const confirmed = await confirmSubscription(token);

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6 lg:px-8">
      {confirmed ? (
        <>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-success">Confirmed</p>
          <h1 className="mt-4 font-serif text-3xl font-extrabold text-white sm:text-4xl">
            You&apos;re subscribed to The MMWA Briefing
          </h1>
          <p className="mt-4 border-l-2 border-success bg-success/10 px-4 py-3 text-left text-base text-offwhite">
            Your subscription is confirmed. Look out for the week&apos;s most important health
            stories in your inbox.
          </p>
        </>
      ) : (
        <>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-live-red">Not confirmed</p>
          <h1 className="mt-4 font-serif text-3xl font-extrabold text-white sm:text-4xl">
            This confirmation link isn&apos;t valid
          </h1>
          <p className="mt-4 text-base text-gray-secondary-light">
            It may have already been used, or the link may have expired. You can sign up again
            from the homepage.
          </p>
        </>
      )}
      <Link
        href="/"
        className="focus-ring mt-8 inline-block border border-charcoal px-6 py-3 text-sm font-semibold text-offwhite hover:border-accent hover:text-accent"
      >
        Back to homepage
      </Link>
    </div>
  );
}

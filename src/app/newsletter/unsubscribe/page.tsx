import type { Metadata } from "next";
import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/public";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

async function unsubscribe(token: string | undefined) {
  if (!token) return false;
  const supabase = createPublicClient();
  const { data, error } = await supabase.rpc("unsubscribe_newsletter", { p_token: token });
  return !error && data === true;
}

export default async function NewsletterUnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const unsubscribed = await unsubscribe(token);

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
        {unsubscribed ? "Unsubscribed" : "Not found"}
      </p>
      <h1 className="mt-4 font-serif text-3xl font-extrabold text-white sm:text-4xl">
        {unsubscribed ? "You've been unsubscribed" : "This link isn't valid"}
      </h1>
      <p className="mt-4 text-base text-gray-secondary-light">
        {unsubscribed
          ? "You won't receive The MMWA Briefing anymore. You can resubscribe anytime from the homepage."
          : "This unsubscribe link may have already been used."}
      </p>
      <Link
        href="/"
        className="focus-ring mt-8 inline-block border border-charcoal px-6 py-3 text-sm font-semibold text-offwhite hover:border-accent hover:text-accent"
      >
        Back to homepage
      </Link>
    </div>
  );
}

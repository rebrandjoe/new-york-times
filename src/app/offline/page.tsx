import type { Metadata } from "next";
import { OfflineRetryButton } from "@/components/pwa/OfflineRetryButton";

export const metadata: Metadata = {
  title: "You're offline",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:py-32">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
        className="h-12 w-12 text-accent"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.5 8.5c5.25-4.667 13.75-4.667 19 0M5.5 12c3.5-3 9.5-3 13 0M8.5 15.5c1.75-1.333 5.25-1.333 7 0M12 19h.01M2 2l20 20"
        />
      </svg>
      <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-accent">
        No connection
      </p>
      <h1 className="mt-3 font-serif text-3xl font-extrabold leading-[1.1] text-white sm:text-4xl">
        You&apos;re offline
      </h1>
      <p className="mt-6 max-w-md text-base leading-relaxed text-gray-secondary-light sm:text-lg">
        This page hasn&apos;t been saved for offline reading. Reconnect to the internet and try
        again — anything you&apos;ve already read on JOSEPH MMWA stays available offline.
      </p>
      <div className="mt-10">
        <OfflineRetryButton />
      </div>
    </div>
  );
}

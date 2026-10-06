"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";
import type { ActiveTicker } from "@/lib/cms/ticker";

/**
 * Admin routes get their own work-focused shell (see /admin/layout.tsx) —
 * no live ticker, public nav, or Subscribe/Sign-in bar. Everywhere else
 * gets the standard public header/footer.
 */
export function SiteChrome({
  ticker,
  children,
}: {
  ticker: ActiveTicker | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <main id="main-content">{children}</main>;
  }

  return (
    <>
      <Header ticker={ticker} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}

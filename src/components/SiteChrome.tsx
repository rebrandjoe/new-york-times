"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";

/**
 * Admin routes get their own work-focused shell (see /admin/layout.tsx) —
 * no live ticker, public nav, or Subscribe/Sign-in bar. Everywhere else
 * gets the standard public header/footer.
 */
export function SiteChrome({
  tickerHeadline,
  children,
}: {
  tickerHeadline: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <main id="main-content">{children}</main>;
  }

  return (
    <>
      <Header tickerHeadline={tickerHeadline} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}

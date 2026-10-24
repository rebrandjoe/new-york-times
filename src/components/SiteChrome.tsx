"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";
import { MedicalDisclaimerTab } from "@/components/MedicalDisclaimerTab";
import type { ActiveTicker } from "@/lib/cms/ticker";

/**
 * Admin routes get their own work-focused shell (see /admin/layout.tsx).
 * Public routes keep the standard site chrome.
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
      <MedicalDisclaimerTab />
    </>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium",
  description:
    "Unlock premium health journalism from JOSEPH MMWA — investigative reports, medical research analysis, archive access, and an ad-free reading experience.",
  alternates: { canonical: "/premium" },
  openGraph: {
    url: "/premium",
    title: "Premium | JOSEPH MMWA",
    description:
      "Unlock premium health journalism — investigative reports, medical research analysis, and ad-free reading.",
  },
};

export default function PremiumLayout({ children }: { children: React.ReactNode }) {
  return children;
}

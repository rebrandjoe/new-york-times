import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium Membership",
  description:
    "Premium membership for Joseph Mmwa — in-depth investigative health reporting, medical research analysis, archive access, and an ad-free reading experience.",
  alternates: { canonical: "/premium" },
  openGraph: {
    url: "/premium",
    title: "Premium Membership | JOSEPH MMWA",
    description:
      "Health journalism beyond the headlines. Independent reporting, deeper analysis, and an ad-free reading experience.",
  },
};

export default function PremiumLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { WhoIAm } from "@/components/about/WhoIAm";
import { GlobalCoverage } from "@/components/about/GlobalCoverage";
import { WhatICover } from "@/components/about/WhatICover";
import { WhyItMatters } from "@/components/about/WhyItMatters";
import { AboutContactCta } from "@/components/about/AboutContactCta";

export const metadata: Metadata = {
  title: "Joseph Mmwa — Health & Medical Journalist",
  description:
    "Joseph Mmwa is a Kenyan health news editor and aggregator focused on making health and medical news clear, accessible, and meaningful to everyone — across Kenya, Africa, and the world.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Joseph Mmwa — Health & Medical Journalist",
    description:
      "Joseph Mmwa is a Kenyan health news editor and aggregator focused on making health and medical news clear, accessible, and meaningful to everyone — across Kenya, Africa, and the world.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <WhoIAm />
      <GlobalCoverage />
      <WhatICover />
      <WhyItMatters />
      <AboutContactCta />
    </>
  );
}

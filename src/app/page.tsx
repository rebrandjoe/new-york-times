import type { Metadata } from "next";
import { Hero } from "@/components/hero/Hero";
import { LeadNews } from "@/components/sections/LeadNews";
import { LatestNews } from "@/components/sections/LatestNews";
import { RegionalSection } from "@/components/sections/RegionalSection";
import { HealthTopics } from "@/components/sections/HealthTopics";
import { Briefing } from "@/components/sections/Briefing";
import { Premium } from "@/components/sections/Premium";
import { getPublishedArticles, getTopics } from "@/lib/cms/queries";
import { toHomepageArticle } from "@/lib/cms/mappers";
import type { RegionSlug } from "@/lib/types";
import { SUPABASE_LOGO_URL } from "@/components/Wordmark";

const SITE_URL = "https://josephmmwa.com";
const SITE_TITLE = "JOSEPH MMWA — If it's health, it's here";
const SITE_DESCRIPTION =
  "The world's biggest health and medical news explained as they happen.";
/** Prefer hero for share cards; fall back to brand mark. */
const HOME_OG_IMAGE = `${SITE_URL}/images/hero-group.jpg`;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: HOME_OG_IMAGE,
        alt: "JOSEPH MMWA — global health news",
        width: 1200,
        height: 630,
      },
      {
        url: SUPABASE_LOGO_URL,
        alt: "JOSEPH MMWA logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [HOME_OG_IMAGE],
  },
};

const REGIONS: { slug: RegionSlug; label: string; href: string }[] = [
  { slug: "kenya", label: "Kenya", href: "/kenya" },
  { slug: "global", label: "Global", href: "/global" },
];

export default async function Home() {
  const [latestRows, kenyaRows, globalRows, topics] = await Promise.all([
    getPublishedArticles({ limit: 16 }),
    getPublishedArticles({ categorySlug: "kenya", limit: 4 }),
    getPublishedArticles({ categorySlug: "global", limit: 4 }),
    getTopics(),
  ]);

  const latest = latestRows.map(toHomepageArticle);

  // Top Stories — primary auto-swipe (no buried carousel)
  const topStories = latest.slice(0, 8);
  // Latest list — next stories only (no overlap with Top Stories)
  const latestNewsArticles = latest.slice(8, 16);

  const regionRows: Record<RegionSlug, ReturnType<typeof toHomepageArticle>[]> = {
    kenya: kenyaRows.map(toHomepageArticle),
    global: globalRows.map(toHomepageArticle),
  };

  const regionTabs = REGIONS.map((region) => ({
    ...region,
    featured: regionRows[region.slug][0],
    supporting: regionRows[region.slug].slice(1, 4),
  })).filter((region): region is typeof region & { featured: NonNullable<typeof region.featured> } =>
    Boolean(region.featured)
  );

  return (
    <>
      <Hero
        imageSrc="/images/hero-group.jpg"
        imageAlt="A diverse group of people smiling together"
      />
      {topStories.length > 0 && <LeadNews articles={topStories} />}
      {latestNewsArticles.length > 0 && <LatestNews articles={latestNewsArticles} />}
      {regionTabs.length > 0 && <RegionalSection regions={regionTabs} />}
      <HealthTopics topics={topics} />
      <Briefing />
      <Premium />
    </>
  );
}

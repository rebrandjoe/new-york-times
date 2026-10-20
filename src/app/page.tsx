import type { Metadata } from "next";
import { Hero } from "@/components/hero/Hero";
import { LeadNews } from "@/components/sections/LeadNews";
import { LatestNews } from "@/components/sections/LatestNews";
import { TrendingNow } from "@/components/sections/TrendingNow";
import { RegionalSection } from "@/components/sections/RegionalSection";
import { HealthTopics } from "@/components/sections/HealthTopics";
import { Briefing } from "@/components/sections/Briefing";
import { Premium } from "@/components/sections/Premium";
import { getPublishedArticles, getTopics } from "@/lib/cms/queries";
import { toHomepageArticle } from "@/lib/cms/mappers";
import type { RegionSlug } from "@/lib/types";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
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

  // Top Stories — first interactive swipe (lead pack)
  const topStories = latest.slice(0, 8);
  // Trending — numbered list of the next set (no overlap with top 8)
  const trendingArticles = latest.slice(8, 14);
  // Latest — remaining for archive-style list (avoid duplicating top pack)
  const latestNewsArticles = latest.slice(6, 14);

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
      {trendingArticles.length > 0 && <TrendingNow articles={trendingArticles} />}
      {latestNewsArticles.length > 0 && <LatestNews articles={latestNewsArticles} />}
      {regionTabs.length > 0 && <RegionalSection regions={regionTabs} />}
      <HealthTopics topics={topics} />
      <Briefing />
      <Premium />
    </>
  );
}

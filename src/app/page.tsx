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

const REGIONS: { slug: RegionSlug; label: string; href: string }[] = [
  { slug: "africa", label: "Africa", href: "/africa" },
  { slug: "kenya", label: "Kenya", href: "/kenya" },
  { slug: "global", label: "Global", href: "/global" },
];

export default async function Home() {
  const [latestRows, africaRows, kenyaRows, globalRows, topics] = await Promise.all([
    getPublishedArticles({ limit: 10 }),
    getPublishedArticles({ categorySlug: "africa", limit: 4 }),
    getPublishedArticles({ categorySlug: "kenya", limit: 4 }),
    getPublishedArticles({ categorySlug: "global", limit: 4 }),
    getTopics(),
  ]);

  const latest = latestRows.map(toHomepageArticle);
  const leadPrimary = latest[0];
  const leadSecondary = latest.slice(1, 4);
  const latestNewsArticles = latest.slice(4, 10);

  const regionRows: Record<RegionSlug, ReturnType<typeof toHomepageArticle>[]> = {
    africa: africaRows.map(toHomepageArticle),
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
      {leadPrimary && <LeadNews primary={leadPrimary} secondary={leadSecondary} />}
      {latestNewsArticles.length > 0 && <LatestNews articles={latestNewsArticles} />}
      {regionTabs.length > 0 && <RegionalSection regions={regionTabs} />}
      <HealthTopics topics={topics} />
      <Briefing />
      <Premium />
    </>
  );
}

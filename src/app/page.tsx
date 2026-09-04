import { Hero } from "@/components/hero/Hero";
import { LeadNews } from "@/components/sections/LeadNews";
import { LatestNews } from "@/components/sections/LatestNews";
import { RegionalSection } from "@/components/sections/RegionalSection";
import { HealthTopics } from "@/components/sections/HealthTopics";
import { Briefing } from "@/components/sections/Briefing";
import { Premium } from "@/components/sections/Premium";
import {
  latestArticles,
  leadArticle,
  leadSecondaryArticles,
  regionalArticles,
} from "@/lib/mock-data";

const regionTabs = [
  { slug: "africa" as const, label: "Africa", href: "/africa", ...regionalArticles.africa },
  { slug: "kenya" as const, label: "Kenya", href: "/kenya", ...regionalArticles.kenya },
  { slug: "global" as const, label: "Global", href: "/global", ...regionalArticles.global },
];

export default function Home() {
  return (
    <>
      <Hero
        imageSrc="/images/hero-group.jpg"
        imageAlt="A diverse group of people smiling together"
      />
      <LeadNews primary={leadArticle} secondary={leadSecondaryArticles} />
      <LatestNews articles={latestArticles} />
      <RegionalSection regions={regionTabs} />
      <HealthTopics />
      <Briefing />
      <Premium />
    </>
  );
}

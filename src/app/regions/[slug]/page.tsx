import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticlesByRegion } from "@/lib/cms/queries";
import { toHomepageArticle } from "@/lib/cms/mappers";
import { RegionArticlesClient, type ArticleItem } from "@/components/RegionArticlesClient";
import { majorRegions } from "@/lib/nav";

export async function generateStaticParams() {
  return majorRegions.map((region) => ({ slug: region.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const region = majorRegions.find((r) => r.slug === slug);
  if (!region) return { title: "Region" };

  return {
    title: `${region.name} | JOSEPH MMWA`,
    description: `Health and medical news from ${region.name}, reported by JOSEPH MMWA.`,
    alternates: { canonical: `/regions/${region.slug}` },
  };
}

export default async function RegionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const region = majorRegions.find((r) => r.slug === slug);
  if (!region) notFound();

  const rows = await getArticlesByRegion(region.name, 100);
  const articles: ArticleItem[] = rows.map((row) => ({
    ...toHomepageArticle(row),
    country: row.country,
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <RegionArticlesClient articles={articles} regionName={region.name} />
    </div>
  );
}

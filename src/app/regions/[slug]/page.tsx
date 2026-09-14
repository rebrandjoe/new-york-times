import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedArticles } from "@/lib/cms/queries";
import { toHomepageArticle } from "@/lib/cms/mappers";
import { majorRegions } from "@/lib/nav";
import { RegionArticlesClient, type ArticleItem } from "@/components/RegionArticlesClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const regionObj = majorRegions.find((r) => r.slug === slug);
  if (!regionObj) return { title: "Region Not Found" };

  return {
    title: `${regionObj.name} Health Coverage | JOSEPH MMWA`,
    description: `Health dispatches, outbreak tracking, and country reports across ${regionObj.name}.`,
    alternates: { canonical: `/regions/${regionObj.slug}` },
  };
}

export default async function RegionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const regionObj = majorRegions.find((r) => r.slug === slug);
  if (!regionObj) notFound();

  // Fetch articles and filter/map safely to ArticleItem shape
  const rows = await getPublishedArticles({ limit: 100 });
  const regionNameLower = regionObj.name.toLowerCase();
  
  const filteredRows = rows.filter((row: any) => {
    const reg = (row.region || "").toLowerCase();
    const slugMatch = slug.replace("-", " ");
    return reg === regionNameLower || reg.includes(slugMatch);
  });

  const articles: ArticleItem[] = filteredRows.map((row) => {
    const item = toHomepageArticle(row);
    return {
      id: item.id,
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt,
      country: row.country || undefined,
      region: row.region || regionObj.name,
      publication_date: item.publication_date,
    };
  });

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
      <RegionArticlesClient
        articles={articles}
        regionName={regionObj.name}
      />
    </div>
  );
}

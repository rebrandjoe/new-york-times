import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { healthTopics } from "@/lib/mock-data";

export function generateStaticParams() {
  return healthTopics.map((topic) => ({ slug: topic.slug }));
}

function titleFromSlug(slug: string) {
  const known = healthTopics.find((t) => t.slug === slug);
  if (known) return known.name;
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: titleFromSlug(slug) };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <PlaceholderPage
      title={titleFromSlug(slug)}
      message="Stories on this topic are coming soon."
    />
  );
}

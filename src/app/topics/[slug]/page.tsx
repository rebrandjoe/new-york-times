import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListItemCard } from "@/components/ArticleCard";
import { getPublishedArticles, getTopics } from "@/lib/cms/queries";
import { toHomepageArticle } from "@/lib/cms/mappers";
import { TopicArticlesClient, type ArticleItem } from "@/components/TopicArticlesClient";

export async function generateStaticParams() {
  const topics = await getTopics();
  return topics.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topics = await getTopics();
  const topic = topics.find((t) => t.slug === slug);
  if (!topic) return { title: "Topic" };

  return {
    title: topic.name,
    description: `Health and medical news on ${topic.name}, reported by JOSEPH MMWA.`,
    alternates: { canonical: `/topics/${topic.slug}` },
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topics = await getTopics();
  const topic = topics.find((t) => t.slug === slug);
  if (!topic) notFound();

  const rows = await getPublishedArticles({ topicSlug: slug, limit: 100 });
  const articles: ArticleItem[] = rows.map((row) => toHomepageArticle(row));

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Topic</p>
      <h1 className="mt-3 font-serif text-4xl font-extrabold text-white sm:text-5xl">
        {topic.name}
      </h1>

      <TopicArticlesClient
        articles={articles}
        topicName={topic.name}
        topicSlug={topic.slug}
      />
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListItemCard } from "@/components/ArticleCard";
import { getPublishedArticles, getTopics } from "@/lib/cms/queries";
import { toHomepageArticle } from "@/lib/cms/mappers";

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

  const rows = await getPublishedArticles({ topicSlug: slug, limit: 30 });
  const articles = rows.map(toHomepageArticle);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Topic</p>
      <h1 className="mt-3 font-serif text-4xl font-extrabold text-white sm:text-5xl">{topic.name}</h1>

      {articles.length === 0 ? (
        <p className="mt-10 text-base text-gray-secondary-light">
          No stories on {topic.name} have been published yet. Check back soon.
        </p>
      ) : (
        <div className="mt-10">
          {articles.map((article) => (
            <ListItemCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

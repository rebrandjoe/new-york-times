import type { Metadata } from "next";
import { Homepage } from "@/components/Homepage";
import { getPublishedArticles, getTopics } from "@/lib/cms/queries";
import { toHomepageArticle } from "@/lib/cms/mappers";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
  },
};

export default async function HomePage() {
  const [rows, topics] = await Promise.all([
    getPublishedArticles({ limit: 24 }),
    getTopics(),
  ]);
  const articles = rows.map(toHomepageArticle);

  return <Homepage articles={articles} topics={topics} />;
}

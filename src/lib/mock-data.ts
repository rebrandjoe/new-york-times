import type { Article, Category, RegionSlug, Topic } from "./types";

const category: Category = { id: "cat-1", name: "Category", slug: "category" };

const topic: Topic = { id: "topic-1", name: "Topic", slug: "topic" };

function placeholderArticle(id: string, region?: RegionSlug): Article {
  return {
    id,
    slug: `article-${id}`,
    headline: "Article headline",
    description: "Article description goes here, summarizing the story in one or two lines.",
    category,
    topics: [topic],
    region,
    author: { id: "author-1", name: "Author name", slug: "author-name" },
    image: { src: null, alt: "Article headline" },
    publication: { date: "Sep 3, 2026", readTime: "3 min read" },
  };
}

export const leadArticle: Article = placeholderArticle("lead");

export const leadSecondaryArticles: Article[] = [
  placeholderArticle("lead-2"),
  placeholderArticle("lead-3"),
  placeholderArticle("lead-4"),
];

export const latestArticles: Article[] = Array.from({ length: 6 }, (_, i) =>
  placeholderArticle(`latest-${i + 1}`)
);

export const regionalArticles: Record<RegionSlug, { featured: Article; supporting: Article[] }> = {
  africa: {
    featured: placeholderArticle("africa-featured", "africa"),
    supporting: [
      placeholderArticle("africa-1", "africa"),
      placeholderArticle("africa-2", "africa"),
      placeholderArticle("africa-3", "africa"),
    ],
  },
  kenya: {
    featured: placeholderArticle("kenya-featured", "kenya"),
    supporting: [
      placeholderArticle("kenya-1", "kenya"),
      placeholderArticle("kenya-2", "kenya"),
      placeholderArticle("kenya-3", "kenya"),
    ],
  },
  global: {
    featured: placeholderArticle("global-featured", "global"),
    supporting: [
      placeholderArticle("global-1", "global"),
      placeholderArticle("global-2", "global"),
      placeholderArticle("global-3", "global"),
    ],
  },
};

export const healthTopics: Topic[] = [
  { id: "t-global-health", name: "Global Health", slug: "global-health" },
  { id: "t-research", name: "Medical Research", slug: "medical-research" },
  { id: "t-infectious", name: "Infectious Diseases", slug: "infectious-diseases" },
  { id: "t-hiv", name: "HIV & AIDS", slug: "hiv-aids" },
  { id: "t-vaccines", name: "Vaccines", slug: "vaccines" },
  { id: "t-cancer", name: "Cancer", slug: "cancer" },
  { id: "t-public-health", name: "Public Health", slug: "public-health" },
  { id: "t-policy", name: "Health Policy", slug: "health-policy" },
  { id: "t-healthcare", name: "Healthcare", slug: "healthcare" },
  { id: "t-ai", name: "AI & Health", slug: "ai-health" },
  { id: "t-maternal", name: "Maternal & Child Health", slug: "maternal-child-health" },
  { id: "t-nutrition", name: "Nutrition", slug: "nutrition" },
  { id: "t-mental", name: "Mental Health", slug: "mental-health" },
  { id: "t-emerging", name: "Emerging Diseases", slug: "emerging-diseases" },
  { id: "t-breakthroughs", name: "Medical Breakthroughs", slug: "medical-breakthroughs" },
];

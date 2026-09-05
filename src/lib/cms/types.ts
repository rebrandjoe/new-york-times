import type { ContentBlock } from "./blocks";

export interface CmsCategory {
  id: string;
  name: string;
  slug: string;
}

export interface CmsTopic {
  id: string;
  name: string;
  slug: string;
}

export interface CmsAuthor {
  id: string;
  name: string;
  slug: string;
  title: string;
}

export interface CmsMedia {
  id: string;
  type: "image" | "video";
  url: string;
  altText: string | null;
  caption: string | null;
  credit: string | null;
  source: string | null;
  linkUrl: string | null;
}

export type ArticleStatus = "draft" | "scheduled" | "published" | "unpublished";

export interface CmsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: ContentBlock[];
  featuredImage: CmsMedia | null;
  category: CmsCategory;
  topics: CmsTopic[];
  region: string | null;
  country: string | null;
  author: CmsAuthor;
  publicationDate: string;
  updatedAt: string;
  readTimeMinutes: number;
  status: ArticleStatus;
  scheduledAt: string | null;
  premium: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  socialImage: CmsMedia | null;
  source: {
    name: string | null;
    author: string | null;
    institution: string | null;
    url: string | null;
    publishedAt: string | null;
    additional: string | null;
  };
}

export interface ArticleListItem {
  id: string;
  slug: string;
  title: string;
  status: ArticleStatus;
  category: CmsCategory;
  author: CmsAuthor;
  publicationDate: string;
  updatedAt: string;
}

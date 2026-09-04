export interface ImageAsset {
  src: string | null;
  alt: string;
  focalPoint?: "top" | "center" | "bottom";
}

export interface Author {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Topic {
  id: string;
  name: string;
  slug: string;
}

export type RegionSlug = "africa" | "kenya" | "global";

export interface Region {
  id: string;
  name: string;
  slug: RegionSlug;
}

export interface PublicationMeta {
  date: string;
  readTime: string;
}

export interface Article {
  id: string;
  slug: string;
  headline: string;
  description: string;
  category: Category;
  topics: Topic[];
  region?: RegionSlug;
  author?: Author;
  image: ImageAsset;
  publication: PublicationMeta;
}

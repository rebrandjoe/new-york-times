import type { Metadata } from "next";
import { CategoryArchive } from "@/components/category/CategoryArchive";

export const metadata: Metadata = {
  title: "Global",
  description: "Global health and medical news, reported by JOSEPH MMWA.",
  alternates: { canonical: "/global" },
};

export default function GlobalPage() {
  return <CategoryArchive categorySlug="global" categoryName="Global" />;
}

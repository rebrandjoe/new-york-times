import type { Metadata } from "next";
import { CategoryArchive } from "@/components/category/CategoryArchive";

export const metadata: Metadata = {
  title: "Africa",
  description: "Health and medical news from across Africa, reported by JOSEPH MMWA.",
  alternates: { canonical: "/africa" },
};

export default function AfricaPage() {
  return <CategoryArchive categorySlug="africa" categoryName="Africa" />;
}

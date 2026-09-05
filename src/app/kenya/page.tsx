import type { Metadata } from "next";
import { CategoryArchive } from "@/components/category/CategoryArchive";

export const metadata: Metadata = {
  title: "Kenya",
  description: "Health and medical news from Kenya, reported by JOSEPH MMWA.",
  alternates: { canonical: "/kenya" },
};

export default function KenyaPage() {
  return <CategoryArchive categorySlug="kenya" categoryName="Kenya" />;
}

import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const metadata: Metadata = {
  title: "Article",
};

export default function ArticlePage() {
  return (
    <PlaceholderPage
      title="Article"
      message="Full article pages are coming soon."
    />
  );
}

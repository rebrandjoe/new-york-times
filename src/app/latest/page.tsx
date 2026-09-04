import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const metadata: Metadata = { title: "Latest" };

export default function LatestPage() {
  return (
    <PlaceholderPage
      title="Latest"
      message="The full latest news feed is coming soon."
    />
  );
}

import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage() {
  return <PlaceholderPage title="Search" message="Site search is coming soon." />;
}

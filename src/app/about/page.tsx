import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return <PlaceholderPage title="About" message="The About page is coming soon." />;
}

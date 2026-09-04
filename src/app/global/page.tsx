import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const metadata: Metadata = { title: "Global" };

export default function GlobalPage() {
  return (
    <PlaceholderPage
      title="Global"
      message="The Global regional news page is coming soon."
    />
  );
}

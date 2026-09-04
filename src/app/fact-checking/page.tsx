import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const metadata: Metadata = { title: "Fact-Checking" };

export default function FactCheckingPage() {
  return (
    <PlaceholderPage
      title="Fact-Checking"
      message="Our fact-checking policy is coming soon."
    />
  );
}

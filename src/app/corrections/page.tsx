import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const metadata: Metadata = { title: "Corrections" };

export default function CorrectionsPage() {
  return (
    <PlaceholderPage title="Corrections" message="Our corrections policy is coming soon." />
  );
}

import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <PlaceholderPage title="Terms of Service" message="Our terms of service are coming soon." />
  );
}

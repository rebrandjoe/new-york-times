import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return <PlaceholderPage title="Contact" message="The Contact page is coming soon." />;
}

import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const metadata: Metadata = { title: "Africa" };

export default function AfricaPage() {
  return (
    <PlaceholderPage
      title="Africa"
      message="The Africa regional news page is coming soon."
    />
  );
}

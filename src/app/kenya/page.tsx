import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const metadata: Metadata = { title: "Kenya" };

export default function KenyaPage() {
  return (
    <PlaceholderPage
      title="Kenya"
      message="The Kenya regional news page is coming soon."
    />
  );
}

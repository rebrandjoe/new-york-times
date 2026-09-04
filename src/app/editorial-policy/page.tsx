import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const metadata: Metadata = { title: "Editorial Policy" };

export default function EditorialPolicyPage() {
  return (
    <PlaceholderPage
      title="Editorial Policy"
      message="Our editorial policy is coming soon."
    />
  );
}

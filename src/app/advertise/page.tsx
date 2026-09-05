import type { Metadata } from "next";
import { PolicyPage, PolicyParagraph, PolicySection } from "@/components/policy/PolicyPage";

export const metadata: Metadata = {
  title: "Advertise & Partner",
  description: "Advertising, collaboration, and partnership opportunities with JOSEPH MMWA.",
  alternates: { canonical: "/advertise" },
  openGraph: {
    title: "Advertise & Partner — Joseph Mmwa",
    description: "Advertising, collaboration, and partnership opportunities with JOSEPH MMWA.",
    url: "/advertise",
  },
};

export default function AdvertisePage() {
  return (
    <PolicyPage
      eyebrow="Advertise & Partner"
      title="Advertise & Partner With Us"
      intro="Reach a global audience that cares about health"
    >
      <PolicyParagraph>
        JOSEPH MMWA reaches readers across Kenya, Africa, and around the world who care about clear,
        accurate health and medical journalism. If you&apos;re an organisation, institution, or brand
        looking to reach this audience, we welcome conversations about collaboration, partnership, and
        advertising opportunities.
      </PolicyParagraph>

      <PolicySection heading="Collaborations & partnerships">
        <PolicyParagraph>
          We&apos;re open to working with health institutions, research organisations, NGOs, and
          mission-aligned partners on initiatives that genuinely serve our readers — from co-covering
          important public health developments to supporting broader health-literacy efforts.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Advertising">
        <PolicyParagraph>
          Advertising placements on JosephMmwa.com are available for brands and organisations whose
          message aligns with our editorial values. As stated in our Editorial Standards, advertising
          relationships never determine or influence independent editorial coverage, and any sponsored
          content is always clearly identified as such.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Get in touch">
        <PolicyParagraph>
          To discuss advertising, partnerships, or collaboration opportunities, contact us at:
        </PolicyParagraph>
        <PolicyParagraph>
          Email:{" "}
          <a href="mailto:contact@josephmmwa.com" className="text-accent hover:underline">
            contact@josephmmwa.com
          </a>
          <br />
          Phone: <a href="tel:+254729147765" className="text-accent hover:underline">+254 729 147 765</a>
        </PolicyParagraph>
      </PolicySection>
    </PolicyPage>
  );
}

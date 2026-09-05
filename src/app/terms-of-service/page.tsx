import type { Metadata } from "next";
import Link from "next/link";
import { PolicyList, PolicyPage, PolicyParagraph, PolicySection } from "@/components/policy/PolicyPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing use of JosephMmwa.com and the JOSEPH MMWA platform.",
  alternates: { canonical: "/terms-of-service" },
  openGraph: {
    title: "Terms of Service — Joseph Mmwa",
    description: "The terms governing use of JosephMmwa.com and the JOSEPH MMWA platform.",
    url: "/terms-of-service",
  },
};

export default function TermsOfServicePage() {
  return (
    <PolicyPage eyebrow="Terms of Service" title="Terms of Service" intro="Using JOSEPH MMWA">
      <PolicyParagraph>
        These Terms govern your use of JosephMmwa.com and services provided through the JOSEPH MMWA
        platform.
      </PolicyParagraph>
      <PolicyParagraph>By using the website, you agree to these Terms.</PolicyParagraph>

      <PolicySection heading="1. About the service">
        <PolicyParagraph>
          JOSEPH MMWA publishes health and medical journalism, research coverage, news, explanations,
          videos and related information. Content is provided for information and public education.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="2. Health information is not medical advice">
        <PolicyParagraph>
          JOSEPH MMWA is a journalism publication, not a medical provider. Our content should not be
          treated as a diagnosis, prescription or substitute for advice from a qualified healthcare
          professional. Do not delay or avoid professional medical care because of information read on
          this website.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="3. Accuracy">
        <PolicyParagraph>
          We work to publish accurate, responsibly sourced information. However, no publication can
          guarantee that every piece of information will remain current or that an error will never
          occur. Health research evolves, developing stories change and corrections may sometimes be
          necessary. Our{" "}
          <Link href="/editorial-standards" className="text-accent hover:underline">
            Editorial Standards
          </Link>{" "}
          and{" "}
          <Link href="/corrections-and-fact-checking" className="text-accent hover:underline">
            Corrections &amp; Fact-Checking
          </Link>{" "}
          pages explain our standards.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="4. Intellectual property">
        <PolicyParagraph>
          Unless otherwise indicated, original JOSEPH MMWA content, branding, design and other
          proprietary material belong to JOSEPH MMWA or its relevant rights holder. You may share
          links to our articles. You may not reproduce, republish, distribute or commercially exploit
          substantial portions of our content without appropriate permission where permission is
          required by law. Third-party material remains the property of its respective rights holders.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="5. User accounts">
        <PolicyParagraph>
          Certain features, including commenting, may require registration. Users are responsible for
          maintaining the security of their account information and for activity conducted through
          their account. You must not impersonate another person or create an account for fraudulent
          purposes.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="6. Comments">
        <PolicyParagraph>
          Users are responsible for content they submit. Comments must not be unlawful, threatening,
          defamatory, abusive, deliberately deceptive or intended to disrupt the service. JOSEPH MMWA
          may moderate, remove or restrict comments that violate these Terms or applicable law.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="7. Prohibited activity">
        <PolicyParagraph>You must not:</PolicyParagraph>
        <PolicyList
          items={[
            "attempt unauthorised access to the website or administrative systems;",
            "interfere with website operations;",
            "introduce malicious software;",
            "abuse authentication or comment systems;",
            "impersonate another person or organisation;",
            "use automated systems in a manner that disrupts the service;",
            "reproduce content in violation of applicable rights;",
            "use the service for unlawful activity.",
          ]}
        />
      </PolicySection>

      <PolicySection heading="8. External links">
        <PolicyParagraph>
          Our journalism may link to external websites, research papers, institutions and other
          sources. We do not control those external websites and cannot guarantee their availability,
          accuracy or policies.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="9. Advertising and sponsored content">
        <PolicyParagraph>
          Advertising and commercial partnerships may appear on JOSEPH MMWA. Commercial relationships
          do not automatically determine independent editorial coverage. Sponsored content should be
          identified appropriately.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="10. Website availability">
        <PolicyParagraph>
          We aim to maintain a reliable service but cannot guarantee uninterrupted availability. The
          website may occasionally be unavailable because of maintenance, technical problems, security
          issues or circumstances beyond our control.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="11. Changes to these Terms">
        <PolicyParagraph>
          We may update these Terms as the website, services or applicable legal requirements evolve.
          The current version published on this page governs continued use of the service after
          changes take effect.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="12. Contact">
        <PolicyParagraph>
          Questions concerning these Terms may be directed to:{" "}
          <a href="mailto:contact@josephmmwa.com" className="text-accent hover:underline">
            contact@josephmmwa.com
          </a>
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="13. Governing law">
        <PolicyParagraph>
          These Terms should be reviewed and finalised with qualified legal counsel to ensure they
          appropriately reflect the laws applicable to JOSEPH MMWA and its operations.
        </PolicyParagraph>
      </PolicySection>
    </PolicyPage>
  );
}

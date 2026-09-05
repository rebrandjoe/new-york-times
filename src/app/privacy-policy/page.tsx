import type { Metadata } from "next";
import { PolicyList, PolicyPage, PolicyParagraph, PolicySection } from "@/components/policy/PolicyPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How JosephMmwa.com collects, uses, and protects your information.",
  alternates: { canonical: "/privacy-policy" },
  openGraph: {
    title: "Privacy Policy — Joseph Mmwa",
    description: "How JosephMmwa.com collects, uses, and protects your information.",
    url: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Privacy Policy"
      title="Privacy Policy"
      intro="Your privacy, and how JOSEPH MMWA handles information"
    >
      <PolicyParagraph>
        This Privacy Policy explains what information JosephMmwa.com collects, why, and how it is
        used and protected.
      </PolicyParagraph>

      <PolicySection heading="1. Information we collect">
        <PolicyList
          items={[
            <>
              <strong className="text-white">Account information:</strong> if you register an account,
              we collect your name, email address, and password (stored securely, never in plain text).
            </>,
            <>
              <strong className="text-white">Comments:</strong> if you comment on an article, we store
              the comment content, your account association, and the time it was posted.
            </>,
            <>
              <strong className="text-white">Newsletter subscription:</strong> if you subscribe to The
              MMWA Briefing, we collect your email address for the purpose of sending it.
            </>,
            <>
              <strong className="text-white">Contact form submissions:</strong> if you contact us, we
              collect the name, email, organisation (if provided), subject, and message you submit.
            </>,
            <>
              <strong className="text-white">Basic usage data:</strong> standard technical information
              such as browser type and general usage patterns, collected to keep the site secure and
              functioning correctly.
            </>,
          ]}
        />
      </PolicySection>

      <PolicySection heading="2. How we use this information">
        <PolicyParagraph>
          We use collected information to: operate your account and authentication; publish and
          moderate comments; send the newsletter to subscribers; respond to contact and correction
          requests; maintain the security and performance of the website.
        </PolicyParagraph>
        <PolicyParagraph>We do not sell your personal information.</PolicyParagraph>
      </PolicySection>

      <PolicySection heading="3. Third-party services">
        <PolicyParagraph>
          JosephMmwa.com relies on third-party infrastructure to operate, including Supabase
          (database, authentication, and storage) and an email delivery provider (for newsletter and
          account-related emails). These providers process data on our behalf under their own security
          practices.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="4. Cookies">
        <PolicyParagraph>
          The site may use essential cookies necessary for account sessions and basic site
          functionality. We do not use cookies for third-party advertising tracking unless an
          advertising system is introduced and clearly disclosed separately.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="5. Data retention">
        <PolicyParagraph>
          We retain account and comment information for as long as your account remains active, or as
          needed to comply with legal obligations, resolve disputes, and enforce our Terms of Service.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="6. Your rights">
        <PolicyParagraph>
          You may request access to, correction of, or deletion of your personal information by
          contacting us at{" "}
          <a href="mailto:contact@josephmmwa.com" className="text-accent hover:underline">
            contact@josephmmwa.com
          </a>
          . We will respond to reasonable requests in a timely manner.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="7. Children's privacy">
        <PolicyParagraph>
          JosephMmwa.com is not directed at children, and we do not knowingly collect personal
          information from children.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="8. Security">
        <PolicyParagraph>
          We use reasonable technical and organisational measures to protect your information,
          including secure authentication and database-level access controls. No online service can
          guarantee absolute security.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="9. Changes to this policy">
        <PolicyParagraph>
          We may update this Privacy Policy as the website and applicable legal requirements evolve.
          The version published on this page governs continued use of the service after changes take
          effect.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="10. Contact">
        <PolicyParagraph>
          Questions about this Privacy Policy may be directed to:{" "}
          <a href="mailto:contact@josephmmwa.com" className="text-accent hover:underline">
            contact@josephmmwa.com
          </a>
        </PolicyParagraph>
      </PolicySection>
    </PolicyPage>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import {
  PolicyList,
  PolicyPage,
  PolicyParagraph,
  PolicySection,
} from "@/components/policy/PolicyPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for JosephMmwa.com — acceptable use, accounts, health information, intellectual property and user rights.",
  alternates: { canonical: "/terms-of-service" },
  openGraph: {
    title: "Terms of Service — Joseph Mmwa",
    description:
      "Terms governing access to and use of JosephMmwa.com, a health news platform.",
    url: "/terms-of-service",
  },
};

export default function TermsOfServicePage() {
  return (
    <PolicyPage title="Terms of Service" effectiveOn="2026-10-24">
      <PolicyParagraph>Welcome to JosephMmwa.com.</PolicyParagraph>
      <PolicyParagraph>
        These Terms of Service govern access to and use of JosephMmwa.com, a health news platform
        publishing reporting, research-based information, analysis and explanations of health and
        medical developments across Kenya, Africa and the world.
      </PolicyParagraph>
      <PolicyParagraph>
        By accessing or using this website, you agree to these Terms of Service. If you do not agree,
        please discontinue use of the website.
      </PolicyParagraph>

      <PolicySection heading="1. About JOSEPH MMWA">
        <PolicyParagraph>
          JosephMmwa.com operates under the personal brand of Joseph Mmwa.
        </PolicyParagraph>
        <PolicyParagraph>
          The website publishes health journalism, news, reporting, research-based information,
          analysis, explainers and other editorial content concerning health, medicine, science and
          public health.
        </PolicyParagraph>
        <PolicyParagraph>
          JOSEPH MMWA is a health journalism platform, not a healthcare provider. Joseph Mmwa is a
          health journalist and editor, not a medical doctor. Content published on the website is
          intended for general informational and educational purposes and is not a substitute for
          individual medical advice, diagnosis or treatment.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="2. Acceptable use of the website">
        <PolicyParagraph>You may use JosephMmwa.com for lawful purposes, including:</PolicyParagraph>
        <PolicyList
          items={[
            "Reading and sharing links to published articles.",
            "Creating and managing an account where account services are available.",
            "Participating in comments where enabled.",
            "Subscribing to newsletters or other available services.",
            "Contacting the publication or submitting news tips.",
            "Accessing publicly available health and medical information.",
          ]}
        />
        <PolicyParagraph>You agree not to use the website to:</PolicyParagraph>
        <PolicyList
          items={[
            "Violate applicable laws or the rights of others.",
            "Attempt to gain unauthorised access to accounts, systems or restricted areas.",
            "Interfere with the website's security, operation or availability.",
            "Upload malware or other harmful code.",
            "Impersonate another person or organisation.",
            "Submit fraudulent, deceptive or deliberately misleading information.",
            "Threaten, harass or abuse other users.",
            "Publish unlawful, defamatory or infringing material.",
            "Distribute spam or unsolicited commercial messages.",
            "Scrape, copy or reproduce substantial amounts of website content without permission or a lawful basis.",
            "Use automated systems in ways that disrupt the website or impose unreasonable demands on its infrastructure.",
          ]}
        />
      </PolicySection>

      <PolicySection heading="3. User accounts">
        <PolicyParagraph>Certain website features may require an account.</PolicyParagraph>
        <PolicyParagraph>
          Where registration is available, you are responsible for providing accurate information and
          taking reasonable steps to protect your account credentials. You should not share your
          password or authentication credentials with others.
        </PolicyParagraph>
        <PolicyParagraph>
          You should notify us if you become aware of unauthorised access to your account.
        </PolicyParagraph>
        <PolicyParagraph>
          We may restrict, suspend or terminate an account where there are reasonable grounds to
          believe it has been used in violation of these Terms, to compromise website security or to
          engage in unlawful activity.
        </PolicyParagraph>
        <PolicyParagraph>
          Where appropriate, we will consider the circumstances and applicable legal obligations
          before taking action.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="4. Google Sign-In">
        <PolicyParagraph>
          Where Google Sign-In is available, you may use your Google Account to authenticate your
          account on JosephMmwa.com.
        </PolicyParagraph>
        <PolicyParagraph>
          Your use of Google's authentication services is also subject to Google's
          applicable terms and policies.
        </PolicyParagraph>
        <PolicyParagraph>
          The normal Google Sign-In process does not provide us with your Google password. The
          information received through authentication depends on the permissions and configuration of
          the integration.
        </PolicyParagraph>
        <PolicyParagraph>
          Our collection and handling of information received through Google Sign-In are described in
          our{" "}
          <Link href="/privacy-policy" className="font-semibold text-accent hover:underline">
            Privacy Policy
          </Link>
          .
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="5. Comments and user-submitted content">
        <PolicyParagraph>
          Where comments or other user-submission features are available, you remain responsible for
          the content you submit.
        </PolicyParagraph>
        <PolicyParagraph>
          You must not submit content that is unlawful, defamatory, threatening, abusive, harassing,
          fraudulent, deliberately misleading, malicious, infringing of another person's rights
          or intended to facilitate unlawful activity.
        </PolicyParagraph>
        <PolicyParagraph>
          You must not use comments to impersonate another person, publish another person's
          confidential information without a lawful basis, or distribute spam.
        </PolicyParagraph>
        <PolicyParagraph>
          We may review, moderate, restrict or remove submitted content that violates these Terms,
          applicable law or relevant website rules. We may also restrict commenting privileges where
          necessary to protect the website and its users.
        </PolicyParagraph>
        <PolicyParagraph>
          Submitting a comment does not guarantee publication or continued availability. We may
          retain information associated with moderation or security where reasonably necessary and
          permitted by applicable law.
        </PolicyParagraph>
        <PolicyParagraph>
          Unless a feature clearly indicates otherwise, do not assume that a comment or other public
          submission is confidential.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="6. Health and medical information">
        <PolicyParagraph>
          Content published on JosephMmwa.com is intended to inform readers about health, medicine,
          scientific research and public-health developments.
        </PolicyParagraph>
        <PolicyParagraph>
          The website does not provide personalised medical diagnosis, treatment, prescriptions or
          emergency medical services.
        </PolicyParagraph>
        <PolicyParagraph>
          Medical knowledge and public-health guidance can change as new evidence emerges. We make
          reasonable efforts to verify information and correct material errors when identified, but
          published information may become outdated or may not address every individual circumstance.
        </PolicyParagraph>
        <PolicyParagraph>
          You should not use information from this website as a substitute for advice from a
          qualified healthcare professional who can assess your specific situation. Do not delay or
          disregard appropriate medical care because of something you have read on the website.
        </PolicyParagraph>
        <PolicyParagraph>
          If you believe you are experiencing a medical emergency, contact an appropriate emergency
          service or seek urgent medical attention.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="7. Editorial independence and commercial content">
        <PolicyParagraph>
          JOSEPH MMWA aims to publish accurate, evidence-based and accountable health journalism.
        </PolicyParagraph>
        <PolicyParagraph>
          Advertising, sponsorships, affiliate arrangements, partnerships and other commercial
          relationships, where applicable, do not automatically constitute editorial endorsement.
        </PolicyParagraph>
        <PolicyParagraph>
          Editorial decisions should remain distinct from commercial arrangements. Sponsored content,
          advertisements and other paid material will be identified where appropriate so readers can
          distinguish it from editorial reporting.
        </PolicyParagraph>
        <PolicyParagraph>
          The appearance of a product, organisation, institution or service in an article does not
          necessarily mean that JOSEPH MMWA endorses it.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="8. Accuracy, updates and corrections">
        <PolicyParagraph>
          We make reasonable efforts to verify information before publication and to present it in
          context.
        </PolicyParagraph>
        <PolicyParagraph>
          News developments, scientific evidence and public-health guidance can change. We may update
          articles to reflect material new information, clarify context or correct errors.
        </PolicyParagraph>
        <PolicyParagraph>
          Readers may submit correction requests or report potential factual errors by emailing{" "}
          <a href="mailto:contact@josephmmwa.com" className="font-semibold text-accent hover:underline">
            contact@josephmmwa.com
          </a>
          .
        </PolicyParagraph>
        <PolicyParagraph>
          Requests are assessed against available evidence and editorial standards. A request does
          not automatically guarantee a change, but relevant concerns may be investigated.
        </PolicyParagraph>
        <PolicyParagraph>
          Our approach to verification and corrections is explained further in our{" "}
          <Link href="/corrections-and-fact-checking" className="font-semibold text-accent hover:underline">
            Corrections & Fact-Checking
          </Link>{" "}
          policy.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="9. Intellectual property and permitted use">
        <PolicyParagraph>
          Unless otherwise indicated, original articles, written content, branding, logos, graphics,
          design elements and other materials created for JosephMmwa.com are protected by applicable
          intellectual-property laws.
        </PolicyParagraph>
        <PolicyParagraph>You may:</PolicyParagraph>
        <PolicyList
          items={[
            "Read and access publicly available content for personal, non-commercial use.",
            "Share links to published articles.",
            "Quote reasonable portions of published material for purposes permitted by applicable law, with appropriate attribution and a link to the original source where practicable.",
          ]}
        />
        <PolicyParagraph>
          You may not reproduce, republish, distribute, sell or commercially exploit substantial
          portions of original content without permission, unless such use is permitted by applicable
          law.
        </PolicyParagraph>
        <PolicyParagraph>
          Nothing in these Terms removes rights or exceptions available under applicable copyright
          law, including any applicable fair dealing provisions.
        </PolicyParagraph>
        <PolicyParagraph>
          Third-party photographs, videos, research, quotations, logos and other materials remain
          subject to the rights of their respective owners. Their appearance on the website does not
          mean that they belong to JOSEPH MMWA or are available for unrestricted reuse.
        </PolicyParagraph>
        <PolicyParagraph>
          Requests for permission to reproduce original material may be sent to{" "}
          <a href="mailto:contact@josephmmwa.com" className="font-semibold text-accent hover:underline">
            contact@josephmmwa.com
          </a>
          .
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="10. Third-party websites and external sources">
        <PolicyParagraph>
          JosephMmwa.com may link to external websites, scientific publications, government agencies,
          regulatory authorities, health organisations, news organisations and other resources.
        </PolicyParagraph>
        <PolicyParagraph>
          These links may help readers consult original research or obtain additional information. We
          do not control external websites and cannot guarantee their accuracy, availability,
          security or privacy practices.
        </PolicyParagraph>
        <PolicyParagraph>
          A link to an external source does not necessarily indicate endorsement of every statement,
          service or position expressed on that website.
        </PolicyParagraph>
        <PolicyParagraph>
          Your use of third-party websites is subject to their own applicable terms and policies.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="11. Newsletters and communications">
        <PolicyParagraph>
          Where newsletter services are available, you may voluntarily subscribe by providing the
          information requested.
        </PolicyParagraph>
        <PolicyParagraph>
          You may unsubscribe using the method provided in the relevant email or by contacting{" "}
          <a href="mailto:contact@josephmmwa.com" className="font-semibold text-accent hover:underline">
            contact@josephmmwa.com
          </a>
          .
        </PolicyParagraph>
        <PolicyParagraph>
          Unsubscribing from a newsletter does not necessarily stop essential communications relating
          to an account, transaction, security matter or service you have requested.
        </PolicyParagraph>
        <PolicyParagraph>
          Information associated with newsletter subscriptions is handled in accordance with our{" "}
          <Link href="/privacy-policy" className="font-semibold text-accent hover:underline">
            Privacy Policy
          </Link>
          .
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="12. Paid subscriptions and other paid services">
        <PolicyParagraph>
          If paid subscriptions, memberships, premium articles or other paid features are available,
          the applicable price, billing period, payment arrangements, renewal conditions and
          cancellation procedures will be presented before you complete a purchase.
        </PolicyParagraph>
        <PolicyParagraph>
          Additional terms may apply to specific paid services. Where those terms conflict with these
          general Terms, the specific terms will govern the relevant service to the extent permitted
          by applicable law.
        </PolicyParagraph>
        <PolicyParagraph>
          Payments may be processed by third-party payment providers. Their applicable terms and
          privacy practices may also apply.
        </PolicyParagraph>
        <PolicyParagraph>
          You are responsible for reviewing the terms presented before confirming a transaction. Any
          applicable cancellation, refund and consumer rights remain subject to the relevant terms
          and applicable law.
        </PolicyParagraph>
        <PolicyParagraph>
          Nothing in this section represents that a particular paid feature or payment method is
          currently available.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="13. Website availability and changes">
        <PolicyParagraph>
          We aim to keep JosephMmwa.com accessible and functioning reliably, but uninterrupted
          availability cannot be guaranteed.
        </PolicyParagraph>
        <PolicyParagraph>
          The website may be temporarily unavailable because of maintenance, technical problems,
          security incidents, hosting or infrastructure failures, third-party service interruptions
          or events beyond our reasonable control.
        </PolicyParagraph>
        <PolicyParagraph>
          We may change, suspend or discontinue website features where reasonably necessary for
          operational, security, editorial or business reasons, subject to applicable legal
          obligations and any specific commitments made to users.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="14. Prohibited technical activity">
        <PolicyParagraph>You must not attempt to:</PolicyParagraph>
        <PolicyList
          items={[
            "Circumvent authentication or other security controls.",
            "Access restricted systems or accounts without authorisation.",
            "Probe, scan or test website vulnerabilities without authorisation.",
            "Introduce malicious software or harmful code.",
            "Interfere with servers, networks or website functionality.",
            "Obtain another user's credentials or personal information without authorisation.",
            "Overload the website through excessive requests or abusive automated activity.",
            "Use the website to facilitate cybercrime or other unlawful activity.",
          ]}
        />
        <PolicyParagraph>
          If you discover a potential security vulnerability, please report it responsibly to{" "}
          <a href="mailto:contact@josephmmwa.com" className="font-semibold text-accent hover:underline">
            contact@josephmmwa.com
          </a>
          . Do not exploit the vulnerability, access other users' information or disrupt the
          service.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="15. Disclaimer and limitations of information">
        <PolicyParagraph>
          The website and its content are provided for general informational and educational purposes
          and are made available subject to applicable law.
        </PolicyParagraph>
        <PolicyParagraph>
          Although we make reasonable efforts to publish accurate and relevant information, we do not
          guarantee that every article will be free from error, that all information will remain
          current, or that the website will always be available.
        </PolicyParagraph>
        <PolicyParagraph>
          External sources may change, scientific conclusions may evolve and information may not be
          suitable for every individual circumstance.
        </PolicyParagraph>
        <PolicyParagraph>
          Nothing in these Terms should be interpreted as a guarantee of a particular health outcome,
          an offer of personalised medical care or a representation that every external resource is
          accurate or continuously available.
        </PolicyParagraph>
        <PolicyParagraph>
          Nothing in these Terms excludes, restricts or limits any right, remedy or liability that
          cannot lawfully be excluded, restricted or limited.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="16. Limitation of liability">
        <PolicyParagraph>
          To the extent permitted by applicable law, JOSEPH MMWA is not responsible for losses
          arising from circumstances beyond its reasonable control, interruptions to website
          availability, or a user's inability to access external resources.
        </PolicyParagraph>
        <PolicyParagraph>
          Nothing in these Terms is intended to exempt JOSEPH MMWA from responsibilities imposed by
          law, including any responsibility that may arise from unlawful conduct, actionable
          misrepresentation, or a failure to meet an applicable legal obligation.
        </PolicyParagraph>
        <PolicyParagraph>
          Where liability cannot legally be excluded or limited, the applicable legal rules will
          continue to apply.
        </PolicyParagraph>
        <PolicyParagraph>
          This section should not be interpreted as removing rights available to consumers or other
          users under applicable Kenyan law.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="17. Privacy and personal information">
        <PolicyParagraph>
          Your use of JosephMmwa.com is also governed by our{" "}
          <Link href="/privacy-policy" className="font-semibold text-accent hover:underline">
            Privacy Policy
          </Link>
          .
        </PolicyParagraph>
        <PolicyParagraph>
          The Privacy Policy explains how personal information may be collected, used, stored,
          disclosed and protected when you use the website and its features.
        </PolicyParagraph>
        <PolicyParagraph>
          We handle personal information in accordance with applicable data-protection obligations.
          These Terms do not replace the rights users may have under the Kenya Data Protection Act,
          2019, or other applicable law.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="18. Changes to these Terms">
        <PolicyParagraph>
          We may revise these Terms when the website, available services, operational practices or
          applicable legal requirements change.
        </PolicyParagraph>
        <PolicyParagraph>
          The latest version will be published on this page with its effective date.
        </PolicyParagraph>
        <PolicyParagraph>
          We encourage users to review the Terms periodically. Where a change requires additional
          notice or consent under applicable law, we will take the steps required by law.
        </PolicyParagraph>
        <PolicyParagraph>
          Continued use of the website after revised Terms take effect may indicate acceptance where
          legally valid. It does not override any rights or requirements that cannot lawfully be
          waived.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="19. Governing law and applicable rights">
        <PolicyParagraph>
          These Terms are intended to be governed by the laws of Kenya, subject to applicable
          conflict-of-law rules and any mandatory legal protections available to users.
        </PolicyParagraph>
        <PolicyParagraph>
          Any dispute arising from the use of the website will be addressed in accordance with
          applicable law and the jurisdiction of the courts or other competent bodies where legally
          appropriate.
        </PolicyParagraph>
        <PolicyParagraph>
          Nothing in these Terms prevents a user from exercising a statutory right or pursuing a
          remedy available under applicable law.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="20. Contact">
        <PolicyParagraph>
          For questions about these Terms, website use, content permissions, correction requests or
          potential security issues, contact:
        </PolicyParagraph>
        <PolicyParagraph>
          <strong className="text-white">JOSEPH MMWA</strong>
        </PolicyParagraph>
        <PolicyParagraph>
          Email:{" "}
          <a href="mailto:contact@josephmmwa.com" className="font-semibold text-accent hover:underline">
            contact@josephmmwa.com
          </a>
        </PolicyParagraph>
        <PolicyParagraph>
          Website:{" "}
          <a href="https://josephmmwa.com" className="font-semibold text-accent hover:underline">
            josephmmwa.com
          </a>
        </PolicyParagraph>
      </PolicySection>
    </PolicyPage>
  );
}

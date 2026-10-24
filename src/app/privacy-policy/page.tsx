import type { Metadata } from "next";
import {
  PolicyList,
  PolicyPage,
  PolicyParagraph,
  PolicySection,
  PolicySubheading,
} from "@/components/policy/PolicyPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How JOSEPH MMWA collects, uses, stores and protects personal information on JosephMmwa.com, including Google Sign-In and account data.",
  alternates: { canonical: "/privacy-policy" },
  openGraph: {
    title: "Privacy Policy — Joseph Mmwa",
    description:
      "How JOSEPH MMWA collects, uses, stores and protects personal information on JosephMmwa.com.",
    url: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage title="Privacy Policy" effectiveOn="2026-10-24">
      <PolicyParagraph>
        Your privacy matters to JOSEPH MMWA. This Privacy Policy explains what personal information
        may be collected when you use JosephMmwa.com, how that information is used and protected,
        when it may be shared, how long it may be retained and the choices available to you.
      </PolicyParagraph>
      <PolicyParagraph>
        JOSEPH MMWA is a health news platform providing news, reporting, research, analysis and
        explanations of health and medical developments across Kenya, Africa and the world.
      </PolicyParagraph>
      <PolicyParagraph>
        This Privacy Policy applies to personal information processed through JosephMmwa.com and its
        features. Additional privacy notices may apply to particular services where relevant.
      </PolicyParagraph>

      <PolicySection heading="1. Information we collect">
        <PolicyParagraph>
          Depending on how you use the website, we may collect the following categories of
          information.
        </PolicyParagraph>

        <PolicySubheading>Account information</PolicySubheading>
        <PolicyParagraph>When you create an account, we may collect:</PolicyParagraph>
        <PolicyList
          items={[
            "Your name",
            "Email address",
            "Profile information provided during registration",
            "Authentication information necessary to maintain your account",
            "Account preferences",
            "Information associated with activity performed while signed in",
          ]}
        />
        <PolicyParagraph>
          Authentication credentials are handled through the authentication service used by the
          website. Passwords are not intentionally stored in plain text by JOSEPH MMWA.
        </PolicyParagraph>

        <PolicySubheading>Google Sign-In</PolicySubheading>
        <PolicyParagraph>
          You may have the option to create or access your JOSEPH MMWA account using Google Sign-In.
        </PolicyParagraph>
        <PolicyParagraph>
          When you use Google Sign-In, Google may provide basic information associated with your
          Google Account, depending on the permissions requested and granted. This may include your
          name, email address, profile picture and a unique identifier associated with your Google
          Account.
        </PolicyParagraph>
        <PolicyParagraph>This information is used to:</PolicyParagraph>
        <PolicyList
          items={[
            "Create or authenticate your JOSEPH MMWA account",
            "Identify your account when you sign in",
            "Maintain your account session",
            "Associate your account with features such as comments and account preferences",
            "Communicate with you about your account when necessary",
          ]}
        />
        <PolicyParagraph>
          The website does not request access to Gmail, Google Drive, Google Calendar, Google
          Contacts or other Google services unless a particular feature requires such access and the
          relevant permission is presented to you.
        </PolicyParagraph>
        <PolicyParagraph>
          Google user data is not sold or used for advertising purposes. It is shared only as
          necessary to provide authentication and account features, maintain security, comply with
          applicable legal obligations or as otherwise permitted under applicable law and Google's
          policies.
        </PolicyParagraph>
        <PolicyParagraph>
          Google user data is used and retained only as necessary for the purposes described in this
          Privacy Policy.
        </PolicyParagraph>

        <PolicySubheading>Comments</PolicySubheading>
        <PolicyParagraph>
          If commenting is available, we may collect and store:
        </PolicyParagraph>
        <PolicyList
          items={[
            "Your comment",
            "Your account name or display name",
            "Your account identifier",
            "The date and time the comment was submitted",
            "Information necessary to moderate or manage comments",
          ]}
        />
        <PolicyParagraph>
          Comments may be publicly visible on the website. Comments that violate the Terms of
          Service, editorial standards or applicable law may be removed.
        </PolicyParagraph>
        <PolicyParagraph>
          Readers should avoid including sensitive personal information in public comments.
        </PolicyParagraph>

        <PolicySubheading>Newsletter subscriptions</PolicySubheading>
        <PolicyParagraph>
          If you subscribe to a JOSEPH MMWA newsletter, we may collect your email address and
          information necessary to manage your subscription.
        </PolicyParagraph>
        <PolicyParagraph>
          An email delivery provider may process this information to send newsletters and
          subscription-related communications.
        </PolicyParagraph>
        <PolicyParagraph>
          You may unsubscribe from newsletters or marketing communications through the unsubscribe
          mechanism provided in the communication or by contacting contact@josephmmwa.com.
        </PolicyParagraph>
        <PolicyParagraph>
          Essential service or account-related communications may continue where necessary.
        </PolicyParagraph>

        <PolicySubheading>Contact forms and email correspondence</PolicySubheading>
        <PolicyParagraph>
          When you contact JOSEPH MMWA through a website form or email, we may receive:
        </PolicyParagraph>
        <PolicyList
          items={[
            "Your name",
            "Email address",
            "Organisation, if provided",
            "Subject of your message",
            "Message content",
            "Other information you voluntarily provide",
          ]}
        />
        <PolicyParagraph>
          This information may be used to respond to enquiries, news tips, correction requests,
          privacy requests, collaboration proposals and other communications.
        </PolicyParagraph>
        <PolicyParagraph>
          Anyone submitting a news tip or confidential information should consider the risks of
          including identifying or sensitive details. Ordinary website contact forms and email should
          not automatically be assumed to provide secure or anonymous communication.
        </PolicyParagraph>

        <PolicySubheading>Technical information</PolicySubheading>
        <PolicyParagraph>
          When you visit the website, hosting, security and infrastructure providers may
          automatically collect or generate technical information, including:
        </PolicyParagraph>
        <PolicyList
          items={[
            "IP address",
            "Browser type and version",
            "Device type and operating system",
            "Approximate location inferred from technical information",
            "Pages or resources requested",
            "Date and time of requests",
            "Referring website",
            "Security, diagnostic and error logs",
          ]}
        />
        <PolicyParagraph>
          This information may be used to operate, secure, troubleshoot and improve the website and
          investigate suspicious activity.
        </PolicyParagraph>
        <PolicyParagraph>
          Technical information may sometimes be linked to an account or other information. It is not
          intentionally used to identify visitors personally unless necessary for security, legal
          compliance or another legitimate and disclosed purpose.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="2. How we use personal information">
        <PolicyParagraph>
          Personal information collected through JosephMmwa.com may be used to:
        </PolicyParagraph>
        <PolicyList
          items={[
            "Create and manage user accounts",
            "Authenticate users and maintain account sessions",
            "Provide website functionality",
            "Enable comments and account features",
            "Respond to enquiries and correspondence",
            "Send newsletters to subscribers",
            "Send necessary account-related communications",
            "Process correction and privacy requests",
            "Maintain website security",
            "Detect and prevent abuse, fraud and unauthorised activity",
            "Troubleshoot technical problems",
            "Improve website performance and functionality",
            "Comply with applicable legal obligations",
          ]}
        />
        <PolicyParagraph>
          Personal information is collected and processed for specific, legitimate purposes and
          limited to what is reasonably necessary for those purposes.
        </PolicyParagraph>
        <PolicyParagraph>
          Where consent is required, it will be sought before the relevant processing takes place.
          Where another lawful basis applies, personal information may be processed on that basis.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="3. How we handle Google user data">
        <PolicyParagraph>
          Information obtained through Google Sign-In is used in accordance with the purposes
          described in this Privacy Policy and applicable Google policies.
        </PolicyParagraph>
        <PolicyParagraph>
          Google user data is not sold, used for targeted advertising or transferred to advertising
          platforms for advertising purposes.
        </PolicyParagraph>
        <PolicyParagraph>
          The minimum information necessary may be shared with service providers supporting
          authentication, account management, hosting, database operations or security. Information
          may also be disclosed where required by law or otherwise permitted under applicable law and
          Google's policies.
        </PolicyParagraph>
        <PolicyParagraph>
          Reasonable steps are taken to protect Google user data against unauthorised access,
          alteration, loss or disclosure. Access to and retention of this information are limited to
          what is necessary for the purposes described in this policy.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="4. Service providers and third parties">
        <PolicyParagraph>
          JOSEPH MMWA may use third-party service providers to operate and maintain parts of the
          website. Depending on the features implemented, these may include providers for:
        </PolicyParagraph>
        <PolicyList
          items={[
            "Authentication and account management",
            "Database services and storage",
            "Website hosting and infrastructure",
            "Email delivery",
            "Security and technical monitoring",
            "Analytics, where implemented",
            "Payment processing, where paid services are offered",
          ]}
        />
        <PolicyParagraph>
          For example, Supabase may be used for authentication, databases and storage.
        </PolicyParagraph>
        <PolicyParagraph>
          These providers may process personal information on behalf of JOSEPH MMWA to deliver their
          services. Appropriate measures are sought to limit such processing to what is necessary and
          protect the information involved.
        </PolicyParagraph>
        <PolicyParagraph>
          Third-party providers may also process information under their own legal obligations and
          applicable privacy policies. JOSEPH MMWA does not control the independent privacy practices
          of third parties acting outside its control.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="5. Payments and subscriptions">
        <PolicyParagraph>
          If paid subscriptions, memberships or other paid services are offered through
          JosephMmwa.com, payments may be processed by third-party payment providers.
        </PolicyParagraph>
        <PolicyParagraph>
          These providers may collect and process payment information directly from users under their
          own privacy policies and terms.
        </PolicyParagraph>
        <PolicyParagraph>
          Where payment processing is handled directly by an authorised provider, JOSEPH MMWA does
          not need to store complete payment-card details. Limited transaction information, such as
          payment status, subscription status, transaction references or billing details, may be
          received where necessary to manage a purchase.
        </PolicyParagraph>
        <PolicyParagraph>
          The information processed depends on the payment service implemented and the transaction
          involved.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="6. Cookies and similar technologies">
        <PolicyParagraph>JosephMmwa.com may use cookies and similar technologies for:</PolicyParagraph>
        <PolicyList
          items={[
            "Maintaining account sessions and authentication",
            "Website security",
            "Remembering preferences",
            "Supporting essential website functionality",
            "Measuring website performance, where analytics are implemented",
          ]}
        />
        <PolicyParagraph>
          Some cookies may be necessary for the website to function correctly. Other technologies may
          be subject to additional consent requirements under applicable law.
        </PolicyParagraph>
        <PolicyParagraph>
          Users can manage or disable cookies through their browser settings. Disabling certain
          cookies may affect sign-in, preferences or other website features.
        </PolicyParagraph>
        <PolicyParagraph>
          If analytics or other technologies that collect additional personal information are
          introduced, this Privacy Policy will be updated where necessary, and any notices or consent
          mechanisms required by applicable law will be provided.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="7. Advertising">
        <PolicyParagraph>JOSEPH MMWA may introduce advertising services in the future.</PolicyParagraph>
        <PolicyParagraph>
          If third-party advertising is implemented, advertising providers may process information or
          use cookies and similar technologies in accordance with their own policies and applicable
          legal requirements.
        </PolicyParagraph>
        <PolicyParagraph>
          This Privacy Policy will be updated when necessary to describe advertising technologies and
          data practices actually used on the website. This section does not indicate that a
          particular advertising service is currently active.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="8. How we share personal information">
        <PolicyParagraph>JOSEPH MMWA does not sell personal information.</PolicyParagraph>
        <PolicyParagraph>
          Personal information may be shared in the following circumstances:
        </PolicyParagraph>
        <PolicyList
          items={[
            "Service delivery: With providers supporting authentication, hosting, databases, storage, email delivery, security or payment processing.",
            "Legal obligations: Where disclosure is required by applicable law, a valid court order or another lawful process.",
            "Security and protection: Where reasonably necessary to investigate abuse, protect website users, maintain security or protect legal rights.",
            "User direction or consent: Where a user requests that information be shared or otherwise authorises a particular disclosure.",
          ]}
        />
        <PolicyParagraph>
          Disclosures are limited to information reasonably necessary for the relevant purpose.
        </PolicyParagraph>
        <PolicyParagraph>
          A service-provider relationship does not, by itself, authorise the use of personal
          information for unrelated purposes.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="9. Data retention">
        <PolicyParagraph>
          Personal information is retained for as long as reasonably necessary for the purpose for
          which it was collected, including providing accounts and services, maintaining comments,
          responding to enquiries, preserving necessary security records, resolving disputes and
          complying with legal obligations.
        </PolicyParagraph>
        <PolicyParagraph>
          Retention periods may differ depending on the type of information and the reason it is
          held.
        </PolicyParagraph>
        <PolicyParagraph>
          When information is no longer required, JOSEPH MMWA seeks to delete it or anonymise it
          where appropriate, subject to applicable legal requirements and legitimate retention needs.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="10. Account deletion">
        <PolicyParagraph>
          Users may request deletion of their JOSEPH MMWA accounts and associated personal
          information by emailing contact@josephmmwa.com.
        </PolicyParagraph>
        <PolicyParagraph>
          Requests will be assessed and handled in accordance with applicable law.
        </PolicyParagraph>
        <PolicyParagraph>
          Some information may need to be retained where required by law or reasonably necessary for
          security, dispute resolution or other lawful purposes.
        </PolicyParagraph>
        <PolicyParagraph>
          Deleting an account may also remove or affect content associated with it, including
          comments, where technically and legally appropriate. Information already copied, quoted or
          otherwise reproduced by third parties may not be removable from their systems.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="11. Privacy rights">
        <PolicyParagraph>
          Depending on the applicable law and circumstances of processing, users may have rights
          concerning their personal information.
        </PolicyParagraph>
        <PolicyParagraph>
          Under Kenya's Data Protection Act, 2019, data subjects have rights that include:
        </PolicyParagraph>
        <PolicyList
          items={[
            "The right to be informed about the use of their personal data",
            "The right to access personal data held about them",
            "The right to object to the processing of their personal data",
            "The right to request correction of false or misleading personal data",
            "The right to request deletion of false or misleading personal data",
          ]}
        />
        <PolicyParagraph>
          Other rights or remedies may apply depending on the circumstances and applicable law.
        </PolicyParagraph>
        <PolicyParagraph>
          To exercise a privacy right, ask a question about how personal information is handled or
          submit a data-related request, contact contact@josephmmwa.com.
        </PolicyParagraph>
        <PolicyParagraph>
          Identity verification may be required before a request is processed to protect personal
          information against unauthorised access or disclosure.
        </PolicyParagraph>
        <PolicyParagraph>
          Users may also have the right to lodge a complaint with the relevant data-protection
          authority, including Kenya's Office of the Data Protection Commissioner, where
          applicable.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="12. International data processing">
        <PolicyParagraph>
          Some service providers used by JosephMmwa.com may store or process personal information
          outside Kenya.
        </PolicyParagraph>
        <PolicyParagraph>
          Where personal information is transferred outside Kenya, JOSEPH MMWA seeks to comply with
          applicable data-protection requirements and use appropriate safeguards for the transfer.
        </PolicyParagraph>
        <PolicyParagraph>
          The location and processing arrangements may depend on the services and infrastructure used
          to operate the website.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="13. Security">
        <PolicyParagraph>
          JOSEPH MMWA takes reasonable steps to protect personal information against unauthorised
          access, loss, misuse, alteration or disclosure.
        </PolicyParagraph>
        <PolicyParagraph>
          Depending on the services implemented, these measures may include secure connections,
          authentication controls, database access restrictions, limited access permissions and
          security monitoring.
        </PolicyParagraph>
        <PolicyParagraph>
          No website, storage system or internet transmission can be guaranteed to be completely
          secure. JOSEPH MMWA therefore cannot promise absolute security but seeks to address risks
          using measures appropriate to the information and services involved.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="14. Children's privacy">
        <PolicyParagraph>
          JosephMmwa.com is a general-audience health and medical news website and is not specifically
          directed at children.
        </PolicyParagraph>
        <PolicyParagraph>
          JOSEPH MMWA does not knowingly collect children's personal information for purposes
          that are inappropriate or unlawful under applicable law. Where information concerning a
          child is collected, it will be handled in accordance with applicable legal requirements.
        </PolicyParagraph>
        <PolicyParagraph>
          Anyone who believes that a child has provided personal information inappropriately may
          contact contact@josephmmwa.com so the matter can be assessed and appropriate action taken.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="15. Third-party websites">
        <PolicyParagraph>
          JosephMmwa.com may contain links to external websites, including news organisations,
          research institutions, government agencies, social media platforms and other sources.
        </PolicyParagraph>
        <PolicyParagraph>
          When users visit an external website, that website's privacy practices and terms apply
          to their use of the service. JOSEPH MMWA does not control the privacy practices of external
          websites and encourages users to review their privacy policies before providing personal
          information.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="16. Changes to this Privacy Policy">
        <PolicyParagraph>
          This Privacy Policy may be updated when the website, its features, the technology used or
          applicable legal requirements change.
        </PolicyParagraph>
        <PolicyParagraph>
          Revised versions will be published on this page with an updated effective date.
        </PolicyParagraph>
        <PolicyParagraph>
          Where a change requires additional notice or consent under applicable law, appropriate
          steps will be taken.
        </PolicyParagraph>
        <PolicyParagraph>
          Readers are encouraged to review this page periodically to understand how personal
          information is handled.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="17. Contact">
        <PolicyParagraph>
          Questions, concerns or requests concerning this Privacy Policy or personal information may
          be directed to:
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
        <p className="mt-4 font-sans text-base text-gray-secondary-light sm:text-lg">
          <span className="text-offwhite">If it's health,</span>{" "}
          <span className="text-accent">it's here</span>
        </p>
      </PolicySection>
    </PolicyPage>
  );
}

import type { Metadata } from "next";
import { PolicyList, PolicyPage, PolicyParagraph, PolicySection } from "@/components/policy/PolicyPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How JosephMmwa.com collects, uses, stores, and shares your information, including Google user data.",
  alternates: { canonical: "/privacy-policy" },
  openGraph: {
    title: "Privacy Policy — Joseph Mmwa",
    description: "How JosephMmwa.com collects, uses, stores, and shares your information, including Google user data.",
    url: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Privacy Policy"
      title="Privacy Policy"
      intro="Effective date: September 13, 2026"
    >
      <PolicyParagraph>
        Your privacy matters to Joseph Mmwa. This Privacy Policy explains what personal information may be collected when you use JosephMmwa.com, how that information is used, how it may be stored or shared, and the choices available to you.
      </PolicyParagraph>

      <PolicyParagraph>
        JosephMmwa.com is an independent health and medical news platform providing reporting, research, analysis and explanations of health and medical developments from Kenya, Africa and around the world.
      </PolicyParagraph>

      <PolicyParagraph>
        By using the website, you acknowledge the practices described in this Privacy Policy.
      </PolicyParagraph>

      <PolicySection heading="1. Information we collect">
        <PolicyParagraph>Depending on how you use the website, we may collect the following information.</PolicyParagraph>
        
        <h3 className="font-serif text-xl font-bold text-white mt-4 mb-2">Account information</h3>
        <PolicyParagraph>If you create an account, we may collect information such as:</PolicyParagraph>
        <PolicyList
          items={[
            <><strong className="text-white">Your name</strong></>,
            <><strong className="text-white">Email address</strong></>,
            <><strong className="text-white">Profile information provided during registration</strong></>,
            <><strong className="text-white">Authentication information necessary to maintain your account</strong></>,
            <><strong className="text-white">Your account preferences</strong></>,
            <><strong className="text-white">Information associated with activity performed while signed in</strong></>,
          ]}
        />
        <PolicyParagraph>
          Passwords, where applicable, are handled through our authentication provider and are not intentionally stored by Joseph Mmwa in plain text.
        </PolicyParagraph>

        <h3 className="font-serif text-xl font-bold text-white mt-4 mb-2">Google Sign-In</h3>
        <PolicyParagraph>
          You may have the option to create or access your Joseph Mmwa account using Google Sign-In.
        </PolicyParagraph>
        <PolicyParagraph>
          When you use Google Sign-In, Google may provide us with basic information associated with your Google Account, depending on the permissions requested and granted. This may include your name, email address, profile picture and a unique identifier associated with your Google account.
        </PolicyParagraph>
        <PolicyParagraph>We use information received through Google Sign-In to:</PolicyParagraph>
        <PolicyList
          items={[
            <>Create or authenticate your Joseph Mmwa account</>,
            <>Identify your account when you sign in</>,
            <>Maintain your account session</>,
            <>Associate your account with features such as comments and account preferences</>,
            <>Communicate with you about your account when necessary</>,
          ]}
        />
        <PolicyList
          items={[
            <>We do not request access to Gmail, Google Drive, Google Calendar, Google Contacts or other Google services unless a particular feature requires such access and the relevant permission is clearly presented to you.</>,
            <>We do not sell Google user data.</>,
            <>We do not use Google user data received through Google Sign-In for advertising purposes.</>,
            <>Google account information is only used and retained as necessary to provide the account and authentication features described in this Privacy Policy.</>,
            <>Google&apos;s requirements specifically require an application&apos;s privacy policy to explain how Google user data is accessed, used, stored and shared.</>,
          ]}
        />

        <h3 className="font-serif text-xl font-bold text-white mt-4 mb-2">Comments</h3>
        <PolicyParagraph>If commenting is available, we may collect and store:</PolicyParagraph>
        <PolicyList
          items={[
            <>Your comment</>,
            <>Your account name or display name</>,
            <>Your account identifier</>,
            <>The date and time the comment was submitted</>,
            <>Information necessary to moderate or manage comments</>,
          ]}
        />
        <PolicyParagraph>
          Comments may be publicly visible on the website. We may remove comments that violate our Terms of Service, editorial standards or applicable law.
        </PolicyParagraph>

        <h3 className="font-serif text-xl font-bold text-white mt-4 mb-2">Newsletter subscriptions</h3>
        <PolicyParagraph>
          If you subscribe to a Joseph Mmwa newsletter, we may collect your email address and information necessary to manage your subscription. Your email address may be processed by an email delivery provider used to send newsletters and account-related messages. You may unsubscribe from marketing or newsletter communications at any time using the unsubscribe mechanism provided in the communication or by contacting us.
        </PolicyParagraph>

        <h3 className="font-serif text-xl font-bold text-white mt-4 mb-2">Contact forms</h3>
        <PolicyParagraph>If you contact Joseph Mmwa through a contact form or email, we may receive information such as:</PolicyParagraph>
        <PolicyList
          items={[
            <>Your name</>,
            <>Email address</>,
            <>Organisation, if provided</>,
            <>Subject</>,
            <>Message</>,
            <>Other information you voluntarily provide</>,
          ]}
        />
        <PolicyParagraph>
          We use this information to respond to your enquiry, request, correction request, collaboration request or other communication.
        </PolicyParagraph>

        <h3 className="font-serif text-xl font-bold text-white mt-4 mb-2">Technical information</h3>
        <PolicyParagraph>
          When you visit the website, certain technical information may be automatically generated or recorded by our hosting, security and infrastructure providers, including IP address, browser type, device type, operating system, approximate location derived from technical information, pages or resources requested, date and time of requests, referring website, and security and error logs.
        </PolicyParagraph>
        <PolicyParagraph>
          This information may be used to operate, secure, troubleshoot and improve the website. We do not intentionally use technical information to identify you personally unless necessary for security, legal compliance or another legitimate purpose.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="2. How we use information">
        <PolicyParagraph>Information collected through JosephMmwa.com may be used to:</PolicyParagraph>
        <PolicyList
          items={[
            <>Create and manage user accounts</>,
            <>Authenticate users</>,
            <>Provide website functionality</>,
            <>Enable comments and account features</>,
            <>Respond to enquiries</>,
            <>Send newsletters where you have subscribed</>,
            <>Send necessary account-related communications</>,
            <>Process correction or privacy requests</>,
            <>Maintain website security</>,
            <>Detect and prevent abuse, fraud or unauthorized activity</>,
            <>Troubleshoot technical problems</>,
            <>Improve website performance and functionality</>,
            <>Comply with applicable legal obligations</>,
          ]}
        />
        <PolicyParagraph>
          We collect and use personal information for specific and legitimate purposes and seek to limit collection to information reasonably necessary for those purposes.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="3. How we use Google user data">
        <PolicyParagraph>
          Information obtained through Google Sign-In is used only for the purposes disclosed in this Privacy Policy.
        </PolicyParagraph>
        <PolicyList
          items={[
            <>We do not sell Google user data.</>,
            <>We do not use Google user data for targeted advertising.</>,
            <>We do not transfer Google user data to third parties except where necessary to provide the authentication service, maintain the website, comply with legal obligations, protect security, or as otherwise permitted by applicable law and Google&apos;s policies.</>,
            <>Where Google account information is stored through our service providers, we take reasonable measures to protect it against unauthorized access, alteration or disclosure.</>,
          ]}
        />
      </PolicySection>

      <PolicySection heading="4. Service providers and third parties">
        <PolicyParagraph>JosephMmwa.com may use third-party service providers to operate parts of the website, including providers for authentication, database services, website hosting, cloud storage, email delivery, security, analytics (where implemented), and payment processing (where paid services are offered).</PolicyParagraph>
        <PolicyParagraph>For example, Supabase may be used for authentication, databases and storage.</PolicyParagraph>
        <PolicyParagraph>
          Third-party providers process information according to their own terms and privacy policies as well as the arrangements applicable to the services they provide. We do not permit service providers to use personal information for purposes unrelated to the services they provide to Joseph Mmwa, except where otherwise permitted or required by law.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="5. Payments">
        <PolicyParagraph>
          If paid subscriptions, advertising services, memberships or other paid services are offered through JosephMmwa.com, payments may be processed by third-party payment providers. Payment providers may collect payment information directly from you. Joseph Mmwa does not need to store complete payment-card details when payment processing is handled directly by an authorized payment provider. Payment information is subject to the privacy policy and terms of the applicable payment provider.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="6. Cookies and similar technologies">
        <PolicyParagraph>JosephMmwa.com may use cookies and similar technologies for maintaining account sessions, authentication, website security, remembering preferences, basic website functionality, and measuring website performance where analytics are implemented.</PolicyParagraph>
        <PolicyParagraph>
          If advertising or analytics technologies that use cookies or similar identifiers are introduced, the relevant practices may be described in additional notices or updated in this Privacy Policy.
        </PolicyParagraph>
        <PolicyParagraph>
          You can control cookies through your browser settings. Disabling certain cookies may affect website functionality.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="7. Advertising">
        <PolicyParagraph>JosephMmwa.com may introduce advertising services in the future.</PolicyParagraph>
        <PolicyParagraph>
          If third-party advertising is implemented, advertising providers may use cookies or similar technologies in accordance with their own policies and applicable requirements. The Privacy Policy will be updated when necessary to accurately describe advertising technologies that are actually used on the website. We do not state that an advertising service is active unless it has actually been implemented.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="8. Data sharing">
        <PolicyParagraph>We do not sell your personal information.</PolicyParagraph>
        <PolicyParagraph>
          Information may be shared with service providers when reasonably necessary to operate the website, such as authentication, hosting, database, storage, email, security and payment providers. Information may also be disclosed where required by law, legal process, court order, regulatory requirement, or where reasonably necessary to protect the rights, safety, security or property of Joseph Mmwa, website users or others.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="9. Data retention">
        <PolicyParagraph>
          We retain personal information only for as long as reasonably necessary for the purposes for which it was collected, including providing your account, providing requested services, maintaining comments, responding to enquiries, maintaining security records, resolving disputes, complying with legal obligations, and enforcing our Terms of Service. When information is no longer required, we may delete it or anonymize it where reasonably appropriate.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="10. Account deletion">
        <PolicyParagraph>
          You may request deletion of your Joseph Mmwa account and associated personal information by contacting:{" "}
          <a href="mailto:contact@josephmmwa.com" className="text-accent hover:underline">
            contact@josephmmwa.com
          </a>
        </PolicyParagraph>
        <PolicyParagraph>
          Some information may need to be retained where required by law, necessary for legitimate security purposes, necessary to resolve disputes, or otherwise permitted by applicable law. Deleting your account may also remove or affect content associated with that account, including comments, where technically and legally appropriate.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="11. Your privacy rights">
        <PolicyParagraph>
          Depending on applicable law, you may have rights regarding your personal information, including being informed, accessing personal data we hold about you, requesting correction of inaccurate information, objecting to processing, requesting deletion, requesting restriction of processing, withdrawing consent, and requesting processing info.
        </PolicyParagraph>
        <PolicyParagraph>
          Kenya&apos;s data-protection framework recognizes rights including being informed, accessing personal data, objecting to processing, correcting inaccurate data and requesting deletion of false or misleading data.
        </PolicyParagraph>
        <PolicyParagraph>
          To exercise a privacy right, contact:{" "}
          <a href="mailto:contact@josephmmwa.com" className="text-accent hover:underline">
            contact@josephmmwa.com
          </a>
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="12. International data processing">
        <PolicyParagraph>
          Some technology and service providers used by JosephMmwa.com may process or store information outside Kenya. Where personal information is transferred outside Kenya, we seek to use appropriate safeguards and comply with applicable data-protection requirements.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="13. Security">
        <PolicyParagraph>
          We use reasonable technical and organizational measures designed to protect personal information from unauthorized access, loss, misuse, alteration or disclosure, including secure connections, authentication controls, database access controls, access restrictions and security monitoring. However, no internet service can guarantee absolute security.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="14. Children's privacy">
        <PolicyParagraph>
          JosephMmwa.com is a general-audience health and medical news website. The website is not specifically directed at children, and we do not knowingly request personal information from children for purposes that are not appropriate under applicable law. If you believe that a child has provided personal information to us inappropriately, please contact us at{" "}
          <a href="mailto:contact@josephmmwa.com" className="text-accent hover:underline">
            contact@josephmmwa.com
          </a>
          .
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="15. Third-party websites">
        <PolicyParagraph>
          JosephMmwa.com may contain links to external websites, including news organizations, research institutions, government agencies, social-media platforms and other sources. We are not responsible for the privacy practices or content of external websites. You should review the privacy policy of any third-party website you visit.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="16. Changes to this Privacy Policy">
        <PolicyParagraph>
          We may update this Privacy Policy when our website, services, technology or legal obligations change. The updated version will be published on this page with a revised effective date.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="17. Contact">
        <PolicyParagraph>Questions, requests or concerns about this Privacy Policy can be sent to:</PolicyParagraph>
        <PolicyParagraph>
          Joseph Mmwa<br />
          Email:{" "}
          <a href="mailto:contact@josephmmwa.com" className="text-accent hover:underline">
            contact@josephmmwa.com
          </a><br />
          Website: <span className="text-white">josephmmwa.com</span>
        </PolicyParagraph>
      </PolicySection>
    </PolicyPage>
  );
}

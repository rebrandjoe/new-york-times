import type { Metadata } from "next";
import { PolicyLead, PolicyList, PolicyPage, PolicyParagraph, PolicySection } from "@/components/policy/PolicyPage";

export const metadata: Metadata = {
  title: "AI Policy",
  description:
    "How Joseph Mmwa uses artificial intelligence — human editorial responsibility, verification standards, and accountability in health journalism.",
  alternates: { canonical: "/ai-policy" },
  openGraph: {
    title: "AI Policy — Joseph Mmwa",
    description:
      "How Joseph Mmwa uses artificial intelligence — human editorial responsibility, verification standards, and accountability in health journalism.",
    url: "/ai-policy",
  },
};

export default function AiPolicyPage() {
  return (
    <PolicyPage
      eyebrow="AI Policy"
      title="AI Policy"
      intro="Technology can assist journalism. It cannot replace editorial responsibility."
    >
      <PolicyParagraph>Artificial intelligence is becoming part of the modern information environment.</PolicyParagraph>
      <PolicyParagraph>
        JOSEPH MMWA uses AI tools where they can improve efficiency, research workflow or
        presentation.
      </PolicyParagraph>
      <PolicyParagraph>But there is an important boundary:</PolicyParagraph>
      <PolicyLead>AI may assist the work. A human editor remains responsible for the work.</PolicyLead>

      <PolicySection heading="Human editorial judgment">
        <PolicyParagraph>AI does not decide what JOSEPH MMWA publishes.</PolicyParagraph>
        <PolicyParagraph>
          It does not determine what is important, whether evidence is sufficient, whether a claim is
          credible or whether a story is ready for readers.
        </PolicyParagraph>
        <PolicyParagraph>Those remain human editorial decisions.</PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Where AI may assist">
        <PolicyParagraph>Depending on the task, AI tools may assist with:</PolicyParagraph>
        <PolicyList
          items={[
            "organising information;",
            "summarising material for internal review;",
            "identifying claims requiring further verification;",
            "transcription;",
            "translation;",
            "formatting;",
            "research workflow;",
            "identifying inconsistencies;",
            "drafting material for human review.",
          ]}
        />
        <PolicyParagraph>The use of AI is a tool choice, not an editorial standard.</PolicyParagraph>
      </PolicySection>

      <PolicySection heading="AI is not evidence">
        <PolicyParagraph>AI-generated information is treated as unverified.</PolicyParagraph>
        <PolicyParagraph>
          Artificial intelligence systems can produce inaccurate, incomplete, outdated or fabricated
          information.
        </PolicyParagraph>
        <PolicyParagraph>
          We therefore do not treat an AI response as a source simply because it sounds authoritative.
        </PolicyParagraph>
        <PolicyParagraph>Important claims must be independently verified against appropriate evidence.</PolicyParagraph>
      </PolicySection>

      <PolicySection heading="No fabricated journalism">
        <PolicyParagraph>JOSEPH MMWA does not knowingly use AI to fabricate:</PolicyParagraph>
        <PolicyList
          items={[
            "sources;",
            "quotations;",
            "experts;",
            "patients;",
            "research findings;",
            "statistics;",
            "institutions;",
            "events;",
            "medical evidence.",
          ]}
        />
        <PolicyParagraph>Synthetic information must never be presented as authentic reporting.</PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Health requires greater caution">
        <PolicyParagraph>Medical information can have real consequences.</PolicyParagraph>
        <PolicyParagraph>
          For stories involving treatments, vaccines, diseases, clinical research, public-health
          recommendations or medical risks, AI-assisted material must receive appropriate human
          scrutiny and source verification.
        </PolicyParagraph>
        <PolicyParagraph>The more consequential the claim, the greater the need for verification.</PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Attribution remains human">
        <PolicyParagraph>
          AI does not replace the journalist, researcher or institution that originally produced
          information.
        </PolicyParagraph>
        <PolicyParagraph>
          Where our journalism relies on reporting or research produced elsewhere, we seek to identify
          and attribute the original work.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="AI-generated images and media">
        <PolicyParagraph>We distinguish between authentic editorial imagery and synthetic material.</PolicyParagraph>
        <PolicyParagraph>
          AI-generated imagery must not be presented as a genuine photograph of a real person, event
          or medical situation.
        </PolicyParagraph>
        <PolicyParagraph>
          Where synthetic media is materially relevant to a story, its nature should be made clear.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Transparency">
        <PolicyParagraph>Not every use of AI requires a public label.</PolicyParagraph>
        <PolicyParagraph>
          Routine assistance with transcription, formatting, spelling or workflow is different from
          publishing synthetic material.
        </PolicyParagraph>
        <PolicyParagraph>
          Where AI materially contributes to the creation or presentation of published content in a
          way that could reasonably affect a reader&apos;s understanding, we may disclose that use.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Accountability">
        <PolicyParagraph>If an AI-assisted story contains an error, responsibility remains with JOSEPH MMWA.</PolicyParagraph>
        <PolicyParagraph>We do not blame the software.</PolicyParagraph>
        <PolicyParagraph>The publication process is accountable.</PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Our principle">
        <PolicyParagraph>Technology should make journalism more efficient.</PolicyParagraph>
        <PolicyParagraph>It should never make journalism less trustworthy.</PolicyParagraph>
        <PolicyLead>The tool can be artificial. The accountability cannot be.</PolicyLead>
      </PolicySection>
    </PolicyPage>
  );
}

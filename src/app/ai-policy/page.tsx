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
      intro="AI can support journalism. Editorial responsibility remains human."
    >
      <PolicyParagraph>
        Artificial intelligence is increasingly used across journalism and the wider information environment. At JOSEPH MMWA, AI tools may be used selectively to support research, organisation, production and presentation.
      </PolicyParagraph>
      <PolicyParagraph>
        The use of AI does not change our editorial standards. Accuracy, verification, independence and accountability remain the responsibility of the human editor.
      </PolicyParagraph>

      <PolicySection heading="Editorial oversight">
        <PolicyParagraph>AI does not determine what JOSEPH MMWA publishes.</PolicyParagraph>
        <PolicyParagraph>
          Editorial decisions—including what to report, which sources to use, whether evidence is sufficient and whether material is ready for publication—remain subject to human judgment.
        </PolicyParagraph>
        <PolicyParagraph>
          AI-assisted material is reviewed before publication where its use could affect the accuracy, meaning or presentation of published content.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="How AI may be used">
        <PolicyParagraph>AI tools may assist with:</PolicyParagraph>
        <PolicyList
          items={[
            <>research and information organisation;</>,
            <>summarising material for editorial review;</>,
            <>identifying claims that require verification;</>,
            <>transcription and translation;</>,
            <>editing, formatting and production;</>,
            <>identifying inconsistencies or gaps;</>,
            <>developing initial drafts for human review.</>,
          ]}
        />
        <PolicyParagraph>These applications support the editorial process; they do not replace it.</PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Verification and sources">
        <PolicyParagraph>AI-generated information is not treated as an authoritative source.</PolicyParagraph>
        <PolicyParagraph>
          Because AI systems can produce inaccurate, incomplete or outdated information, factual claims must be checked against appropriate primary sources, official records, scientific literature or credible original reporting.
        </PolicyParagraph>
        <PolicyParagraph>
          Particular care is taken with health and medical information, where inaccurate reporting can have significant consequences.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Accuracy and integrity">
        <PolicyParagraph>JOSEPH MMWA does not knowingly present AI-generated material as authentic reporting or use AI to invent:</PolicyParagraph>
        <PolicyList
          items={[
            <>sources or quotations;</>,
            <>people, experts or patients;</>,
            <>research findings or statistics;</>,
            <>institutions or events;</>,
            <>medical evidence or claims.</>,
          ]}
        />
        <PolicyParagraph>
          Information originating from another journalist, publication, institution or research organisation should be appropriately attributed. AI does not replace or obscure the original source of information.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Health and medical journalism">
        <PolicyParagraph>
          For reporting involving diseases, treatments, medicines, vaccines, clinical research, public-health guidance or medical risks, AI-assisted material is subject to appropriate source verification and editorial scrutiny.
        </PolicyParagraph>
        <PolicyParagraph>The potential impact of a claim determines the level of care required before publication.</PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Synthetic images and media">
        <PolicyParagraph>
          AI-generated images or other synthetic media must not be presented as authentic photographs, recordings or depictions of real people, events or medical situations.
        </PolicyParagraph>
        <PolicyParagraph>
          Where synthetic media is materially relevant to published content, its nature will be made clear to readers.
        </PolicyParagraph>
        <PolicyParagraph>
          Authentic editorial photographs, illustrations and other media remain subject to appropriate attribution and contextual accuracy.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Transparency">
        <PolicyParagraph>
          Not every routine use of AI requires disclosure. Assistance with tasks such as transcription, formatting, translation or basic editing is different from publishing synthetic content.
        </PolicyParagraph>
        <PolicyParagraph>
          Where AI makes a material contribution to published content or its presentation in a way that could reasonably affect a reader&apos;s understanding, JOSEPH MMWA may disclose that use.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Accountability">
        <PolicyParagraph>
          The use of AI does not transfer editorial responsibility to a technology provider or software system.
        </PolicyParagraph>
        <PolicyParagraph>
          JOSEPH MMWA remains responsible for the accuracy, integrity and presentation of the journalism it publishes.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Our standard">
        <PolicyParagraph>AI is a tool within the editorial process—not a substitute for journalism.</PolicyParagraph>
        <PolicyParagraph>Technology may assist the work. Human judgment remains accountable for the result.</PolicyParagraph>
        <PolicyLead>The tool can be artificial. The accountability cannot be.</PolicyLead>
      </PolicySection>
    </PolicyPage>
  );
}

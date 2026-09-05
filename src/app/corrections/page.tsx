import type { Metadata } from "next";
import { PolicyList, PolicyPage, PolicyParagraph, PolicySection } from "@/components/policy/PolicyPage";

export const metadata: Metadata = {
  title: "Corrections",
  description:
    "JOSEPH MMWA's corrections policy — how factual errors are identified, corrected and disclosed to readers.",
  alternates: { canonical: "/corrections" },
  openGraph: {
    title: "Corrections — Joseph Mmwa",
    description:
      "JOSEPH MMWA's corrections policy — how factual errors are identified, corrected and disclosed to readers.",
    url: "/corrections",
  },
};

export default function CorrectionsPage() {
  return (
    <PolicyPage eyebrow="Corrections" title="Corrections" intro="Accuracy includes what happens after publication.">
      <PolicyParagraph>Every newsroom wants to be accurate.</PolicyParagraph>
      <PolicyParagraph>A trustworthy newsroom also knows what to do when it is not.</PolicyParagraph>
      <PolicyParagraph>
        If JOSEPH MMWA publishes a material factual error, we believe the responsible response is to
        correct the record clearly and promptly.
      </PolicyParagraph>

      <PolicySection heading="What we correct">
        <PolicyParagraph>We may issue a correction for material errors involving:</PolicyParagraph>
        <PolicyList
          items={[
            "names;",
            "dates;",
            "locations;",
            "numbers;",
            "medical findings;",
            "study details;",
            "quotations;",
            "attribution;",
            "institutions;",
            "descriptions of events;",
            "other facts that materially affect the reader's understanding.",
          ]}
        />
      </PolicySection>

      <PolicySection heading="Correction or update?">
        <PolicyParagraph>Not every change is a correction.</PolicyParagraph>
        <PolicyParagraph>
          An update adds new verified information that was not available when the article was
          originally published.
        </PolicyParagraph>
        <PolicyParagraph>A correction addresses information that was previously published inaccurately.</PolicyParagraph>
        <PolicyParagraph>Where appropriate, we distinguish between the two.</PolicyParagraph>
      </PolicySection>

      <PolicySection heading="We do not quietly erase significant mistakes">
        <PolicyParagraph>
          For material errors, we may include a correction notice explaining what was incorrect and
          what has been changed.
        </PolicyParagraph>
        <PolicyParagraph>
          The purpose is not to draw attention away from the mistake. It is to give readers an
          accurate record.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Serious errors">
        <PolicyParagraph>
          Where an error substantially undermines an article, we may take additional action, including
          prominent correction, substantial revision or withdrawal of the article where necessary.
        </PolicyParagraph>
        <PolicyParagraph>The response should be proportionate to the seriousness of the error.</PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Reader corrections">
        <PolicyParagraph>Readers are encouraged to alert us to potential errors.</PolicyParagraph>
        <PolicyParagraph>A useful correction request should identify:</PolicyParagraph>
        <PolicyList items={["the article;", "the specific statement;", "why it may be inaccurate;", "evidence supporting the concern."]} />
        <PolicyParagraph>
          A correction request does not automatically result in a correction. We review claims against
          the available evidence.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Corrections and accountability">
        <PolicyParagraph>We do not consider a correction an admission that journalism has failed.</PolicyParagraph>
        <PolicyParagraph>We consider refusing to correct a known error the greater failure.</PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Our promise">
        <PolicyParagraph>We will not defend an error simply because it has already been published.</PolicyParagraph>
        <PolicyParagraph>
          When the evidence changes—or when we discover that we were wrong—we will act accordingly.
        </PolicyParagraph>
      </PolicySection>
    </PolicyPage>
  );
}

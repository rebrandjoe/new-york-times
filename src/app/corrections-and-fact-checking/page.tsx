import type { Metadata } from "next";
import { PolicyGroup, PolicyList, PolicyPage, PolicyParagraph, PolicySection } from "@/components/policy/PolicyPage";

export const metadata: Metadata = {
  title: "Corrections & Fact-Checking",
  description:
    "How JOSEPH MMWA verifies health and medical claims before publication, and how factual errors are corrected after.",
  alternates: { canonical: "/corrections-and-fact-checking" },
  openGraph: {
    title: "Corrections & Fact-Checking — Joseph Mmwa",
    description:
      "How JOSEPH MMWA verifies health and medical claims before publication, and how factual errors are corrected after.",
    url: "/corrections-and-fact-checking",
  },
};

export default function CorrectionsAndFactCheckingPage() {
  return (
    <PolicyPage
      eyebrow="Corrections & Fact-Checking"
      title="Corrections & Fact-Checking"
      intro="Before we ask the reader to believe it"
    >
      <PolicyParagraph>Health information does not become true because it is widely shared.</PolicyParagraph>
      <PolicyParagraph>A study can be real and still be misunderstood.</PolicyParagraph>
      <PolicyParagraph>A statistic can be accurate and still lack context.</PolicyParagraph>
      <PolicyParagraph>A claim can come from a respected institution and still require scrutiny.</PolicyParagraph>
      <PolicyParagraph>Our fact-checking approach is designed around one fundamental question:</PolicyParagraph>
      <PolicyParagraph>What evidence supports this claim?</PolicyParagraph>
      <PolicyParagraph>
        And when we get it wrong, accuracy also means correcting the record clearly and promptly.
      </PolicyParagraph>

      <PolicyGroup heading="Fact-Checking">
        <PolicySection headingLevel={3} heading="Our editorial sequence">
          <PolicyParagraph>Our working approach is:</PolicyParagraph>
          <PolicyParagraph>Read → Understand → Verify → Attribute → Write → Publish</PolicyParagraph>
          <PolicyParagraph>Each stage serves a purpose.</PolicyParagraph>
          <PolicyParagraph>
            <strong className="text-white">Read</strong>
          </PolicyParagraph>
          <PolicyParagraph>
            Where possible, we go beyond summaries and examine the original material.
          </PolicyParagraph>
          <PolicyParagraph>
            For research stories, this may mean reviewing the study itself rather than relying solely
            on a press release or social-media description.
          </PolicyParagraph>
          <PolicyParagraph>
            <strong className="text-white">Understand</strong>
          </PolicyParagraph>
          <PolicyParagraph>
            Before explaining a scientific or medical development, we seek to understand:
          </PolicyParagraph>
          <PolicyList
            items={[
              "what was actually studied;",
              "who or what was studied;",
              "how the study was conducted;",
              "what the researchers found;",
              "what they did not find;",
              "what limitations exist.",
            ]}
          />
          <PolicyParagraph>
            <strong className="text-white">Verify</strong>
          </PolicyParagraph>
          <PolicyParagraph>Claims are checked against sources appropriate to the subject. These may include:</PolicyParagraph>
          <PolicyList
            items={[
              "peer-reviewed research;",
              "official government data;",
              "regulatory authorities;",
              "international health organisations;",
              "universities and research institutions;",
              "original documents;",
              "official statistics;",
              "credible original reporting.",
            ]}
          />
          <PolicyParagraph>No single source is automatically sufficient for every claim.</PolicyParagraph>
        </PolicySection>

        <PolicySection headingLevel={3} heading="Research is read in context">
          <PolicyParagraph>
            We pay attention to distinctions that can materially change the meaning of medical
            evidence. For example:
          </PolicyParagraph>
          <PolicyList
            items={[
              "laboratory research versus human research;",
              "animal studies versus clinical studies;",
              "observational studies versus controlled trials;",
              "association versus causation;",
              "preliminary findings versus established evidence;",
              "statistical significance versus clinical significance.",
            ]}
          />
        </PolicySection>

        <PolicySection headingLevel={3} heading="Sources and expertise">
          <PolicyParagraph>Experts can help explain complex evidence.</PolicyParagraph>
          <PolicyParagraph>But expertise does not eliminate verification.</PolicyParagraph>
          <PolicyParagraph>
            Where expert interpretation is used, we consider relevant qualifications, institutional
            affiliations and potential conflicts of interest.
          </PolicyParagraph>
        </PolicySection>

        <PolicySection headingLevel={3} heading="Viral claims">
          <PolicyParagraph>Virality is not verification.</PolicyParagraph>
          <PolicyParagraph>
            A health claim being repeated across social media does not increase its evidentiary value.
          </PolicyParagraph>
          <PolicyParagraph>
            In some circumstances, widespread circulation is precisely why a claim deserves closer
            scrutiny.
          </PolicyParagraph>
        </PolicySection>

        <PolicySection headingLevel={3} heading="AI-generated information">
          <PolicyParagraph>
            Information generated by AI is not accepted as a substitute for primary evidence or
            authoritative sources.
          </PolicyParagraph>
          <PolicyParagraph>AI can assist research. It cannot independently verify itself.</PolicyParagraph>
        </PolicySection>

        <PolicySection headingLevel={3} heading="Attribution">
          <PolicyParagraph>
            When information originates elsewhere, we seek to identify the original reporting or
            source.
          </PolicyParagraph>
          <PolicyParagraph>
            Fact-checking is not simply about deciding whether something is true. It is also about
            understanding where the information came from and how confidently it can be presented.
          </PolicyParagraph>
        </PolicySection>
      </PolicyGroup>

      <PolicyGroup heading="Corrections">
        <PolicySection headingLevel={3} heading="Accuracy includes what happens after publication">
          <PolicyParagraph>Every newsroom wants to be accurate.</PolicyParagraph>
          <PolicyParagraph>A trustworthy newsroom also knows what to do when it is not.</PolicyParagraph>
          <PolicyParagraph>
            If JOSEPH MMWA publishes a material factual error, we believe the responsible response is
            to correct the record clearly and promptly.
          </PolicyParagraph>
        </PolicySection>

        <PolicySection headingLevel={3} heading="What we correct">
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

        <PolicySection headingLevel={3} heading="Correction or update?">
          <PolicyParagraph>Not every change is a correction.</PolicyParagraph>
          <PolicyParagraph>
            An update adds new verified information that was not available when the article was
            originally published.
          </PolicyParagraph>
          <PolicyParagraph>A correction addresses information that was previously published inaccurately.</PolicyParagraph>
          <PolicyParagraph>Where appropriate, we distinguish between the two.</PolicyParagraph>
        </PolicySection>

        <PolicySection headingLevel={3} heading="We do not quietly erase significant mistakes">
          <PolicyParagraph>
            For material errors, we may include a correction notice explaining what was incorrect and
            what has been changed.
          </PolicyParagraph>
          <PolicyParagraph>
            The purpose is not to draw attention away from the mistake. It is to give readers an
            accurate record.
          </PolicyParagraph>
        </PolicySection>

        <PolicySection headingLevel={3} heading="Serious errors">
          <PolicyParagraph>
            Where an error substantially undermines an article, we may take additional action,
            including prominent correction, substantial revision or withdrawal of the article where
            necessary.
          </PolicyParagraph>
          <PolicyParagraph>The response should be proportionate to the seriousness of the error.</PolicyParagraph>
        </PolicySection>

        <PolicySection headingLevel={3} heading="Reader corrections">
          <PolicyParagraph>Readers are encouraged to alert us to potential errors.</PolicyParagraph>
          <PolicyParagraph>A useful correction request should identify:</PolicyParagraph>
          <PolicyList items={["the article;", "the specific statement;", "why it may be inaccurate;", "evidence supporting the concern."]} />
          <PolicyParagraph>
            A correction request does not automatically result in a correction. We review claims
            against the available evidence.
          </PolicyParagraph>
        </PolicySection>

        <PolicySection headingLevel={3} heading="Our standard">
          <PolicyParagraph>We do not ask: &quot;Is this interesting enough to publish?&quot;</PolicyParagraph>
          <PolicyParagraph>We ask: &quot;Do we have enough evidence to present this as fact?&quot;</PolicyParagraph>
          <PolicyParagraph>
            We do not consider a correction an admission that journalism has failed. We consider
            refusing to correct a known error the greater failure.
          </PolicyParagraph>
          <PolicyParagraph>
            We will not defend an error simply because it has already been published. When the
            evidence changes—or when we discover that we were wrong—we will act accordingly.
          </PolicyParagraph>
        </PolicySection>
      </PolicyGroup>
    </PolicyPage>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import {
  PolicyLead,
  PolicyList,
  PolicyPage,
  PolicyParagraph,
  PolicySection,
  PolicySubheading,
} from "@/components/policy/PolicyPage";

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
    <PolicyPage title="Corrections & Fact-Checking" updatedOn="2026-10-24">
      <PolicyLead>Before we ask readers to believe it, we must examine the evidence.</PolicyLead>

      <PolicyParagraph>
        Health information does not become true because it is widely shared.
      </PolicyParagraph>
      <PolicyParagraph>
        A study can be genuine and still be misunderstood. A statistic can be accurate and still
        lack context. A claim can come from a respected institution and still require scrutiny.
      </PolicyParagraph>
      <PolicyParagraph>
        At JOSEPH MMWA, fact-checking begins with a fundamental question:
      </PolicyParagraph>
      <PolicyLead>
        What evidence supports this claim, and does that evidence justify the way it is presented?
      </PolicyLead>
      <PolicyParagraph>
        My approach is to examine the available evidence, identify the original source where
        possible, understand the limitations of the information and communicate findings accurately.
        When an error occurs, accountability requires taking reasonable steps to correct the record
        clearly and promptly.
      </PolicyParagraph>

      <PolicySection heading="Fact-checking">
        <PolicySubheading>1. The editorial process</PolicySubheading>
        <PolicyParagraph>My working approach is:</PolicyParagraph>
        <p className="font-serif text-base font-bold text-white sm:text-lg">
          Read → Understand → Verify → Attribute → Write → Review → Publish
        </p>
        <PolicyParagraph>
          Each stage serves a purpose. This sequence describes my editorial approach; the checks
          required depend on the subject, the evidence available and the potential consequences of an
          error.
        </PolicyParagraph>

        <PolicySubheading>Read</PolicySubheading>
        <PolicyParagraph>
          Where possible, I examine original material rather than relying solely on summaries, press
          releases, headlines or social-media posts.
        </PolicyParagraph>
        <PolicyParagraph>
          For medical research, this may mean reviewing the published study, clinical trial record,
          research abstract, supplementary material or relevant regulatory documentation.
        </PolicyParagraph>
        <PolicyParagraph>
          When the original material is unavailable, I consider what reliable sources are accessible
          and whether the available evidence is sufficient to support publication.
        </PolicyParagraph>

        <PolicySubheading>Understand</PolicySubheading>
        <PolicyParagraph>
          Before explaining a scientific or medical development, I seek to establish:
        </PolicyParagraph>
        <PolicyList
          items={[
            "What was actually studied.",
            "Who or what was studied.",
            "How the research was conducted.",
            "What the researchers found.",
            "What the findings do not establish.",
            "What limitations could affect the interpretation.",
            "Whether the article or announcement accurately reflects the underlying evidence.",
          ]}
        />

        <PolicySubheading>Verify</PolicySubheading>
        <PolicyParagraph>
          I check factual claims against sources appropriate to the subject. Depending on the story,
          these may include original research, peer-reviewed studies, official government data,
          regulatory authorities, international health organisations, universities, research
          institutions, official records and credible original reporting.
        </PolicyParagraph>
        <PolicyParagraph>
          No single source is automatically sufficient for every claim. The verification required
          depends on the nature of the claim, the reliability of the source and the consequences of
          getting it wrong.
        </PolicyParagraph>

        <PolicySubheading>Attribute</PolicySubheading>
        <PolicyParagraph>
          I identify where information originated and distinguish between my own reporting, findings
          from researchers, statements from institutions and reporting published by other
          journalists.
        </PolicyParagraph>
        <PolicyParagraph>
          Where information comes from an external publication or original reporter, I seek to
          acknowledge that source appropriately. I do not present another journalist's original
          reporting as my own.
        </PolicyParagraph>

        <PolicySubheading>Review</PolicySubheading>
        <PolicyParagraph>
          Before publication, I assess whether the article's claims, quotations, figures,
          headline and conclusions are supported by the available evidence.
        </PolicyParagraph>
        <PolicyParagraph>
          I pay particular attention to details that could materially change the meaning of a story,
          especially medical claims, statistics, dates, study findings and statements attributed to
          individuals or institutions.
        </PolicyParagraph>

        <PolicySubheading>2. Research must be understood in context</PolicySubheading>
        <PolicyParagraph>
          Scientific findings can be misrepresented even when individual facts are technically
          correct. Context matters.
        </PolicyParagraph>
        <PolicyParagraph>I pay particular attention to distinctions such as:</PolicyParagraph>
        <PolicyList
          items={[
            "Laboratory research versus research involving humans.",
            "Animal studies versus human clinical studies.",
            "Observational studies versus randomised controlled trials.",
            "Association versus causation.",
            "Preliminary findings versus established evidence.",
            "Statistical significance versus clinical significance.",
            "Relative risk reduction versus absolute risk reduction.",
            "Research results versus regulatory approval or established clinical practice.",
          ]}
        />
        <PolicyParagraph>
          I also consider the size and design of a study, its limitations, the population studied and
          whether the conclusions are supported by the results.
        </PolicyParagraph>
        <PolicyParagraph>
          A promising result is not automatically a proven treatment. A study involving a small group
          of participants does not necessarily establish effectiveness across a wider population. A
          press release's interpretation of a study does not replace examination of the available
          evidence.
        </PolicyParagraph>
        <PolicyParagraph>
          My reporting should reflect what the evidence supports, not what would make the story more
          dramatic.
        </PolicyParagraph>

        <PolicySubheading>3. Sources and expertise</PolicySubheading>
        <PolicyParagraph>
          Experts can help explain complex research, interpret findings and provide context. However,
          expertise does not eliminate the need for verification.
        </PolicyParagraph>
        <PolicyParagraph>
          Where expert commentary is used, I consider relevant qualifications, experience,
          institutional affiliations and potential conflicts of interest.
        </PolicyParagraph>
        <PolicyParagraph>
          I distinguish between an expert's interpretation and established findings. I also
          consider whether a source has direct knowledge of the issue being discussed.
        </PolicyParagraph>
        <PolicyParagraph>
          When a material claim requires clarification or a response from a relevant institution or
          individual, I may seek comment from the appropriate source. Where such contact is material
          to the story, I aim to represent the response fairly and distinguish a response received
          from a request that remains unanswered.
        </PolicyParagraph>
        <PolicyParagraph>
          I do not invent expert opinions, interviews, quotations or institutional responses.
        </PolicyParagraph>

        <PolicySubheading>4. Official statements and press releases</PolicySubheading>
        <PolicyParagraph>
          Official statements, press releases and institutional announcements can be valuable sources
          of information, but they are not automatically conclusive evidence.
        </PolicyParagraph>
        <PolicyParagraph>
          I assess what the announcement establishes, what evidence it provides and whether its
          claims require further verification.
        </PolicyParagraph>
        <PolicyParagraph>
          Where an institution describes a development as a breakthrough, a first, a major advance or
          a success, I seek to establish whether the available evidence supports that description.
        </PolicyParagraph>
        <PolicyParagraph>
          I distinguish between what an organisation says, what the underlying evidence shows and
          what remains uncertain.
        </PolicyParagraph>

        <PolicySubheading>5. Statistics and numerical claims</PolicySubheading>
        <PolicyParagraph>
          Numbers can be misleading when their definitions, time periods, denominators or limitations
          are omitted.
        </PolicyParagraph>
        <PolicyParagraph>
          When reporting statistics, I seek to verify the original source and understand what the
          figures measure, the population they cover and the period to which they apply.
        </PolicyParagraph>
        <PolicyParagraph>
          Where relevant, I distinguish estimates from confirmed counts, projections from observed
          outcomes and percentages from absolute numbers.
        </PolicyParagraph>
        <PolicyParagraph>
          I do not knowingly change a figure's meaning through selective presentation,
          misleading comparisons or the removal of important context.
        </PolicyParagraph>
        <PolicyParagraph>
          If a statistic cannot be traced to a sufficiently reliable source, I assess whether it can
          responsibly be used, qualified or should be omitted.
        </PolicyParagraph>

        <PolicySubheading>6. Breaking news and developing claims</PolicySubheading>
        <PolicyParagraph>
          Breaking health news may emerge before all relevant details are available.
        </PolicyParagraph>
        <PolicyParagraph>
          In such situations, I distinguish confirmed information from preliminary reports,
          attributed claims and details that remain under verification.
        </PolicyParagraph>
        <PolicyParagraph>
          I identify uncertainty where it matters and update stories when material new information
          becomes available.
        </PolicyParagraph>
        <PolicyParagraph>
          Speed does not justify presenting an unconfirmed claim as established fact. If the
          available evidence is insufficient, I may wait for confirmation, narrow the claim or
          explain what remains unknown.
        </PolicyParagraph>

        <PolicySubheading>7. Viral claims and misinformation</PolicySubheading>
        <PolicyParagraph>
          <strong className="text-white">Virality is not verification.</strong>
        </PolicyParagraph>
        <PolicyParagraph>
          A claim repeated across social media does not become more reliable because it has attracted
          attention or been shared by prominent accounts.
        </PolicyParagraph>
        <PolicyParagraph>
          When examining a viral health claim, I seek to identify its origin, check the evidence it
          relies on and assess whether it accurately represents the available facts.
        </PolicyParagraph>
        <PolicyParagraph>
          I distinguish between demonstrably false claims, unsupported claims, misleading
          interpretations and questions that remain unresolved. I do not label a claim false merely
          because evidence is incomplete, nor describe a claim as established simply because it has
          not been disproved.
        </PolicyParagraph>

        <PolicySubheading>8. AI-assisted fact-checking</PolicySubheading>
        <PolicyParagraph>
          AI tools may assist with research organisation, document analysis, identifying claims that
          require checking and reviewing drafts for possible inconsistencies.
        </PolicyParagraph>
        <PolicyParagraph>
          However, AI-generated information is not treated as proof, and AI-assisted fact-checking is
          not infallible.
        </PolicyParagraph>
        <PolicyParagraph>
          AI systems can misinterpret research, invent references, omit qualifications and produce
          inaccurate conclusions. Where AI identifies a source or makes a factual claim, I seek to
          check it against the original material or another appropriate reliable source before
          relying on it.
        </PolicyParagraph>
        <PolicyParagraph>
          AI does not replace source verification or editorial judgment. I remain responsible for the
          accuracy and attribution of the material I publish.
        </PolicyParagraph>
        <PolicyParagraph>
          Further information is available in the{" "}
          <Link href="/ai-policy" className="font-semibold text-accent hover:underline">
            AI Policy
          </Link>
          .
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="9. Corrections">
        <PolicyLead>Accuracy includes what happens after publication</PolicyLead>
        <PolicyParagraph>
          I aim to publish accurate journalism, but errors can occur despite reasonable efforts to
          verify information.
        </PolicyParagraph>
        <PolicyParagraph>
          When I identify a material factual error, I seek to correct it promptly and transparently. I
          do not defend a known error simply because it has already been published.
        </PolicyParagraph>
        <PolicyParagraph>
          Accountability requires assessing the evidence, determining what was wrong and taking
          appropriate action.
        </PolicyParagraph>

        <PolicySubheading>What may warrant a correction?</PolicySubheading>
        <PolicyParagraph>Corrections may be necessary for material errors involving:</PolicyParagraph>
        <PolicyList
          items={[
            "Names, titles or identities.",
            "Dates, locations or timelines.",
            "Figures, statistics or numerical comparisons.",
            "Medical findings or descriptions of research.",
            "Quotations or statements attributed to individuals.",
            "Sources, attribution or institutional affiliations.",
            "Descriptions of events or public-health developments.",
            "Claims about medicines, vaccines, treatments or medical risks.",
            "Other factual details that materially affect a reader's understanding.",
          ]}
        />
        <PolicyParagraph>
          Not every editorial preference or minor wording change amounts to a factual correction. The
          appropriate response depends on the nature and significance of the issue.
        </PolicyParagraph>

        <PolicySubheading>Corrections, updates and clarifications</PolicySubheading>
        <PolicyParagraph>These terms describe different editorial actions.</PolicyParagraph>
        <PolicyParagraph>
          <strong className="text-white">Correction:</strong> Addresses information that was
          published inaccurately or incorrectly. For a material error, I aim to identify the
          correction and explain what has changed.
        </PolicyParagraph>
        <PolicyParagraph>
          <strong className="text-white">Update:</strong> Adds new verified information or
          developments that became available after the original publication. An update does not
          necessarily mean the original article was wrong.
        </PolicyParagraph>
        <PolicyParagraph>
          <strong className="text-white">Clarification:</strong> Makes wording or context clearer
          where the original presentation could reasonably have caused misunderstanding, even if the
          underlying facts were not necessarily incorrect.
        </PolicyParagraph>
        <PolicyParagraph>
          Where appropriate, I distinguish these actions so readers can understand why an article has
          changed.
        </PolicyParagraph>

        <PolicySubheading>How significant errors are handled</PolicySubheading>
        <PolicyParagraph>
          When a material error is confirmed, I aim to correct the article and provide a correction
          notice explaining the issue and the change made.
        </PolicyParagraph>
        <PolicyParagraph>
          Where an error substantially undermines a story, further action may be necessary. Depending
          on the circumstances, this may include a prominent correction, substantial revision,
          withdrawal of the article or a notice explaining why it is no longer available.
        </PolicyParagraph>
        <PolicyParagraph>
          The response should be proportionate to the seriousness of the error and the risk of
          continued misunderstanding.
        </PolicyParagraph>
        <PolicyParagraph>
          I do not promise that every correction will take the same form. I commit to assessing
          identified errors and taking appropriate action based on the available evidence.
        </PolicyParagraph>

        <PolicySubheading>Corrections to developing stories</PolicySubheading>
        <PolicyParagraph>
          An article may be accurate based on the information available at the time of publication
          and later require an update as events develop.
        </PolicyParagraph>
        <PolicyParagraph>
          However, new information does not automatically excuse an earlier factual error. If the
          original article contained a material inaccuracy, I assess whether a correction is
          warranted in addition to any update.
        </PolicyParagraph>
        <PolicyParagraph>
          Where a significant change affects the meaning of a story, readers should not be left with
          a misleading impression of what was originally reported.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="10. How readers can request a correction">
        <PolicyParagraph>
          Readers are encouraged to report potential factual errors, misleading claims or problems
          with source attribution.
        </PolicyParagraph>
        <PolicyParagraph>Send correction requests to:</PolicyParagraph>
        <PolicyParagraph>
          <a href="mailto:contact@josephmmwa.com" className="font-semibold text-accent hover:underline">
            contact@josephmmwa.com
          </a>
        </PolicyParagraph>
        <PolicyParagraph>Where possible, include:</PolicyParagraph>
        <PolicyList
          items={[
            "The article's headline or URL.",
            "The specific statement or passage in question.",
            "An explanation of why it may be inaccurate or misleading.",
            "Supporting evidence, such as an original research paper, official record or relevant source.",
          ]}
        />
        <PolicyParagraph>
          Providing supporting evidence can help me assess the concern more efficiently.
        </PolicyParagraph>
        <PolicyParagraph>
          I review correction requests against the available evidence and editorial standards. A
          request does not automatically establish that an error occurred or guarantee a change, but
          credible concerns deserve consideration.
        </PolicyParagraph>
        <PolicyParagraph>
          Where further information is necessary, I may seek clarification before deciding what
          action is appropriate.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="11. Accountability and transparency">
        <PolicyParagraph>
          I believe trust is strengthened when readers can understand how information was assessed
          and when mistakes are acknowledged.
        </PolicyParagraph>
        <PolicyParagraph>
          I aim to make corrections clear enough for readers to understand what changed and why. I
          also seek to preserve the distinction between an error, a legitimate update and a change in
          scientific understanding.
        </PolicyParagraph>
        <PolicyParagraph>
          A correction is not proof that all journalism has failed. Refusing to address a known
          material error undermines accountability.
        </PolicyParagraph>
        <PolicyParagraph>
          When evidence shows that a report was wrong, I will seek to correct the record rather than
          defend the original claim without justification.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Our standard">
        <PolicyParagraph>Before publication, I ask:</PolicyParagraph>
        <PolicyList
          items={[
            "What evidence supports this claim?",
            "Have I checked the original source where possible?",
            "Does the evidence justify the wording of the article and headline?",
            "Have I understood the research and its limitations?",
            "Have I attributed information fairly?",
            "Have I communicated uncertainty honestly?",
            "Would a reader be able to trace important claims to their supporting sources?",
          ]}
        />
        <PolicyParagraph>After publication, I ask a related question:</PolicyParagraph>
        <PolicyLead>
          If credible evidence shows that something is wrong, am I prepared to correct it clearly and
          promptly?
        </PolicyLead>
        <PolicyParagraph>
          These questions guide my approach to fact-checking and corrections at JOSEPH MMWA.
        </PolicyParagraph>
        <PolicyLead>
          The objective is not to claim that errors are impossible. It is to make evidence central to
          publication, treat readers fairly and take responsibility when the record needs to be
          corrected.
        </PolicyLead>
      </PolicySection>
    </PolicyPage>
  );
}

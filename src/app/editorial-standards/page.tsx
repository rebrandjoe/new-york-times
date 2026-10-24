import type { Metadata } from "next";
import Link from "next/link";
import {
  PolicyLead,
  PolicyList,
  PolicyPage,
  PolicyParagraph,
  PolicySection,
} from "@/components/policy/PolicyPage";

export const metadata: Metadata = {
  title: "Editorial Standards",
  description:
    "JOSEPH MMWA editorial standards — accuracy, evidence, transparency, independence and accountability in health journalism.",
  alternates: { canonical: "/editorial-standards" },
  openGraph: {
    title: "Editorial Standards — Joseph Mmwa",
    description:
      "Accuracy, evidence, transparency, independence and accountability in health journalism across Kenya, Africa and the world.",
    url: "/editorial-standards",
  },
};

export default function EditorialStandardsPage() {
  return (
    <PolicyPage title="Editorial Standards" updatedOn="2026-10-24">
      <PolicyParagraph>
        Health journalism carries particular responsibilities. A health story can influence what
        people believe, the treatment they seek, the decisions a family makes or how a community
        understands a public-health threat.
      </PolicyParagraph>
      <PolicyParagraph>
        At JOSEPH MMWA, I treat accuracy, context and accountability as editorial responsibilities,
        not optional qualities.
      </PolicyParagraph>
      <PolicyParagraph>
        My purpose is to help readers understand the developments shaping health, medicine, science
        and public health across Kenya, Africa and the world.
      </PolicyParagraph>
      <PolicyParagraph>
        The following editorial standards outline the principles and practices that guide how I
        research, verify, report and present health news. They reflect my commitment to accuracy,
        transparency, fairness and accountability in health journalism.
      </PolicyParagraph>

      <PolicySection heading="1. Accuracy">
        <PolicyParagraph>
          Accuracy is the foundation of my journalism. I strive to ensure that names, dates, figures,
          quotations, medical claims and other factual details are correct before publication.
        </PolicyParagraph>
        <PolicyParagraph>
          I do not knowingly publish false or misleading information. When a claim cannot be
          adequately verified, I seek further evidence, qualify the claim or leave it out.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="2. Evidence-Based Reporting">
        <PolicyParagraph>
          I assess what the available evidence actually demonstrates rather than relying on
          promotional language or dramatic claims.
        </PolicyParagraph>
        <PolicyParagraph>
          I distinguish between preliminary findings and established evidence, laboratory research
          and human studies, association and causation, and statistical results and their practical
          significance.
        </PolicyParagraph>
        <PolicyParagraph>
          I communicate the strengths and limitations of research without exaggerating its
          implications.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="3. Verification and Reliable Sourcing">
        <PolicyParagraph>
          I assess the reliability of information before publication, prioritising original research,
          peer-reviewed studies, clinical trial records, regulatory documents, official health
          advisories and relevant public-health authorities.
        </PolicyParagraph>
        <PolicyParagraph>
          I examine the context in which findings were produced, including study design, limitations
          and whether conclusions are supported by the reported results.
        </PolicyParagraph>
        <PolicyParagraph>
          I identify and link sources where possible so readers can examine the evidence behind my
          reporting.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="4. Originality and Attribution">
        <PolicyParagraph>
          I publish original journalism, explain developments reported elsewhere, aggregate important
          health news and provide context around medical research and public-health events.
        </PolicyParagraph>
        <PolicyParagraph>
          I distinguish my own reporting from information originating with other journalists,
          publications, researchers and institutions.
        </PolicyParagraph>
        <PolicyParagraph>
          When my reporting relies on another journalist's work or an external publication, I
          seek to identify and appropriately attribute the original reporting. Adding context or
          analysis does not remove my responsibility to acknowledge the source.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="5. Clarity and Accessibility">
        <PolicyParagraph>
          I write for readers who may not have a medical or scientific background.
        </PolicyParagraph>
        <PolicyParagraph>
          I aim to make complex information understandable without losing the uncertainty,
          limitations or context necessary for accuracy. I explain technical terms where needed and
          avoid unnecessary jargon.
        </PolicyParagraph>
        <PolicyParagraph>
          My aim is clarity without oversimplification. Making a story easier to understand must
          never mean changing what the evidence says.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="6. Human Dignity and Privacy">
        <PolicyParagraph>
          Behind every health statistic are people whose lives and communities may be affected by the
          developments I report.
        </PolicyParagraph>
        <PolicyParagraph>
          I avoid unnecessary sensationalism, dehumanising descriptions and imagery that treats
          suffering as spectacle. I approach patients, vulnerable communities and sensitive health
          information with care.
        </PolicyParagraph>
        <PolicyParagraph>
          I seek to explain the human consequences of health developments without exploiting fear,
          grief or vulnerability, while respecting applicable privacy obligations and the dignity of
          the people involved.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="7. Honest Headlines">
        <PolicyParagraph>
          A headline should earn the reader's attention rather than manipulate it.
        </PolicyParagraph>
        <PolicyParagraph>
          I favour headlines that are clear, specific, relevant, accurate and proportionate to the
          evidence. I do not deliberately misrepresent findings, exaggerate risks or benefits, or
          create misleading information gaps simply to generate clicks.
        </PolicyParagraph>
        <PolicyParagraph>
          The headline must reflect the substance of the story, not promise more than the reporting
          can support.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="8. Transparency About Uncertainty">
        <PolicyParagraph>
          Health research and public-health developments do not always produce definitive answers.
        </PolicyParagraph>
        <PolicyParagraph>
          I distinguish confirmed facts from preliminary reports, attributed claims, disputed
          information and details that remain under verification. I do not manufacture certainty
          where the evidence is limited or changing.
        </PolicyParagraph>
        <PolicyParagraph>
          When information remains uncertain, I make those limitations clear so readers can
          understand what is known, what is not known and what remains to be established.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="9. Timely Updates and Developing Stories">
        <PolicyParagraph>
          When a story is unfolding, I may publish information before every detail is known. In such
          situations, I make the available information and its limitations clear.
        </PolicyParagraph>
        <PolicyParagraph>
          I update developing stories when material new information becomes available and correct
          information that is subsequently established to be wrong.
        </PolicyParagraph>
        <PolicyParagraph>
          Being first is valuable, but speed does not justify presenting unverified claims as
          established facts. Accuracy takes precedence.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="10. Editorial Independence">
        <PolicyParagraph>
          I maintain editorial independence from advertisers, sponsors, commercial partners and
          outside interests.
        </PolicyParagraph>
        <PolicyParagraph>
          Commercial relationships do not purchase editorial coverage or determine my conclusions.
          Decisions about what to publish and how to report a story should be guided by evidence,
          editorial judgment and public interest rather than commercial pressure.
        </PolicyParagraph>
        <PolicyParagraph>
          Sponsored and commercial content must be clearly distinguishable from editorial journalism.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="11. Conflicts of Interest">
        <PolicyParagraph>
          Financial, professional and institutional relationships can affect how health information
          is produced, interpreted or perceived.
        </PolicyParagraph>
        <PolicyParagraph>
          I consider relevant conflicts of interest when assessing sources, research and potential
          coverage. Where a conflict could reasonably affect the credibility or interpretation of a
          story, I seek to disclose it clearly.
        </PolicyParagraph>
        <PolicyParagraph>
          Transparency about relevant interests helps readers assess the context in which information
          is presented.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="12. Corrections and Accountability">
        <PolicyParagraph>
          Despite my efforts to verify information, errors can occur. When I identify a material
          factual error, I correct it promptly.
        </PolicyParagraph>
        <PolicyParagraph>
          I clearly identify significant corrections and avoid making material changes in a way that
          misleads readers about what was originally reported.
        </PolicyParagraph>
        <PolicyParagraph>
          I take responsibility for the journalism I publish, including errors in AI-assisted or
          externally sourced material. My{" "}
          <Link href="/corrections-and-fact-checking" className="font-semibold text-accent hover:underline">
            Corrections & Fact-Checking
          </Link>{" "}
          page explains my approach in greater detail.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="13. Responsible Health Communication">
        <PolicyParagraph>
          I publish health journalism to inform public understanding of health, medicine and
          scientific research.
        </PolicyParagraph>
        <PolicyParagraph>
          My reporting does not replace individual medical advice, diagnosis or treatment from a
          qualified healthcare professional. I take particular care with claims about medicines,
          vaccines, treatments, clinical trials and medical risks because inaccurate information can
          influence personal and public-health decisions.
        </PolicyParagraph>
        <PolicyParagraph>
          I aim to provide readers with reliable information and appropriate context without making
          unsupported medical recommendations or presenting uncertain findings as established
          guidance.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="14. Public Interest and Responsibility">
        <PolicyParagraph>
          I seek stories that matter to patients, communities, health professionals, researchers,
          policymakers and the wider public.
        </PolicyParagraph>
        <PolicyParagraph>
          I consider why a development matters, who may be affected and what readers need to
          understand its implications. I aim to provide context that helps readers assess the
          significance of health news rather than simply repeat announcements or statistics.
        </PolicyParagraph>
        <PolicyParagraph>
          Public interest does not remove the responsibility to verify claims, respect privacy or
          report fairly.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="15. Scientific Integrity">
        <PolicyParagraph>
          Science evolves as new evidence emerges. Further research can strengthen, qualify or
          overturn previous conclusions.
        </PolicyParagraph>
        <PolicyParagraph>
          I do not treat preliminary findings as settled science or present a study's
          conclusions as stronger than its evidence supports. I consider study limitations and
          distinguish researchers' interpretations from what the results directly demonstrate.
        </PolicyParagraph>
        <PolicyParagraph>
          Revising a report or conclusion in response to stronger evidence is part of responsible
          journalism, not a failure of it.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="16. Responsible Use of Artificial Intelligence">
        <PolicyParagraph>
          AI tools may assist with research organisation, drafting, editing, transcription,
          translation and other editorial tasks. Their use does not remove my responsibility to
          verify information, attribute original work and assess the accuracy of published material.
        </PolicyParagraph>
        <PolicyParagraph>
          AI-generated content is not automatically reliable, and AI-assisted fact-checking is not
          infallible. I do not knowingly use AI to fabricate sources, quotations, research findings,
          statistics or evidence.
        </PolicyParagraph>
        <PolicyParagraph>
          Where AI materially contributes to published content or synthetic media in a way that could
          reasonably affect a reader's understanding, I consider whether disclosure is
          warranted. My{" "}
          <Link href="/ai-policy" className="font-semibold text-accent hover:underline">
            AI Policy
          </Link>{" "}
          explains these principles in greater detail.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="My Editorial Commitment">
        <PolicyParagraph>Before publication, I ask myself:</PolicyParagraph>
        <PolicyList
          items={[
            "Is the information accurate and supported by reliable evidence?",
            "Have I verified the important claims and understood the research correctly?",
            "Have I attributed original reporting fairly?",
            "Have I given readers enough context to understand the story?",
            "Have I communicated uncertainty honestly?",
            "Have I considered the people affected by the reporting?",
            "Have I identified relevant conflicts of interest?",
            "Would I stand behind this reporting if a reader, researcher or subject challenged it tomorrow?",
          ]}
        />
        <PolicyParagraph>
          These standards guide how I work at JOSEPH MMWA. They are commitments I strive to uphold in
          the journalism I publish and against which my editorial decisions should be assessed.
        </PolicyParagraph>
        <PolicyLead>
          Accuracy, evidence, transparency, independence and accountability remain central to my
          work.
        </PolicyLead>
      </PolicySection>
    </PolicyPage>
  );
}

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
    "JOSEPH MMWA editorial standards — accuracy, context and accountability in health and medical journalism across Kenya, Africa and the world.",
  alternates: { canonical: "/editorial-standards" },
  openGraph: {
    title: "Editorial Standards — Joseph Mmwa",
    description:
      "Accuracy, context and accountability in health and medical journalism across Kenya, Africa and the world.",
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
        research, verify, report and present health news at JOSEPH MMWA. They reflect my commitment
        to accuracy, transparency, fairness and accountability in health journalism.
      </PolicyParagraph>

      <PolicySection heading="What I cover">
        <PolicyParagraph>
          I cover health and medical developments across Kenya, Africa and internationally.
        </PolicyParagraph>
        <PolicyParagraph>My coverage includes:</PolicyParagraph>
        <PolicyList
          items={[
            "Medical research",
            "HIV and AIDS",
            "Vaccines and immunisation",
            "Cancer",
            "Infectious diseases",
            "Public health",
            "Health policy",
            "Artificial intelligence in healthcare",
            "Digital health",
            "Global health",
            "Healthcare systems",
            "Emerging medical developments",
          ]}
        />
        <PolicyParagraph>
          I seek stories that matter to patients, communities, health professionals, researchers,
          policymakers and the wider public.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Evidence before excitement">
        <PolicyParagraph>
          Medical news frequently arrives with dramatic language: breakthrough, revolutionary,
          miracle or game-changing.
        </PolicyParagraph>
        <PolicyParagraph>
          I do not adopt such language simply because it appears in a press release, social media
          post, institutional announcement or promotional statement. I examine what the available
          evidence actually demonstrates.
        </PolicyParagraph>
        <PolicyParagraph>
          A promising laboratory result is not automatically a treatment. An early clinical study is
          not proof of established effectiveness. An association does not automatically establish
          causation. Findings from animal studies do not establish that the same effects occur in
          humans.
        </PolicyParagraph>
        <PolicyParagraph>
          I distinguish between promising developments, preliminary findings and established
          evidence. The language I use reflects the strength and limitations of the evidence.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Verification and sourcing">
        <PolicyParagraph>
          I assess the reliability of information before publication, prioritising original research,
          peer-reviewed studies, official health advisories, regulatory documents and information
          from relevant public-health authorities.
        </PolicyParagraph>
        <PolicyParagraph>
          I examine the context in which findings were produced, including study design, limitations
          and whether the conclusions are supported by the reported results.
        </PolicyParagraph>
        <PolicyParagraph>
          I identify and link sources where possible, enabling readers to examine the evidence behind
          my reporting. I do not present claims that I cannot adequately verify as established facts.
        </PolicyParagraph>
        <PolicyParagraph>
          Where information remains uncertain or disputed, I make those limitations clear.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Original reporting and attribution">
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
          seek to identify and appropriately attribute the original reporting. I do not present
          another journalist's reporting as my own.
        </PolicyParagraph>
        <PolicyParagraph>
          Adding context, explanation or verification does not remove my responsibility to
          acknowledge the original source.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="The reader comes first">
        <PolicyParagraph>
          I write for readers who may not have a medical or scientific background.
        </PolicyParagraph>
        <PolicyParagraph>
          I aim to make complex information understandable without losing the uncertainty,
          limitations or context necessary for accuracy. I explain technical terms where needed and
          distinguish established facts from interpretation and speculation.
        </PolicyParagraph>
        <PolicyParagraph>My aim is clarity without oversimplification.</PolicyParagraph>
      </PolicySection>

      <PolicySection heading="People, not statistics">
        <PolicyParagraph>
          Behind every health statistic are people whose lives and communities may be affected by the
          developments I report.
        </PolicyParagraph>
        <PolicyParagraph>
          I avoid unnecessary sensationalism, dehumanising descriptions and imagery that treats
          suffering as spectacle. I seek to explain the human consequences of health developments
          without exploiting fear, grief or vulnerability.
        </PolicyParagraph>
        <PolicyParagraph>
          I also respect privacy and approach sensitive health information with care.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Headlines">
        <PolicyParagraph>
          A headline should earn the reader's attention rather than manipulate it.
        </PolicyParagraph>
        <PolicyParagraph>
          I favour headlines that are clear, specific, relevant, accurate and proportionate to the
          evidence.
        </PolicyParagraph>
        <PolicyParagraph>
          I do not deliberately misrepresent findings, exaggerate risks or benefits, or create
          misleading information gaps simply to generate clicks.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Developing stories">
        <PolicyParagraph>
          When a story is unfolding, I may publish information before every detail is known. In such
          situations, I make uncertainty visible.
        </PolicyParagraph>
        <PolicyParagraph>
          I distinguish confirmed information from preliminary reports, attributed claims and details
          that remain under verification. I update developing stories when material new information
          becomes available.
        </PolicyParagraph>
        <PolicyParagraph>
          Being first is valuable. Being wrong is costly. Accuracy takes precedence.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Scientific uncertainty">
        <PolicyParagraph>
          Science evolves as new evidence emerges. Further research can strengthen, qualify or
          overturn previous conclusions.
        </PolicyParagraph>
        <PolicyParagraph>
          I do not treat preliminary findings as settled science or manufacture certainty where none
          exists. When evidence is disputed, limited or changing, I communicate that clearly.
        </PolicyParagraph>
        <PolicyParagraph>
          Revising a report or conclusion in response to stronger evidence is part of responsible
          journalism.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Independence">
        <PolicyParagraph>
          I maintain editorial independence from advertisers, sponsors, commercial partners and
          outside interests.
        </PolicyParagraph>
        <PolicyParagraph>
          Commercial relationships do not purchase editorial coverage or determine my conclusions.
        </PolicyParagraph>
        <PolicyParagraph>
          I ensure that sponsored and commercial content is clearly distinguishable from editorial
          journalism.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Conflicts of interest">
        <PolicyParagraph>
          Financial, professional and institutional relationships can affect how health information
          is produced, interpreted or perceived.
        </PolicyParagraph>
        <PolicyParagraph>
          I consider relevant conflicts of interest when assessing sources, research and potential
          coverage. Where a conflict could reasonably affect the credibility or interpretation of a
          story, I seek to disclose it clearly.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Corrections and accountability">
        <PolicyParagraph>
          Despite my efforts to verify information, errors can occur. When I identify a material
          factual error, I correct it promptly.
        </PolicyParagraph>
        <PolicyParagraph>
          I clearly identify significant corrections and avoid making material changes in a way that
          misleads readers about what was originally reported.
        </PolicyParagraph>
        <PolicyParagraph>
          I believe correcting errors strengthens accountability and public trust. My{" "}
          <Link href="/corrections-and-fact-checking" className="font-semibold text-accent hover:underline">
            Corrections & Fact-Checking
          </Link>{" "}
          page explains my approach in greater detail.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Health information, not medical advice">
        <PolicyParagraph>
          I publish health journalism to inform public understanding of health, medicine and
          scientific research. My reporting does not replace individual medical advice, diagnosis or
          treatment from a qualified healthcare professional.
        </PolicyParagraph>
        <PolicyParagraph>
          I encourage readers to consult an appropriate healthcare professional when making decisions
          about their personal health.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="My editorial standard">
        <PolicyParagraph>Before publication, I ask myself:</PolicyParagraph>
        <PolicyList
          items={[
            "Is it accurate?",
            "Is it supported by reliable evidence?",
            "Have I understood the findings correctly?",
            "Have I attributed the original work fairly?",
            "Have I given readers enough context?",
            "Have I communicated uncertainty honestly?",
            "Have I considered the people affected by the story?",
          ]}
        />
        <PolicyParagraph>
          Would I stand behind this reporting if a reader, researcher or subject challenged it
          tomorrow?
        </PolicyParagraph>
        <PolicyLead>
          These are the standards I strive to uphold in my work at JOSEPH MMWA.
        </PolicyLead>
      </PolicySection>
    </PolicyPage>
  );
}

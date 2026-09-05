import type { Metadata } from "next";
import { PolicyLead, PolicyList, PolicyPage, PolicyParagraph, PolicySection } from "@/components/policy/PolicyPage";

export const metadata: Metadata = {
  title: "Editorial Policy",
  description:
    "JOSEPH MMWA's editorial policy — accuracy, context and accountability in health and medical journalism.",
  alternates: { canonical: "/editorial-policy" },
  openGraph: {
    title: "Editorial Policy — Joseph Mmwa",
    description:
      "JOSEPH MMWA's editorial policy — accuracy, context and accountability in health and medical journalism.",
    url: "/editorial-policy",
  },
};

export default function EditorialPolicyPage() {
  return (
    <PolicyPage eyebrow="Editorial Policy" title="Editorial Policy" intro="Journalism with consequences">
      <PolicyParagraph>Health journalism is different from ordinary information publishing.</PolicyParagraph>
      <PolicyParagraph>
        A health story can influence what someone believes, the treatment they seek, the decisions a
        family makes or how a community understands a public-health threat.
      </PolicyParagraph>
      <PolicyParagraph>
        At JOSEPH MMWA, we therefore treat accuracy, context and accountability as editorial
        responsibilities—not optional qualities.
      </PolicyParagraph>
      <PolicyParagraph>
        Our purpose is to help readers understand the developments shaping health, medicine, science
        and public health.
      </PolicyParagraph>

      <PolicySection heading="What we cover">
        <PolicyParagraph>
          JOSEPH MMWA covers health and medical developments across Kenya, Africa and the world.
        </PolicyParagraph>
        <PolicyParagraph>Our coverage includes:</PolicyParagraph>
        <PolicyList
          items={[
            "Medical research",
            "HIV & AIDS",
            "Vaccines",
            "Cancer",
            "Infectious diseases",
            "Public health",
            "Health policy",
            "AI and health",
            "Digital health",
            "Global health",
            "Healthcare systems",
            "Emerging medical developments",
          ]}
        />
        <PolicyParagraph>
          We seek stories that matter to patients, communities, health professionals, researchers,
          policymakers and the wider public.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Evidence before excitement">
        <PolicyParagraph>Medical news frequently arrives with dramatic language.</PolicyParagraph>
        <PolicyParagraph>Breakthrough. Revolutionary. Miracle. Game-changing.</PolicyParagraph>
        <PolicyParagraph>
          We do not adopt such language simply because it appears in a press release, social-media
          post, institutional announcement or promotional statement.
        </PolicyParagraph>
        <PolicyParagraph>We ask what the evidence actually demonstrates.</PolicyParagraph>
        <PolicyParagraph>A promising laboratory result is not automatically a treatment.</PolicyParagraph>
        <PolicyParagraph>An early clinical study is not automatically proof of effectiveness.</PolicyParagraph>
        <PolicyParagraph>An association is not automatically causation.</PolicyParagraph>
        <PolicyParagraph>
          A study involving animals is not evidence that the same result has been demonstrated in
          humans.
        </PolicyParagraph>
        <PolicyParagraph>Our language should match the strength of the evidence.</PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Original reporting and aggregation">
        <PolicyParagraph>
          JOSEPH MMWA may publish original journalism, explain developments reported elsewhere,
          aggregate important health news and provide context around research and public-health
          events.
        </PolicyParagraph>
        <PolicyParagraph>
          When the essential reporting originates with another journalist, publication, researcher or
          institution, we seek to identify and attribute that work.
        </PolicyParagraph>
        <PolicyParagraph>We do not present another journalist&apos;s reporting as our own.</PolicyParagraph>
        <PolicyParagraph>
          Adding context, explanation or verification does not remove the responsibility to
          acknowledge the original source.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="The reader comes first">
        <PolicyParagraph>We write for people who may not have a medical or scientific background.</PolicyParagraph>
        <PolicyParagraph>
          Complex information should therefore be made understandable without stripping away the
          uncertainty, limitations or context that make it accurate.
        </PolicyParagraph>
        <PolicyParagraph>We aim for clarity without oversimplification.</PolicyParagraph>
      </PolicySection>

      <PolicySection heading="People, not statistics">
        <PolicyParagraph>Behind every health statistic are people.</PolicyParagraph>
        <PolicyParagraph>
          We avoid unnecessary sensationalism, dehumanising descriptions and imagery that treats
          suffering as spectacle.
        </PolicyParagraph>
        <PolicyParagraph>
          We seek to explain the human consequences of health developments without exploiting fear,
          grief or vulnerability.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Headlines">
        <PolicyParagraph>A headline should earn the reader&apos;s attention rather than manipulate it.</PolicyParagraph>
        <PolicyParagraph>We favour headlines that are:</PolicyParagraph>
        <PolicyList items={["clear;", "specific;", "relevant;", "accurate;", "proportionate to the evidence."]} />
        <PolicyParagraph>
          We do not deliberately create a misleading information gap simply to generate clicks.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Developing stories">
        <PolicyParagraph>
          When a story is still unfolding, we may publish information before every detail is known.
        </PolicyParagraph>
        <PolicyParagraph>In those situations, uncertainty should be visible.</PolicyParagraph>
        <PolicyParagraph>
          We distinguish confirmed information from claims, preliminary reports and information that
          remains under verification.
        </PolicyParagraph>
        <PolicyParagraph>Being first is valuable. Being wrong is costly. Accuracy takes precedence.</PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Scientific uncertainty">
        <PolicyParagraph>Science is not static.</PolicyParagraph>
        <PolicyParagraph>New evidence can strengthen, weaken or overturn previous conclusions.</PolicyParagraph>
        <PolicyParagraph>
          When evidence is preliminary or disputed, we aim to communicate that uncertainty rather than
          manufacture certainty where none exists.
        </PolicyParagraph>
        <PolicyParagraph>
          Changing a conclusion because better evidence becomes available is not inconsistency. It is
          responsible journalism.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Independence">
        <PolicyParagraph>
          Editorial decisions should remain independent of advertisers, sponsors, commercial partners
          and outside interests.
        </PolicyParagraph>
        <PolicyParagraph>Commercial relationships do not purchase editorial coverage.</PolicyParagraph>
        <PolicyParagraph>
          Sponsored or commercial content should be clearly distinguishable from independent editorial
          journalism.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Conflicts of interest">
        <PolicyParagraph>
          Relevant conflicts of interest should be disclosed when they could reasonably affect the
          credibility or interpretation of coverage.
        </PolicyParagraph>
        <PolicyParagraph>
          We consider financial, professional and institutional relationships when assessing potential
          conflicts.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Corrections">
        <PolicyParagraph>
          When we discover that we have published a material factual error, we correct it.
        </PolicyParagraph>
        <PolicyParagraph>
          We do not believe that correcting an error weakens journalism. It strengthens accountability.
        </PolicyParagraph>
        <PolicyParagraph>Our Corrections Policy explains how we handle this process.</PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Our editorial standard">
        <PolicyParagraph>Before publication, we ask:</PolicyParagraph>
        <PolicyParagraph>
          Is it accurate? Is it supported? Have we understood the evidence correctly? Have we
          attributed the original work fairly? Have we given the reader enough context? Would we stand
          behind this story if the reader challenged it tomorrow?
        </PolicyParagraph>
        <PolicyLead>That is the standard we aim to meet.</PolicyLead>
      </PolicySection>
    </PolicyPage>
  );
}

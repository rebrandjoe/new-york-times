import type { Metadata } from "next";
import {
  PolicyLead,
  PolicyList,
  PolicyPage,
  PolicyParagraph,
  PolicySection,
} from "@/components/policy/PolicyPage";

export const metadata: Metadata = {
  title: "AI Policy",
  description:
    "How JOSEPH MMWA uses artificial intelligence — human editorial responsibility, verification standards, and accountability in health journalism.",
  alternates: { canonical: "/ai-policy" },
  openGraph: {
    title: "AI Policy — Joseph Mmwa",
    description:
      "How JOSEPH MMWA uses artificial intelligence — human editorial responsibility, verification standards, and accountability in health journalism.",
    url: "/ai-policy",
  },
};

export default function AiPolicyPage() {
  return (
    <PolicyPage title="AI Policy" updatedOn="2026-10-24">
      <PolicyLead>Artificial intelligence can support journalism. Editorial responsibility remains human.</PolicyLead>

      <PolicyParagraph>
        Artificial intelligence is changing how information is researched, produced, translated and
        presented. At JOSEPH MMWA, AI tools may be used to support parts of the editorial process,
        including research assistance, information organisation, drafting, editing, transcription,
        translation and the development of editorial workflows.
      </PolicyParagraph>
      <PolicyParagraph>
        Their use does not remove the responsibility to report accurately, verify information,
        attribute sources fairly and communicate uncertainty honestly.
      </PolicyParagraph>
      <PolicyParagraph>
        This policy explains how AI may be used in our journalism, the limitations we recognise and
        the standards that guide its use.
      </PolicyParagraph>

      <PolicySection heading="1. Editorial responsibility">
        <PolicyParagraph>
          <strong className="text-white">AI tools do not hold editorial authority at JOSEPH MMWA.</strong>
        </PolicyParagraph>
        <PolicyParagraph>
          Decisions about which stories to pursue, how to interpret evidence, which sources to trust,
          what claims to publish and whether a report is ready for publication remain the
          responsibility of the human editor.
        </PolicyParagraph>
        <PolicyParagraph>
          AI-generated or AI-assisted material is not automatically suitable for publication. It must
          be assessed in context, with particular attention to factual accuracy, meaning, source
          attribution and the potential consequences of errors.
        </PolicyParagraph>
        <PolicyParagraph>
          The extent of review should reflect the nature and sensitivity of the material. Health
          claims, medical research, statistics, treatment information and breaking public-health
          developments require particular scrutiny.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="2. How AI may be used">
        <PolicyParagraph>AI tools may assist with:</PolicyParagraph>
        <PolicyList
          items={[
            "Research support and the organisation of information.",
            "Summarising documents and scientific literature for editorial review.",
            "Identifying factual claims, inconsistencies and questions that require further investigation.",
            "Developing preliminary article drafts, headlines, outlines and explainers.",
            "Editing, proofreading, formatting and improving readability.",
            "Transcription and translation.",
            "Supporting editorial workflows, including the organisation of news alerts and the preparation of material for review.",
            "Assisting with the presentation of information and other production tasks.",
          ]}
        />
        <PolicyParagraph>
          These are potential or permitted applications, not a guarantee that every tool or
          application is used in every article. The use of AI does not, by itself, establish the
          accuracy, originality or completeness of the resulting material.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="3. Verification and factual accuracy">
        <PolicyParagraph>
          AI systems can produce false statements, misinterpret evidence, omit important context,
          generate nonexistent references or provide outdated information with apparent confidence.
        </PolicyParagraph>
        <PolicyParagraph>
          <strong className="text-white">
            For this reason, AI output is treated as material requiring assessment, not as proof that
            a claim is true.
          </strong>
        </PolicyParagraph>
        <PolicyParagraph>
          Where appropriate, I prioritise primary sources, including original research papers,
          clinical trial records, official health advisories, regulatory documents, public-health
          authorities and statements from relevant institutions. Secondary reporting may also be used
          where it provides relevant context or original reporting, with appropriate attribution.
        </PolicyParagraph>
        <PolicyParagraph>
          A source suggested by an AI system must be checked before it is relied upon. Where
          possible, I examine the original document rather than relying solely on an AI-generated
          summary.
        </PolicyParagraph>
        <PolicyParagraph>
          AI-assisted fact-checking is not infallible. It can miss errors, misread documents or
          incorrectly assess whether a claim is supported. It therefore does not replace source
          verification and editorial judgment.
        </PolicyParagraph>
        <PolicyParagraph>
          Where a claim cannot be adequately verified, I may qualify it, identify the uncertainty,
          seek further evidence or exclude it from publication.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="4. Health and medical information">
        <PolicyParagraph>
          Health journalism requires particular care because inaccurate information can influence
          medical decisions, public understanding and confidence in healthcare.
        </PolicyParagraph>
        <PolicyParagraph>
          When AI tools assist with reporting on diseases, medicines, vaccines, clinical trials,
          treatments, medical devices, public-health guidance or medical risks, I assess the
          underlying evidence rather than relying on the tool's interpretation alone.
        </PolicyParagraph>
        <PolicyParagraph>This includes distinguishing, where relevant, between:</PolicyParagraph>
        <PolicyList
          items={[
            "Laboratory or animal research and evidence from human studies.",
            "Early-stage research and established clinical evidence.",
            "Statistical associations and demonstrated causal relationships.",
            "Relative risk reductions and absolute changes in risk.",
            "Study findings and claims that go beyond what the research establishes.",
            "Regulatory approval, research results and evidence of real-world effectiveness.",
          ]}
        />
        <PolicyParagraph>
          I do not treat an AI-generated medical explanation as a substitute for reliable scientific
          evidence or qualified clinical judgment. The strength of the available evidence and the
          potential consequences of an error inform the level of scrutiny required before
          publication.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="5. Sources, attribution and originality">
        <PolicyParagraph>
          AI tools may help locate, organise or summarise information, but they are not a substitute
          for identifying the origins of that information.
        </PolicyParagraph>
        <PolicyParagraph>
          I do not knowingly present another journalist's reporting, a researcher's
          findings or an institution's original work as my own. When a story relies materially on
          external reporting, research or institutional information, I seek to attribute the relevant
          source clearly.
        </PolicyParagraph>
        <PolicyParagraph>
          AI-assisted rewriting, summarising or paraphrasing does not remove the responsibility to
          acknowledge original work. Nor does the fact that a tool produces new wording establish that
          the underlying reporting is original.
        </PolicyParagraph>
        <PolicyParagraph>
          <strong className="text-white">
            I do not knowingly use AI to fabricate sources, quotations, expert opinions, interviews,
            research findings, statistics, citations or other evidence.
          </strong>
        </PolicyParagraph>
        <PolicyParagraph>
          If a quotation cannot be traced to a reliable source, it must not be presented as an
          authentic quotation merely because an AI tool generated it.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="6. AI-assisted writing and editorial judgment">
        <PolicyParagraph>
          AI may help develop an initial draft or improve the clarity of existing material. However,
          generated text can introduce unsupported claims, distort the meaning of a source, remove
          important qualifications or make uncertain findings sound conclusive.
        </PolicyParagraph>
        <PolicyParagraph>
          AI-assisted drafts therefore require editorial assessment before publication. Where material
          claims are involved, the underlying evidence must be checked.
        </PolicyParagraph>
        <PolicyParagraph>
          I remain responsible for the final wording, headline, context and conclusions of published
          journalism. I do not regard fluency, confidence or professional-sounding language as
          evidence of factual accuracy.
        </PolicyParagraph>
        <PolicyParagraph>
          <strong className="text-white">
            The final article must meet the same editorial standards regardless of whether AI
            contributed to its preparation.
          </strong>
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="7. Images, illustrations and synthetic media">
        <PolicyParagraph>
          AI-generated images and synthetic media can mislead readers when presented as authentic
          records of real events or people.
        </PolicyParagraph>
        <PolicyParagraph>
          I do not knowingly present AI-generated imagery as an authentic photograph of a real
          person, event, clinical procedure, disease outbreak or medical situation.
        </PolicyParagraph>
        <PolicyParagraph>
          Where synthetic imagery is used and its artificial nature is material to how readers
          understand the content, I will seek to identify it clearly. Illustrations and
          reconstructions should not be used in ways that create a false impression of documentary
          evidence.
        </PolicyParagraph>
        <PolicyParagraph>
          Photographs, graphics and other visual material obtained from external sources remain
          subject to appropriate attribution, permissions where required and checks for contextual
          accuracy.
        </PolicyParagraph>
        <PolicyParagraph>
          The use of AI to create, edit or enhance an image must not be used to fabricate evidence or
          materially misrepresent a real event.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="8. Transparency with readers">
        <PolicyParagraph>
          Readers should not be misled about how a story was produced or what evidence supports it.
        </PolicyParagraph>
        <PolicyParagraph>
          Routine assistance with proofreading, formatting, transcription or similar tasks does not
          necessarily require a separate disclosure. However, where AI makes a substantial
          contribution to published material, creates synthetic media, or otherwise plays a role that
          could reasonably affect a reader's understanding of the content, I will consider
          whether clear disclosure is warranted.
        </PolicyParagraph>
        <PolicyParagraph>
          Disclosure decisions should reflect the significance of the AI contribution and the risk of
          misleading readers. They should not be used to imply that an article is accurate simply
          because AI use has been disclosed.
        </PolicyParagraph>
        <PolicyParagraph>
          This policy does not mean every article will carry an AI label. Nor does the absence of such
          a label establish that no AI tool was used during the editorial process.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="9. Confidentiality and personal information">
        <PolicyParagraph>
          Journalism can involve confidential sources, unpublished material, sensitive health
          information and personal data.
        </PolicyParagraph>
        <PolicyParagraph>
          I recognise that entering information into an AI service may expose it to processing under
          that service's terms, settings and data-handling practices. I therefore seek to avoid
          submitting confidential source identities, sensitive personal information or unpublished
          material to AI tools unless there is an appropriate basis and adequate safeguards for doing
          so.
        </PolicyParagraph>
        <PolicyParagraph>
          Where possible, sensitive information should be minimised or de-identified before using an
          AI tool. Any use must take account of applicable privacy obligations, source protection and
          the need to preserve journalistic trust.
        </PolicyParagraph>
        <PolicyParagraph>
          <strong className="text-white">
            AI tools should not be treated as confidential simply because they are used for editorial
            work.
          </strong>
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="10. Bias and representation">
        <PolicyParagraph>
          AI systems can reproduce stereotypes, omit underrepresented perspectives or reflect
          imbalances in the material on which they were developed or trained.
        </PolicyParagraph>
        <PolicyParagraph>
          I recognise that these limitations may affect how people, countries, communities, diseases
          and health systems are described.
        </PolicyParagraph>
        <PolicyParagraph>
          AI-assisted material should be assessed for misleading generalisations, stigmatising
          language, unsupported assumptions and unfair representation. Particular care is necessary
          when reporting on vulnerable populations, infectious diseases, disability, mental health and
          other sensitive health issues.
        </PolicyParagraph>
        <PolicyParagraph>
          AI-generated language must not be allowed to replace careful consideration of the people and
          communities affected by a story.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="11. Limitations and responsibility">
        <PolicyParagraph>
          No AI tool can guarantee that a report is accurate, balanced, complete, original or free
          from bias.
        </PolicyParagraph>
        <PolicyParagraph>
          AI can assist with tasks, but it cannot independently establish whether a source is
          trustworthy, whether a claim is adequately supported or whether a story serves the public
          interest in a particular context.
        </PolicyParagraph>
        <PolicyParagraph>
          <strong className="text-white">
            The responsibility for published journalism remains with JOSEPH MMWA. It cannot be
            transferred to an AI system, a software provider or a generated response.
          </strong>
        </PolicyParagraph>
        <PolicyParagraph>
          Where an AI-assisted error is identified in published material, the same correction and
          accountability principles that apply to other editorial errors apply.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="12. Review of this policy">
        <PolicyParagraph>
          AI technology and its use in journalism continue to evolve. This policy may be updated as
          editorial practices, available tools, applicable requirements and the risks associated with
          AI change.
        </PolicyParagraph>
        <PolicyParagraph>
          Any update should preserve the central principle that technological assistance does not
          reduce editorial responsibility.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="13. My standard">
        <PolicyLead>AI is a tool within the editorial process, not a substitute for journalism.</PolicyLead>
        <PolicyParagraph>
          It may help organise information, examine material, develop drafts and improve
          presentation. It cannot replace the responsibility to verify evidence, attribute original
          work fairly, communicate uncertainty and consider the consequences of publication.
        </PolicyParagraph>
        <PolicyLead>
          The technology may assist the work. Responsibility for the journalism remains human.
        </PolicyLead>
      </PolicySection>
    </PolicyPage>
  );
}

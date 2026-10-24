import type { Metadata } from "next";
import Link from "next/link";
import {
  PolicyLead,
  PolicyPage,
  PolicyParagraph,
  PolicySection,
} from "@/components/policy/PolicyPage";

export const metadata: Metadata = {
  title: "Medical Disclaimer",
  description:
    "Health information on JOSEPH MMWA is for public understanding. Medical decisions require appropriate professional guidance.",
  alternates: { canonical: "/medical-disclaimer" },
  openGraph: {
    title: "Medical Disclaimer — Joseph Mmwa",
    description:
      "Health information is for public understanding. Medical decisions require appropriate professional guidance.",
    url: "/medical-disclaimer",
  },
};

export default function MedicalDisclaimerPage() {
  return (
    <PolicyPage title="Medical Disclaimer" effectiveOn="2026-09-13">
      <PolicyLead>
        Health information is for public understanding. Medical decisions require appropriate
        professional guidance.
      </PolicyLead>

      <PolicySection heading="1. Purpose of This Disclaimer">
        <PolicyParagraph>
          JOSEPH MMWA publishes health journalism, medical news, scientific research, public-health
          information and analysis to help readers understand developments affecting health, medicine
          and healthcare in Kenya, Africa and around the world.
        </PolicyParagraph>
        <PolicyParagraph>
          All health-related content published on this website is intended for general informational,
          educational and journalistic purposes only. It is not a substitute for professional medical
          advice, diagnosis, treatment or care.
        </PolicyParagraph>
        <PolicyParagraph>
          Reading our content does not establish a doctor-patient relationship between you and JOSEPH
          MMWA or any of its contributors.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="2. Not a Substitute for Medical Advice">
        <PolicyParagraph>
          Information published on JOSEPH MMWA should not be used to diagnose a medical condition,
          determine whether you have a particular disease, choose a treatment or make decisions about
          your individual healthcare without appropriate professional guidance.
        </PolicyParagraph>
        <PolicyParagraph>
          Medical decisions should be made in consultation with a qualified healthcare professional
          who can consider your medical history, symptoms, circumstances and individual needs.
        </PolicyParagraph>
        <PolicyParagraph>
          <strong className="text-white">
            Do not disregard professional medical advice, delay seeking care or change your treatment
            because of something you have read on this website.
          </strong>
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="3. Medical Research and Scientific Findings">
        <PolicyParagraph>
          JOSEPH MMWA reports on medical research, clinical trials, scientific discoveries,
          medicines, vaccines, medical technologies and emerging treatments.
        </PolicyParagraph>
        <PolicyParagraph>
          Research findings may change as new evidence becomes available. A finding reported in a
          laboratory, an animal study or an early-stage clinical trial does not necessarily establish
          that an intervention is safe, effective or suitable for people in everyday clinical
          practice.
        </PolicyParagraph>
        <PolicyParagraph>
          Where relevant, readers should distinguish between preliminary findings and established
          evidence, research results and regulatory approval, and statistical findings and
          demonstrated benefits for patients.
        </PolicyParagraph>
        <PolicyParagraph>
          Reporting that a treatment is being studied, has shown promising results or has received
          regulatory approval does not constitute a recommendation to use it. Approval, availability
          and clinical guidance may also differ between countries.
        </PolicyParagraph>
        <PolicyParagraph>
          Readers should consult qualified healthcare professionals and relevant medicines regulators
          for guidance applicable to their circumstances.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="4. Medicines, Vaccines and Treatments">
        <PolicyParagraph>
          Information about medicines, vaccines, medical procedures, supplements and other health
          interventions is provided for general understanding.
        </PolicyParagraph>
        <PolicyParagraph>
          Our coverage does not replace official prescribing information, product safety
          instructions, clinical guidelines or advice from a qualified healthcare professional.
        </PolicyParagraph>
        <PolicyParagraph>
          Do not start, stop, increase, decrease or combine medicines based solely on information
          published on this website. If you experience possible side effects or have concerns about a
          treatment, seek guidance from an appropriate healthcare professional.
        </PolicyParagraph>
        <PolicyParagraph>
          Where relevant, consult the appropriate national medicines regulator or public-health
          authority for current safety information and official guidance.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="5. Symptoms, Conditions and Self-Diagnosis">
        <PolicyParagraph>
          Articles about diseases, symptoms, risk factors, prevention and treatment are not intended
          to determine whether a reader has a particular condition.
        </PolicyParagraph>
        <PolicyParagraph>
          Symptoms can have different causes, and information that appears relevant to your
          circumstances may not accurately reflect your individual health situation.
        </PolicyParagraph>
        <PolicyParagraph>
          If you have symptoms, concerns about your health or questions about screening, testing or
          treatment, contact a qualified healthcare professional.
        </PolicyParagraph>
        <PolicyParagraph>
          <strong className="text-white">
            If you believe you are experiencing a medical emergency, seek immediate medical
            assistance through the appropriate local emergency services or go to the nearest suitable
            emergency facility. Do not delay urgent care to read our content or contact us.
          </strong>
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="6. Public Health Alerts and Outbreak Reporting">
        <PolicyParagraph>
          JOSEPH MMWA covers infectious disease outbreaks, public-health emergencies, health
          advisories and official recommendations.
        </PolicyParagraph>
        <PolicyParagraph>
          Such information can change as authorities investigate events, confirm cases, revise risk
          assessments or issue new guidance. Early reports may contain preliminary information that is
          subsequently clarified or corrected.
        </PolicyParagraph>
        <PolicyParagraph>
          We aim to distinguish confirmed information from preliminary reports and communicate
          significant developments as they become available.
        </PolicyParagraph>
        <PolicyParagraph>
          Readers should consult the relevant health ministry, public-health authority or other
          appropriate official source for current instructions concerning their location and
          circumstances.
        </PolicyParagraph>
        <PolicyParagraph>
          Our reporting should not be treated as a substitute for official emergency instructions or
          individualized medical advice.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="7. Accuracy, Sources and Updates">
        <PolicyParagraph>
          We aim to publish accurate, evidence-informed health journalism, identify relevant sources
          and provide context for medical and scientific claims.
        </PolicyParagraph>
        <PolicyParagraph>
          However, medical knowledge evolves, sources may be incomplete, and information available at
          publication may subsequently change. We cannot guarantee that every item of content will
          remain complete, current or applicable to every reader at all times.
        </PolicyParagraph>
        <PolicyParagraph>
          We may update, clarify or correct published material when warranted. Readers can consult
          our{" "}
          <Link href="/corrections-and-fact-checking" className="font-semibold text-accent hover:underline">
            Corrections & Fact-Checking
          </Link>{" "}
          policy to understand how we approach verification and accountability.
        </PolicyParagraph>
        <PolicyParagraph>
          A disclaimer does not remove our responsibility to follow our editorial standards or
          address material errors appropriately.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="8. Individual Circumstances and Different Medical Guidance">
        <PolicyParagraph>
          Health information may not apply equally to everyone. Age, pregnancy, existing conditions,
          allergies, medicines, medical history and other circumstances can affect healthcare
          decisions.
        </PolicyParagraph>
        <PolicyParagraph>
          Medical recommendations may also vary by country because of differences in regulatory
          approvals, available treatments, clinical guidelines and healthcare systems.
        </PolicyParagraph>
        <PolicyParagraph>
          Readers should not assume that information reported in one country automatically represents
          the applicable guidance in another.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="9. External Sources and Third-Party Content">
        <PolicyParagraph>
          Our reporting may refer to scientific journals, research institutions, health ministries,
          regulators, hospitals, healthcare professionals and other external sources. We may also
          provide links to third-party websites.
        </PolicyParagraph>
        <PolicyParagraph>
          These references are intended to help readers understand the evidence, identify original
          information or explore a subject further. A reference or link does not necessarily mean that
          JOSEPH MMWA endorses every statement, service, product or recommendation provided by that
          source.
        </PolicyParagraph>
        <PolicyParagraph>
          Third-party websites operate under their own policies and responsibilities. Readers should
          assess external information carefully and consult appropriate professionals when making
          healthcare decisions.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="10. No Guarantee of Health Outcomes">
        <PolicyParagraph>
          Health information alone cannot guarantee a particular diagnosis, treatment result or
          health outcome. Individual outcomes depend on many factors, including the condition
          involved, the available evidence, access to care and individual circumstances.
        </PolicyParagraph>
        <PolicyParagraph>
          JOSEPH MMWA does not promise that following information discussed in its reporting will
          prevent disease, improve a medical condition or produce a specific result.
        </PolicyParagraph>
        <PolicyParagraph>
          Our purpose is to inform readers about health and medicine, not to guarantee outcomes or
          replace the care provided by qualified professionals.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="11. Limitation of Responsibility">
        <PolicyParagraph>
          To the extent permitted by applicable law, JOSEPH MMWA is not responsible for medical
          decisions made solely on the basis of general information published on this website, or for
          a reader's failure to seek appropriate professional care.
        </PolicyParagraph>
        <PolicyParagraph>
          Nothing in this disclaimer excludes or limits liability, consumer rights or other legal
          protections that cannot lawfully be excluded or limited under applicable law. This
          disclaimer does not remove our editorial responsibility for the journalism we publish.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="12. Contact Us">
        <PolicyParagraph>
          If you identify a potentially inaccurate medical statement, a misleading interpretation of
          research or an issue requiring editorial review, please contact:
        </PolicyParagraph>
        <PolicyParagraph>
          Email:{" "}
          <a href="mailto:contact@josephmmwa.com" className="font-semibold text-accent hover:underline">
            contact@josephmmwa.com
          </a>
        </PolicyParagraph>
        <PolicyParagraph>
          Where possible, include the article link, the specific statement of concern and a reliable
          source or explanation supporting your request. We review concerns in accordance with our
          editorial processes, but submitting a request does not guarantee a particular outcome.
        </PolicyParagraph>
        <PolicyParagraph>
          For medical advice, diagnosis or treatment, please contact a qualified healthcare
          professional rather than JOSEPH MMWA.
        </PolicyParagraph>
      </PolicySection>

      <PolicySection heading="Our Commitment">
        <PolicyParagraph>
          JOSEPH MMWA is committed to reporting health and medical developments with accuracy,
          context, transparency and accountability.
        </PolicyParagraph>
        <PolicyParagraph>
          We believe readers deserve clear information about what the evidence shows, what remains
          uncertain and what published research does—and does not—establish.
        </PolicyParagraph>
        <PolicyLead>
          Our journalism is intended to inform your understanding of health, not replace professional
          medical care.
        </PolicyLead>
      </PolicySection>
    </PolicyPage>
  );
}

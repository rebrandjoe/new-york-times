import type { ContentBlock } from "./blocks";

export type MedicalDisclaimerMode = "auto" | "show" | "hide";

export interface MedicalDisclaimerClassification {
  /** Suggested mode when using Automatic. */
  suggested: "show" | "hide";
  reason: string;
  /** True when signals are weak — prefer show / editorial review. */
  uncertain: boolean;
}

function blocksToPlainText(blocks: ContentBlock[]): string {
  const parts: string[] = [];
  for (const block of blocks) {
    const b = block as ContentBlock & { text?: string; content?: string; items?: string[] };
    if (typeof b.text === "string") parts.push(b.text);
    if (typeof b.content === "string") parts.push(b.content);
    if (Array.isArray(b.items)) parts.push(b.items.join(" "));
    const anyBlock = block as unknown as Record<string, unknown>;
    if (typeof anyBlock.html === "string") parts.push(anyBlock.html.replace(/<[^>]+>/g, " "));
  }
  return parts.join(" ");
}

function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const SHOW_PATTERNS: { re: RegExp; label: string }[] = [
  { re: /\bsymptom(s)?\b/, label: "symptoms" },
  { re: /\bdiagnos(e|is|ed|ing)\b/, label: "diagnosis" },
  { re: /\btreatment(s)?\b/, label: "treatment" },
  { re: /\bmedicin(e|es|al)\b/, label: "medicine" },
  { re: /\bdrug(s)?\b|\bpharmaceutical/, label: "drugs" },
  { re: /\bvaccine(s)?\b|\bimmunis(ation|e)|\bimmuniz(ation|e)/, label: "vaccines" },
  { re: /\bclinical trial/, label: "clinical trials" },
  { re: /\bside effect/, label: "side effects" },
  { re: /\bwhen to (seek|see) (care|a doctor|medical)/, label: "care guidance" },
  { re: /\bself[- ]?diagnos/, label: "self-diagnosis" },
  { re: /\bpatient(s)? (should|may|can)\b/, label: "patient guidance" },
  { re: /\befficacy\b|\beffectiveness\b/, label: "effectiveness" },
  { re: /\bdosage\b|\bdose\b/, label: "dosage" },
  { re: /\bprevention\b|\bpreventive\b|\bprophylax/, label: "prevention" },
  { re: /\binfectious disease|\boutbreak\b|\bepidemic\b|\bpandemic\b/, label: "outbreaks" },
  { re: /\bcancer\b|\bhiv\b|\baids\b|\bmalaria\b|\btuberculosis\b|\btb\b|\bebola\b|\bcholera\b|\bdengue\b/, label: "disease focus" },
  { re: /\bmedical research\b|\bpeer[- ]reviewed\b|\bstudy (found|shows|suggests)/, label: "research findings" },
  { re: /\bseek (immediate )?medical\b|\bemeragency care\b/, label: "emergency care advice" },
];

const HIDE_PATTERNS: { re: RegExp; label: string }[] = [
  { re: /\bappoint(ed|ment|s)\b.*\b(director|minister|secretary|board|ceo)\b/, label: "appointments" },
  { re: /\bnamed (as |the )?(new )?(director|minister|head|chair)/, label: "leadership naming" },
  { re: /\belect(ed|ion)\b/, label: "elections" },
  { re: /\bfunding\b|\bgrant(s)?\b|\bbudget\b|\binvestment\b|\bdonation/, label: "funding" },
  { re: /\bpartnership\b|\bmemorandum of understanding\b|\bmou\b/, label: "partnerships" },
  { re: /\bmanufacturing (plant|facility|investment)/, label: "manufacturing investment" },
  { re: /\bdiplomatic\b|\bsummit\b|\bconference opens\b/, label: "diplomatic/admin" },
  { re: /\bresign(ed|ation)\b|\bsuccession\b/, label: "personnel changes" },
];

/**
 * Classify whether a medical disclaimer is editorially relevant.
 * Uses full title + excerpt + body + topic names — not category alone.
 */
export function classifyMedicalDisclaimerRelevance(input: {
  title?: string | null;
  excerpt?: string | null;
  body?: ContentBlock[] | null;
  topicNames?: string[] | null;
}): MedicalDisclaimerClassification {
  const topicText = (input.topicNames ?? []).join(" ");
  const text = normalizeText(
    [input.title ?? "", input.excerpt ?? "", blocksToPlainText(input.body ?? []), topicText].join(" ")
  );

  if (!text || text.length < 40) {
    return {
      suggested: "show",
      reason: "Limited text available — defaulting to show until an editor reviews.",
      uncertain: true,
    };
  }

  let showScore = 0;
  const showHits: string[] = [];
  for (const { re, label } of SHOW_PATTERNS) {
    if (re.test(text)) {
      showScore += 1;
      showHits.push(label);
    }
  }

  let hideScore = 0;
  const hideHits: string[] = [];
  for (const { re, label } of HIDE_PATTERNS) {
    if (re.test(text)) {
      hideScore += 1;
      hideHits.push(label);
    }
  }

  if (showScore >= 2) {
    return {
      suggested: "show",
      reason: `Content discusses ${showHits.slice(0, 4).join(", ")}.`,
      uncertain: false,
    };
  }

  if (showScore === 1 && hideScore === 0) {
    return {
      suggested: "show",
      reason: `Content references ${showHits[0]}.`,
      uncertain: false,
    };
  }

  if (hideScore >= 1 && showScore === 0) {
    return {
      suggested: "hide",
      reason: `Appears to be routine news (${hideHits.slice(0, 3).join(", ")}) without medical guidance.`,
      uncertain: false,
    };
  }

  if (hideScore >= 1 && showScore === 1) {
    return {
      suggested: "show",
      reason: `Mixed signals (${showHits.join(", ")} vs ${hideHits.join(", ")}) — prefer show; editor may override.`,
      uncertain: true,
    };
  }

  return {
    suggested: "show",
    reason: "No clear administrative-only pattern — prefer show for reader safety.",
    uncertain: true,
  };
}

/** Resolve whether the article-level notice should render. */
export function shouldShowMedicalDisclaimer(
  mode: MedicalDisclaimerMode | null | undefined,
  article: {
    title: string;
    excerpt: string | null;
    body: ContentBlock[];
    topics: { name: string }[];
  }
): boolean {
  const resolved: MedicalDisclaimerMode = mode ?? "auto";
  if (resolved === "show") return true;
  if (resolved === "hide") return false;
  const classification = classifyMedicalDisclaimerRelevance({
    title: article.title,
    excerpt: article.excerpt,
    body: article.body,
    topicNames: article.topics.map((t) => t.name),
  });
  return classification.suggested === "show";
}

export function parseMedicalDisclaimerMode(value: unknown): MedicalDisclaimerMode {
  if (value === "show" || value === "hide" || value === "auto") return value;
  return "auto";
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createArticle,
  deleteArticle,
  setArticleStatus,
  updateArticle,
} from "@/lib/actions/admin-articles";
import type { ContentBlock } from "@/lib/cms/blocks";
import type { ArticleSource, CmsArticle, CmsAuthor, CmsMedia, CmsTopic, MedicalDisclaimerMode } from "@/lib/cms/types";
import { SourcesEditor } from "./SourcesEditor";
import { TiptapEditor } from "./editor/TiptapEditor";
import { MediaPickerField } from "./MediaPickerField";
import { CountryField } from "./CountryField";
import { majorRegions } from "@/lib/nav";

type SaveState = "idle" | "unsaved" | "saving" | "saved" | "error";

const META_DESC_RECOMMENDED = 160;

function toDatetimeLocalValue(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}`;
}

function fieldClass() {
  return "focus-ring mt-1.5 w-full border border-white/10 bg-charcoal-deep px-3 py-2 text-sm text-offwhite placeholder:text-gray-muted focus:border-accent";
}

function labelClass() {
  return "text-xs font-bold uppercase tracking-wide text-gray-muted";
}

export function ArticleEditor({
  articleId,
  initial,
  initialTopicIds = [],
  topics,
  authors,
  media,
}: {
  articleId?: string;
  initial?: CmsArticle;
  initialTopicIds?: string[];
  topics: CmsTopic[];
  authors: CmsAuthor[];
  media: CmsMedia[];
}) {
  const router = useRouter();
  const [mediaList, setMediaList] = useState<CmsMedia[]>(media);
  const [id, setId] = useState(articleId);
  const [status, setStatus] = useState(initial?.status ?? "draft");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [metaDescription, setMetaDescription] = useState(initial?.metaDescription ?? "");
  const [body, setBody] = useState<ContentBlock[]>(initial?.body ?? []);
  const [featuredImageId, setFeaturedImageId] = useState(initial?.featuredImage?.id ?? "");
  const [topicIds, setTopicIds] = useState<string[]>(initialTopicIds);
  const [region, setRegion] = useState(initial?.region ?? "");
  const [country, setCountry] = useState(initial?.country ?? "");
  const [isGlobalStory, setIsGlobalStory] = useState(initial?.category?.slug === "global");
  const [authorId, setAuthorId] = useState(initial?.author.id ?? authors[0]?.id ?? "");
  const [publicationDate, setPublicationDate] = useState(
    initial ? toDatetimeLocalValue(initial.publicationDate) : toDatetimeLocalValue(new Date().toISOString())
  );
  const [autoReadTime, setAutoReadTime] = useState(true);
  const [readTimeMinutes, setReadTimeMinutes] = useState(initial?.readTimeMinutes ?? 3);
  const [premium, setPremium] = useState(initial?.premium ?? false);
  const [correctionNote, setCorrectionNote] = useState(initial?.correctionNote ?? "");
  const [medicalDisclaimerMode, setMedicalDisclaimerMode] = useState<MedicalDisclaimerMode>(
    initial?.medicalDisclaimerMode === "hide" ? "hide" : "show"
  );
  const [sources, setSources] = useState<ArticleSource[]>(initial?.sources ?? []);
  const [scheduledFor, setScheduledFor] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleMediaUploaded(uploaded: CmsMedia) {
    setMediaList((prev) => [uploaded, ...prev]);
  }

  const isFirstRender = useRef(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function buildInput() {
    return {
      title,
      slug,
      excerpt,
      metaDescription: metaDescription || null,
      body,
      featuredImageId: featuredImageId || null,
      topicIds,
      region: region || null,
      country: country || null,
      isGlobalStory,
      authorId,
      publicationDate: new Date(publicationDate).toISOString(),
      readTimeMinutes: autoReadTime ? null : readTimeMinutes,
      premium,
      correctionNote: correctionNote || null,
      medicalDisclaimerMode,
      sources,
    };
  }

  // NOTE: remainder of file truncated in this intermediate step - will complete in follow-up if needed
  return <div>ArticleEditor loading</div>;
}

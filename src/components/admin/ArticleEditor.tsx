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
  const [saveState, setSaveState] = useState<SaveState>("idle");

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [seoDescription, setSeoDescription] = useState(initial?.seoDescription ?? "");
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
  const [sources, setSources] = useState<ArticleSource[]>(() => initial?.sources ?? []);
  const [scheduledFor, setScheduledFor] = useState("");

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
      seoDescription: seoDescription.trim() || null,
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
      sources: sources
        .map((s) => ({
          author: s.author?.trim() || null,
          publication: s.publication.trim(),
          url: s.url?.trim() || null,
        }))
        .filter((s) => s.publication || s.author || s.url),
    };
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!id) return;

    const markUnsaved = setTimeout(() => setSaveState("unsaved"), 0);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSaveState("saving");
      const result = await updateArticle(id, buildInput());
      setSaveState("ok" in result ? "saved" : "error");
    }, 2000);

    return () => {
      clearTimeout(markUnsaved);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [
    id,
    title,
    slug,
    excerpt,
    seoDescription,
    body,
    featuredImageId,
    topicIds,
    region,
    country,
    authorId,
    publicationDate,
    autoReadTime,
    readTimeMinutes,
    premium,
    isGlobalStory,
    correctionNote,
    medicalDisclaimerMode,
    sources,
  ]);

  async function handleSaveNow() {
    if (!id) return;
    setSaveState("saving");
    const result = await updateArticle(id, buildInput(), { snapshotRevisionFirst: true });
    setSaveState("ok" in result ? "saved" : "error");
  }

  async function handleCreateDraft() {
    if (!title.trim()) {
      alert("Please add a title first.");
      return;
    }
    setSaveState("saving");
    const result = await createArticle(buildInput());
    if ("id" in result) {
      setId(result.id);
      setSaveState("saved");
      router.replace(`/admin/articles/${result.id}`);
    } else {
      setSaveState("error");
    }
  }

  async function handlePublish() {
    if (!id) {
      await handleCreateDraft();
      return;
    }
    await handleSaveNow();
    const result = await setArticleStatus(id, "published");
    if ("ok" in result) setStatus("published");
  }

  async function handleUnpublish() {
    if (!id) return;
    const result = await setArticleStatus(id, "draft");
    if ("ok" in result) setStatus("draft");
  }

  async function handleDelete() {
    if (!id) return;
    if (!confirm("Delete this article permanently? This cannot be undone.")) return;
    const result = await deleteArticle(id);
    if ("ok" in result) router.push("/admin/articles");
  }

  const saveLabel: Record<SaveState, string> = {
    idle: "",
    unsaved: "Unsaved changes",
    saving: "Saving…",
    saved: "Saved",
    error: "Could not save",
  };

  const metaLen = seoDescription.length;
  const metaLenHint =
    metaLen === 0
      ? `Recommended up to ${META_DESC_RECOMMENDED} characters`
      : metaLen <= META_DESC_RECOMMENDED
        ? `${metaLen} / ${META_DESC_RECOMMENDED}`
        : `${metaLen} / ${META_DESC_RECOMMENDED} (a bit long for search snippets)`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/articles" className="text-xs text-gray-muted hover:text-accent">
            ← Articles
          </Link>
          <h1 className="mt-1 font-serif text-2xl font-bold text-white">
            {id ? "Edit article" : "New article"}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {saveState !== "idle" && (
            <span className="text-xs text-gray-muted">{saveLabel[saveState]}</span>
          )}
          {id ? (
            <>
              <button
                type="button"
                onClick={handleSaveNow}
                className="border border-white/20 px-3 py-1.5 text-sm text-offwhite hover:border-accent hover:text-accent"
              >
                Save
              </button>
              {status === "published" ? (
                <button
                  type="button"
                  onClick={handleUnpublish}
                  className="border border-white/20 px-3 py-1.5 text-sm text-offwhite hover:border-accent"
                >
                  Unpublish
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePublish}
                  className="bg-accent px-3 py-1.5 text-sm font-medium text-charcoal-deep hover:opacity-90"
                >
                  Publish
                </button>
              )}
              <button
                type="button"
                onClick={handleDelete}
                className="border border-red-500/40 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10"
              >
                Delete
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleCreateDraft}
              className="bg-accent px-3 py-1.5 text-sm font-medium text-charcoal-deep hover:opacity-90"
            >
              Create draft
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <label className={labelClass()}>Title</label>
            <input
              className={`${fieldClass()} font-serif text-lg font-bold`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Headline"
            />
          </div>

          <div>
            <label className={labelClass()}>Slug</label>
            <input
              className={fieldClass()}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="url-slug"
            />
          </div>

          <div>
            <label className={labelClass()}>Excerpt</label>
            <textarea
              className={fieldClass()}
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short summary for cards and SEO"
            />
          </div>

          <div>
            <div className="flex items-baseline justify-between gap-2">
              <label className={labelClass()}>Meta description</label>
              <span className="text-xs text-gray-muted">{metaLenHint}</span>
            </div>
            {excerpt.trim() && !seoDescription.trim() && (
              <button
                type="button"
                className="mt-1 text-xs text-accent hover:underline"
                onClick={() => setSeoDescription(excerpt.trim().slice(0, META_DESC_RECOMMENDED))}
              >
                Use excerpt
              </button>
            )}
            <textarea
              className={fieldClass()}
              rows={2}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Optional. Shown in Google search results and social shares. Leave blank to use the excerpt."
            />
            <p className="mt-1 text-xs text-gray-muted">
              {metaLenHint}. Does not overwrite a value you have already written.
            </p>
          </div>

          <div>
            <label className={labelClass()}>Featured image</label>
            <div className="mt-1.5">
              <MediaPickerField
                media={mediaList.filter((m) => m.type === "image")}
                value={featuredImageId}
                onChange={(m) => setFeaturedImageId(m?.id ?? "")}
                onUploaded={handleMediaUploaded}
              />
            </div>
          </div>

          <div>
            <h2 className="border-b border-charcoal pb-2 font-serif text-lg font-bold text-white">Body</h2>
            <div className="mt-4">
              <TiptapEditor
                blocks={body}
                onChange={setBody}
                media={mediaList}
                onMediaUploaded={handleMediaUploaded}
                articleId={id}
              />
            </div>
          </div>

          <SourcesEditor sources={sources} onChange={setSources} />

          <div>
            <h2 className="border-b border-charcoal pb-2 font-serif text-lg font-bold text-white">
              Medical disclaimer
            </h2>
            <div className="mt-4 space-y-3">
              <p className="text-xs text-gray-muted">
                Show the short medical disclaimer notice on this story for readers?
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                <label
                  className={`flex cursor-pointer items-center gap-2 border px-3 py-2.5 text-sm ${
                    medicalDisclaimerMode === "show"
                      ? "border-accent text-accent"
                      : "border-charcoal text-gray-secondary-light"
                  }`}
                >
                  <input
                    type="radio"
                    name="medical-disclaimer-on"
                    checked={medicalDisclaimerMode === "show"}
                    onChange={() => setMedicalDisclaimerMode("show")}
                    className="accent-[var(--brand-accent)]"
                  />
                  Yes — show on this story
                </label>
                <label
                  className={`flex cursor-pointer items-center gap-2 border px-3 py-2.5 text-sm ${
                    medicalDisclaimerMode === "hide"
                      ? "border-accent text-accent"
                      : "border-charcoal text-gray-secondary-light"
                  }`}
                >
                  <input
                    type="radio"
                    name="medical-disclaimer-on"
                    checked={medicalDisclaimerMode === "hide"}
                    onChange={() => setMedicalDisclaimerMode("hide")}
                    className="accent-[var(--brand-accent)]"
                  />
                  No — do not show
                </label>
              </div>
            </div>
          </div>

          <div>
            <h2 className="border-b border-charcoal pb-2 font-serif text-lg font-bold text-white">
              Correction
            </h2>
            <div className="mt-4">
              <label className={labelClass()}>Correction note (shown on the published article)</label>
              <textarea
                rows={3}
                value={correctionNote}
                onChange={(e) => setCorrectionNote(e.target.value)}
                placeholder="Leave blank unless this article has a published correction."
                className={fieldClass()}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className={labelClass()}>Topics</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {topics.map((topic) => {
                const active = topicIds.includes(topic.id);
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() =>
                      setTopicIds((prev) =>
                        active ? prev.filter((t) => t !== topic.id) : [...prev, topic.id]
                      )
                    }
                    className={`focus-ring border px-3 py-1.5 text-xs font-semibold ${
                      active ? "border-accent text-accent" : "border-charcoal text-gray-secondary-light"
                    }`}
                  >
                    {topic.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass()}>Region</label>
              <select value={region} onChange={(e) => setRegion(e.target.value)} className={fieldClass()}>
                <option value="">Select a region...</option>
                {majorRegions.map((r) => (
                  <option key={r.slug} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass()}>Country</label>
              <CountryField value={country} onChange={setCountry} className={fieldClass()} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="global"
              type="checkbox"
              checked={isGlobalStory}
              onChange={(e) => setIsGlobalStory(e.target.checked)}
              className="accent-[var(--brand-accent)]"
            />
            <label htmlFor="global" className="text-sm text-gray-secondary-light">
              Global story
            </label>
          </div>

          <div>
            <label className={labelClass()}>Author</label>
            <select value={authorId} onChange={(e) => setAuthorId(e.target.value)} className={fieldClass()}>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass()}>Publication date</label>
            <input
              type="datetime-local"
              value={publicationDate}
              onChange={(e) => setPublicationDate(e.target.value)}
              className={fieldClass()}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                id="auto-read"
                type="checkbox"
                checked={autoReadTime}
                onChange={(e) => setAutoReadTime(e.target.checked)}
                className="accent-[var(--brand-accent)]"
              />
              <label htmlFor="auto-read" className="text-sm text-gray-secondary-light">
                Auto read time
              </label>
            </div>
            {!autoReadTime && (
              <div>
                <label className={labelClass()}>Read time (minutes)</label>
                <input
                  type="number"
                  min={1}
                  value={readTimeMinutes}
                  onChange={(e) => setReadTimeMinutes(Number(e.target.value) || 1)}
                  className={fieldClass()}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              id="premium"
              type="checkbox"
              checked={premium}
              onChange={(e) => setPremium(e.target.checked)}
              className="accent-[var(--brand-accent)]"
            />
            <label htmlFor="premium" className="text-sm text-gray-secondary-light">
              Premium article
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

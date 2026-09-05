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
import type { CmsArticle, CmsAuthor, CmsCategory, CmsMedia, CmsTopic } from "@/lib/cms/types";
import { TiptapEditor } from "./editor/TiptapEditor";
import { MediaPickerField } from "./MediaPickerField";

type SaveState = "idle" | "unsaved" | "saving" | "saved" | "error";

function toDateInputValue(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
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
  categories,
  topics,
  authors,
  media,
}: {
  articleId?: string;
  initial?: CmsArticle;
  initialTopicIds?: string[];
  categories: CmsCategory[];
  topics: CmsTopic[];
  authors: CmsAuthor[];
  media: CmsMedia[];
}) {
  const router = useRouter();
  const [id, setId] = useState(articleId);
  const [status, setStatus] = useState(initial?.status ?? "draft");
  const [saveState, setSaveState] = useState<SaveState>("idle");

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [body, setBody] = useState<ContentBlock[]>(initial?.body ?? []);
  const [featuredImageId, setFeaturedImageId] = useState(initial?.featuredImage?.id ?? "");
  const [categoryId, setCategoryId] = useState(initial?.category.id ?? categories[0]?.id ?? "");
  const [topicIds, setTopicIds] = useState<string[]>(initialTopicIds);
  const [region, setRegion] = useState(initial?.region ?? "");
  const [country, setCountry] = useState(initial?.country ?? "");
  const [authorId, setAuthorId] = useState(initial?.author.id ?? authors[0]?.id ?? "");
  const [publicationDate, setPublicationDate] = useState(
    initial ? toDateInputValue(initial.publicationDate) : toDateInputValue(new Date().toISOString())
  );
  const [autoReadTime, setAutoReadTime] = useState(true);
  const [readTimeMinutes, setReadTimeMinutes] = useState(initial?.readTimeMinutes ?? 3);
  const [premium, setPremium] = useState(initial?.premium ?? false);
  const [correctionNote, setCorrectionNote] = useState(initial?.correctionNote ?? "");
  const [sourceName, setSourceName] = useState(initial?.source.name ?? "");
  const [sourceAuthor, setSourceAuthor] = useState(initial?.source.author ?? "");
  const [sourceInstitution, setSourceInstitution] = useState(initial?.source.institution ?? "");
  const [sourceUrl, setSourceUrl] = useState(initial?.source.url ?? "");
  const [sourceAdditional, setSourceAdditional] = useState(initial?.source.additional ?? "");
  const [scheduledFor, setScheduledFor] = useState("");

  const isFirstRender = useRef(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function buildInput() {
    return {
      title,
      slug,
      excerpt,
      body,
      featuredImageId: featuredImageId || null,
      categoryId,
      topicIds,
      region: region || null,
      country: country || null,
      authorId,
      publicationDate: new Date(publicationDate).toISOString(),
      readTimeMinutes: autoReadTime ? null : readTimeMinutes,
      premium,
      correctionNote: correctionNote || null,
      sourceName: sourceName || null,
      sourceAuthor: sourceAuthor || null,
      sourceInstitution: sourceInstitution || null,
      sourceUrl: sourceUrl || null,
      sourcePublishedAt: null,
      sourceAdditional: sourceAdditional || null,
    };
  }

  // Autosave: only once the article exists, debounced after edits settle.
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    title, slug, excerpt, body, featuredImageId, categoryId, topicIds, region, country,
    authorId, publicationDate, autoReadTime, readTimeMinutes, premium,
    correctionNote, sourceName, sourceAuthor,
    sourceInstitution, sourceUrl, sourceAdditional,
  ]);

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

  async function handleSaveNow() {
    if (!id) return handleCreateDraft();
    setSaveState("saving");
    const result = await updateArticle(id, buildInput(), { snapshotRevisionFirst: true });
    setSaveState("ok" in result ? "saved" : "error");
  }

  async function handlePublish() {
    if (!id) await handleCreateDraft();
    if (!id) return;
    await handleSaveNow();
    const result = await setArticleStatus(id, "published");
    if ("ok" in result) setStatus("published");
  }

  async function handleUnpublish() {
    if (!id) return;
    const result = await setArticleStatus(id, "unpublished");
    if ("ok" in result) setStatus("unpublished");
  }

  async function handleSchedule() {
    if (!id || !scheduledFor) return;
    await handleSaveNow();
    const result = await setArticleStatus(id, "scheduled", new Date(scheduledFor).toISOString());
    if ("ok" in result) setStatus("scheduled");
  }

  async function handleDelete() {
    if (!id) return;
    if (!confirm("Delete this article permanently? This cannot be undone.")) return;
    await deleteArticle(id);
    router.push("/admin/articles");
  }

  const saveLabel = {
    idle: "",
    unsaved: "Unsaved changes",
    saving: "Saving…",
    saved: "Saved",
    error: "Could not save",
  }[saveState];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-charcoal pb-4">
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-2xl font-extrabold text-white">
            {id ? "Edit Article" : "New Article"}
          </h1>
          <span
            className={`border px-2 py-1 text-[11px] font-bold uppercase tracking-wide ${
              status === "published" ? "border-accent text-accent" : "border-charcoal text-gray-muted"
            }`}
          >
            {status}
          </span>
          {saveLabel && (
            <span
              className={`text-xs ${saveState === "error" ? "text-live-red" : "text-gray-muted"}`}
            >
              {saveLabel}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {id && (
            <Link
              href={`/preview/article/${id}`}
              target="_blank"
              className="focus-ring border border-charcoal px-4 py-2 text-sm font-semibold text-offwhite hover:border-accent hover:text-accent"
            >
              Preview
            </Link>
          )}
          <button
            type="button"
            onClick={handleSaveNow}
            className="focus-ring border border-charcoal px-4 py-2 text-sm font-semibold text-offwhite hover:border-accent hover:text-accent"
          >
            {id ? "Save" : "Create Draft"}
          </button>
          {status === "published" ? (
            <button
              type="button"
              onClick={handleUnpublish}
              className="focus-ring border border-charcoal px-4 py-2 text-sm font-semibold text-offwhite hover:border-accent hover:text-accent"
            >
              Unpublish
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePublish}
              className="focus-ring bg-accent px-4 py-2 text-sm font-bold text-black hover:opacity-90"
            >
              Publish
            </button>
          )}
          {id && (
            <button
              type="button"
              onClick={handleDelete}
              className="focus-ring border border-live-red/40 px-4 py-2 text-sm font-semibold text-live-red hover:bg-live-red/10"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {id && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border border-charcoal bg-charcoal-deep p-4">
          <label className={labelClass()}>Schedule for</label>
          <input
            type="datetime-local"
            value={scheduledFor}
            onChange={(e) => setScheduledFor(e.target.value)}
            className="focus-ring border border-white/10 bg-black px-3 py-1.5 text-sm text-offwhite focus:border-accent"
          />
          <button
            type="button"
            onClick={handleSchedule}
            disabled={!scheduledFor}
            className="focus-ring border border-charcoal px-4 py-1.5 text-sm font-semibold text-offwhite hover:border-accent hover:text-accent disabled:opacity-50"
          >
            Schedule
          </button>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <label className={labelClass()}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`${fieldClass()} font-serif text-lg font-bold`}
            />
          </div>

          <div>
            <label className={labelClass()}>Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto-generated from title if left blank"
              className={fieldClass()}
            />
          </div>

          <div>
            <label className={labelClass()}>Excerpt</label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className={fieldClass()}
            />
          </div>

          <div>
            <label className={labelClass()}>Featured image</label>
            <div className="mt-1.5">
              <MediaPickerField
                media={media.filter((m) => m.type === "image")}
                value={featuredImageId}
                onChange={(m) => setFeaturedImageId(m?.id ?? "")}
              />
            </div>
          </div>

          <div>
            <h2 className="border-b border-charcoal pb-2 font-serif text-lg font-bold text-white">Body</h2>
            <div className="mt-4">
              <TiptapEditor blocks={body} onChange={setBody} media={media} />
            </div>
          </div>

          <div>
            <h2 className="border-b border-charcoal pb-2 font-serif text-lg font-bold text-white">
              Source &amp; Attribution
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass()}>Original source / publication</label>
                <input type="text" value={sourceName} onChange={(e) => setSourceName(e.target.value)} className={fieldClass()} />
              </div>
              <div>
                <label className={labelClass()}>Original author</label>
                <input type="text" value={sourceAuthor} onChange={(e) => setSourceAuthor(e.target.value)} className={fieldClass()} />
              </div>
              <div>
                <label className={labelClass()}>Institution</label>
                <input type="text" value={sourceInstitution} onChange={(e) => setSourceInstitution(e.target.value)} className={fieldClass()} />
              </div>
              <div>
                <label className={labelClass()}>Source URL</label>
                <input type="url" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} className={fieldClass()} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass()}>Additional attribution</label>
                <textarea rows={2} value={sourceAdditional} onChange={(e) => setSourceAdditional(e.target.value)} className={fieldClass()} />
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
            <label className={labelClass()}>Category</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={fieldClass()}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

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
              <input type="text" value={region} onChange={(e) => setRegion(e.target.value)} className={fieldClass()} />
            </div>
            <div>
              <label className={labelClass()}>Country</label>
              <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className={fieldClass()} />
            </div>
          </div>

          <div>
            <label className={labelClass()}>Author</label>
            <select value={authorId} onChange={(e) => setAuthorId(e.target.value)} className={fieldClass()}>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass()}>Publication date</label>
            <input
              type="date"
              value={publicationDate}
              onChange={(e) => setPublicationDate(e.target.value)}
              className={fieldClass()}
            />
          </div>

          <div>
            <label className={labelClass()}>Read time</label>
            <div className="mt-1.5 flex items-center gap-2">
              <input
                type="checkbox"
                id="auto-read-time"
                checked={autoReadTime}
                onChange={(e) => setAutoReadTime(e.target.checked)}
                className="h-4 w-4 accent-[var(--brand-accent)]"
              />
              <label htmlFor="auto-read-time" className="text-sm text-gray-secondary-light">
                Auto-calculate
              </label>
            </div>
            {!autoReadTime && (
              <input
                type="number"
                min={1}
                value={readTimeMinutes}
                onChange={(e) => setReadTimeMinutes(Number(e.target.value))}
                className={fieldClass()}
              />
            )}
          </div>

          <div className="flex items-center gap-2 border border-charcoal p-3">
            <input
              type="checkbox"
              id="premium"
              checked={premium}
              onChange={(e) => setPremium(e.target.checked)}
              className="h-4 w-4 accent-[var(--brand-accent)]"
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

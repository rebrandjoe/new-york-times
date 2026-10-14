"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ContentBlock } from "@/lib/cms/blocks";

/** Build speakable plain text from title, excerpt, and body blocks. */
export function articleTextForSpeech(
  title: string,
  excerpt: string | null | undefined,
  body: ContentBlock[]
): string {
  const parts: string[] = [title.trim()];
  if (excerpt?.trim()) parts.push(excerpt.trim());

  for (const block of body) {
    if (block.type === "paragraph" || block.type === "heading" || block.type === "blockquote") {
      if (block.text.trim()) parts.push(block.text.trim());
    } else if (block.type === "pullquote") {
      if (block.text.trim()) parts.push(block.text.trim());
    } else if (block.type === "list") {
      const items = block.items.map((i) => i.trim()).filter(Boolean);
      if (items.length) parts.push(items.join(". "));
    }
  }

  return parts.join(". ").replace(/\s+/g, " ").trim();
}

/** Keep utterances short — some browsers truncate very long SpeechSynthesisUtterance text. */
function chunkText(text: string, maxLen = 220): string[] {
  if (!text) return [];
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [text];
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    const s = sentence.trim();
    if (!s) continue;
    if (current.length + s.length + 1 <= maxLen) {
      current = current ? `${current} ${s}` : s;
    } else {
      if (current) chunks.push(current);
      if (s.length <= maxLen) {
        current = s;
      } else {
        for (let i = 0; i < s.length; i += maxLen) {
          chunks.push(s.slice(i, i + maxLen));
        }
        current = "";
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function supportsSpeech(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

export function ArticleListen({
  title,
  excerpt,
  body,
}: {
  title: string;
  excerpt?: string | null;
  body: ContentBlock[];
}) {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const chunkIndex = useRef(0);
  const chunksRef = useRef<string[]>([]);
  const stoppedRef = useRef(false);

  useEffect(() => {
    setSupported(supportsSpeech());
    return () => {
      stoppedRef.current = true;
      try {
        window.speechSynthesis?.cancel();
      } catch {
        /* ignore */
      }
    };
  }, []);

  const speakFrom = useCallback((startIndex: number) => {
    if (!supportsSpeech()) return;
    const synth = window.speechSynthesis;
    const chunks = chunksRef.current;
    if (startIndex >= chunks.length) {
      setSpeaking(false);
      setPaused(false);
      chunkIndex.current = 0;
      return;
    }

    const utter = new SpeechSynthesisUtterance(chunks[startIndex]);
    utter.rate = 1;
    utter.pitch = 1;
    utter.lang = "en-US";

    utter.onend = () => {
      if (stoppedRef.current) return;
      chunkIndex.current = startIndex + 1;
      speakFrom(startIndex + 1);
    };
    utter.onerror = () => {
      if (stoppedRef.current) return;
      setSpeaking(false);
      setPaused(false);
    };

    synth.speak(utter);
  }, []);

  function start() {
    if (!supportsSpeech()) return;
    stoppedRef.current = false;
    const full = articleTextForSpeech(title, excerpt, body);
    chunksRef.current = chunkText(full);
    chunkIndex.current = 0;
    window.speechSynthesis.cancel();
    setSpeaking(true);
    setPaused(false);
    // Chrome sometimes needs a tick after cancel before speak
    window.setTimeout(() => speakFrom(0), 40);
  }

  function stop() {
    stoppedRef.current = true;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
    chunkIndex.current = 0;
  }

  function togglePause() {
    if (!supportsSpeech() || !speaking) return;
    if (paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    } else {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  }

  function onPrimaryClick() {
    if (!speaking) {
      start();
      return;
    }
    togglePause();
  }

  if (!supported) return null;

  return (
    <div
      className="mt-4 flex flex-wrap items-center gap-2"
      role="group"
      aria-label="Listen to this article"
    >
      <button
        type="button"
        onClick={onPrimaryClick}
        className="focus-ring inline-flex items-center gap-2 rounded-full border border-accent/35 bg-black px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-accent transition-colors hover:border-accent hover:bg-accent/10 sm:text-xs"
        aria-label={speaking ? (paused ? "Resume listening" : "Pause listening") : "Listen to this article"}
      >
        {speaking && !paused ? <PauseIcon /> : <PlayIcon />}
        {speaking ? (paused ? "Resume" : "Pause") : "Listen"}
      </button>
      {speaking && (
        <button
          type="button"
          onClick={stop}
          className="focus-ring text-[11px] font-medium text-gray-muted hover:text-white"
        >
          Stop
        </button>
      )}
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
    </svg>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Meta = {
  status: string;
  durationSeconds: number | null;
  ready: boolean;
  configured: boolean;
  error: string | null;
};

const SPEEDS = [0.75, 1, 1.25, 1.5, 1.75] as const;

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function ArticleAudioPlayer({
  slug,
  estimatedMinutes,
}: {
  slug: string;
  estimatedMinutes?: number;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [srcReady, setSrcReady] = useState(false);

  const audioUrl = `/api/article/${encodeURIComponent(slug)}/audio`;

  const fetchMeta = useCallback(async () => {
    try {
      const res = await fetch(`${audioUrl}?meta=1`, { credentials: "same-origin" });
      if (!res.ok) return;
      const data = (await res.json()) as Meta;
      setMeta(data);
      if (data.durationSeconds) setDuration(data.durationSeconds);
    } catch {
      // ignore
    }
  }, [audioUrl]);

  useEffect(() => {
    void fetchMeta();
  }, [fetchMeta]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onTime = () => setCurrent(el.currentTime);
    const onDur = () => {
      if (Number.isFinite(el.duration) && el.duration > 0) setDuration(el.duration);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);
    const onErr = () => {
      setError("Playback failed. Try again.");
      setPlaying(false);
      setLoading(false);
    };

    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onDur);
    el.addEventListener("durationchange", onDur);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    el.addEventListener("error", onErr);

    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onDur);
      el.removeEventListener("durationchange", onDur);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("error", onErr);
    };
  }, [srcReady]);

  async function ensureSrcAndPlay() {
    setError(null);
    setLoading(true);
    try {
      const metaRes = await fetch(`${audioUrl}?meta=1&generate=1`, {
        credentials: "same-origin",
      });
      if (metaRes.status === 403) {
        setError("Premium membership required to listen.");
        setLoading(false);
        return;
      }
      const data = (await metaRes.json()) as Meta;
      setMeta(data);

      if (!data.ready && data.status === "pending") {
        setError("Preparing audio…");
        for (let i = 0; i < 8; i++) {
          await new Promise((r) => setTimeout(r, 2000));
          const p = await fetch(`${audioUrl}?meta=1`, { credentials: "same-origin" });
          const m = (await p.json()) as Meta;
          setMeta(m);
          if (m.ready) {
            data.ready = true;
            break;
          }
          if (m.status === "failed") {
            setError(m.error || "Could not generate audio.");
            setLoading(false);
            return;
          }
        }
        if (!data.ready) {
          setError("Audio is still preparing. Try again in a moment.");
          setLoading(false);
          return;
        }
      }

      if (!data.ready && data.status === "failed") {
        setError(data.error || "Audio unavailable.");
        setLoading(false);
        return;
      }

      if (!data.ready && !data.configured) {
        setError("Listen is not configured yet.");
        setLoading(false);
        return;
      }

      const playRes = await fetch(audioUrl, { credentials: "same-origin", redirect: "follow" });
      if (!playRes.ok) {
        if (playRes.status === 403) setError("Premium membership required to listen.");
        else setError("Could not load audio.");
        setLoading(false);
        return;
      }

      const blob = await playRes.blob();
      const objectUrl = URL.createObjectURL(blob);
      const el = audioRef.current;
      if (!el) {
        setLoading(false);
        return;
      }
      if (el.src) URL.revokeObjectURL(el.src);
      el.src = objectUrl;
      el.playbackRate = speed;
      setSrcReady(true);
      await el.play();
      setLoading(false);
    } catch {
      setError("Could not start playback.");
      setLoading(false);
    }
  }

  function togglePlay() {
    const el = audioRef.current;
    if (playing && el) {
      el.pause();
      return;
    }
    if (srcReady && el?.src) {
      void el.play();
      return;
    }
    void ensureSrcAndPlay();
  }

  function onSeek(value: number) {
    const el = audioRef.current;
    if (!el || !srcReady) return;
    el.currentTime = value;
    setCurrent(value);
  }

  function cycleSpeed() {
    const idx = SPEEDS.indexOf(speed as (typeof SPEEDS)[number]);
    const next = SPEEDS[(idx + 1) % SPEEDS.length];
    setSpeed(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  }

  const total =
    duration > 0
      ? duration
      : meta?.durationSeconds && meta.durationSeconds > 0
        ? meta.durationSeconds
        : estimatedMinutes
          ? estimatedMinutes * 60
          : 0;

  return (
    <div
      className="mt-5 border border-charcoal bg-charcoal-deep/60 px-3 py-3 sm:px-4"
      role="region"
      aria-label="Listen to this article"
    >
      <audio ref={audioRef} preload="none" className="hidden" />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={togglePlay}
          disabled={loading}
          className="focus-ring inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-black text-accent transition-opacity hover:opacity-90 disabled:opacity-50"
          aria-label={playing ? "Pause" : "Listen to this article"}
        >
          {loading ? (
            <span className="h-4 w-4 animate-pulse rounded-full bg-accent/60" />
          ) : playing ? (
            <PauseIcon />
          ) : (
            <PlayIcon />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              Listen to this article
            </p>
            <button
              type="button"
              onClick={cycleSpeed}
              className="focus-ring text-[11px] font-bold tabular-nums text-gray-secondary-light hover:text-accent"
              aria-label={`Playback speed ${speed}x`}
            >
              {speed}x
            </button>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <span className="w-9 shrink-0 text-[11px] tabular-nums text-gray-muted">
              {formatTime(current)}
            </span>
            <input
              type="range"
              min={0}
              max={total || 1}
              step={0.1}
              value={Math.min(current, total || 0)}
              onChange={(e) => onSeek(Number(e.target.value))}
              disabled={!srcReady}
              className="h-1 w-full cursor-pointer appearance-none bg-charcoal accent-[var(--brand-accent)] disabled:opacity-40"
              aria-label="Seek"
            />
            <span className="w-9 shrink-0 text-right text-[11px] tabular-nums text-gray-muted">
              {formatTime(total)}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-xs text-live-red" role="status">
          {error}
        </p>
      )}
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
    </svg>
  );
}

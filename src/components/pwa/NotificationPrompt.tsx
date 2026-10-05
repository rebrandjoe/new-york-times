"use client";

import { useCallback, useEffect, useState } from "react";
import { CloseIcon } from "@/components/icons";
import { subscribeToPush } from "@/lib/actions/push-notifications";

const DISMISS_KEY = "push-notification-dismissed";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

function canOfferPush(): boolean {
  if (typeof window === "undefined") return false;
  if (!("Notification" in window)) return false;
  if (!("serviceWorker" in navigator)) return false;
  if (!("PushManager" in window)) return false;
  if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) return false;
  if (Notification.permission !== "default") return false;
  if (window.localStorage.getItem(DISMISS_KEY) === "1") return false;
  return true;
}

/**
 * One-time professional opt-in for push alerts on new health stories.
 * Shown after the visitor's first click/tap (or a short delay), then never
 * again if they allow, deny, or dismiss. Does not interrupt every link.
 */
export function NotificationPrompt() {
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);

  const show = useCallback(() => {
    if (!canOfferPush()) return;
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!canOfferPush()) return;

    // Prefer first real engagement (click/tap) so the later browser permission
    // dialog is more likely to be accepted; fall back to a short delay.
    const onEngage = () => {
      show();
      cleanup();
    };

    const timer = window.setTimeout(() => {
      show();
      cleanup();
    }, 4500);

    function cleanup() {
      window.clearTimeout(timer);
      document.removeEventListener("pointerdown", onEngage);
    }

    document.addEventListener("pointerdown", onEngage, { once: true, passive: true });
    return cleanup;
  }, [show]);

  function dismiss() {
    setVisible(false);
    window.localStorage.setItem(DISMISS_KEY, "1");
  }

  async function allow() {
    if (busy) return;
    setBusy(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        dismiss();
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ) as BufferSource,
      });

      await subscribeToPush(
        subscription.toJSON() as {
          endpoint: string;
          keys: { p256dh: string; auth: string };
        }
      );
    } catch (err) {
      console.error("[push] subscribe failed:", err);
    } finally {
      dismiss();
      setBusy(false);
    }
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="push-prompt-title"
      aria-describedby="push-prompt-desc"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Dismiss notification prompt"
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        onClick={dismiss}
      />

      {/* Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-sm border border-white/10 bg-charcoal-deep shadow-2xl">
        <div className="h-1 w-full bg-accent" />

        <div className="px-5 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
                JOSEPH MMWA
              </p>
              <h2
                id="push-prompt-title"
                className="mt-2 font-serif text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-[1.65rem]"
              >
                Stay ahead of health news
              </h2>
            </div>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Close"
              className="focus-ring -mr-1 -mt-1 shrink-0 p-2 text-gray-muted transition-colors hover:text-white"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          <p
            id="push-prompt-desc"
            className="mt-3 text-sm leading-relaxed text-gray-secondary-light"
          >
            Allow notifications to get an alert the moment we publish important
            health and medical stories from Kenya, Africa and around the world.
          </p>

          <ul className="mt-4 space-y-2 text-sm text-offwhite/90">
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
              Breaking and explained coverage, as it happens
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
              No spam — only when a new story goes live
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
              You can turn this off anytime in browser settings
            </li>
          </ul>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={dismiss}
              disabled={busy}
              className="focus-ring px-4 py-2.5 text-sm font-medium text-gray-secondary-light transition-colors hover:text-white disabled:opacity-50"
            >
              Not now
            </button>
            <button
              type="button"
              onClick={allow}
              disabled={busy}
              className="focus-ring bg-accent px-5 py-2.5 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {busy ? "Enabling…" : "Allow notifications"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { CloseIcon } from "@/components/icons";
import { subscribeToPush } from "@/lib/actions/push-notifications";

/** Remembered forever in this browser (until storage is cleared). */
const DISMISS_KEY = "push-notification-dismissed";
const ACCEPTED_KEY = "push-notification-accepted";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

function alreadyHandled(): boolean {
  try {
    if (window.localStorage.getItem(ACCEPTED_KEY) === "1") return true;
    if (window.localStorage.getItem(DISMISS_KEY) === "1") return true;
  } catch {
    /* private mode may throw */
  }
  return false;
}

function markDismissed() {
  try {
    window.localStorage.setItem(DISMISS_KEY, "1");
  } catch {
    /* ignore */
  }
}

function markAccepted() {
  try {
    window.localStorage.setItem(ACCEPTED_KEY, "1");
    window.localStorage.setItem(DISMISS_KEY, "1");
  } catch {
    /* ignore */
  }
}

async function ensurePushSubscription(vapidPublicKey: string): Promise<boolean> {
  if (!vapidPublicKey) return false;
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return false;

  try {
    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
      });
    }
    const json = subscription.toJSON();
    if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) return false;
    const result = await subscribeToPush({
      endpoint: json.endpoint,
      keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
    });
    return !("error" in result);
  } catch (err) {
    console.error("[push] ensure subscription failed:", err);
    return false;
  }
}

function canOfferPush(vapidPublicKey: string): boolean {
  if (typeof window === "undefined") return false;
  if (!vapidPublicKey) return false;
  if (!("Notification" in window)) return false;
  if (!("serviceWorker" in navigator)) return false;
  if (!("PushManager" in window)) return false;
  if (alreadyHandled()) return false;
  // Only prompt while the browser has not decided yet.
  if (Notification.permission !== "default") return false;
  return true;
}

/**
 * Compact top-left card. First visit only until Allow / Block / dismiss.
 * Once accepted or dismissed, it must not return on later visits.
 */
export function NotificationPrompt({
  vapidPublicKey = "",
}: {
  vapidPublicKey?: string;
}) {
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);

  // If the user already granted permission (e.g. earlier session), never show
  // the card — just make sure the subscription is stored for publish pushes.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!vapidPublicKey) return;
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      markAccepted();
      void ensurePushSubscription(vapidPublicKey);
      setVisible(false);
      return;
    }

    if (Notification.permission === "denied") {
      markDismissed();
      setVisible(false);
    }
  }, [vapidPublicKey]);

  const show = useCallback(() => {
    if (!canOfferPush(vapidPublicKey)) return;
    setVisible(true);
  }, [vapidPublicKey]);

  useEffect(() => {
    if (!canOfferPush(vapidPublicKey)) return;

    const timer = window.setTimeout(() => {
      show();
    }, 1000);

    const onEngage = () => {
      show();
      window.clearTimeout(timer);
    };

    document.addEventListener("pointerdown", onEngage, { once: true, passive: true });

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("pointerdown", onEngage);
    };
  }, [show, vapidPublicKey]);

  function dismiss() {
    setVisible(false);
    markDismissed();
  }

  async function allow() {
    if (busy || !vapidPublicKey) return;
    setBusy(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        markDismissed();
        setVisible(false);
        return;
      }

      markAccepted();
      setVisible(false);
      await ensurePushSubscription(vapidPublicKey);
    } catch (err) {
      console.error("[push] subscribe failed:", err);
      // Still hide permanently for this browser so the card does not loop.
      markAccepted();
      setVisible(false);
    } finally {
      setBusy(false);
    }
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Show notifications"
      className="fixed left-3 top-3 z-[70] w-[min(100%-1.5rem,320px)] overflow-hidden rounded-xl border border-white/10 bg-[#2b2b2b] shadow-2xl sm:left-4 sm:top-4"
    >
      <div className="flex items-start gap-3 px-4 pb-2 pt-3">
        <span
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20 text-sm"
          aria-hidden
        >
          🔔
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-white/70">josephmmwa.com</p>
          <p className="mt-1 text-sm font-semibold leading-snug text-white">Show notifications</p>
          <p className="mt-1 text-xs leading-relaxed text-white/60">
            Stay ahead of health news that matters. Get notified when we publish.
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          disabled={busy}
          aria-label="Dismiss"
          className="focus-ring -mr-1 -mt-0.5 shrink-0 p-1.5 text-white/50 transition-colors hover:text-white disabled:opacity-50"
        >
          <CloseIcon className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex justify-end gap-2 px-4 pb-3 pt-1">
        <button
          type="button"
          onClick={dismiss}
          disabled={busy}
          className="focus-ring rounded-full px-4 py-1.5 text-xs font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
        >
          Block
        </button>
        <button
          type="button"
          onClick={allow}
          disabled={busy}
          className="focus-ring rounded-full bg-white px-4 py-1.5 text-xs font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {busy ? "…" : "Allow"}
        </button>
      </div>
    </div>
  );
}

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

function canOfferPush(vapidPublicKey: string): boolean {
  if (typeof window === "undefined") return false;
  if (!vapidPublicKey) return false;
  if (!("Notification" in window)) return false;
  if (!("serviceWorker" in navigator)) return false;
  if (!("PushManager" in window)) return false;
  if (Notification.permission !== "default") return false;
  if (window.localStorage.getItem(DISMISS_KEY) === "1") return false;
  return true;
}

/**
 * Compact top-left card (similar placement to browser notification prompts).
 * Appears ~1s on first visit; does not block the page.
 */
export function NotificationPrompt({
  vapidPublicKey = "",
}: {
  vapidPublicKey?: string;
}) {
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);

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
    window.localStorage.setItem(DISMISS_KEY, "1");
  }

  async function allow() {
    if (busy || !vapidPublicKey) return;
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
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
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

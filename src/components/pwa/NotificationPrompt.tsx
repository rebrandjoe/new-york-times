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
 * Slim top tab for push opt-in — appears ~1s after first visit.
 * High-contrast so Allow is never lost on dark pages.
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
      aria-label="Turn on notifications"
      className="fixed inset-x-0 top-0 z-[70] border-b-2 border-accent bg-[#1a1a1a] shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
    >
      <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-3 py-2.5 sm:gap-4 sm:px-6">
        <p className="min-w-0 flex-1 text-xs leading-snug text-white/90 sm:text-sm">
          <span className="font-bold text-white">Stay ahead of health news that matters</span>
          <span className="hidden text-white/80 sm:inline"> — get notified when we publish</span>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={allow}
            disabled={busy}
            className="focus-ring rounded-full bg-accent px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-black shadow-[0_0_0_2px_rgba(0,0,0,0.4),0_2px_12px_rgba(212,175,55,0.45)] transition-transform hover:scale-[1.03] hover:brightness-110 disabled:opacity-60 sm:px-5 sm:text-sm"
          >
            {busy ? "…" : "Allow"}
          </button>
          <button
            type="button"
            onClick={dismiss}
            disabled={busy}
            aria-label="Dismiss"
            className="focus-ring rounded-full border border-white/25 p-1.5 text-white/70 transition-colors hover:border-white/50 hover:text-white disabled:opacity-50"
          >
            <CloseIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

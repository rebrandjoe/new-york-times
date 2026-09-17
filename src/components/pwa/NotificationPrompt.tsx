"use client";

import { useEffect, useState } from "react";
import { CloseIcon } from "@/components/icons";
import { subscribeToPush } from "@/lib/actions/push-notifications";

const DISMISS_KEY = "push-notification-dismissed";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

/** Custom pre-prompt, shown once per visitor: asks plainly before the
 * browser's own native permission dialog appears, the same pattern as the
 * install banner. Never shown again once the visitor has answered either
 * way (dismissed here, or already granted/denied at the browser level). */
export function NotificationPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const supported =
      typeof window !== "undefined" &&
      "Notification" in window &&
      "serviceWorker" in navigator &&
      "PushManager" in window;
    if (!supported) return;
    if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) return;
    if (Notification.permission !== "default") return;
    if (window.localStorage.getItem(DISMISS_KEY) === "1") return;

    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    setVisible(false);
    window.localStorage.setItem(DISMISS_KEY, "1");
  }

  async function allow() {
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

      await subscribeToPush(subscription.toJSON() as { endpoint: string; keys: { p256dh: string; auth: string } });
    } catch (err) {
      console.error("[push] subscribe failed:", err);
    } finally {
      dismiss();
    }
  }

  if (!visible) return null;

  return (
    <div
      role="status"
      className="border-t border-accent/30 bg-charcoal-deep"
    >
      <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-3 sm:px-6">
        <p className="flex-1 text-sm text-offwhite">
          Get notified when JOSEPH MMWA publishes the latest health and medical news?
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={allow}
            className="focus-ring bg-accent px-4 py-2 text-sm font-bold text-black transition-opacity hover:opacity-90"
          >
            Allow
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="focus-ring px-3 py-2 text-sm text-gray-secondary-light hover:text-white"
          >
            No thanks
          </button>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="focus-ring p-2 text-gray-secondary-light hover:text-white"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

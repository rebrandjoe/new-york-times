"use client";

import { useEffect, useState } from "react";
import { CloseIcon } from "@/components/icons";

const DISMISS_KEY = "pwa-install-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/** Custom install banner: a real `beforeinstallprompt` trigger on Android/desktop
 * Chrome/Edge, or an honest manual-install note on iOS Safari (which has no such
 * event and no way to trigger an install dialog programmatically). */
export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const nav = window.navigator as Navigator & { standalone?: boolean };
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
    if (isStandalone) return;

    // One-time read of browser-only state (localStorage, user agent) that can't
    // be known during SSR, so it can't be computed as initial render state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDismissed(window.localStorage.getItem(DISMISS_KEY) === "1");
    setIsIOS(/iPad|iPhone|iPod/.test(nav.userAgent) && !("MSStream" in window));

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  function dismiss() {
    setDismissed(true);
    window.localStorage.setItem(DISMISS_KEY, "1");
  }

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    dismiss();
  }

  if (dismissed || (!deferredPrompt && !isIOS)) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-accent/30 bg-charcoal-deep"
    >
      <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-3 sm:px-6">
        <p className="flex-1 text-sm text-offwhite">
          {deferredPrompt
            ? "Install JOSEPH MMWA for a faster, full-screen, offline-ready experience."
            : 'Add JOSEPH MMWA to your home screen: tap Share, then "Add to Home Screen".'}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          {deferredPrompt && (
            <button
              type="button"
              onClick={install}
              className="focus-ring bg-accent px-4 py-2 text-sm font-bold text-black transition-opacity hover:opacity-90"
            >
              Install
            </button>
          )}
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss install prompt"
            className="focus-ring p-2 text-gray-secondary-light hover:text-white"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

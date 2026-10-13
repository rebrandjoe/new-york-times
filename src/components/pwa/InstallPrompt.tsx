"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CloseIcon } from "@/components/icons";

const DISMISS_KEY = "pwa-install-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * PWA install bar.
 * - Fixed to the bottom of the *viewport* (not the end of the article).
 * - Compact on mobile so it does not interrupt reading.
 * - On mobile, shows while the reader is on an article page.
 * - Dismissible with X; remembered in localStorage.
 */
export function InstallPrompt() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [ready, setReady] = useState(false);

  const onArticle = pathname?.startsWith("/article/") ?? false;

  useEffect(() => {
    const nav = window.navigator as Navigator & { standalone?: boolean };
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
    if (isStandalone) return;

    setDismissed(window.localStorage.getItem(DISMISS_KEY) === "1");
    setIsIOS(/iPad|iPhone|iPod/.test(nav.userAgent) && !("MSStream" in window));

    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const onMq = () => setIsMobile(mq.matches);
    mq.addEventListener("change", onMq);

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Short delay so the bar does not flash over the first paint while reading.
    const timer = window.setTimeout(() => setReady(true), 2500);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      mq.removeEventListener("change", onMq);
      window.clearTimeout(timer);
    };
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

  // Need an install path: Chrome/Edge event, or iOS manual instructions.
  const canOffer = Boolean(deferredPrompt) || isIOS;
  if (dismissed || !ready || !canOffer) return null;

  // On mobile, only while reading an article (less clutter on home).
  // Desktop keeps the bar available site-wide when the browser offers install.
  if (isMobile && !onArticle) return null;

  return (
    <div
      role="status"
      className="pointer-events-auto fixed inset-x-0 bottom-0 z-[45] border-t border-accent/25 bg-charcoal-deep/95 shadow-[0_-4px_24px_rgba(0,0,0,0.45)] backdrop-blur-md"
      style={{
        paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))",
      }}
    >
      <div className="mx-auto flex max-w-3xl items-center gap-2 px-3 py-2.5 sm:gap-4 sm:px-6 sm:py-3">
        <p className="min-w-0 flex-1 text-[12px] leading-snug text-offwhite sm:text-sm">
          {deferredPrompt
            ? "Install JOSEPH MMWA for offline reading."
            : "Add to Home Screen: Share → Add to Home Screen."}
        </p>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {deferredPrompt && (
            <button
              type="button"
              onClick={install}
              className="focus-ring bg-accent px-3 py-1.5 text-xs font-bold text-black transition-opacity hover:opacity-90 sm:px-4 sm:py-2 sm:text-sm"
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

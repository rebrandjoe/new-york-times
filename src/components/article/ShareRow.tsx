"use client";

import { useState } from "react";
import {
  WhatsAppIcon,
  FacebookGlyph,
  XGlyph,
  LinkedInGlyph,
  EmailGlyph,
  LinkGlyph,
  InstagramGlyph,
  BRAND_COLORS,
} from "./ShareIcons";

function iconButtonClass() {
  return "focus-ring flex h-11 w-11 items-center justify-center rounded-full transition-transform hover:scale-105 focus-visible:scale-105";
}

export function ShareRow({ url, title }: { url: string; title: string }) {
  const [notice, setNotice] = useState<string | null>(null);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copyToClipboard(message: string) {
    try {
      await navigator.clipboard.writeText(url);
      setNotice(message);
      setTimeout(() => setNotice(null), 4000);
    } catch {
      // Clipboard API can be unavailable — fail silently, link is still visible in the URL bar.
    }
  }

  function shareToInstagram() {
    copyToClipboard("Instagram doesn't support direct link sharing — link copied instead.");
  }

  return (
    <div className="border-y border-charcoal py-8">
      <div className="flex items-center gap-2">
        <LinkGlyph className="h-4 w-4 text-gray-secondary-light" />
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-secondary-light">
          Share this story
        </h2>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <a
          href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on WhatsApp"
          className={iconButtonClass()}
          style={{ backgroundColor: BRAND_COLORS.whatsapp }}
        >
          <WhatsAppIcon className="h-5 w-5" />
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
          className={iconButtonClass()}
          style={{ backgroundColor: BRAND_COLORS.facebook }}
        >
          <FacebookGlyph className="h-4 w-4" />
        </a>
        <a
          href={`https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X"
          className={iconButtonClass()}
          style={{ backgroundColor: BRAND_COLORS.x }}
        >
          <XGlyph className="h-4 w-4" />
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
          className={iconButtonClass()}
          style={{ backgroundColor: BRAND_COLORS.linkedin }}
        >
          <LinkedInGlyph className="h-4 w-4" />
        </a>
        <button
          type="button"
          onClick={shareToInstagram}
          aria-label="Share to Instagram"
          className={iconButtonClass()}
          style={{ backgroundImage: BRAND_COLORS.instagram }}
        >
          <InstagramGlyph className="h-5 w-5" />
        </button>
        <a
          href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}
          aria-label="Share by email"
          className={`${iconButtonClass()} border border-charcoal bg-charcoal-deep text-gray-secondary-light hover:text-accent`}
        >
          <EmailGlyph className="h-4 w-4" />
        </a>

        <button
          type="button"
          onClick={() => copyToClipboard("Link copied")}
          className="focus-ring ml-1 flex items-center gap-2 border border-charcoal px-4 py-2.5 text-sm font-semibold text-gray-secondary-light transition-colors hover:border-accent hover:text-accent"
        >
          <LinkGlyph className="h-4 w-4" />
          Copy link
        </button>
      </div>

      {notice && <p className="mt-3 text-sm text-accent">{notice}</p>}
    </div>
  );
}

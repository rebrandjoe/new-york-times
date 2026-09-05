"use client";

import { useState } from "react";

export function ShareRow({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can be unavailable — fail silently, link is still visible in the URL bar.
    }
  }

  const links = [
    { label: "WhatsApp", href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: "X", href: `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { label: "Email", href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}` },
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-charcoal py-4 text-sm">
      <span className="font-semibold text-gray-muted">Share</span>
      <button
        type="button"
        onClick={copyLink}
        className="focus-ring text-gray-secondary-light hover:text-accent"
      >
        {copied ? "Link copied" : "Copy link"}
      </button>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring text-gray-secondary-light hover:text-accent"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

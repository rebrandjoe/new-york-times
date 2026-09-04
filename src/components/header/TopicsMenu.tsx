"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDownIcon } from "@/components/icons";
import { healthTopics } from "@/lib/mock-data";

export function TopicsMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="focus-ring flex items-center gap-1 py-4 text-[13px] font-semibold tracking-wide text-offwhite transition-colors hover:text-accent"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        TOPICS
        <ChevronDownIcon className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div className="absolute left-1/2 top-full z-40 w-[560px] -translate-x-1/2 border border-charcoal bg-charcoal-deep p-6 shadow-xl">
          <div className="grid grid-cols-3 gap-x-6 gap-y-3">
            {healthTopics.map((topic) => (
              <Link
                key={topic.id}
                href={`/topics/${topic.slug}`}
                className="focus-ring text-sm text-gray-secondary-light transition-colors hover:text-accent"
                onClick={() => setOpen(false)}
              >
                {topic.name}
              </Link>
            ))}
          </div>
          <div className="mt-5 border-t border-charcoal pt-4">
            <Link
              href="/topics"
              className="focus-ring text-sm font-semibold text-accent hover:underline"
              onClick={() => setOpen(false)}
            >
              + More topics
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

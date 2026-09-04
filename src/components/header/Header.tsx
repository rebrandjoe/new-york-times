"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CloseIcon, MenuIcon, SearchIcon } from "@/components/icons";
import { Tagline, WordmarkLink } from "@/components/Wordmark";
import { primaryNav } from "@/lib/nav";
import { LiveTicker } from "./LiveTicker";
import { TopicsMenu } from "./TopicsMenu";

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [topicsExpanded, setTopicsExpanded] = useState(false);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <header className="sticky top-0 z-50 bg-black">
      <LiveTicker />

      <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <WordmarkLink className="text-2xl sm:text-3xl" />
            <Tagline className="mt-1 text-xs text-gray-secondary sm:text-sm" />
          </div>

          <div className="hidden items-center gap-5 pt-1 md:flex">
            <Link
              href="/search"
              aria-label="Search"
              className="focus-ring text-offwhite transition-colors hover:text-accent"
            >
              <SearchIcon className="h-5 w-5" />
            </Link>
            <Link
              href="/sign-in"
              className="focus-ring text-sm font-semibold text-offwhite transition-colors hover:text-accent"
            >
              Sign in
            </Link>
            <Link
              href="/subscribe"
              className="focus-ring bg-accent px-4 py-2 text-sm font-bold text-black transition-opacity hover:opacity-90"
            >
              Subscribe
            </Link>
          </div>

          <button
            type="button"
            className="focus-ring flex items-center gap-2 pt-1 text-offwhite md:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            aria-expanded={drawerOpen}
          >
            <Link
              href="/search"
              aria-label="Search"
              className="focus-ring mr-1 text-offwhite"
              onClick={(e) => e.stopPropagation()}
            >
              <SearchIcon className="h-5 w-5" />
            </Link>
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      <nav
        aria-label="Primary"
        className="hidden border-t border-charcoal md:block"
      >
        <div className="mx-auto flex max-w-[1440px] items-center gap-7 px-4 sm:px-6 lg:px-8">
          {primaryNav.map((item) =>
            item.label === "TOPICS" ? (
              <TopicsMenu key={item.href} />
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="focus-ring py-4 text-[13px] font-semibold tracking-wide text-offwhite transition-colors hover:text-accent"
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      </nav>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-black/70"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col overflow-y-auto border-l border-charcoal bg-charcoal-deep p-6">
            <div className="flex items-center justify-between">
              <WordmarkLink className="text-xl" />
              <button
                type="button"
                className="focus-ring text-offwhite"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
              >
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <Link
                href="/subscribe"
                onClick={() => setDrawerOpen(false)}
                className="focus-ring bg-accent px-4 py-3 text-center text-sm font-bold text-black"
              >
                Subscribe
              </Link>
              <Link
                href="/sign-in"
                onClick={() => setDrawerOpen(false)}
                className="focus-ring border border-charcoal px-4 py-3 text-center text-sm font-semibold text-offwhite"
              >
                Sign in
              </Link>
            </div>

            <nav aria-label="Mobile" className="mt-6 flex flex-col divide-y divide-charcoal border-t border-charcoal">
              {primaryNav
                .filter((item) => item.label !== "TOPICS" && item.label !== "ABOUT")
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    className="focus-ring py-3 text-sm font-semibold tracking-wide text-offwhite transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                ))}

              <div>
                <button
                  type="button"
                  className="focus-ring flex w-full items-center justify-between py-3 text-sm font-semibold tracking-wide text-offwhite"
                  onClick={() => setTopicsExpanded((v) => !v)}
                  aria-expanded={topicsExpanded}
                >
                  TOPICS
                  <span className="text-accent">{topicsExpanded ? "−" : "+"}</span>
                </button>
                {topicsExpanded && (
                  <div className="flex flex-col gap-2 pb-3 pl-3">
                    <Link
                      href="/topics"
                      onClick={() => setDrawerOpen(false)}
                      className="focus-ring text-sm text-accent"
                    >
                      All topics
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/about"
                onClick={() => setDrawerOpen(false)}
                className="focus-ring py-3 text-sm font-semibold tracking-wide text-offwhite transition-colors hover:text-accent"
              >
                ABOUT
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

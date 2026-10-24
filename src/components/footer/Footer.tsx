"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tagline, WordmarkLink } from "@/components/Wordmark";
import { SocialFollow } from "@/components/SocialFollow";
import {
  footerEditorial,
  footerInformation,
  footerNews,
  footerTopics,
} from "@/lib/nav";
import type { NavLink } from "@/lib/nav";

function FooterColumn({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-muted">
        {title}
      </h3>
      <ul className="mt-4 flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="focus-ring text-sm text-gray-secondary-light transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const aboutBottomLinks = [
  { label: "Editorial Standards", href: "/editorial-standards" },
  { label: "Corrections & Fact-Checking", href: "/corrections-and-fact-checking" },
  { label: "AI Policy", href: "/ai-policy" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Contact", href: "/contact" },
  { label: "Advertise", href: "/advertise" },
];

export function Footer() {
  const pathname = usePathname();
  const isAboutPage = pathname === "/about";
  const isContactPage = pathname === "/contact";

  return (
    <footer className="border-t border-charcoal bg-black">
      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8">
        {!isAboutPage && (
          <>
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              <FooterColumn title="News" links={footerNews} />
              <FooterColumn title="Information" links={footerInformation} />
              <FooterColumn title="Topics" links={footerTopics} />
              <FooterColumn title="Editorial" links={footerEditorial} />
            </div>

            <div className="mt-14 flex flex-col items-center border-t border-charcoal pt-10 text-center">
              <WordmarkLink className="text-2xl" />
              <Tagline className="mt-2 text-sm text-gray-secondary" />
            </div>

            <div className="mx-auto mt-10 max-w-2xl space-y-2 border-t border-charcoal pt-8 text-center">
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-white">
                About Joseph Mmwa
              </h4>
              <p className="text-xs leading-relaxed text-gray-secondary-light">
                Joseph Mmwa is a health journalism platform delivering news, reporting and
                analysis on the medical and public health developments shaping Kenya, Africa
                and the world. From disease outbreaks and vaccines to medical breakthroughs,
                pharmaceutical developments, healthcare policy and scientific research, Joseph
                Mmwa brings readers credible information, evidence-based reporting and context
                to understand the stories shaping global health and medicine.
              </p>
            </div>

            {!isContactPage && (
              <div className="mt-10 flex justify-center">
                <SocialFollow align="center" iconSize="sm" />
              </div>
            )}
          </>
        )}

        <div
          className={`flex flex-col items-center gap-3 ${
            isAboutPage ? "pt-2" : "mt-10 border-t border-charcoal pt-6"
          }`}
        >
          {isAboutPage ? (
            <div className="flex max-w-2xl flex-wrap items-center justify-center gap-x-3 gap-y-2">
              {aboutBottomLinks.map((link, i) => (
                <span key={link.href} className="inline-flex items-center gap-3">
                  {i > 0 && <span className="text-gray-muted">·</span>}
                  <Link
                    href={link.href}
                    className="focus-ring text-xs text-gray-muted hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </span>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/privacy-policy"
                className="focus-ring text-xs text-gray-muted hover:text-accent"
              >
                Privacy Policy
              </Link>
              <span className="text-gray-muted">|</span>
              <Link
                href="/terms-of-service"
                className="focus-ring text-xs text-gray-muted hover:text-accent"
              >
                Terms of Service
              </Link>
              <span className="text-gray-muted">|</span>
              <a
                href="mailto:contact@josephmmwa.com"
                className="focus-ring text-xs text-gray-muted hover:text-accent"
              >
                Contact
              </a>
            </div>
          )}
          <p className="text-xs text-gray-muted">
            © 2026 Joseph Mmwa. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}

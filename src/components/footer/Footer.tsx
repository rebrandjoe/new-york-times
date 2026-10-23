"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tagline, WordmarkLink } from "@/components/Wordmark";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/icons";
import {
  footerEditorial,
  footerInformation,
  footerNews,
  footerTopics,
  socialLinks,
} from "@/lib/nav";
import type { NavLink } from "@/lib/nav";

const socialIconMap = {
  Facebook: FacebookIcon,
  LinkedIn: LinkedInIcon,
  YouTube: YouTubeIcon,
  X: XIcon,
  Instagram: InstagramIcon,
  TikTok: TikTokIcon,
};

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
                Joseph Mmwa is a Kenyan health news publication covering major
                developments in Kenya, Africa and around the world. I report and explain
                breaking health news, medical research, public health, diseases, vaccines,
                healthcare policy and scientific developments—with context, evidence and a
                focus on why the story matters.
              </p>
            </div>

            <div className="mt-10 flex flex-col items-center gap-4">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-muted">
                Follow me
              </p>
              <div className="flex items-center gap-5">
                {socialLinks.map((social) => {
                  const Icon = socialIconMap[social.label as keyof typeof socialIconMap];
                  return (
                    <a
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="focus-ring text-gray-secondary transition-colors hover:text-accent"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Bottom legal / policy links — full on all pages; essential set on /about */}
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

import Link from "next/link";
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

export function Footer() {
  return (
    <footer className="border-t border-charcoal bg-black">
      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8">
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

        <div className="mt-10 flex flex-col items-center gap-2 border-t border-charcoal pt-6">
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="focus-ring text-xs text-gray-muted hover:text-accent">
              Privacy
            </Link>
            <Link href="/terms-of-service" className="focus-ring text-xs text-gray-muted hover:text-accent">
              Terms
            </Link>
          </div>
          <p className="text-xs text-gray-muted">
            © 2026 Joseph Mmwa. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}

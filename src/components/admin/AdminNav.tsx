"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/ticker", label: "Ticker" },
  { href: "/admin/comments", label: "Comments" },
  { href: "/admin/subscriptions", label: "Subscriptions" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1 border-b border-charcoal">
      {links.map((link) => {
        const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`focus-ring border-b-2 px-4 py-3 text-sm font-semibold tracking-wide transition-colors ${
              active ? "border-accent text-accent" : "border-transparent text-gray-secondary hover:text-offwhite"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

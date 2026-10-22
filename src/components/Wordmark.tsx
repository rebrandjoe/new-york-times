import Image from "next/image";
import Link from "next/link";

export const SUPABASE_LOGO_URL =
  "https://uhkmgirkogzmnkkidcgm.supabase.co/storage/v1/object/public/logo/WhatsApp%20Image%202026-09-13%20at%2014.28.22%20(1).jpeg";

/** Circular logo mark only — used in header on /about and beside the About hero name. */
export function LogoMark({
  size = 36,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`relative shrink-0 overflow-hidden rounded-full border border-charcoal bg-black ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={SUPABASE_LOGO_URL}
        alt="Joseph Mmwa Logo"
        fill
        className="object-cover"
        sizes={`${size}px`}
      />
    </span>
  );
}

export function LogoMarkLink({
  size = 40,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Link href="/" className={`focus-ring inline-flex ${className}`} aria-label="Joseph Mmwa home">
      <LogoMark size={size} />
    </Link>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 font-serif font-extrabold tracking-tight ${className}`}>
      <LogoMark size={36} />
      <span>
        <span className="text-white">JOSEPH</span>{" "}
        <span className="text-accent">MMWA</span>
      </span>
    </span>
  );
}

export function Tagline({ className = "" }: { className?: string }) {
  return (
    <p className={`font-sans ${className}`}>
      <span className="text-offwhite">If it's health,</span>{" "}
      <span className="text-accent">it's here</span>
    </p>
  );
}

export function WordmarkLink({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className="focus-ring inline-block">
      <Wordmark className={className} />
    </Link>
  );
}

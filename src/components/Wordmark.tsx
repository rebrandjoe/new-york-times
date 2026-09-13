import Image from "next/image";
import Link from "next/link";

const SUPABASE_LOGO_URL =
  "https://uhkmgirkogzmnkkidcgm.supabase.co/storage/v1/object/public/logo/WhatsApp%20Image%202026-09-13%20at%2014.28.22%20(1).jpeg";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 font-serif font-extrabold tracking-tight ${className}`}>
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-charcoal bg-black">
        <Image
          src={SUPABASE_LOGO_URL}
          alt="Joseph Mmwa Logo"
          fill
          className="object-cover"
        />
      </span>
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
      <span className="text-offwhite">If it&apos;s health,</span>{" "}
      <span className="text-accent">it&apos;s here</span>
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

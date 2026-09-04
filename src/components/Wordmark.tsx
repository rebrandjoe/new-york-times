import Link from "next/link";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-serif font-extrabold tracking-tight ${className}`}>
      <span className="text-white">JOSEPH</span>{" "}
      <span className="text-accent">MMWA</span>
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

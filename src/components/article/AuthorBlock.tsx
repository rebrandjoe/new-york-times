import Image from "next/image";
import Link from "next/link";
import { AUTHOR_PHOTO_ALT, AUTHOR_PHOTO_SRC } from "@/lib/constants";

export function AuthorBlock({ name, title }: { name: string; title: string }) {
  return (
    <Link
      href="/about"
      className="focus-ring flex items-center gap-3 border-y border-charcoal py-4"
    >
      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-charcoal">
        <Image src={AUTHOR_PHOTO_SRC} alt={AUTHOR_PHOTO_ALT} fill sizes="40px" className="object-cover object-top" />
      </span>
      <span>
        <span className="block text-sm font-semibold text-white">{name}</span>
        <span className="block text-xs text-gray-muted">{title}</span>
      </span>
    </Link>
  );
}

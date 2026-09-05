import Image from "next/image";
import Link from "next/link";
import { AUTHOR_PHOTO_ALT, AUTHOR_PHOTO_SRC } from "@/lib/constants";

/** Splits "Joseph Mmwa" into the same two-colour treatment as the site
 * wordmark — first word white, the rest in accent. */
function BrandedName({ name }: { name: string }) {
  const [first, ...rest] = name.split(" ");
  return (
    <span className="font-serif text-base font-extrabold tracking-tight">
      <span className="text-white">{first}</span>
      {rest.length > 0 && <span className="text-accent"> {rest.join(" ")}</span>}
    </span>
  );
}

export function AuthorBlock({ name, title }: { name: string; title: string }) {
  return (
    <Link
      href="/about"
      className="focus-ring flex items-center gap-4 border-t border-charcoal py-8"
    >
      <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-charcoal">
        <Image src={AUTHOR_PHOTO_SRC} alt={AUTHOR_PHOTO_ALT} fill sizes="56px" className="object-cover object-top" />
      </span>
      <span>
        <BrandedName name={name} />
        <span className="mt-0.5 block text-sm text-gray-secondary-light">{title}</span>
      </span>
    </Link>
  );
}

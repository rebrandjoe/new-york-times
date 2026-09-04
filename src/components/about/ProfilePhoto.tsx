import Image from "next/image";

interface ProfilePhotoProps {
  imageSrc?: string | null;
  imageAlt?: string;
  className?: string;
}

export function ProfilePhoto({
  imageSrc = null,
  imageAlt = "Portrait of Joseph Mmwa",
  className = "",
}: ProfilePhotoProps) {
  return (
    <div className={className}>
      <div className="h-1 w-16 bg-accent" />
      <div className="relative mt-4 aspect-[4/5] w-full overflow-hidden border border-charcoal bg-charcoal-deep">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover object-top"
            priority
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-6 text-center">
            <span className="font-serif text-2xl font-bold text-gray-muted">JM</span>
            <p className="text-xs uppercase tracking-[0.15em] text-gray-muted">
              Portrait pending
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

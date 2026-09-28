import Image from "next/image";
import type { ImageAsset } from "@/lib/types";

const focalPositionMap: Record<NonNullable<ImageAsset["focalPoint"]>, string> = {
  top: "object-top",
  center: "object-center",
  bottom: "object-bottom",
};

export function ArticleImage({
  image,
  sizes,
  className = "",
  priority = false,
}: {
  image: ImageAsset;
  sizes: string;
  className?: string;
  /** Only the above-the-fold lead image should set this. */
  priority?: boolean;
}) {
  if (!image.src) {
    return (
      <div
        className={`flex items-center justify-center bg-charcoal ${className}`}
        role="img"
        aria-label={image.alt}
      >
        <span className="font-serif text-lg font-bold text-gray-muted">JM</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-charcoal ${className}`}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${focalPositionMap[image.focalPoint ?? "center"]}`}
      />
    </div>
  );
}

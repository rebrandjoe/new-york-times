import Image from "next/image";

interface HeroProps {
  imageSrc?: string | null;
  imageAlt?: string;
}

export function Hero({ imageSrc = null, imageAlt = "" }: HeroProps) {
  return (
    <section className="relative left-1/2 h-[50vh] min-h-[380px] w-screen -translate-x-1/2 overflow-hidden bg-charcoal lg:h-[60vh]">
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_68%]"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal to-black" />
      )}

      {/* Dark scrim the photo bleeds out of, left-to-right, for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/10" />
      {/* Bottom scrim for footer-edge legibility at any breakpoint */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      <div className="relative flex h-full items-center">
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <h1 className="max-w-xl font-serif text-[11vw] font-extrabold leading-[0.98] tracking-tight text-white sm:max-w-2xl sm:text-6xl lg:text-7xl">
            <span className="block text-white">GLOBAL HEALTH NEWS</span>
            <span className="block text-accent">YOU CAN TRUST</span>
          </h1>
          <p className="mt-4 max-w-md text-sm text-gray-secondary-light sm:mt-5 sm:max-w-lg sm:text-lg">
            The world&apos;s biggest health and medical news explained as they happen
          </p>
        </div>
      </div>
    </section>
  );
}

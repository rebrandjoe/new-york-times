import Image from "next/image";

interface HeroProps {
  imageSrc?: string | null;
  imageAlt?: string;
}

export function Hero({ imageSrc = null, imageAlt = "" }: HeroProps) {
  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 bg-charcoal">
      <div className="relative aspect-[4/5] w-full sm:aspect-[16/10] lg:aspect-[16/9]">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_20%]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/[.85]" />

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-[1440px] px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8 lg:pb-20">
            <h1 className="max-w-4xl font-serif text-[13vw] font-extrabold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
              <span className="block text-white">GLOBAL HEALTH NEWS</span>
              <span className="block text-accent">YOU CAN TRUST</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-gray-secondary-light sm:text-lg">
              The world&apos;s biggest health and medical news explained as they happen
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

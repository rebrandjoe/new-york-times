import { ProfilePhoto } from "./ProfilePhoto";
import { AUTHOR_PHOTO_ALT, AUTHOR_PHOTO_SRC } from "@/lib/constants";

export function AboutHero() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 pt-14 sm:px-6 lg:px-8 lg:pt-20">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">About</p>
      <h1 className="mt-3 font-serif text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
        JOSEPH MMWA
      </h1>
      <p className="mt-2 text-lg font-medium text-gray-secondary-light sm:text-xl">
        Health &amp; Medical Journalist
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-12">
        <ProfilePhoto
          className="lg:col-span-5"
          imageSrc={AUTHOR_PHOTO_SRC}
          imageAlt={AUTHOR_PHOTO_ALT}
        />
        <div className="flex flex-col justify-center lg:col-span-7" />
      </div>
    </section>
  );
}

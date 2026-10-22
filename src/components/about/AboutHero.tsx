import { ProfilePhoto } from "./ProfilePhoto";
import { AUTHOR_PHOTO_ALT, AUTHOR_PHOTO_SRC } from "@/lib/constants";

export function AboutHero() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 pt-16 sm:px-6 lg:px-8 lg:pt-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-serif text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
          Joseph Mmwa
        </h1>
        <p className="mt-5 text-lg font-medium text-accent sm:mt-6 sm:text-xl">
          If it's health, it's here
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-md sm:mt-14 lg:mt-16">
        <ProfilePhoto
          imageSrc={AUTHOR_PHOTO_SRC}
          imageAlt={AUTHOR_PHOTO_ALT}
        />
      </div>
    </section>
  );
}

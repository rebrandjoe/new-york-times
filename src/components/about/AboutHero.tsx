import { ProfilePhoto } from "./ProfilePhoto";
import { LogoMark } from "@/components/Wordmark";
import { AUTHOR_PHOTO_ALT, AUTHOR_PHOTO_SRC } from "@/lib/constants";

export function AboutHero() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 pt-12 sm:px-6 lg:px-8 lg:pt-16">
      <div className="mx-auto max-w-3xl text-center">
        {/* Brand mark first — striking open */}
        <div className="flex justify-center">
          <LogoMark size={168} className="sm:hidden ring-1 ring-charcoal" />
          <LogoMark size={220} className="hidden sm:inline-block ring-1 ring-charcoal" />
        </div>

        <h1 className="mt-8 font-serif text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:mt-10 sm:text-6xl lg:text-7xl">
          Joseph Mmwa
        </h1>
        <p className="mt-5 text-lg font-medium text-accent sm:mt-6 sm:text-xl">
          If it's health, it's here
        </p>
      </div>

      <figure className="mx-auto mt-12 max-w-md sm:mt-14 lg:mt-16">
        <ProfilePhoto
          imageSrc={AUTHOR_PHOTO_SRC}
          imageAlt={AUTHOR_PHOTO_ALT}
        />
        {/* Name in accent; role in same weight/font as “My approach to journalism is simple:” */}
        <figcaption className="mt-3 text-left">
          <p className="text-base font-semibold tracking-tight text-accent sm:text-lg">
            Joseph Mmwa
          </p>
          <p className="mt-1 text-base font-semibold leading-snug text-offwhite sm:text-lg">
            Health Journalist and Founder of Joseph Mmwa Health News Publication
          </p>
        </figcaption>
      </figure>
    </section>
  );
}

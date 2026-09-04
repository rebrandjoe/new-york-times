import { ProfilePhoto } from "./ProfilePhoto";

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
        <ProfilePhoto className="lg:col-span-5" />
        <div className="flex flex-col justify-center lg:col-span-7">
          <p className="max-w-xl text-lg leading-relaxed text-offwhite sm:text-xl">
            I cover health and medical developments as they unfold — from Kenya and
            across Africa, to the United States, Europe, Asia, Latin America, and the
            Middle East.
          </p>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-secondary-light">
            My work follows medical research, public health, disease outbreaks,
            vaccines, healthcare systems, and health policy wherever they matter —
            explaining what happened, why it matters, and what it could mean for
            people.
          </p>
        </div>
      </div>
    </section>
  );
}

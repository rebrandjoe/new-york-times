import Link from "next/link";

export function WhyItMatters() {
  return (
    <>
      <section className="border-y border-charcoal bg-charcoal-deep">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <h2 className="font-serif text-2xl font-extrabold text-white sm:text-3xl">
              Why This Journalism Matters
            </h2>
            <div className="mt-5 space-y-5 text-base leading-relaxed text-gray-secondary-light sm:text-lg">
              <p>
                Health decisions affect every family, every community and every
                country. My reporting makes complex developments in health,
                medicine and research easier to understand, placing evidence,
                context and the people affected at the centre of every story.
              </p>
              <p>
                In a world where health information moves quickly and not every
                claim tells the whole story, accurate reporting matters. I aim to
                distinguish established evidence from uncertainty, explain the
                significance of new developments and give readers the context they
                need to understand the issues affecting their lives.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="max-w-3xl">
          <h2 className="font-serif text-2xl font-extrabold text-white sm:text-3xl">
            Editorial Approach
          </h2>
          <div className="mt-5 space-y-5 text-base leading-relaxed text-gray-secondary-light sm:text-lg">
            <p>
              Accuracy, verification, clear attribution and editorial independence
              guide my work.
            </p>
            <p>
              I seek to trace information to original research, official
              announcements, relevant documents and other reliable sources. I aim
              to represent findings accurately, acknowledge uncertainty and correct
              material errors transparently.
            </p>
            <p>
              Artificial intelligence may assist aspects of research and content
              production, but it does not replace editorial responsibility. I remain
              responsible for the material published under the Joseph Mmwa name.
            </p>
            <p>
              Read more about my{" "}
              <Link
                href="/editorial-standards"
                className="font-semibold text-accent hover:underline"
              >
                Editorial Standards
              </Link>
              ,{" "}
              <Link
                href="/corrections-and-fact-checking"
                className="font-semibold text-accent hover:underline"
              >
                Corrections & Fact-Checking Policy
              </Link>{" "}
              and{" "}
              <Link href="/ai-policy" className="font-semibold text-accent hover:underline">
                AI Policy
              </Link>{" "}
              for details of how I approach accuracy, sourcing and accountability.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

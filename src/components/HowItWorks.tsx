import { CATERING_STEPS } from "@/lib/content";
import { Reveal, Section, SectionHeading } from "@/components/ui/Section";

/**
 * Three steps, each with the honest elapsed time attached.
 *
 * The objection this answers is not "is it good" but "how much of my week does
 * this cost me" — so the duration is the loudest element in each card.
 */
export function HowItWorks() {
  return (
    <Section id="how" className="py-16 sm:py-20">
      <SectionHeading
        align="center"
        tone="bone"
        eyebrow="How catering works"
        title="Three steps, and one of them is us calling you."
      />

      <ol className="relative mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* The connector sits behind the cards and stops short of the last one,
            so it reads as a path rather than a border. */}
        <div
          aria-hidden
          className="absolute top-9 right-[16.6%] left-[16.6%] hidden h-px bg-linear-to-r from-transparent via-white/15 to-transparent md:block"
        />

        {CATERING_STEPS.map((step, index) => (
          <Reveal as="li" key={step.id} delay={index * 0.1} className="relative">
            <div className="flex flex-col items-center text-center">
              <span className="glass-bone relative z-10 grid size-[4.5rem] place-items-center rounded-full">
                <span className="font-display text-2xl font-extrabold tabular text-bone">
                  {index + 1}
                </span>
              </span>

              <span className="eyebrow mt-5 text-ember">{step.duration}</span>
              <h3 className="font-display mt-2 text-lg font-bold tracking-tight">{step.title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-400">{step.body}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

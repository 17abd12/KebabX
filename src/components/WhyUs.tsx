"use client";

import { Clock, Flame, ShieldCheck, Timer, Utensils } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { STATS, VALUE_PROPS } from "@/lib/content";
import { Reveal, Section, SectionHeading } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  flame: Flame,
  clock: Clock,
  shield: ShieldCheck,
  grill: Utensils,
  timer: Timer,
};

/**
 * Bento layout is declared here rather than in the content module: the copy is
 * editorial and should be editable without anyone reasoning about column spans.
 */
const LAYOUT: Record<string, string> = {
  spit: "sm:col-span-2 lg:col-span-7 lg:row-span-2",
  marinade: "lg:col-span-5",
  halal: "lg:col-span-5",
  charcoal: "sm:col-span-2 lg:col-span-6",
  speed: "sm:col-span-2 lg:col-span-6",
};

export function WhyUs() {
  return (
    <Section id="why" glow="ember">
      <SectionHeading
        eyebrow="Why it tastes different"
        title={
          <>
            Anyone can sell a kebab.
            <span className="text-gradient-ember"> Fewer can cook one.</span>
          </>
        }
        blurb="Five things we do that cost us time and money, and that you can taste in the first bite."
      />

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
        {VALUE_PROPS.map((prop, index) => {
          const Icon = ICONS[prop.icon] ?? Flame;
          const hasPhoto = "photo" in prop && prop.photo;

          return (
            <Reveal
              key={prop.id}
              as="article"
              delay={Math.min(index * 0.06, 0.24)}
              className={cn("group relative", LAYOUT[prop.id])}
            >
              <div className="glass-2 grain relative flex h-full flex-col overflow-hidden rounded-3xl">
                {hasPhoto && (
                  <>
                    <Image
                      src={prop.photo.src}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 100vw, 55vw"
                      placeholder="blur"
                      blurDataURL={prop.photo.blur}
                      className="object-cover opacity-60 transition-all duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-75"
                    />
                    {/* Two-stop scrim: the copy sits on near-solid ground at the
                        bottom while the photo stays legible up top. */}
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-linear-to-t from-obsidian via-obsidian/75 to-obsidian/20"
                    />
                  </>
                )}

                <div
                  className={cn(
                    "relative z-10 flex flex-1 flex-col p-6 sm:p-7",
                    hasPhoto && "justify-end",
                    prop.id === "spit" && "min-h-[22rem] sm:min-h-[26rem]",
                    prop.id === "charcoal" && "min-h-[15rem]",
                  )}
                >
                  <span className="grid size-10 place-items-center rounded-2xl bg-ember/12 ring-1 ring-ember/25">
                    <Icon className="size-5 text-ember" aria-hidden />
                  </span>

                  <h3
                    className={cn(
                      "font-display mt-4 font-bold tracking-tight text-balance",
                      prop.id === "spit" ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl",
                    )}
                  >
                    {prop.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-400">{prop.body}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* ------------------------------ Stats row ------------------------------ */}
      <Reveal delay={0.1}>
        <dl className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.id}
              className="glass rounded-3xl px-5 py-6 text-center transition-colors duration-300 hover:bg-white/6"
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="font-display text-gradient-ember block text-3xl font-extrabold tracking-tight tabular sm:text-4xl">
                  {stat.value}
                </span>
                <span className="mt-2 block text-sm font-semibold text-zinc-200">{stat.label}</span>
                <span className="mt-0.5 block text-xs text-zinc-500">{stat.sub}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}

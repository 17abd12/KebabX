"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Building2, Check, FileText, Repeat2, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { CATERING_PACKAGES, GUARANTEES, PHOTOS } from "@/lib/content";
import { QuoteBuilder } from "@/components/catering/QuoteBuilder";
import { Reveal, SectionHeading } from "@/components/ui/Section";
import { cn, formatAUD } from "@/lib/utils";

const GUARANTEE_ICON: Record<string, LucideIcon> = {
  ontime: BadgeCheck,
  headcount: Repeat2,
  dietary: Sparkles,
  terms: FileText,
};

/**
 * The B2B lane.
 *
 * Kept visually cool — bone type, hairline rules, no ember gradients on the
 * body copy — because the ember treatment that sells a Friday-night HSP works
 * against you when the reader is deciding whether to put your name on a
 * purchase order. The one place ember still appears is the price and the CTA.
 */
export function CateringSection() {
  return (
    <section id="catering" className="relative isolate scroll-mt-32 overflow-hidden py-20 sm:py-28">
      {/* Cool wash + a hairline top edge separate this from the menu above it
          without needing a hard divider. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(75%_45%_at_50%_0%,rgba(242,237,227,0.07),transparent_70%)]"
      />
      <div aria-hidden className="hairline absolute inset-x-0 top-0" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHeading
            tone="bone"
            eyebrow="For business"
            title={
              <>
                Feed the whole office
                <span className="text-gradient-bone"> without chasing anyone.</span>
              </>
            }
            blurb="Boardroom lunches, site crews, launches and end-of-year functions across Melbourne's south-east. Fixed per-head pricing, 30-day invoicing, and a delivery window we put money behind."
          />

          <Reveal delay={0.16} className="lg:pb-2">
            <div className="glass-bone flex items-center gap-3 rounded-2xl px-4 py-3">
              <Building2 className="size-5 shrink-0 text-bone-dim" aria-hidden />
              <p className="text-sm text-bone-dim">
                Already have an account?{" "}
                <a href="#quote" className="font-semibold text-bone underline underline-offset-4">
                  Reorder in 30 seconds
                </a>
              </p>
            </div>
          </Reveal>
        </div>

        {/* ------------------------------ Packages ------------------------------ */}
        <div className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {CATERING_PACKAGES.map((pkg, index) => (
            <Reveal
              key={pkg.id}
              as="article"
              delay={index * 0.08}
              className={cn("relative", pkg.recommended && "lg:-mt-4 lg:mb-4")}
            >
              <div
                className={cn(
                  "relative flex h-full flex-col overflow-hidden rounded-4xl p-6 sm:p-7",
                  pkg.recommended
                    ? "glass-2 ring-1 ring-ember/35"
                    : "glass-bone",
                )}
              >
                {pkg.recommended && (
                  <>
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(80%_100%_at_50%_0%,rgba(245,158,11,0.16),transparent_75%)]"
                    />
                    <span className="relative mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-ember px-3 py-1 text-[10px] font-extrabold tracking-wide text-obsidian uppercase">
                      <Sparkles className="size-3" aria-hidden />
                      Most booked
                    </span>
                  </>
                )}

                <h3
                  className={cn(
                    "font-display relative text-xl font-extrabold tracking-tight sm:text-2xl",
                    !pkg.recommended && "mt-0",
                  )}
                >
                  {pkg.name}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-zinc-400">{pkg.pitch}</p>

                <div className="relative mt-6 flex items-baseline gap-1.5">
                  <span
                    className={cn(
                      "font-display text-4xl font-extrabold tracking-tight tabular",
                      pkg.recommended ? "text-gradient-ember" : "text-bone",
                    )}
                  >
                    {formatAUD(pkg.perHead)}
                  </span>
                  <span className="text-sm text-zinc-500">per head</span>
                </div>
                <p className="relative mt-1 text-xs text-zinc-600">
                  Minimum {pkg.minHeads} people · GST inclusive
                </p>

                <div className="hairline relative my-6" />

                <ul className="relative flex flex-1 flex-col gap-2.5">
                  {pkg.includes.map((line) => (
                    <li key={line} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <Check
                        className={cn(
                          "mt-0.5 size-4 shrink-0",
                          pkg.recommended ? "text-ember" : "text-bone-dim",
                        )}
                        aria-hidden
                      />
                      {line}
                    </li>
                  ))}
                </ul>

                <a
                  href="#quote"
                  className={cn(
                    "relative mt-7 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]",
                    pkg.recommended
                      ? "bg-linear-to-r from-ember to-gold text-obsidian shadow-ember"
                      : "border border-white/14 bg-white/5 text-zinc-100 hover:bg-white/10",
                  )}
                >
                  Price {pkg.name}
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ----------------------------- Guarantees ----------------------------- */}
        <div className="mt-16">
          <Reveal>
            <h3 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
              What we put in writing
            </h3>
          </Reveal>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GUARANTEES.map((g, index) => {
              const Icon = GUARANTEE_ICON[g.id] ?? BadgeCheck;
              return (
                <Reveal as="li" key={g.id} delay={index * 0.06}>
                  <div className="glass-bone h-full rounded-3xl p-5">
                    <Icon className="size-5 text-bone" aria-hidden />
                    <h4 className="mt-3.5 text-sm font-bold text-bone">{g.title}</h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{g.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>

        {/* --------------------------- Quote builder ---------------------------- */}
        <div id="quote" className="mt-16 scroll-mt-32">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <Reveal>
              <div className="relative">
                <h3 className="font-display text-2xl font-extrabold tracking-tight text-balance sm:text-3xl">
                  Get a real number in thirty seconds.
                </h3>
                <p className="mt-3 text-base leading-relaxed text-zinc-400">
                  No &ldquo;contact us for pricing&rdquo;. Move the slider, pick a package, and the
                  figure you see is the figure we quote — then we call to confirm the details.
                </p>

                <ul className="mt-6 space-y-2.5">
                  {[
                    "Delivery and setup within 10km included",
                    "Serving gear dropped off and collected next day",
                    "Dietary trays labelled by name, not by guesswork",
                    "Tax invoice with your PO reference on 30-day terms",
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <Check className="mt-0.5 size-4 shrink-0 text-bone-dim" aria-hidden />
                      {line}
                    </li>
                  ))}
                </ul>

                <div className="relative mt-8 hidden overflow-hidden rounded-4xl lg:block">
                  <Image
                    src={PHOTOS.mezze.src}
                    alt={PHOTOS.mezze.alt}
                    width={PHOTOS.mezze.width}
                    height={PHOTOS.mezze.height}
                    placeholder="blur"
                    blurDataURL={PHOTOS.mezze.blur}
                    sizes="(max-width: 1024px) 0px, 32vw"
                    className="h-56 w-full object-cover"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-linear-to-t from-obsidian via-obsidian/40 to-transparent"
                  />
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="absolute inset-x-5 bottom-4 text-sm font-semibold text-zinc-200"
                  >
                    Grazing tables, chafing dishes and pack-down included from the Feast up.
                  </motion.p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <QuoteBuilder />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

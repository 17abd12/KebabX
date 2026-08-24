"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useState } from "react";
import { TESTIMONIALS } from "@/lib/content";
import { STORE } from "@/lib/data";
import { Reveal, Section, SectionHeading } from "@/components/ui/Section";
import { cn } from "@/lib/utils";
import type { Audience } from "@/types";

const TABS: { key: Audience; label: string }[] = [
  { key: "b2c", label: "Locals" },
  { key: "b2b", label: "Businesses" },
];

export function Testimonials() {
  const [tab, setTab] = useState<Audience>("b2c");
  const shown = TESTIMONIALS.filter((t) => t.audience === tab);

  return (
    <Section id="reviews" glow="ember">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="What people say"
          title={
            <>
              {STORE.rating}★ across {STORE.reviews} reviews
              <span className="text-gradient-ember"> — and a few repeat offenders.</span>
            </>
          }
        />

        {/* Two audiences, one section: a procurement lead does not want to read
            about someone's Friday-night HSP, and vice versa. */}
        <Reveal delay={0.1}>
          {/* Deliberately not an ARIA tablist: there is no tabpanel and no
              arrow-key roving focus here, and claiming the tab pattern without
              those makes the control worse for screen readers than a plain
              group of toggle buttons. */}
          <div role="group" aria-label="Review audience" className="glass flex gap-1 rounded-full p-1">
            {TABS.map((t) => {
              const selected = t.key === tab;
              return (
                <button
                  key={t.key}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-200",
                    selected ? "text-obsidian" : "text-zinc-400 hover:text-zinc-100",
                  )}
                >
                  {selected && (
                    <motion.span
                      layoutId="review-tab"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                      className="absolute inset-0 -z-10 rounded-full bg-linear-to-r from-ember to-gold"
                    />
                  )}
                  {t.label}
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((t, index) => (
            <motion.figure
              key={t.id}
              layout
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="glass-2 relative flex flex-col rounded-3xl p-6"
            >
              <Quote className="size-6 text-ember/35" aria-hidden />

              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-zinc-200">
                {t.quote}
              </blockquote>

              <figcaption className="mt-6 flex items-center justify-between gap-3 border-t border-white/8 pt-4">
                <div>
                  <p className="text-sm font-bold text-zinc-100">{t.name}</p>
                  <p className="text-xs text-zinc-500">{t.context}</p>
                </div>
                <div role="img" className="flex gap-0.5" aria-label={`Rated ${t.rating} out of 5`}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      aria-hidden
                      className={cn(
                        "size-3.5",
                        star <= t.rating ? "fill-gold text-gold" : "text-zinc-700",
                      )}
                    />
                  ))}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </AnimatePresence>
      </div>

      <p className="mt-6 text-xs text-zinc-600">
        Sample reviews shown on this demo storefront. Star rating and review count reflect the
        store&apos;s public Google listing.
      </p>
    </Section>
  );
}

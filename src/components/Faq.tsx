"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Phone, Plus } from "lucide-react";
import { useState } from "react";
import { FAQS } from "@/lib/content";
import { STORE } from "@/lib/data";
import { Reveal, Section, SectionHeading } from "@/components/ui/Section";
import { cn } from "@/lib/utils";
import type { Audience } from "@/types";

const telHref = `tel:${STORE.phone.replace(/[\s()]/g, "")}`;

type Filter = Audience | "all";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Everything" },
  { key: "b2c", label: "Ordering" },
  { key: "b2b", label: "Catering" },
];

export function Faq() {
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(FAQS[0].id);

  const shown = FAQS.filter((f) => filter === "all" || f.audience === filter || f.audience === "both");

  return (
    <Section id="faq" className="py-16 sm:py-24">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Questions"
            title="The things people ask before they order."
            blurb="If the answer you need is not here, the phone is answered by someone standing next to the grill."
          />

          <Reveal delay={0.14}>
            <div className="mt-8 flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  aria-pressed={filter === f.key}
                  className={cn(
                    "rounded-full border px-4 py-2 text-xs font-semibold transition-colors duration-200",
                    filter === f.key
                      ? "border-ember/50 bg-ember/15 text-ember"
                      : "border-white/10 bg-white/3 text-zinc-400 hover:border-white/25 hover:text-zinc-100",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="glass mt-8 rounded-3xl p-5">
              <p className="text-sm font-bold text-zinc-100">Still stuck?</p>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                Ring the shop between 11am and 11pm. For catering, ask for the quote you generated
                and we will pull it up.
              </p>
              <a
                href={telHref}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/8 px-4 py-2.5 text-xs font-bold text-zinc-100 transition-colors hover:bg-white/14"
              >
                <Phone className="size-3.5 text-ember" aria-hidden />
                {STORE.phone}
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <ul className="divide-y divide-white/8 border-y border-white/8">
            {shown.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <li key={faq.id}>
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : faq.id)}
                      aria-expanded={isOpen}
                      aria-controls={`${faq.id}-panel`}
                      className="group flex w-full items-start justify-between gap-6 py-5 text-left"
                    >
                      <span
                        className={cn(
                          "text-base font-semibold transition-colors sm:text-lg",
                          isOpen ? "text-ember" : "text-zinc-100 group-hover:text-ember",
                        )}
                      >
                        {faq.question}
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border transition-colors",
                          isOpen
                            ? "border-ember/50 bg-ember/15 text-ember"
                            : "border-white/12 text-zinc-500 group-hover:border-white/25 group-hover:text-zinc-200",
                        )}
                      >
                        {isOpen ? <Minus className="size-3.5" /> : <Plus className="size-3.5" />}
                      </span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`${faq.id}-panel`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pr-10 pb-6 text-sm leading-relaxed text-zinc-400">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}

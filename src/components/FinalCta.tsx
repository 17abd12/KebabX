"use client";

import { ArrowRight, Building2, Flame } from "lucide-react";
import Image from "next/image";
import { PHOTOS } from "@/lib/content";
import { STORE } from "@/lib/data";
import { useCartStore } from "@/lib/store";
import { Reveal } from "@/components/ui/Section";

/**
 * The last block on the page, and the only one that offers both doors at equal
 * weight. Everything above this point has already sorted the reader into a
 * lane; forcing a single CTA here would make one of them bounce.
 */
export function FinalCta() {
  const setActiveCategory = useCartStore((s) => s.setActiveCategory);

  return (
    <section className="relative isolate overflow-hidden py-20 sm:py-28">
      <Image
        src={PHOTOS.charcoal.src}
        alt=""
        fill
        sizes="100vw"
        placeholder="blur"
        blurDataURL={PHOTOS.charcoal.blur}
        className="-z-20 object-cover opacity-25"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-obsidian via-obsidian/85 to-obsidian"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_50%_50%,rgba(245,158,11,0.14),transparent_70%)]"
      />

      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="font-display text-3xl leading-[1.06] font-extrabold tracking-tight text-balance sm:text-5xl">
            The grill is already on.
            <span className="text-gradient-ember block">Pick your door.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mx-auto mt-5 max-w-xl text-base text-pretty text-zinc-400 sm:text-lg">
            One kebab or one hundred and twenty. Same charcoal, same 12-hour marinade, same people
            behind the counter at {STORE.shortAddress}.
          </p>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
            <a
              href="#menu"
              onClick={() => setActiveCategory("all")}
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-linear-to-r from-ember to-gold px-8 py-4 text-sm font-bold text-obsidian shadow-ember transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
            >
              <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <Flame className="size-4" aria-hidden />
              Order for tonight
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </a>

            <a
              href="#quote"
              className="glass-bone inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-bold text-bone transition-colors duration-200 hover:bg-white/10"
            >
              <Building2 className="size-4" aria-hidden />
              Price a catering order
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.22}>
          <p className="mt-6 text-xs text-zinc-600">
            Pickup {STORE.pickupEta} · Delivery {STORE.deliveryEta} · Catering from 48 hours notice
          </p>
        </Reveal>
      </div>
    </section>
  );
}

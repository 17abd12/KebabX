"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { ArrowRight, Building2, Flame, Leaf, ShieldCheck, Star, Timer } from "lucide-react";
import { MENU, STORE } from "@/lib/data";
import { useCartStore } from "@/lib/store";
import { OrderTypeSwitcher } from "@/components/OrderTypeSwitcher";
import Image from "next/image";
import { PHOTOS } from "@/lib/content";
import { TiltCard } from "@/components/TiltCard";
import { formatAUD } from "@/lib/utils";

// WebGL only exists in the browser, and the hero must paint without it.
const HeroCanvas = dynamic(() => import("@/components/HeroCanvas"), { ssr: false });

/** The showcase dish. Lamb doner, because it is the one item we have a
 *  real, well-lit photograph of — a hero shot has to be the strongest image
 *  on the site, not the highest-margin dish. */
const HERO_ITEM = MENU.find((i) => i.id === "lamb-doner") ?? MENU[0];

const TRUST = [
  { icon: ShieldCheck, label: "100% Halal Certified" },
  { icon: Timer, label: `Ready in ${STORE.pickupEta}` },
  { icon: Leaf, label: "Veg & vegan options" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export function Hero() {
  const setActiveCategory = useCartStore((s) => s.setActiveCategory);
  const openCustomize = useCartStore((s) => s.openCustomize);

  const goToMenu = (category: "all" | "hsp") => {
    setActiveCategory(category);
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="top" className="relative isolate overflow-hidden pt-24 pb-12 sm:pt-32 sm:pb-16">
      {/* Ambient ember field */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <HeroCanvas />
      </div>

      {/* Static radial glows keep the section alive before/without WebGL */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(245,158,11,0.16),transparent_70%),radial-gradient(40%_40%_at_85%_60%,rgba(234,88,12,0.12),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-20 h-40 bg-linear-to-t from-obsidian to-transparent"
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:px-8">
        {/* -------------------------------- Copy -------------------------------- */}
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.07, delayChildren: 0.05 }}
          className="text-center lg:text-left"
        >
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="glass mx-auto inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-zinc-300 lg:mx-0"
          >
            <Star className="size-3.5 fill-gold text-gold" aria-hidden />
            <span className="font-semibold text-zinc-100 tabular">{STORE.rating}</span>
            <span className="text-zinc-500 tabular">({STORE.reviews} reviews)</span>
            <span className="hidden text-zinc-700 sm:inline">|</span>
            <span className="hidden sm:inline">{STORE.address}</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="font-display mt-5 text-[2.6rem] leading-[1.03] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl xl:text-[4.25rem]"
          >
            Elevated Street Food.
            <span className="text-gradient-ember block">Grilled to Perfection.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto mt-4 max-w-xl text-base text-pretty text-zinc-400 sm:text-lg lg:mx-0"
          >
            Twelve-hour marinades, charcoal skewers and snack packs built the proper way — carved
            to order at {STORE.shortAddress}. Pickup or delivery across {STORE.suburb}.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <button
              type="button"
              onClick={() => goToMenu("all")}
              className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-linear-to-r from-ember to-gold px-7 py-3.5 text-sm font-bold text-obsidian shadow-ember transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] sm:w-auto"
            >
              <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              Order Now
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </button>

            <button
              type="button"
              onClick={() => goToMenu("hsp")}
              className="glass inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-zinc-100 transition-colors duration-200 hover:border-ember/40 hover:bg-ember/10 sm:w-auto"
            >
              <Flame className="size-4 text-ember" aria-hidden />
              View Signature HSPs
            </button>
          </motion.div>

          <motion.ul
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start"
          >
            {TRUST.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-1.5 text-xs text-zinc-400">
                <Icon className="size-3.5 text-ember" aria-hidden />
                {label}
              </li>
            ))}
          </motion.ul>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-5 flex justify-center lg:justify-start"
          >
            <OrderTypeSwitcher />
          </motion.div>

          {/* The B2B door, placed above the fold on desktop. A catering buyer who
              has to scroll past a consumer menu to find you often does not. */}
          <motion.a
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            href="#catering"
            className="glass-bone group mx-auto mt-6 flex w-full max-w-md items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors duration-200 hover:bg-white/8 lg:mx-0"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/6 ring-1 ring-white/12">
              <Building2 className="size-4 text-bone" aria-hidden />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-bold text-bone">Feeding a team?</span>
              <span className="block text-xs text-bone-dim">
                Per-head catering from $18.50 · 30-day invoicing
              </span>
            </span>
            <ArrowRight
              className="size-4 shrink-0 text-bone-dim transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </motion.a>
        </motion.div>

        {/* ----------------------------- 3D showcase ---------------------------- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 32 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="animate-float-slow">
            <TiltCard intensity={11} lift={22}>
              <div className="glow-border glass-2 relative overflow-hidden rounded-4xl p-2.5">
                {/* The frame matches the hero crop's 3:2 aspect exactly. A taller
                    frame crops into the filling and shows a close-up of onion
                    rather than a kebab. */}
                <div className="relative aspect-3/2 overflow-hidden rounded-3xl bg-obsidian-700">
                  {/* The store's own photograph, filling the frame. A
                      background-removed cutout floated here previously; the
                      source has soft white sauce against a white bench, so the
                      matte left a halo that read as a bad clipping job on the
                      most important image on the site. */}
                  <Image
                    src={PHOTOS.heroDoner.src}
                    alt={PHOTOS.heroDoner.alt}
                    fill
                    priority
                    placeholder="blur"
                    blurDataURL={PHOTOS.heroDoner.blur}
                    sizes="(max-width: 1024px) 90vw, 46vw"
                    className="object-cover"
                  />

                  {/* Warm grade: the source is lit cool on marble, and dropping
                      it straight onto an ember page reads as a pasted-in stock
                      photo until the whites are pulled toward the palette. */}
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_40%,rgba(245,158,11,0.28),transparent_78%)] mix-blend-soft-light"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_45%,transparent_50%,rgba(9,8,10,0.55)_100%)]"
                  />

                  <div
                    className="absolute top-3.5 left-3.5 flex items-center gap-1.5 rounded-full bg-obsidian/75 px-3 py-1.5 text-[11px] font-bold text-ember backdrop-blur-md"
                    style={{ transform: "translateZ(50px)" }}
                  >
                    <Flame className="size-3.5" aria-hidden />
                    HOUSE FAVOURITE
                  </div>
                </div>

                {/* Caption sits on the glass rather than on the photo: the shot
                    is bright and busy edge to edge, and any scrim heavy enough
                    to make white text safe on it kills the food. */}
                <div
                  className="px-4 pt-5 pb-3"
                  style={{ transform: "translateZ(40px)" }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-display text-2xl font-extrabold tracking-tight text-balance">
                      {HERO_ITEM.name}
                    </h2>
                    <span className="mt-0.5 shrink-0 rounded-full bg-ember px-3 py-1.5 text-xs font-extrabold text-obsidian tabular">
                      {formatAUD(HERO_ITEM.price)}
                    </span>
                  </div>

                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-400">
                    {HERO_ITEM.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => openCustomize(HERO_ITEM.id)}
                      className="group/build inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-ember to-gold px-5 py-2.5 text-xs font-bold text-obsidian shadow-ember transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
                    >
                      Build yours
                      <ArrowRight
                        className="size-3.5 transition-transform group-hover/build:translate-x-0.5"
                        aria-hidden
                      />
                    </button>
                    <span className="text-[11px] text-zinc-500">
                      Carved to order · Ready in {STORE.pickupEta}
                    </span>
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

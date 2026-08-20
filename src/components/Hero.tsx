"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { ArrowRight, Flame, Leaf, ShieldCheck, Star, Timer } from "lucide-react";
import { MENU, STORE } from "@/lib/data";
import { useCartStore } from "@/lib/store";
import { OrderTypeSwitcher } from "@/components/OrderTypeSwitcher";
import { SafeImage } from "@/components/SafeImage";
import { TiltCard } from "@/components/TiltCard";
import { formatAUD } from "@/lib/utils";

// WebGL only exists in the browser, and the hero must paint without it.
const HeroCanvas = dynamic(() => import("@/components/HeroCanvas"), { ssr: false });

const HERO_ITEM = MENU.find((i) => i.id === "classic-hsp") ?? MENU[0];

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
    <section id="top" className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
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
          transition={{ staggerChildren: 0.08, delayChildren: 0.05 }}
          className="text-center lg:text-left"
        >
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="glass mx-auto inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-zinc-300 lg:mx-0"
          >
            <Star className="size-3.5 fill-gold text-gold" aria-hidden />
            <span className="font-semibold text-zinc-100">{STORE.rating}</span>
            <span className="text-zinc-500">({STORE.reviews} reviews)</span>
            <span className="text-zinc-700">|</span>
            <span>{STORE.address}</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="font-display mt-6 text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            Elevated Street Food.
            <span className="text-gradient-ember block">Grilled to Perfection.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto mt-5 max-w-xl text-base text-pretty text-zinc-400 sm:text-lg lg:mx-0"
          >
            Twelve-hour marinades, charcoal skewers and snack packs built the proper way — carved
            to order at {STORE.shortAddress}. Pickup or delivery across {STORE.suburb}.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
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
            className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start"
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
            className="mt-8 flex justify-center lg:justify-start"
          >
            <OrderTypeSwitcher />
          </motion.div>
        </motion.div>

        {/* ----------------------------- 3D showcase ---------------------------- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 32 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="animate-float-slow">
            <TiltCard intensity={13} lift={24}>
              <div className="glow-border glass-strong relative overflow-hidden rounded-4xl p-3 shadow-lift">
                <div className="relative aspect-4/5 overflow-hidden rounded-[1.5rem] sm:aspect-square lg:aspect-4/5">
                  <SafeImage
                    src={HERO_ITEM.image}
                    alt={HERO_ITEM.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 90vw, 45vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-obsidian via-obsidian/25 to-transparent" />

                  {/* Floating depth chips */}
                  <div
                    className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-obsidian/70 px-3 py-1.5 text-[11px] font-bold text-ember backdrop-blur-md"
                    style={{ transform: "translateZ(50px)" }}
                  >
                    <Flame className="size-3.5" aria-hidden />
                    HOUSE FAVOURITE
                  </div>
                  <div
                    className="absolute top-4 right-4 rounded-full bg-ember px-3 py-1.5 text-[11px] font-extrabold text-obsidian"
                    style={{ transform: "translateZ(50px)" }}
                  >
                    {formatAUD(HERO_ITEM.price)}
                  </div>

                  <div
                    className="absolute inset-x-4 bottom-4"
                    style={{ transform: "translateZ(40px)" }}
                  >
                    <h2 className="font-display text-2xl font-extrabold tracking-tight">
                      {HERO_ITEM.name}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-300">
                      {HERO_ITEM.description}
                    </p>
                    <button
                      type="button"
                      onClick={() => openCustomize(HERO_ITEM.id)}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-zinc-100 backdrop-blur-md transition-colors hover:bg-ember hover:text-obsidian"
                    >
                      Build yours
                      <ArrowRight className="size-3.5" aria-hidden />
                    </button>
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

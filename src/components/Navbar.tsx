"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Flame, MapPin, ShoppingCart, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { STORE } from "@/lib/data";
import { computeTotals, useCartStore } from "@/lib/store";
import { OrderTypeSwitcher } from "@/components/OrderTypeSwitcher";
import { cn, formatAUD } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 24));

  const items = useCartStore((s) => s.items);
  const orderType = useCartStore((s) => s.orderType);
  const openCart = useCartStore((s) => s.openCart);
  const hasHydrated = useCartStore((s) => s.hasHydrated);

  const totals = useMemo(() => computeTotals(items, orderType), [items, orderType]);
  // Cart contents come from localStorage, so hold the badge until rehydration
  // to keep the server and first client render identical.
  const count = hasHydrated ? totals.itemCount : 0;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass-strong shadow-lift" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:h-20 sm:gap-6 sm:px-6 lg:px-8">
        {/* Brand */}
        <a href="#top" className="group flex shrink-0 items-center gap-2.5">
          <span className="relative grid size-9 place-items-center rounded-xl bg-linear-to-br from-ember to-flame shadow-ember sm:size-10">
            <Flame className="size-5 text-obsidian" aria-hidden />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-extrabold tracking-tight sm:text-xl">
              Kebab<span className="text-gradient-ember"> X</span>
            </span>
            <span className="mt-0.5 hidden text-[10px] font-medium tracking-[0.18em] text-zinc-500 uppercase sm:block">
              {STORE.suburb}
            </span>
          </span>
        </a>

        {/* Store status */}
        <div className="hidden items-center gap-2 lg:flex">
          <span className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-zinc-300">
            <MapPin className="size-3.5 text-ember" aria-hidden />
            {STORE.region}
          </span>
          <span className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-zinc-300">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            Open Now
            <span className="text-zinc-600">•</span>
            <Star className="size-3.5 fill-gold text-gold" aria-hidden />
            {STORE.rating}
            <span className="text-zinc-500">({STORE.reviews} reviews)</span>
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <OrderTypeSwitcher size="compact" showEta={false} className="hidden md:flex" />

          <button
            type="button"
            onClick={openCart}
            aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
            className="group glass relative flex items-center gap-2 rounded-full py-2 pr-3 pl-3 text-sm font-semibold transition-all duration-200 hover:border-ember/40 hover:bg-ember/10 sm:pr-4"
          >
            <ShoppingCart className="size-4.5 text-ember transition-transform group-hover:scale-110" aria-hidden />
            <span className="hidden tabular-nums sm:inline">
              {count > 0 ? formatAUD(totals.total) : "Cart"}
            </span>
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 18 }}
                className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-linear-to-br from-ember to-flame text-[11px] font-bold text-obsidian"
              >
                {count > 99 ? "99+" : count}
              </motion.span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

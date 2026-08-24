"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Flame, MapPin, Menu, Phone, ShoppingCart, Star, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { STORE } from "@/lib/data";
import { computeTotals, useCartStore } from "@/lib/store";
import { OrderTypeSwitcher } from "@/components/OrderTypeSwitcher";
import { cn, formatAUD } from "@/lib/utils";

const LINKS = [
  { href: "#menu", label: "Menu" },
  { href: "#why", label: "Why us" },
  { href: "#catering", label: "Catering" },
  { href: "#visit", label: "Visit" },
  { href: "#faq", label: "FAQ" },
];

const telHref = `tel:${STORE.phone.replace(/[\s()]/g, "")}`;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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

  // The sheet is a full-viewport overlay; leaving the page scrollable behind it
  // lets a stray touch drag the content out from under the menu.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled || menuOpen ? "glass-strong shadow-lift" : "bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:h-20 sm:gap-5 sm:px-6 lg:px-8">
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

          {/* Primary nav */}
          <nav aria-label="Sections" className="ml-2 hidden items-center gap-1 lg:flex">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-2 text-sm font-semibold text-zinc-400 transition-colors duration-200 hover:bg-white/6 hover:text-zinc-100"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <span className="glass hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-zinc-300 xl:flex">
              <Star className="size-3.5 fill-gold text-gold" aria-hidden />
              {STORE.rating}
              <span className="text-zinc-500">({STORE.reviews})</span>
            </span>

            <OrderTypeSwitcher size="compact" showEta={false} className="hidden md:flex" />

            <a
              href="#quote"
              className="glass-bone hidden rounded-full px-4 py-2 text-sm font-bold text-bone transition-colors duration-200 hover:bg-white/10 lg:inline-flex"
            >
              Catering quote
            </a>

            <button
              type="button"
              onClick={openCart}
              aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
              className="group glass relative flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-all duration-200 hover:border-ember/40 hover:bg-ember/10 sm:pr-4"
            >
              <ShoppingCart
                className="size-4.5 text-ember transition-transform group-hover:scale-110"
                aria-hidden
              />
              <span className="hidden tabular sm:inline">
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

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="glass grid size-10 place-items-center rounded-full text-zinc-200 lg:hidden"
            >
              {menuOpen ? <X className="size-4.5" aria-hidden /> : <Menu className="size-4.5" aria-hidden />}
            </button>
          </div>
        </div>
      </header>

      {/* ----------------------------- Mobile sheet ---------------------------- */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-16 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
              aria-hidden
            />
            <motion.nav
              aria-label="Sections"
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="glass-strong relative mx-4 mt-3 rounded-4xl p-4"
            >
              <ul className="flex flex-col">
                {LINKS.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 + index * 0.04 }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block border-b border-white/6 py-3.5 text-base font-semibold text-zinc-200 transition-colors hover:text-ember"
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-4 flex flex-col gap-2.5">
                <a
                  href="#quote"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-ember to-gold px-5 py-3 text-sm font-bold text-obsidian"
                >
                  Get a catering quote
                </a>
                <a
                  href={telHref}
                  className="glass inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-zinc-100"
                >
                  <Phone className="size-4 text-ember" aria-hidden />
                  {STORE.phone}
                </a>
                <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-zinc-500">
                  <MapPin className="size-3.5 text-ember" aria-hidden />
                  {STORE.address}
                </p>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

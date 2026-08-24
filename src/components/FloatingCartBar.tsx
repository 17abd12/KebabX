"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { useMemo } from "react";
import { STORE } from "@/lib/data";
import { computeTotals, useCartStore } from "@/lib/store";
import { formatAUD } from "@/lib/utils";

/**
 * Mobile-only order bar. The desktop trigger lives in the navbar, but on small
 * screens the cart needs to stay within thumb reach.
 */
export function FloatingCartBar() {
  const items = useCartStore((s) => s.items);
  const orderType = useCartStore((s) => s.orderType);
  const openCart = useCartStore((s) => s.openCart);
  const cartOpen = useCartStore((s) => s.cartOpen);
  const hasHydrated = useCartStore((s) => s.hasHydrated);

  const totals = useMemo(() => computeTotals(items, orderType), [items, orderType]);
  const visible = hasHydrated && totals.itemCount > 0 && !cartOpen;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="pb-safe fixed inset-x-0 bottom-0 z-50 px-4 pt-4 md:hidden"
        >
          <button
            type="button"
            onClick={openCart}
            className="glass-strong flex w-full items-center gap-3 rounded-full py-2.5 pr-2.5 pl-4 shadow-lift"
          >
            <span className="relative grid size-9 shrink-0 place-items-center rounded-full bg-ember/15">
              <ShoppingCart className="size-4.5 text-ember" aria-hidden />
              <span className="absolute -top-1 -right-1 grid size-4.5 place-items-center rounded-full bg-ember text-[10px] font-bold text-obsidian">
                {totals.itemCount > 9 ? "9+" : totals.itemCount}
              </span>
            </span>
            <span className="flex-1 text-left">
              <span className="block text-sm font-bold text-zinc-100">View order</span>
              <span className="block text-[11px] text-zinc-500">
                {orderType === "pickup" ? STORE.pickupEta : STORE.deliveryEta}
              </span>
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-linear-to-r from-ember to-gold px-4 py-2.5 text-sm font-bold text-obsidian tabular-nums">
              {formatAUD(totals.total)}
              <ArrowRight className="size-4" aria-hidden />
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

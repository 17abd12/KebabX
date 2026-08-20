"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bike, Clock, ShoppingBag } from "lucide-react";
import { useId } from "react";
import { STORE } from "@/lib/data";
import { useCartStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { OrderType } from "@/types";

const MODES: {
  value: OrderType;
  label: string;
  sub: string;
  eta: string;
  icon: typeof ShoppingBag;
}[] = [
  {
    value: "pickup",
    label: "Pickup",
    sub: STORE.shortAddress,
    eta: STORE.pickupEta,
    icon: ShoppingBag,
  },
  {
    value: "delivery",
    label: "Delivery",
    sub: `${STORE.suburb} & nearby`,
    eta: STORE.deliveryEta,
    icon: Bike,
  },
];

interface Props {
  /** "full" shows the address sub-label; "compact" fits the mobile nav. */
  size?: "full" | "compact";
  className?: string;
  showEta?: boolean;
}

export function OrderTypeSwitcher({ size = "full", className, showEta = true }: Props) {
  const orderType = useCartStore((s) => s.orderType);
  const setOrderType = useCartStore((s) => s.setOrderType);
  const layoutId = useId();

  const active = MODES.find((m) => m.value === orderType) ?? MODES[0];

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div
        role="radiogroup"
        aria-label="Order type"
        className="glass relative flex items-center gap-1 rounded-full p-1"
      >
        {MODES.map((mode) => {
          const selected = mode.value === orderType;
          const Icon = mode.icon;
          return (
            <button
              key={mode.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setOrderType(mode.value)}
              className={cn(
                "relative z-10 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200",
                size === "full" ? "sm:px-5 sm:py-2.5" : "px-3 py-1.5 text-xs",
                selected ? "text-obsidian" : "text-zinc-400 hover:text-zinc-100",
              )}
            >
              {selected && (
                <motion.span
                  layoutId={layoutId}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 -z-10 rounded-full bg-linear-to-r from-ember to-gold shadow-ember"
                />
              )}
              <Icon className={cn(size === "full" ? "size-4" : "size-3.5")} aria-hidden />
              <span className="flex flex-col items-start leading-none">
                <span>{mode.label}</span>
                {size === "full" && (
                  <span
                    className={cn(
                      "mt-0.5 hidden text-[10px] font-medium sm:block",
                      selected ? "text-obsidian/70" : "text-zinc-500",
                    )}
                  >
                    {mode.sub}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {showEta && (
        <div className="flex h-5 items-center gap-1.5 text-xs text-zinc-400">
          <Clock className="size-3.5 text-ember" aria-hidden />
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={active.value}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              aria-live="polite"
            >
              {active.value === "pickup" ? "Ready in " : "Delivered in "}
              <span className="font-semibold text-zinc-100">{active.eta}</span>
            </motion.span>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

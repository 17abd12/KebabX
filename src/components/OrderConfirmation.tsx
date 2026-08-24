"use client";

import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Bike, Check, ChefHat, MapPin, Phone, Receipt, ShoppingBag, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { STORE } from "@/lib/data";
import { useCartStore } from "@/lib/store";
import { useDialog } from "@/lib/useDialog";
import { cn, formatAUD, formatClock } from "@/lib/utils";
import type { OrderStage, PlacedOrder } from "@/types";

/** Demo pacing: the real shop takes minutes, the timeline takes seconds. */
const STAGE_TIMINGS: { stage: OrderStage; at: number; label: string; blurb: string; icon: typeof Check }[] =
  [
    {
      stage: "received",
      at: 0,
      label: "Received",
      blurb: "The shop has your order.",
      icon: Receipt,
    },
    {
      stage: "grilling",
      at: 4200,
      label: "Grilling",
      blurb: "On the charcoal now.",
      icon: ChefHat,
    },
    {
      stage: "ready",
      at: 11000,
      label: "Ready",
      blurb: "Wrapped and waiting.",
      icon: Check,
    },
  ];

function fireConfetti() {
  const colors = ["#f59e0b", "#eab308", "#ea580c", "#fef3c7"];
  confetti({ particleCount: 70, spread: 68, origin: { y: 0.62 }, colors, scalar: 0.9 });
  window.setTimeout(
    () => confetti({ particleCount: 45, angle: 60, spread: 55, origin: { x: 0, y: 0.68 }, colors }),
    180,
  );
  window.setTimeout(
    () => confetti({ particleCount: 45, angle: 120, spread: 55, origin: { x: 1, y: 0.68 }, colors }),
    300,
  );
}

function Timeline({ stageIndex }: { stageIndex: number }) {
  return (
    <ol className="relative mt-6 space-y-5">
      {/* Track */}
      <span aria-hidden className="absolute top-2 bottom-2 left-[15px] w-px bg-white/10" />
      <motion.span
        aria-hidden
        className="absolute top-2 left-[15px] w-px bg-linear-to-b from-ember to-gold"
        initial={{ height: 0 }}
        animate={{ height: `${(stageIndex / (STAGE_TIMINGS.length - 1)) * 100}%` }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {STAGE_TIMINGS.map((step, index) => {
        const done = index < stageIndex;
        const active = index === stageIndex;
        const Icon = step.icon;
        return (
          <li key={step.stage} className="relative flex items-start gap-4 pl-0">
            <span
              className={cn(
                "relative z-10 grid size-8 shrink-0 place-items-center rounded-full border transition-colors duration-500",
                done || active
                  ? "border-ember bg-linear-to-br from-ember to-gold text-obsidian"
                  : "border-white/12 bg-obsidian text-zinc-600",
                active && "animate-pulse-ring",
              )}
            >
              <Icon className="size-4" aria-hidden strokeWidth={2.6} />
            </span>
            <div className="pt-0.5">
              <p
                className={cn(
                  "text-sm font-bold transition-colors duration-500",
                  done || active ? "text-zinc-100" : "text-zinc-600",
                )}
              >
                {step.label}
                {active && <span className="ml-2 text-[11px] font-semibold text-ember">now</span>}
              </p>
              <p className="text-xs text-zinc-500">{step.blurb}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function ConfirmationBody({ order, onClose }: { order: PlacedOrder; onClose: () => void }) {
  const [stageIndex, setStageIndex] = useState(0);
  const delivery = order.orderType === "delivery";

  useEffect(() => {
    fireConfetti();
    const timers = STAGE_TIMINGS.slice(1).map((step, i) =>
      window.setTimeout(() => setStageIndex(i + 1), step.at),
    );
    return () => timers.forEach(window.clearTimeout);
  }, []);

  const readyAt = order.placedAt + order.etaMinutes * 60_000;

  return (
    <>
      <div className="relative shrink-0 overflow-hidden px-6 pt-8 pb-6 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_0%,rgba(245,158,11,0.22),transparent_70%)]"
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 grid size-9 place-items-center rounded-full text-zinc-500 transition-colors hover:bg-white/10 hover:text-zinc-100"
        >
          <X className="size-4.5" aria-hidden />
        </button>

        <motion.span
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
          className="mx-auto grid size-16 place-items-center rounded-2xl bg-linear-to-br from-ember to-flame shadow-ember"
        >
          <Check className="size-8 text-obsidian" strokeWidth={3} aria-hidden />
        </motion.span>

        <h2 id="confirm-title" className="font-display mt-5 text-2xl font-extrabold tracking-tight">
          Order confirmed
        </h2>
        <p className="mt-1.5 text-sm text-zinc-400">
          Thanks {order.customer.name.split(" ")[0] || "mate"} — we are on it.
        </p>

        <div className="glass mx-auto mt-5 flex max-w-sm items-center justify-between gap-4 rounded-2xl px-4 py-3 text-left">
          <div>
            <p className="text-[10px] tracking-[0.16em] text-zinc-500 uppercase">Reference</p>
            <p className="font-display text-lg font-extrabold text-ember">{order.reference}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] tracking-[0.16em] text-zinc-500 uppercase">
              {delivery ? "Arrives" : "Ready"}
            </p>
            <p className="font-display text-lg font-extrabold">{formatClock(readyAt)}</p>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-2">
        <Timeline stageIndex={stageIndex} />

        <div className="mt-7 rounded-2xl border border-white/8 bg-white/[0.025] p-4">
          <p className="flex items-center gap-2 text-xs font-bold tracking-wide text-zinc-300 uppercase">
            {delivery ? (
              <Bike className="size-4 text-ember" aria-hidden />
            ) : (
              <ShoppingBag className="size-4 text-ember" aria-hidden />
            )}
            {delivery ? "Delivering to" : "Collect from"}
          </p>
          <p className="mt-2 text-sm text-zinc-300">
            {delivery
              ? `${order.customer.address}, ${order.customer.suburb || STORE.suburb} VIC`
              : STORE.address}
          </p>
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-zinc-500">
            <Phone className="size-3.5" aria-hidden />
            {order.customer.phone}
          </p>
          {!delivery && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-zinc-500">
              <MapPin className="size-3.5" aria-hidden />
              Ask for reference {order.reference} at the counter
            </p>
          )}
          {order.customer.notes && (
            <p className="mt-2 text-xs text-ember/80 italic">
              &ldquo;{order.customer.notes}&rdquo;
            </p>
          )}
        </div>

        <ul className="mt-4 space-y-2">
          {order.items.map((line) => (
            <li key={line.lineId} className="flex items-start justify-between gap-3 text-sm">
              <span className="min-w-0">
                <span className="font-semibold text-zinc-200">
                  {line.quantity}× {line.name}
                </span>
                {line.selectionLabels.length > 0 && (
                  <span className="mt-0.5 block truncate text-[11px] text-zinc-600">
                    {line.selectionLabels.join(" · ")}
                  </span>
                )}
              </span>
              <span className="shrink-0 text-zinc-400 tabular-nums">
                {formatAUD(line.unitPrice * line.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="mt-4 space-y-1.5 border-t border-white/8 pt-3 text-sm">
          <div className="flex justify-between text-zinc-500">
            <dt>Subtotal</dt>
            <dd className="tabular-nums">{formatAUD(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between text-zinc-500">
            <dt>Delivery</dt>
            <dd className="tabular-nums">
              {order.deliveryFee === 0 ? "—" : formatAUD(order.deliveryFee)}
            </dd>
          </div>
          <div className="flex justify-between font-extrabold">
            <dt>Paid on {delivery ? "delivery" : "pickup"}</dt>
            <dd className="text-ember tabular-nums">{formatAUD(order.total)}</dd>
          </div>
        </dl>
      </div>

      <div className="shrink-0 px-6 pt-4 pb-6">
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-full bg-linear-to-r from-ember to-gold px-5 py-3.5 text-sm font-bold text-obsidian shadow-ember transition-transform hover:scale-[1.01] active:scale-[0.99]"
        >
          Back to the menu
        </button>
      </div>
    </>
  );
}

export function OrderConfirmation() {
  const confirmationOpen = useCartStore((s) => s.confirmationOpen);
  const dismissConfirmation = useCartStore((s) => s.dismissConfirmation);
  const lastOrder = useCartStore((s) => s.lastOrder);

  const open = confirmationOpen && Boolean(lastOrder);
  const onClose = useCallback(() => dismissConfirmation(), [dismissConfirmation]);
  const panelRef = useDialog(open, onClose);

  return (
    <AnimatePresence>
      {open && lastOrder && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-obsidian/90 backdrop-blur-md"
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="glass-strong relative flex max-h-[94dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-4xl shadow-lift outline-none sm:max-h-[90dvh] sm:rounded-4xl"
          >
            <ConfirmationBody order={lastOrder} onClose={onClose} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

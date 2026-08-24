"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Bike, ExternalLink, X, Zap } from "lucide-react";
import { useCallback, type CSSProperties } from "react";
import { DELIVERY_PARTNERS, STORE } from "@/lib/data";
import { useCartStore } from "@/lib/store";
import { useDialog } from "@/lib/useDialog";
import { OrderTypeSwitcher } from "@/components/OrderTypeSwitcher";

/**
 * Offered whenever delivery is newly selected. Kebab X still delivers itself,
 * so the partner apps sit above a "continue in-app" action rather than
 * replacing checkout.
 *
 * Built on the same shell as CustomizeModal — glass-strong panel, obsidian/80
 * backdrop, bottom sheet on mobile, centred card from sm up.
 */
/** One mark per partner so the two rows do not read as duplicates. */
const PARTNER_ICON: Record<string, typeof Bike> = {
  ubereats: Bike,
  doordash: Zap,
};

export function DeliveryPartnerSheet() {
  const open = useCartStore((s) => s.partnerSheetOpen);
  const closePartnerSheet = useCartStore((s) => s.closePartnerSheet);

  const onClose = useCallback(() => closePartnerSheet(), [closePartnerSheet]);
  const panelRef = useDialog(open, onClose);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[75] flex items-end justify-center sm:items-center sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="partner-title"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="glass-strong relative flex max-h-[92dvh] w-full max-w-md flex-col overflow-hidden rounded-t-4xl shadow-lift outline-none sm:max-h-[88dvh] sm:rounded-4xl"
          >
            {/* Grab handle, mobile only */}
            <span
              aria-hidden
              className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-white/15 sm:hidden"
            />

            <div className="flex shrink-0 items-start justify-between gap-3 px-6 pt-5">
              <h2
                id="partner-title"
                className="font-display text-xl font-extrabold tracking-tight"
              >
                Pickup or delivery?
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="-mt-1 grid size-9 shrink-0 place-items-center rounded-full text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-100"
              >
                <X className="size-4.5" aria-hidden />
              </button>
            </div>

            {/* Same segmented pill used across the site */}
            <div className="mt-4 shrink-0 px-6">
              <OrderTypeSwitcher className="items-stretch" showEta={false} />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pt-6 pb-2">
              <p className="font-display text-sm font-bold tracking-wide text-zinc-100 uppercase">
                Order delivery with our partners
              </p>
              <p className="mt-1.5 text-sm text-zinc-400">
                Kebab X is on Uber Eats and DoorDash across {STORE.suburb} and nearby suburbs.
              </p>

              <div className="mt-4 space-y-2.5">
                {DELIVERY_PARTNERS.map((partner) => {
                  const Mark = PARTNER_ICON[partner.id] ?? Bike;
                  return (
                    <a
                      key={partner.id}
                      href={partner.href}
                      target="_blank"
                      rel="noreferrer"
                      style={{ "--tint": partner.tint } as CSSProperties}
                      className="partner-btn group flex items-center gap-3 rounded-2xl px-4 py-3.5"
                    >
                      <span
                        aria-hidden
                        className="partner-btn__mark grid size-9 shrink-0 place-items-center rounded-xl"
                      >
                        <Mark className="size-4.5 text-obsidian" strokeWidth={2.6} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="font-display block text-base font-extrabold tracking-tight text-zinc-100">
                          {partner.name}
                        </span>
                        <span className="block text-[11px] text-zinc-400">
                          Typically {partner.eta}
                        </span>
                      </span>
                      <ExternalLink
                        className="size-4 shrink-0 text-zinc-500 transition-colors group-hover:text-zinc-100"
                        aria-hidden
                      />
                    </a>
                  );
                })}
              </div>

              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-white/8" />
                <span className="text-[11px] font-semibold tracking-[0.16em] text-zinc-600 uppercase">
                  or
                </span>
                <span className="h-px flex-1 bg-white/8" />
              </div>

              <button
                type="button"
                onClick={onClose}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-linear-to-r from-ember to-gold px-5 py-3.5 text-sm font-bold text-obsidian shadow-ember transition-transform hover:scale-[1.02] active:scale-[0.99]"
              >
                <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/45 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                Continue with Kebab X delivery
                <ArrowRight className="size-4" aria-hidden />
              </button>

              <p className="mt-2.5 text-center text-[11px] text-zinc-600">
                Delivered by us in {STORE.deliveryEta} · {`$${STORE.deliveryFee.toFixed(2)}`} fee,
                free over ${STORE.freeDeliveryOver}
              </p>
            </div>

            <div className="shrink-0 px-6 pt-3 pb-6" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

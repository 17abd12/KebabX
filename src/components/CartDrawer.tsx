"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bike,
  Minus,
  Plus,
  ReceiptText,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { STORE } from "@/lib/data";
import { computeTotals, useCartStore } from "@/lib/store";
import { useDialog } from "@/lib/useDialog";
import { OrderTypeSwitcher } from "@/components/OrderTypeSwitcher";
import { SafeImage } from "@/components/SafeImage";
import { cn, formatAUD } from "@/lib/utils";

type FieldErrors = Partial<Record<"name" | "phone" | "address", string>>;

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  autoComplete,
  inputMode,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "numeric";
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-zinc-400">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "w-full rounded-xl border bg-white/[0.03] px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none",
          error
            ? "border-chilli/60 focus:border-chilli"
            : "border-white/10 focus:border-ember/50 focus:bg-white/6",
        )}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-[11px] font-medium text-chilli">
          {error}
        </p>
      )}
    </div>
  );
}

export function CartDrawer() {
  const cartOpen = useCartStore((s) => s.cartOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const orderType = useCartStore((s) => s.orderType);
  const customer = useCartStore((s) => s.customer);
  const setCustomer = useCartStore((s) => s.setCustomer);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeLine = useCartStore((s) => s.removeLine);
  const clearCart = useCartStore((s) => s.clearCart);
  const placeOrder = useCartStore((s) => s.placeOrder);
  const setActiveCategory = useCartStore((s) => s.setActiveCategory);
  const openPartnerSheet = useCartStore((s) => s.openPartnerSheet);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const onClose = useCallback(() => closeCart(), [closeCart]);
  const panelRef = useDialog(cartOpen, onClose);

  const totals = useMemo(() => computeTotals(items, orderType), [items, orderType]);
  const delivery = orderType === "delivery";

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (customer.name.trim().length < 2) next.name = "Tell us who the order is for.";
    // Loose AU check: 8+ digits after stripping formatting.
    if (customer.phone.replace(/\D/g, "").length < 8) next.phone = "A contactable number, please.";
    if (delivery && customer.address.trim().length < 6) {
      next.address = "We need a street address to deliver.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handlePlaceOrder = () => {
    if (items.length === 0 || !validate()) return;
    setSubmitting(true);
    // Brief pause so the button state reads as a real submission.
    window.setTimeout(() => {
      placeOrder();
      setSubmitting(false);
      setErrors({});
    }, 550);
  };

  const browseMenu = () => {
    setActiveCategory("all");
    onClose();
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <div className="fixed inset-0 z-[70]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm"
          />

          <motion.aside
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Your order"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 34 }}
            className="glass-strong absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-y-0 border-r-0 shadow-lift outline-none"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/8 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-xl bg-ember/15">
                  <ShoppingCart className="size-4.5 text-ember" aria-hidden />
                </span>
                <div>
                  <h2 className="font-display text-base font-extrabold tracking-tight">
                    Your Order
                  </h2>
                  <p className="text-[11px] text-zinc-500">
                    {totals.itemCount} {totals.itemCount === 1 ? "item" : "items"} ·{" "}
                    {delivery ? STORE.deliveryEta : STORE.pickupEta}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close cart"
                className="grid size-9 place-items-center rounded-full text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-100"
              >
                <X className="size-4.5" aria-hidden />
              </button>
            </div>

            {/* Body */}
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
              <OrderTypeSwitcher className="mb-5 items-stretch" showEta />

              {items.length === 0 ? (
                <div className="py-14 text-center">
                  <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white/5">
                    <ShoppingBag className="size-6 text-zinc-600" aria-hidden />
                  </span>
                  <p className="font-display mt-4 text-base font-bold">Nothing on the grill yet.</p>
                  <p className="mx-auto mt-1.5 max-w-[16rem] text-sm text-zinc-500">
                    Add a kebab, a snack pack or a platter and it will land here.
                  </p>
                  <button
                    type="button"
                    onClick={browseMenu}
                    className="mt-5 rounded-full bg-ember px-5 py-2.5 text-xs font-bold text-obsidian"
                  >
                    Browse the menu
                  </button>
                </div>
              ) : (
                <>
                  <ul className="space-y-3">
                    <AnimatePresence initial={false} mode="popLayout">
                      {items.map((line) => (
                        <motion.li
                          key={line.lineId}
                          layout
                          initial={{ opacity: 0, x: 24 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
                          transition={{ duration: 0.24 }}
                          className="glass flex gap-3 overflow-hidden rounded-2xl p-3"
                        >
                          <div className="relative size-16 shrink-0 overflow-hidden rounded-xl">
                            <SafeImage
                              src={line.image}
                              alt={line.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-sm leading-tight font-bold text-zinc-100">
                                {line.name}
                              </h3>
                              <button
                                type="button"
                                onClick={() => removeLine(line.lineId)}
                                aria-label={`Remove ${line.name}`}
                                className="shrink-0 rounded-lg p-1 text-zinc-600 transition-colors hover:bg-chilli/15 hover:text-chilli"
                              >
                                <Trash2 className="size-3.5" aria-hidden />
                              </button>
                            </div>

                            {line.selectionLabels.length > 0 && (
                              <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-zinc-500">
                                {line.selectionLabels.join(" · ")}
                              </p>
                            )}
                            {line.notes && (
                              <p className="mt-1 text-[11px] text-ember/80 italic">
                                &ldquo;{line.notes}&rdquo;
                              </p>
                            )}

                            <div className="mt-2 flex items-center justify-between gap-2">
                              <div className="flex items-center gap-0.5 rounded-full border border-white/10 bg-white/5 p-0.5">
                                <button
                                  type="button"
                                  onClick={() => setQuantity(line.lineId, line.quantity - 1)}
                                  aria-label={`Decrease ${line.name}`}
                                  className="grid size-6 place-items-center rounded-full text-zinc-300 transition-colors hover:bg-white/10"
                                >
                                  <Minus className="size-3" aria-hidden />
                                </button>
                                <span className="w-5 text-center text-xs font-bold tabular-nums">
                                  {line.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setQuantity(line.lineId, line.quantity + 1)}
                                  aria-label={`Increase ${line.name}`}
                                  className="grid size-6 place-items-center rounded-full text-zinc-300 transition-colors hover:bg-white/10"
                                >
                                  <Plus className="size-3" aria-hidden />
                                </button>
                              </div>
                              <span className="text-sm font-extrabold text-ember tabular-nums">
                                {formatAUD(line.unitPrice * line.quantity)}
                              </span>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>

                  <button
                    type="button"
                    onClick={clearCart}
                    className="mt-3 w-full rounded-xl py-2 text-[11px] font-semibold text-zinc-600 transition-colors hover:text-chilli"
                  >
                    Clear order
                  </button>

                  {/* Free delivery nudge */}
                  {delivery && totals.freeDeliveryShortfall > 0 && (
                    <div className="mt-4 rounded-2xl border border-ember/25 bg-ember/8 p-3">
                      <p className="flex items-center gap-2 text-xs font-semibold text-ember">
                        <Truck className="size-3.5" aria-hidden />
                        {formatAUD(totals.freeDeliveryShortfall)} away from free delivery
                      </p>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          className="h-full rounded-full bg-linear-to-r from-ember to-gold"
                          initial={false}
                          animate={{
                            width: `${Math.min(100, (totals.subtotal / STORE.freeDeliveryOver) * 100)}%`,
                          }}
                          transition={{ type: "spring", stiffness: 200, damping: 28 }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Details */}
                  <div className="mt-6 space-y-3">
                    <h3 className="font-display flex items-center gap-2 text-sm font-bold tracking-wide uppercase">
                      {delivery ? (
                        <Bike className="size-4 text-ember" aria-hidden />
                      ) : (
                        <ShoppingBag className="size-4 text-ember" aria-hidden />
                      )}
                      {delivery ? "Delivery details" : "Pickup details"}
                    </h3>

                    {!delivery ? (
                      <p className="rounded-xl border border-white/8 bg-white/[0.025] px-3.5 py-2.5 text-xs text-zinc-400">
                        Collect from <span className="font-semibold text-zinc-200">{STORE.address}</span>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={openPartnerSheet}
                        className="flex w-full items-center justify-between gap-2 rounded-xl border border-white/8 bg-white/[0.025] px-3.5 py-2.5 text-left text-xs text-zinc-400 transition-colors hover:border-ember/40 hover:text-zinc-200"
                      >
                        Prefer Uber Eats or DoorDash?
                        <span className="font-semibold text-ember">View partners</span>
                      </button>
                    )}

                    <Field
                      id="cust-name"
                      label="Name"
                      value={customer.name}
                      onChange={(v) => setCustomer({ name: v })}
                      placeholder="Alex"
                      autoComplete="name"
                      error={errors.name}
                    />
                    <Field
                      id="cust-phone"
                      label="Mobile"
                      type="tel"
                      inputMode="tel"
                      value={customer.phone}
                      onChange={(v) => setCustomer({ phone: v })}
                      placeholder="0400 000 000"
                      autoComplete="tel"
                      error={errors.phone}
                    />

                    <AnimatePresence initial={false}>
                      {delivery && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-3 overflow-hidden"
                        >
                          <Field
                            id="cust-address"
                            label="Street address"
                            value={customer.address}
                            onChange={(v) => setCustomer({ address: v })}
                            placeholder="12 Wellington Rd"
                            autoComplete="street-address"
                            error={errors.address}
                          />
                          <Field
                            id="cust-suburb"
                            label="Suburb"
                            value={customer.suburb}
                            onChange={(v) => setCustomer({ suburb: v })}
                            placeholder="Clayton"
                            autoComplete="address-level2"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div>
                      <label
                        htmlFor="cust-notes"
                        className="mb-1.5 block text-xs font-semibold text-zinc-400"
                      >
                        Notes for the shop
                      </label>
                      <textarea
                        id="cust-notes"
                        rows={2}
                        maxLength={200}
                        value={customer.notes}
                        onChange={(e) => setCustomer({ notes: e.target.value })}
                        placeholder={delivery ? "Buzzer 4, leave at door" : "Running 10 late"}
                        className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-ember/50 focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer / totals */}
            {items.length > 0 && (
              <div className="shrink-0 border-t border-white/8 px-5 py-4">
                <dl className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-zinc-400">
                    <dt>Subtotal</dt>
                    <dd className="tabular-nums">{formatAUD(totals.subtotal)}</dd>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <dt>Delivery fee</dt>
                    <dd className="tabular-nums">
                      {totals.deliveryFee === 0 ? (
                        <span className="font-semibold text-emerald-400">
                          {delivery ? "Free" : "Waived — pickup"}
                        </span>
                      ) : (
                        formatAUD(totals.deliveryFee)
                      )}
                    </dd>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <dt className="flex items-center gap-1.5">
                      <ReceiptText className="size-3.5" aria-hidden />
                      GST (incl.)
                    </dt>
                    <dd className="tabular-nums">{formatAUD(totals.tax)}</dd>
                  </div>
                  <div className="mt-2 flex justify-between border-t border-white/8 pt-2.5 text-base font-extrabold">
                    <dt>Total</dt>
                    <dd className="text-ember tabular-nums">{formatAUD(totals.total)}</dd>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                  className="group relative mt-4 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-linear-to-r from-ember to-gold px-5 py-3.5 text-sm font-bold text-obsidian shadow-ember transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
                >
                  <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/45 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  {submitting ? (
                    <>
                      <span className="size-4 animate-spin rounded-full border-2 border-obsidian/30 border-t-obsidian" />
                      Sending to the grill…
                    </>
                  ) : (
                    <>Place Order · {formatAUD(totals.total)}</>
                  )}
                </button>
                <p className="mt-2 text-center text-[11px] text-zinc-600">
                  Mock checkout — pay cash {delivery ? "on delivery" : "on pickup"}. No card is charged.
                </p>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

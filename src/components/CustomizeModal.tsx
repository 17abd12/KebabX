"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Flame, Minus, Plus, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { MENU, SPICE_LABEL } from "@/lib/data";
import { useCartStore } from "@/lib/store";
import { useDialog } from "@/lib/useDialog";
import { SafeImage } from "@/components/SafeImage";
import { cn, defaultSelections, formatAUD, formatDelta, unitPrice } from "@/lib/utils";
import type { CustomizationGroup, MenuItem, Selections } from "@/types";

function OptionRow({
  group,
  optionId,
  label,
  note,
  price,
  checked,
  disabled,
  onToggle,
}: {
  group: CustomizationGroup;
  optionId: string;
  label: string;
  note?: string;
  price: number;
  checked: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  const single = group.type === "single";
  return (
    <label
      className={cn(
        "group flex cursor-pointer items-center gap-3 rounded-2xl border p-3 transition-all duration-200",
        checked
          ? "border-ember/45 bg-ember/10"
          : "border-white/8 bg-white/[0.025] hover:border-white/20 hover:bg-white/5",
        disabled && "cursor-not-allowed opacity-40 hover:border-white/8 hover:bg-white/[0.025]",
      )}
    >
      <input
        type={single ? "radio" : "checkbox"}
        name={`${group.id}-${optionId}`}
        checked={checked}
        disabled={disabled}
        onChange={onToggle}
        className="sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "grid size-5 shrink-0 place-items-center border transition-all duration-200",
          single ? "rounded-full" : "rounded-md",
          checked ? "border-ember bg-ember text-obsidian" : "border-white/25 bg-transparent",
        )}
      >
        {checked && <Check className="size-3.5" strokeWidth={3.5} />}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-zinc-100">{label}</span>
        {note && <span className="mt-0.5 block text-xs text-zinc-500">{note}</span>}
      </span>

      {price !== 0 && (
        <span
          className={cn(
            "shrink-0 text-xs font-bold tabular-nums",
            price > 0 ? "text-ember" : "text-emerald-400",
          )}
        >
          {formatDelta(price)}
        </span>
      )}
    </label>
  );
}

function ModalBody({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useCartStore((s) => s.showToast);

  // ModalBody is keyed by item id, so a different dish remounts with fresh
  // defaults instead of needing a re-seeding effect.
  const [selections, setSelections] = useState<Selections>(() => defaultSelections(item));
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  const price = useMemo(() => unitPrice(item, selections), [item, selections]);

  const toggle = (group: CustomizationGroup, optionId: string) => {
    setSelections((prev) => {
      const current = prev[group.id] ?? [];
      if (group.type === "single") return { ...prev, [group.id]: [optionId] };

      const has = current.includes(optionId);
      if (has) return { ...prev, [group.id]: current.filter((id) => id !== optionId) };
      if (group.max && current.length >= group.max) return prev;
      return { ...prev, [group.id]: [...current, optionId] };
    });
  };

  const handleAdd = () => {
    addItem(item, selections, quantity, notes.trim() || undefined);
    showToast(`${quantity} × ${item.name} added`);
    onClose();
  };

  return (
    <>
      {/* Hero image */}
      <div className="relative h-44 shrink-0 overflow-hidden sm:h-56">
        <SafeImage
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, 640px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-obsidian via-obsidian/45 to-transparent" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-obsidian/70 text-zinc-200 backdrop-blur-md transition-colors hover:bg-chilli hover:text-white"
        >
          <X className="size-4.5" aria-hidden />
        </button>

        <div className="absolute inset-x-5 bottom-4">
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-zinc-200 backdrop-blur-md"
              >
                {tag}
              </span>
            ))}
            {item.spice > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-chilli/20 px-2 py-0.5 text-[10px] font-semibold text-chilli backdrop-blur-md">
                <Flame className="size-3" aria-hidden />
                {SPICE_LABEL[item.spice]}
              </span>
            )}
          </div>
          <h2 id="customize-title" className="font-display text-2xl font-extrabold tracking-tight">
            {item.name}
          </h2>
        </div>
      </div>

      {/* Scrollable options */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
        <p className="text-sm leading-relaxed text-zinc-400">{item.description}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.ingredients.map((ing) => (
            <span
              key={ing}
              className="rounded-full border border-white/8 px-2 py-0.5 text-[11px] text-zinc-500"
            >
              {ing}
            </span>
          ))}
        </div>
        {item.kj && <p className="mt-2 text-[11px] text-zinc-600">{item.kj} kJ per serve</p>}

        <div className="mt-6 space-y-6">
          {item.customization.map((group) => {
            const picked = selections[group.id] ?? [];
            const atMax = Boolean(group.max && picked.length >= group.max);
            return (
              <fieldset key={`${item.id}-${group.id}`}>
                <legend className="mb-2.5 flex w-full items-baseline justify-between gap-2">
                  <span className="font-display text-sm font-bold tracking-wide text-zinc-100 uppercase">
                    {group.title}
                  </span>
                  <span className="text-[11px] font-medium text-zinc-500">
                    {group.min ? "Required" : group.max ? `Up to ${group.max}` : "Optional"}
                  </span>
                </legend>
                {group.description && (
                  <p className="mb-2.5 -mt-1 text-xs text-zinc-500">{group.description}</p>
                )}
                <div className="grid gap-2 sm:grid-cols-2">
                  {group.options.map((option) => {
                    const checked = picked.includes(option.id);
                    return (
                      <OptionRow
                        key={option.id}
                        group={group}
                        optionId={option.id}
                        label={option.label}
                        note={option.note}
                        price={option.price}
                        checked={checked}
                        disabled={!checked && atMax && group.type === "multi"}
                        onToggle={() => toggle(group, option.id)}
                      />
                    );
                  })}
                </div>
              </fieldset>
            );
          })}

          <div>
            <label
              htmlFor="item-notes"
              className="font-display mb-2.5 block text-sm font-bold tracking-wide text-zinc-100 uppercase"
            >
              Special instructions
            </label>
            <textarea
              id="item-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              maxLength={200}
              placeholder="No onion, extra crispy, sauce on the side…"
              className="glass w-full resize-none rounded-2xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-ember/50 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="glass-strong flex shrink-0 items-center gap-3 border-x-0 border-b-0 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="grid size-8 place-items-center rounded-full text-zinc-300 transition-colors hover:bg-white/10 disabled:opacity-30"
          >
            <Minus className="size-4" aria-hidden />
          </button>
          <span aria-live="polite" className="w-7 text-center text-sm font-bold tabular-nums">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            aria-label="Increase quantity"
            className="grid size-8 place-items-center rounded-full text-zinc-300 transition-colors hover:bg-white/10"
          >
            <Plus className="size-4" aria-hidden />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="group relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-full bg-linear-to-r from-ember to-gold px-5 py-3.5 text-sm font-bold text-obsidian shadow-ember transition-transform hover:scale-[1.02] active:scale-[0.99]"
        >
          <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/45 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          Add to Order
          <span className="tabular-nums">· {formatAUD(price * quantity)}</span>
        </button>
      </div>
    </>
  );
}

export function CustomizeModal() {
  const customizingId = useCartStore((s) => s.customizingId);
  const closeCustomize = useCartStore((s) => s.closeCustomize);

  const item = customizingId ? MENU.find((i) => i.id === customizingId) : undefined;
  const open = Boolean(item);

  const onClose = useCallback(() => closeCustomize(), [closeCustomize]);
  const panelRef = useDialog(open, onClose);

  return (
    <AnimatePresence>
      {open && item && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
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
            aria-labelledby="customize-title"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="glass-strong relative flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-4xl shadow-lift outline-none sm:max-h-[88dvh] sm:rounded-4xl"
          >
            <ModalBody key={item.id} item={item} onClose={onClose} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { useCartStore } from "@/lib/store";

/** Transient confirmation after an item is added. Auto-dismisses. */
export function Toast() {
  const toast = useCartStore((s) => s.toast);
  const clearToast = useCartStore((s) => s.clearToast);
  const openCart = useCartStore((s) => s.openCart);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(clearToast, 2800);
    return () => window.clearTimeout(timer);
  }, [toast, clearToast]);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-[90] flex justify-center px-4 sm:bottom-8"
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="glass-strong pointer-events-auto flex items-center gap-3 rounded-full py-2.5 pr-2.5 pl-4 shadow-lift"
          >
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-linear-to-br from-ember to-gold">
              <Check className="size-3.5 text-obsidian" strokeWidth={3.5} aria-hidden />
            </span>
            <span className="text-sm font-semibold text-zinc-100">{toast}</span>
            <button
              type="button"
              onClick={() => {
                clearToast();
                openCart();
              }}
              className="rounded-full bg-ember px-3.5 py-1.5 text-xs font-bold text-obsidian transition-transform hover:scale-105"
            >
              View
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

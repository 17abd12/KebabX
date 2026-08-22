"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { STORE } from "@/lib/data";
import { lineSignature, orderReference, selectionLabels, unitPrice } from "@/lib/utils";
import type {
  CartItem,
  CategoryKey,
  CustomerDetails,
  MenuItem,
  OrderType,
  PlacedOrder,
  Selections,
} from "@/types";

export type CategoryFilter = CategoryKey | "all";

const emptyCustomer: CustomerDetails = {
  name: "",
  phone: "",
  address: "",
  suburb: "Clayton",
  notes: "",
};

interface CartState {
  /* ---- persisted ---- */
  orderType: OrderType;
  items: CartItem[];
  customer: CustomerDetails;
  lastOrder: PlacedOrder | null;

  /* ---- ephemeral UI (deliberately not persisted) ---- */
  cartOpen: boolean;
  customizingId: string | null;
  confirmationOpen: boolean;
  activeCategory: CategoryFilter;
  partnerSheetOpen: boolean;
  toast: string | null;
  hasHydrated: boolean;

  /* ---- actions ---- */
  setOrderType: (type: OrderType) => void;
  addItem: (item: MenuItem, selections: Selections, quantity?: number, notes?: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  clearCart: () => void;
  setCustomer: (patch: Partial<CustomerDetails>) => void;
  openCart: () => void;
  closeCart: () => void;
  openCustomize: (itemId: string) => void;
  closeCustomize: () => void;
  setActiveCategory: (category: CategoryFilter) => void;
  openPartnerSheet: () => void;
  closePartnerSheet: () => void;
  showToast: (message: string) => void;
  clearToast: () => void;
  placeOrder: () => PlacedOrder | null;
  dismissConfirmation: () => void;
  setHasHydrated: (value: boolean) => void;
}

export interface Totals {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  itemCount: number;
  freeDeliveryShortfall: number;
}

const round = (n: number) => Math.round(n * 100) / 100;

/**
 * Pure totals calculation, kept outside the store so components can memoize it
 * instead of subscribing to a freshly-allocated object every render.
 */
export function computeTotals(items: CartItem[], orderType: OrderType): Totals {
  const subtotal = round(items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0));
  const qualifiesFree = subtotal >= STORE.freeDeliveryOver;
  const deliveryFee =
    orderType === "delivery" && subtotal > 0 && !qualifiesFree ? STORE.deliveryFee : 0;
  const total = round(subtotal + deliveryFee);
  // AU menu prices are GST-inclusive: back the tax component out of the total.
  const tax = round(total - total / (1 + STORE.gstRate));
  return {
    subtotal,
    deliveryFee,
    tax,
    total,
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    freeDeliveryShortfall: qualifiesFree ? 0 : round(STORE.freeDeliveryOver - subtotal),
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      orderType: "pickup",
      items: [],
      customer: emptyCustomer,
      lastOrder: null,

      cartOpen: false,
      customizingId: null,
      confirmationOpen: false,
      activeCategory: "all",
      partnerSheetOpen: false,
      toast: null,
      hasHydrated: false,

      setOrderType: (orderType) =>
        set((state) =>
          // No-op when the mode is already active, so tapping "Delivery" inside
          // the partner sheet does not dismiss the sheet it lives in.
          state.orderType === orderType
            ? {}
            : {
                orderType,
                // Offer Uber Eats / DoorDash whenever delivery is newly chosen;
                // switching back to pickup closes the sheet in the same update.
                partnerSheetOpen: orderType === "delivery",
              },
        ),

      addItem: (item, selections, quantity = 1, notes) => {
        const lineId = lineSignature(item.id, selections);
        const price = unitPrice(item, selections);
        set((state) => {
          const existing = state.items.find((line) => line.lineId === lineId);
          if (existing) {
            return {
              items: state.items.map((line) =>
                line.lineId === lineId
                  ? { ...line, quantity: Math.min(99, line.quantity + quantity) }
                  : line,
              ),
            };
          }
          const next: CartItem = {
            lineId,
            itemId: item.id,
            name: item.name,
            image: item.image,
            basePrice: item.price,
            quantity,
            selections,
            selectionLabels: selectionLabels(item, selections),
            unitPrice: price,
            notes,
          };
          return { items: [...state.items, next] };
        });
      },

      setQuantity: (lineId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((line) => line.lineId !== lineId)
              : state.items.map((line) =>
                  line.lineId === lineId ? { ...line, quantity: Math.min(99, quantity) } : line,
                ),
        })),

      removeLine: (lineId) =>
        set((state) => ({ items: state.items.filter((line) => line.lineId !== lineId) })),

      clearCart: () => set({ items: [] }),

      setCustomer: (patch) => set((state) => ({ customer: { ...state.customer, ...patch } })),

      openCart: () => set({ cartOpen: true }),
      closeCart: () => set({ cartOpen: false }),
      openCustomize: (customizingId) => set({ customizingId }),
      closeCustomize: () => set({ customizingId: null }),
      setActiveCategory: (activeCategory) => set({ activeCategory }),
      // Reachable entry point for visitors who already had delivery selected,
      // since the automatic prompt only fires when the mode actually changes.
      openPartnerSheet: () => set({ partnerSheetOpen: true }),
      closePartnerSheet: () => set({ partnerSheetOpen: false }),
      showToast: (toast) => set({ toast }),
      clearToast: () => set({ toast: null }),

      placeOrder: () => {
        const { items, orderType, customer } = get();
        if (items.length === 0) return null;
        const totals = computeTotals(items, orderType);
        const order: PlacedOrder = {
          reference: orderReference(),
          placedAt: Date.now(),
          orderType,
          items,
          customer,
          subtotal: totals.subtotal,
          deliveryFee: totals.deliveryFee,
          tax: totals.tax,
          total: totals.total,
          etaMinutes:
            orderType === "pickup" ? STORE.pickupEtaMinutes : STORE.deliveryEtaMinutes,
        };
        set({ lastOrder: order, items: [], cartOpen: false, confirmationOpen: true });
        return order;
      },

      dismissConfirmation: () => set({ confirmationOpen: false }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "kebab-x-order",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      // Drawers and modals should never survive a refresh.
      partialize: (state) => ({
        orderType: state.orderType,
        items: state.items,
        customer: state.customer,
        lastOrder: state.lastOrder,
      }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);

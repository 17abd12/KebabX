# Kebab X — Clayton

High-conversion digital storefront for **Kebab X, 300 Clayton Rd, Clayton VIC 3168**.
Pickup & delivery ordering, WebGL ember ambience, full local cart state.

```bash
npm run dev     # http://localhost:3000
npm run build
npm start
```

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · React Three Fiber / three.js · Zustand · lucide-react · canvas-confetti

## Layout

```
src/
  app/
    layout.tsx           Fonts (Plus Jakarta Sans), metadata, skip link
    globals.css          Obsidian theme tokens, glass utilities, keyframes
    page.tsx             Composition: nav + hero + menu + overlays
  components/
    HeroCanvas.tsx       R3F ember/smoke particle field (custom GLSL shader)
    Hero.tsx             Headline, CTAs, 3D tilt platter card
    Navbar.tsx           Sticky frosted nav, store status, cart trigger
    OrderTypeSwitcher.tsx  Pickup ⇄ Delivery segmented pill + live ETA
    MenuSection.tsx      Sticky category bar, fuzzy search, dietary filters
    MenuCard.tsx         Tilt card, spice meter, magnetic "Add" button
    CustomizeModal.tsx   Meat / bread / salad / sauce / add-ons, live pricing
    CartDrawer.tsx       Line items, customer details, totals, checkout
    OrderConfirmation.tsx  Confetti + Received → Grilling → Ready timeline
    FloatingCartBar.tsx  Mobile thumb-reach order bar
    TiltCard.tsx         Pointer-driven 3D tilt primitive
    SafeImage.tsx        next/image with branded fallback
    Toast.tsx            Add-to-cart confirmation
  lib/
    data.ts              Store details, 5 categories, 14 menu items
    store.ts             Zustand + persist (localStorage), totals maths
    utils.ts             cn, AUD formatting, pricing, fuzzy search
    useDialog.ts         Scroll lock, Escape, focus trap
  types/index.ts         MenuItem, CartItem, CustomizationOption, OrderState…
```

## Notes

- **Everything is local.** `placeOrder()` writes to `localStorage` under
  `kebab-x-order` and nothing leaves the browser. No payment is taken.
- **GST.** Australian menu prices are GST-inclusive, so the breakdown shows GST
  as a *component* of the total (`total - total / 1.1`), not an added line.
  Total = subtotal + delivery fee.
- **Delivery fee** is $4.90, waived on pickup and on delivery orders over $45.
- **Persistence** covers cart, order type, customer details and last order.
  Drawer/modal state is deliberately excluded so nothing reopens on refresh.
- **Images** are Unsplash placeholders (every URL verified to resolve). Swap the
  `image` fields in `src/lib/data.ts` for real store photography — `SafeImage`
  falls back to an ember gradient if a URL ever dies.
- **Order timeline** runs on demo pacing (seconds, not the real 15–20 minutes).
  Adjust `STAGE_TIMINGS` in `OrderConfirmation.tsx`.
- **Accessibility**: skip link, focus-visible rings, focus-trapped dialogs,
  `aria-live` on ETA/quantity/toast, labelled controls throughout.
- **Graceful degradation**: `HeroCanvas` renders nothing without WebGL or under
  `prefers-reduced-motion`; the hero's CSS gradients carry the look.
# KebabX

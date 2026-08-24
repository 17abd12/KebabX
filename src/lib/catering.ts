import { STORE } from "@/lib/data";
import { CATERING_ADDONS, CATERING_PACKAGES } from "@/lib/content";
import type { CateringPackage } from "@/types";

/**
 * Volume tiers.
 *
 * Published rather than negotiated, for two reasons: a buyer who can see the
 * next tier has a concrete reason to round their head count up, and a buyer who
 * cannot see it assumes they are being quoted worse than the last person was.
 */
export const VOLUME_TIERS = [
  { minHeads: 40, rate: 0.05 },
  { minHeads: 75, rate: 0.08 },
  { minHeads: 150, rate: 0.12 },
] as const;

export const HEADS_MIN = 10;
export const HEADS_MAX = 200;

const round = (n: number) => Math.round(n * 100) / 100;

export interface Quote {
  pkg: CateringPackage;
  heads: number;
  /** Package cost before add-ons and discount. */
  base: number;
  addonsPerHead: number;
  addonsTotal: number;
  subtotal: number;
  discountRate: number;
  discount: number;
  total: number;
  /** All-in cost per person — the number a budget is actually approved against. */
  effectivePerHead: number;
  /** GST already inside the total, surfaced as a component for the tax invoice. */
  gst: number;
  /** Next volume tier, when one is still reachable. */
  nextTier: { minHeads: number; rate: number; headsAway: number } | null;
  /** True when the chosen package needs more people than the slider is set to. */
  belowMinimum: boolean;
}

export function volumeRate(heads: number) {
  let rate = 0;
  for (const tier of VOLUME_TIERS) {
    if (heads >= tier.minHeads) rate = tier.rate;
  }
  return rate;
}

function nextTierFor(heads: number) {
  const tier = VOLUME_TIERS.find((t) => heads < t.minHeads);
  return tier ? { ...tier, headsAway: tier.minHeads - heads } : null;
}

export function buildQuote(packageId: string, heads: number, addonIds: string[]): Quote {
  const pkg = CATERING_PACKAGES.find((p) => p.id === packageId) ?? CATERING_PACKAGES[0];

  const addonsPerHead = round(
    CATERING_ADDONS.filter((a) => addonIds.includes(a.id)).reduce((sum, a) => sum + a.perHead, 0),
  );

  const base = round(pkg.perHead * heads);
  const addonsTotal = round(addonsPerHead * heads);
  const subtotal = round(base + addonsTotal);

  const discountRate = volumeRate(heads);
  const discount = round(subtotal * discountRate);
  const total = round(subtotal - discount);

  return {
    pkg,
    heads,
    base,
    addonsPerHead,
    addonsTotal,
    subtotal,
    discountRate,
    discount,
    total,
    effectivePerHead: heads > 0 ? round(total / heads) : 0,
    gst: round(total - total / (1 + STORE.gstRate)),
    nextTier: nextTierFor(heads),
    belowMinimum: heads < pkg.minHeads,
  };
}

/**
 * A plain-text quote the buyer can paste into an email or read down the phone.
 * The static build has no server to submit to, so the deliverable is the
 * summary itself rather than a form post that quietly goes nowhere.
 */
export function quoteAsText(quote: Quote, addonIds: string[]) {
  const addons = CATERING_ADDONS.filter((a) => addonIds.includes(a.id)).map((a) => a.label);
  const lines = [
    `${STORE.name} — catering quote`,
    `${STORE.address}  ·  ${STORE.phone}`,
    "",
    `Package:        ${quote.pkg.name} ($${quote.pkg.perHead.toFixed(2)} per head)`,
    `Head count:     ${quote.heads}`,
    addons.length ? `Add-ons:        ${addons.join(", ")}` : "Add-ons:        none",
    "",
    `Subtotal:       $${quote.subtotal.toFixed(2)}`,
    quote.discount > 0
      ? `Volume credit:  -$${quote.discount.toFixed(2)} (${Math.round(quote.discountRate * 100)}%)`
      : "Volume credit:  n/a",
    `Total:          $${quote.total.toFixed(2)} incl. GST ($${quote.gst.toFixed(2)})`,
    `Per head:       $${quote.effectivePerHead.toFixed(2)}`,
    "",
    "Indicative only — confirmed on a call before anything is booked.",
  ];
  return lines.join("\n");
}

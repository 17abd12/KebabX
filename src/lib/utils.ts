import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { MenuItem, Selections } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const AUD = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  minimumFractionDigits: 2,
});

export const formatAUD = (value: number) => AUD.format(value);

/** Signed delta, e.g. "+$2.00" / "-$2.00" / "" for zero. */
export function formatDelta(value: number) {
  if (value === 0) return "";
  return `${value > 0 ? "+" : "-"}${AUD.format(Math.abs(value))}`;
}

/** Selections an item starts with when the customization modal opens. */
export function defaultSelections(item: MenuItem): Selections {
  const out: Selections = {};
  for (const group of item.customization) {
    const chosen = group.options.filter((o) => o.default).map((o) => o.id);
    // A required single-choice group always resolves to something.
    if (group.type === "single" && chosen.length === 0 && group.options.length > 0) {
      out[group.id] = [group.options[0].id];
    } else {
      out[group.id] = group.type === "single" ? chosen.slice(0, 1) : chosen;
    }
  }
  return out;
}

/** Base price plus every selected option delta. */
export function unitPrice(item: MenuItem, selections: Selections) {
  let total = item.price;
  for (const group of item.customization) {
    const picked = selections[group.id] ?? [];
    for (const id of picked) {
      const option = group.options.find((o) => o.id === id);
      if (option) total += option.price;
    }
  }
  return Math.max(0, Math.round(total * 100) / 100);
}

/** Flat, ordered list of chosen option labels for cart display. */
export function selectionLabels(item: MenuItem, selections: Selections) {
  const labels: string[] = [];
  for (const group of item.customization) {
    for (const id of selections[group.id] ?? []) {
      const option = group.options.find((o) => o.id === id);
      if (option) labels.push(option.label);
    }
  }
  return labels;
}

/**
 * Stable signature for a configured item. Two lines merge only when the item
 * and every selected option match, so "extra cheese" never silently collapses
 * into a plain one.
 */
export function lineSignature(itemId: string, selections: Selections) {
  const parts = Object.keys(selections)
    .sort()
    .map((key) => `${key}:${[...selections[key]].sort().join("+")}`);
  return `${itemId}|${parts.join("|")}`;
}

/**
 * Forgiving subsequence match — "lam kbb" still finds "Lamb Doner Kebab".
 * Returns a score (lower is better) or null when there is no match.
 */
export function fuzzyScore(haystack: string, needle: string): number | null {
  const h = haystack.toLowerCase();
  const n = needle.toLowerCase().trim();
  if (!n) return 0;

  const direct = h.indexOf(n);
  if (direct !== -1) return direct;

  let score = 0;
  let cursor = 0;
  for (const char of n) {
    if (char === " ") continue;
    const found = h.indexOf(char, cursor);
    if (found === -1) return null;
    score += found - cursor;
    cursor = found + 1;
  }
  return score + 100; // subsequence hits always rank below substring hits
}

/** Searches name, description, ingredients and tags together. */
export function searchScore(item: MenuItem, query: string): number | null {
  if (!query.trim()) return 0;
  const haystacks = [
    item.name,
    item.description,
    item.ingredients.join(" "),
    item.tags.join(" "),
  ];
  const scores = haystacks
    .map((h, i) => {
      const s = fuzzyScore(h, query);
      return s === null ? null : s + i * 40; // name matches outrank ingredient matches
    })
    .filter((s): s is number => s !== null);
  return scores.length ? Math.min(...scores) : null;
}

const REF_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/** Human-readable pickup reference, e.g. "KX-7Q4M". */
export function orderReference() {
  let out = "";
  for (let i = 0; i < 4; i += 1) {
    out += REF_ALPHABET[Math.floor(Math.random() * REF_ALPHABET.length)];
  }
  return `KX-${out}`;
}

export function formatClock(timestamp: number) {
  return new Intl.DateTimeFormat("en-AU", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

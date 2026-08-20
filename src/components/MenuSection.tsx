"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useDeferredValue, useId, useMemo, useState } from "react";
import { CATEGORIES, DIETARY_FILTERS, MENU } from "@/lib/data";
import { useCartStore, type CategoryFilter } from "@/lib/store";
import { MenuCard } from "@/components/MenuCard";
import { cn, searchScore } from "@/lib/utils";
import type { DietaryTag, MenuItem } from "@/types";

const ALL: { key: CategoryFilter; label: string }[] = [
  { key: "all", label: "Everything" },
  ...CATEGORIES.map((c) => ({ key: c.key as CategoryFilter, label: c.label })),
];

export function MenuSection() {
  const activeCategory = useCartStore((s) => s.activeCategory);
  const setActiveCategory = useCartStore((s) => s.setActiveCategory);

  const [query, setQuery] = useState("");
  const [diets, setDiets] = useState<DietaryTag[]>([]);
  const deferredQuery = useDeferredValue(query);
  const searchId = useId();

  const toggleDiet = (tag: DietaryTag) =>
    setDiets((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  /** Category filter, dietary filter and fuzzy ranking in one pass. */
  const results = useMemo(() => {
    const scored: { item: MenuItem; score: number }[] = [];
    for (const item of MENU) {
      if (activeCategory !== "all" && item.category !== activeCategory) continue;
      if (diets.length > 0 && !diets.every((tag) => item.tags.includes(tag))) continue;
      const score = searchScore(item, deferredQuery);
      if (score === null) continue;
      scored.push({ item, score });
    }
    // A live query ranks by relevance; otherwise keep the curated menu order.
    if (deferredQuery.trim()) scored.sort((a, b) => a.score - b.score);
    return scored.map((s) => s.item);
  }, [activeCategory, diets, deferredQuery]);

  const searching = deferredQuery.trim().length > 0;
  const groups = searching
    ? [{ key: "results" as const, label: `Results for "${deferredQuery.trim()}"`, blurb: "", items: results }]
    : CATEGORIES.filter((c) => activeCategory === "all" || c.key === activeCategory)
        .map((c) => ({
          key: c.key,
          label: c.label,
          blurb: c.blurb,
          items: results.filter((i) => i.category === c.key),
        }))
        .filter((g) => g.items.length > 0);

  const hasFilters = diets.length > 0 || activeCategory !== "all" || query.length > 0;

  return (
    <section id="menu" className="relative scroll-mt-32">
      {/* ------------------------- Sticky filter bar ------------------------- */}
      <div className="glass-strong sticky top-16 z-40 border-x-0 border-t-0 sm:top-20">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3">
            {/* Categories */}
            <div className="no-scrollbar mask-fade-r -mx-1 flex items-center gap-1.5 overflow-x-auto px-1 pb-0.5">
              {ALL.map((cat) => {
                const selected = cat.key === activeCategory;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setActiveCategory(cat.key)}
                    aria-pressed={selected}
                    className={cn(
                      "relative shrink-0 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors duration-200 sm:text-sm",
                      selected ? "text-obsidian" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100",
                    )}
                  >
                    {selected && (
                      <motion.span
                        layoutId="category-pill"
                        transition={{ type: "spring", stiffness: 400, damping: 34 }}
                        className="absolute inset-0 -z-10 rounded-full bg-linear-to-r from-ember to-gold"
                      />
                    )}
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Search + dietary */}
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-zinc-500"
                  aria-hidden
                />
                <input
                  id={searchId}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search lamb, HSP, garlic sauce, baklava…"
                  aria-label="Search the menu"
                  className="glass w-full rounded-full py-2.5 pr-10 pl-10 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-ember/50 focus:bg-white/6 focus:outline-none"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-zinc-500 transition-colors hover:bg-white/10 hover:text-zinc-200"
                  >
                    <X className="size-3.5" aria-hidden />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <SlidersHorizontal className="size-3.5 shrink-0 text-zinc-600" aria-hidden />
                {DIETARY_FILTERS.map((tag) => {
                  const on = diets.includes(tag as DietaryTag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleDiet(tag as DietaryTag)}
                      aria-pressed={on}
                      className={cn(
                        "shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap transition-all duration-200",
                        on
                          ? "border-ember/50 bg-ember/15 text-ember"
                          : "border-white/8 bg-white/3 text-zinc-400 hover:border-white/20 hover:text-zinc-200",
                      )}
                    >
                      {tag}
                    </button>
                  );
                })}
                {hasFilters && (
                  <button
                    type="button"
                    onClick={() => {
                      setDiets([]);
                      setQuery("");
                      setActiveCategory("all");
                    }}
                    className="shrink-0 rounded-full px-2.5 py-1.5 text-[11px] font-semibold text-zinc-500 transition-colors hover:text-chilli"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------- Grid -------------------------------- */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <AnimatePresence mode="popLayout" initial={false}>
          {groups.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass mx-auto max-w-md rounded-3xl px-6 py-12 text-center"
            >
              <p className="font-display text-lg font-bold">Nothing on the grill for that.</p>
              <p className="mt-2 text-sm text-zinc-400">
                Try &ldquo;lamb&rdquo;, &ldquo;HSP&rdquo; or clear your filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setDiets([]);
                  setQuery("");
                  setActiveCategory("all");
                }}
                className="mt-5 rounded-full bg-ember px-5 py-2.5 text-xs font-bold text-obsidian"
              >
                Show the full menu
              </button>
            </motion.div>
          ) : (
            groups.map((group) => (
              <motion.div key={group.key} layout className="mb-12 last:mb-0">
                <div className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
                    {group.label}
                  </h2>
                  <span className="text-xs font-medium text-zinc-500">
                    {group.items.length} {group.items.length === 1 ? "item" : "items"}
                  </span>
                  {group.blurb && (
                    <p className="w-full text-sm text-zinc-500">{group.blurb}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence mode="popLayout">
                    {group.items.map((item, index) => (
                      <MenuCard key={item.id} item={item} index={index} />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { Flame, Leaf, Plus, ShieldCheck, Sparkles } from "lucide-react";
import type { PointerEvent } from "react";
import { SPICE_LABEL } from "@/lib/data";
import { useCartStore } from "@/lib/store";
import { SafeImage } from "@/components/SafeImage";
import { TiltCard } from "@/components/TiltCard";
import { cn, formatAUD } from "@/lib/utils";
import type { DietaryTag, MenuItem } from "@/types";

const TAG_ICON: Record<DietaryTag, typeof Leaf> = {
  "Halal Certified": ShieldCheck,
  Vegetarian: Leaf,
  Vegan: Leaf,
  Spicy: Flame,
  "Gluten Free": Sparkles,
};

/** Small pill for a dietary tag. */
function Tag({ tag }: { tag: DietaryTag }) {
  const Icon = TAG_ICON[tag];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
        tag === "Spicy"
          ? "bg-chilli/15 text-chilli"
          : tag === "Halal Certified"
            ? "bg-emerald-500/12 text-emerald-300"
            : "bg-white/6 text-zinc-300",
      )}
    >
      <Icon className="size-3" aria-hidden />
      {tag}
    </span>
  );
}

/** Chilli meter, 0–3. */
function SpiceMeter({ level }: { level: number }) {
  if (level === 0) return null;
  return (
    <span
      className="flex items-center gap-0.5"
      title={SPICE_LABEL[level]}
      aria-label={`Spice level: ${SPICE_LABEL[level]}`}
    >
      {[1, 2, 3].map((step) => (
        <Flame
          key={step}
          aria-hidden
          className={cn("size-3.5", step <= level ? "fill-chilli/80 text-chilli" : "text-zinc-700")}
        />
      ))}
    </span>
  );
}

/** Button that drifts a few pixels toward the cursor while hovered. */
function MagneticAdd({ onClick, label }: { onClick: () => void; label: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 18 });
  const sy = useSpring(y, { stiffness: 300, damping: 18 });

  const handleMove = (event: PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(((event.clientX - rect.left) / rect.width - 0.5) * 14);
    y.set(((event.clientY - rect.top) / rect.height - 0.5) * 10);
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onPointerMove={handleMove}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ x: sx, y: sy }}
      aria-label={label}
      className="group/add relative inline-flex shrink-0 items-center gap-1.5 overflow-hidden rounded-full bg-linear-to-r from-ember to-gold px-4 py-2.5 text-xs font-bold text-obsidian shadow-ember transition-shadow hover:shadow-[0_0_28px_-6px_rgba(245,158,11,0.7)]"
    >
      <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/50 to-transparent transition-transform duration-600 group-hover/add:translate-x-full" />
      <Plus className="size-3.5" aria-hidden />
      Add
    </motion.button>
  );
}

export function MenuCard({ item, index }: { item: MenuItem; index: number }) {
  const openCustomize = useCartStore((s) => s.openCustomize);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.035, 0.28), ease: [0.16, 1, 0.3, 1] }}
    >
      <TiltCard intensity={7} lift={10} className="h-full">
        <div
          className="glow-border glass group relative flex h-full flex-col overflow-hidden rounded-3xl shadow-lift transition-colors duration-300 hover:bg-white/6"
          data-active={item.featured ? "true" : "false"}
        >
          {/* Image */}
          <button
            type="button"
            onClick={() => openCustomize(item.id)}
            aria-label={`Customise ${item.name}`}
            className="relative block aspect-4/3 w-full overflow-hidden"
          >
            <SafeImage
              src={item.image}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 30vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-obsidian/95 via-obsidian/20 to-transparent" />

            {item.popular && (
              <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-obsidian/75 px-2.5 py-1 text-[10px] font-bold tracking-wide text-ember uppercase backdrop-blur-md">
                <Sparkles className="size-3" aria-hidden />
                Popular
              </span>
            )}

            <span className="absolute top-3 right-3 rounded-full bg-obsidian/75 px-2.5 py-1 text-xs font-extrabold text-zinc-100 tabular-nums backdrop-blur-md">
              {formatAUD(item.price)}
            </span>

            <span className="absolute right-3 bottom-3">
              <SpiceMeter level={item.spice} />
            </span>
          </button>

          {/* Body */}
          <div className="flex flex-1 flex-col gap-3 p-5">
            <div>
              <h3 className="font-display text-lg leading-tight font-bold tracking-tight">
                {item.name}
              </h3>
              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-zinc-400">
                {item.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {item.tags.slice(0, 3).map((tag) => (
                <Tag key={tag} tag={tag} />
              ))}
            </div>

            <div className="mt-auto flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => openCustomize(item.id)}
                className="text-xs font-semibold text-zinc-400 underline-offset-4 transition-colors hover:text-ember hover:underline"
              >
                Customise
              </button>
              <MagneticAdd
                onClick={() => openCustomize(item.id)}
                label={`Add ${item.name} to your order`}
              />
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.article>
  );
}

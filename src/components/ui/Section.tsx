"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll-in wrapper. One shared distance and easing for every section on the
 * page — varying the entrance per block is the fastest way to make a site feel
 * assembled from parts rather than designed.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "article";
}) {
  const Tag = motion[as];
  return (
    <Tag
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </Tag>
  );
}

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  blurb?: ReactNode;
  /** "b2b" swaps the ember accent for bone, so catering reads as a different room. */
  tone?: "ember" | "bone";
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  blurb,
  tone = "ember",
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <Reveal>
        <span
          className={cn(
            "eyebrow inline-flex items-center gap-2",
            tone === "ember" ? "text-ember" : "text-bone-dim",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "inline-block h-px w-6",
              tone === "ember" ? "bg-ember/60" : "bg-bone-dim/50",
            )}
          />
          {eyebrow}
        </span>
      </Reveal>

      <Reveal delay={0.06}>
        <h2 className="font-display mt-4 text-3xl leading-[1.08] font-extrabold tracking-tight text-balance sm:text-4xl lg:text-5xl">
          {title}
        </h2>
      </Reveal>

      {blurb && (
        <Reveal delay={0.12}>
          <p
            className={cn(
              "mt-4 text-base leading-relaxed text-pretty sm:text-lg",
              tone === "ember" ? "text-zinc-400" : "text-bone-dim",
            )}
          >
            {blurb}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/**
 * Page section shell: consistent horizontal rhythm and vertical breathing room,
 * with an optional ambient glow bled in behind the content.
 */
export function Section({
  id,
  children,
  className,
  glow,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  /** Radial wash colour behind the section — "ember" for B2C, "bone" for B2B. */
  glow?: "ember" | "bone" | "none";
}) {
  return (
    <section id={id} className={cn("relative isolate scroll-mt-32 py-20 sm:py-28", className)}>
      {glow && glow !== "none" && (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 -z-10",
            glow === "ember"
              ? "bg-[radial-gradient(60%_45%_at_50%_0%,rgba(245,158,11,0.10),transparent_70%)]"
              : "bg-[radial-gradient(70%_50%_at_50%_10%,rgba(242,237,227,0.055),transparent_72%)]",
          )}
        />
      )}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

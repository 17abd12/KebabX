"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees on each axis. */
  intensity?: number;
  /** Adds a cursor-following specular sheen. */
  glare?: boolean;
  /** Pushes the card toward the viewer on hover. */
  lift?: number;
}

const spring = { stiffness: 220, damping: 22, mass: 0.6 };

/**
 * Pointer-driven 3D tilt. Values are normalised to -0.5..0.5 around the card
 * centre so the effect is size-independent, then spring-damped for weight.
 */
export function TiltCard({
  children,
  className,
  intensity = 10,
  glare = true,
  lift = 14,
}: TiltCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const hover = useMotionValue(0);

  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);
  const sz = useSpring(hover, spring);

  const rotateX = useTransform(sy, [-0.5, 0.5], [intensity, -intensity]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-intensity, intensity]);
  const translateZ = useTransform(sz, [0, 1], [0, lift]);

  const glareX = useTransform(sx, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(sy, [-0.5, 0.5], ["0%", "100%"]);
  const glareOpacity = useTransform(sz, [0, 1], [0, 0.14]);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,236,190,1) 0%, rgba(255,236,190,0) 55%)`;

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
    hover.set(0);
  };

  return (
    <motion.div
      onPointerMove={handleMove}
      onPointerEnter={() => hover.set(1)}
      onPointerLeave={reset}
      style={{
        rotateX,
        rotateY,
        translateZ,
        // Perspective belongs in the element's own transform, not on a parent,
        // so the card can tilt wherever it is dropped in the layout.
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
      className={cn("relative", className)}
    >
      {children}
      {glare && (
        <motion.span
          aria-hidden
          style={{ background: glareBackground, opacity: glareOpacity }}
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] mix-blend-screen"
        />
      )}
    </motion.div>
  );
}

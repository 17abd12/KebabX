"use client";

import Image, { type ImageProps } from "next/image";
import { Flame } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type SafeImageProps = Omit<ImageProps, "onError"> & {
  /** Wrapper classes; the image itself still takes `className`. */
  wrapperClassName?: string;
};

/**
 * next/image with a branded fallback. Menu photography is remote placeholder
 * art, so a dead URL degrades to an ember gradient instead of a broken tile.
 */
export function SafeImage({ wrapperClassName, className, alt, ...props }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "flex h-full w-full items-center justify-center bg-linear-to-br from-char via-obsidian-700 to-obsidian",
          wrapperClassName,
          className,
        )}
      >
        <Flame className="size-8 text-ember/40" aria-hidden />
      </div>
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

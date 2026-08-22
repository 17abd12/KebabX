"use client";

import Image, { type ImageProps } from "next/image";
import { Flame } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type SafeImageProps = Omit<ImageProps, "onError" | "src"> & {
  /** Absent when the dish has no photograph yet. */
  src?: string;
  /** Wrapper classes; the image itself still takes `className`. */
  wrapperClassName?: string;
  /** Set false on small thumbnails where a caption would not fit. */
  showFallbackLabel?: boolean;
};

/**
 * next/image with a branded fallback, used both when a dish has no photo and
 * when a URL dies. Falling back to an ember tile keeps the card honest — we
 * never show a photo of a different dish.
 */
export function SafeImage({
  wrapperClassName,
  className,
  alt,
  src,
  showFallbackLabel = false,
  ...props
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={`${alt} — photo coming soon`}
        className={cn(
          "flex h-full w-full flex-col items-center justify-center gap-2 bg-linear-to-br from-char via-obsidian-700 to-obsidian",
          wrapperClassName,
          className,
        )}
      >
        <span className="grid size-11 place-items-center rounded-2xl bg-ember/10">
          <Flame className="size-5 text-ember/70" aria-hidden />
        </span>
        {showFallbackLabel && (
          <span className="text-[10px] font-semibold tracking-[0.16em] text-zinc-600 uppercase">
            Photo coming soon
          </span>
        )}
      </div>
    );
  }

  return <Image {...props} src={src} alt={alt} className={className} onError={() => setFailed(true)} />;
}

import { Check } from "lucide-react";
import { TRUST_MARQUEE } from "@/lib/content";

/**
 * The claim strip under the hero.
 *
 * Runs as an infinite marquee because a static row of ten claims reads as a
 * wall and gets skipped, while a moving row gets read one item at a time. The
 * track holds the list twice so the loop seam lands on an identical frame, and
 * it pauses on hover/focus so anyone who wants to actually read it can.
 */
export function TrustMarquee() {
  return (
    <div className="relative border-y border-white/8 bg-white/[0.015] py-3.5">
      <div className="marquee-viewport mask-fade-x overflow-hidden">
        <ul className="marquee-track items-center gap-8 pr-8 sm:gap-12 sm:pr-12">
          {[...TRUST_MARQUEE, ...TRUST_MARQUEE].map((claim, index) => (
            <li
              key={`${claim}-${index}`}
              // The second pass is decorative repetition, not new information.
              aria-hidden={index >= TRUST_MARQUEE.length}
              className="flex shrink-0 items-center gap-2 text-xs font-medium whitespace-nowrap text-zinc-400 sm:text-sm"
            >
              <Check className="size-3.5 shrink-0 text-ember" aria-hidden />
              {claim}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

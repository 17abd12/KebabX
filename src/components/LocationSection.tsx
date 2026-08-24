"use client";

import { Car, Clock, ExternalLink, MapPin, Phone, Train } from "lucide-react";
import Image from "next/image";
import { useSyncExternalStore } from "react";
import { PHOTOS } from "@/lib/content";
import { STORE } from "@/lib/data";
import { Reveal, Section, SectionHeading } from "@/components/ui/Section";

const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE.address)}`;
const telHref = `tel:${STORE.phone.replace(/[\s()]/g, "")}`;

const OPEN_HOUR = 11;
const CLOSE_HOUR = 23;

/** Melbourne local hour, regardless of where the visitor is sitting. */
function melbourneHour() {
  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Melbourne",
    hour: "numeric",
    hour12: false,
  }).formatToParts(new Date());
  return Number(parts.find((p) => p.type === "hour")?.value ?? 12);
}

/**
 * The clock is an external system, so it is read through useSyncExternalStore
 * rather than an effect: the server snapshot is `null`, which renders a neutral
 * "checking hours" state, and the client subscribes for the minute tick. Doing
 * this with useState + useEffect would either mismatch on hydration or fire a
 * cascading render on mount.
 */
function subscribeToClock(onChange: () => void) {
  const id = window.setInterval(onChange, 60_000);
  return () => window.clearInterval(id);
}

/** Stable within an hour, so React can bail out of re-rendering on every tick. */
const clockSnapshot = () => melbourneHour();
const serverSnapshot = () => null;

const PRACTICALS = [
  {
    icon: Car,
    title: "Parking",
    body: "Free 2-hour street parking on Clayton Rd, plus the Woolworths deck one block north.",
  },
  {
    icon: Train,
    title: "Getting here",
    body: "Six minutes' walk from Clayton Station. The 631, 703 and 800 all stop at the door.",
  },
  {
    icon: Clock,
    title: "Best time to walk in",
    body: "Before 6pm or after 9pm. Between those, order ahead — the queue is real on Fridays.",
  },
];

export function LocationSection() {
  const hour = useSyncExternalStore(subscribeToClock, clockSnapshot, serverSnapshot);
  const open = hour !== null && hour >= OPEN_HOUR && hour < CLOSE_HOUR;

  return (
    <Section id="visit" glow="ember">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Find us"
            title={
              <>
                300 Clayton Road.
                <span className="text-gradient-ember"> Seven days.</span>
              </>
            }
            blurb="The grill is on from 11am. The doner is usually gone by close, which is the point."
          />

          <Reveal delay={0.14}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold">
                {hour === null ? (
                  <span className="text-zinc-400">Checking hours…</span>
                ) : (
                  <>
                    <span className="relative flex size-2.5">
                      {open && (
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-open opacity-60" />
                      )}
                      <span
                        className={`relative inline-flex size-2.5 rounded-full ${open ? "bg-open" : "bg-zinc-600"}`}
                      />
                    </span>
                    <span className={open ? "text-open" : "text-zinc-400"}>
                      {open ? "Open now" : "Closed"}
                    </span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-zinc-400">{STORE.hours}</span>
                  </>
                )}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2.5">
              <a
                href={mapsHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-ember to-gold px-5 py-3 text-sm font-bold text-obsidian shadow-ember transition-transform duration-200 hover:scale-[1.02]"
              >
                <MapPin className="size-4" aria-hidden />
                Directions
                <ExternalLink className="size-3.5 opacity-70" aria-hidden />
              </a>
              <a
                href={telHref}
                className="glass inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-zinc-100 transition-colors hover:border-ember/40 hover:bg-ember/10"
              >
                <Phone className="size-4 text-ember" aria-hidden />
                {STORE.phone}
              </a>
            </div>
          </Reveal>

          <ul className="mt-10 space-y-4">
            {PRACTICALS.map((item, index) => (
              <Reveal as="li" key={item.title} delay={0.18 + index * 0.06}>
                <div className="flex items-start gap-3.5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10">
                    <item.icon className="size-4 text-ember" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-100">{item.title}</h3>
                    <p className="mt-0.5 text-sm leading-relaxed text-zinc-400">{item.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal delay={0.1}>
          <div className="glass-2 grain relative overflow-hidden rounded-4xl p-2.5">
            <div className="relative overflow-hidden rounded-[1.6rem]">
              <Image
                src={PHOTOS.venue.src}
                alt={PHOTOS.venue.alt}
                width={PHOTOS.venue.width}
                height={PHOTOS.venue.height}
                placeholder="blur"
                blurDataURL={PHOTOS.venue.blur}
                sizes="(max-width: 1024px) 92vw, 46vw"
                className="aspect-4/3 w-full object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-t from-obsidian via-obsidian/25 to-transparent"
              />

              <div className="absolute inset-x-5 bottom-5">
                <p className="font-display text-xl font-extrabold tracking-tight">
                  {STORE.address}
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  Dine in, take away, or order ahead and skip the counter.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

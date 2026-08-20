import { Clock, Flame, MapPin, Phone, Star } from "lucide-react";
import { STORE } from "@/lib/data";

const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE.address)}`;

export function Footer() {
  return (
    <footer className="relative mt-8 overflow-hidden border-t border-white/8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_100%,rgba(245,158,11,0.10),transparent_70%)]"
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-xl bg-linear-to-br from-ember to-flame shadow-ember">
              <Flame className="size-5 text-obsidian" aria-hidden />
            </span>
            <span className="font-display text-xl font-extrabold tracking-tight">
              Kebab<span className="text-gradient-ember"> X</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-500">
            Charcoal-grilled kebabs, loaded snack packs and share platters, carved to order in
            {" "}{STORE.suburb}. Halal certified, seven days a week.
          </p>
          <p className="mt-4 flex items-center gap-1.5 text-sm text-zinc-400">
            <Star className="size-4 fill-gold text-gold" aria-hidden />
            <span className="font-semibold text-zinc-200">{STORE.rating}</span>
            <span className="text-zinc-600">from {STORE.reviews} reviews</span>
          </p>
        </div>

        <div>
          <h2 className="font-display text-sm font-bold tracking-[0.16em] text-zinc-300 uppercase">
            Find us
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-zinc-400">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-ember" aria-hidden />
              <a
                href={mapsHref}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-ember"
              >
                {STORE.address}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-ember" aria-hidden />
              <a
                href={`tel:${STORE.phone.replace(/\s|\(|\)/g, "")}`}
                className="transition-colors hover:text-ember"
              >
                {STORE.phone}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 size-4 shrink-0 text-ember" aria-hidden />
              {STORE.hours}
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-bold tracking-[0.16em] text-zinc-300 uppercase">
            Ordering
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm text-zinc-400">
            <li>
              Pickup from {STORE.shortAddress} — ready in{" "}
              <span className="text-zinc-200">{STORE.pickupEta}</span>
            </li>
            <li>
              Delivery across {STORE.suburb} —{" "}
              <span className="text-zinc-200">{STORE.deliveryEta}</span>
            </li>
            <li>
              Free delivery over{" "}
              <span className="text-zinc-200">${STORE.freeDeliveryOver.toFixed(0)}</span>
            </li>
            <li className="text-zinc-500">All prices in AUD and include GST.</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/8 px-4 py-6 text-center text-xs text-zinc-600 sm:px-6 lg:px-8">
        <p>
          © {new Date().getFullYear()} {STORE.name} {STORE.suburb}. Demo storefront — orders are
          simulated locally and never sent anywhere.
        </p>
      </div>
    </footer>
  );
}

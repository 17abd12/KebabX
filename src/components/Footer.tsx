import { Clock, Flame, Mail, MapPin, Phone, Star } from "lucide-react";
import { STORE } from "@/lib/data";

const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE.address)}`;
const telHref = `tel:${STORE.phone.replace(/[\s()]/g, "")}`;

const COLUMNS = [
  {
    heading: "Order",
    links: [
      { label: "Full menu", href: "#menu" },
      { label: "Signature HSPs", href: "#menu" },
      { label: "Pickup & delivery", href: "#visit" },
      { label: "Questions", href: "#faq" },
    ],
  },
  {
    heading: "Business",
    links: [
      { label: "Catering packages", href: "#catering" },
      { label: "Instant quote", href: "#quote" },
      { label: "How it works", href: "#how" },
      { label: "Corporate accounts", href: "#catering" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-8 overflow-hidden border-t border-white/8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_100%,rgba(245,158,11,0.10),transparent_70%)]"
      />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:px-8">
        {/* Brand */}
        <div className="lg:col-span-4">
          <div className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-xl bg-linear-to-br from-ember to-flame shadow-ember">
              <Flame className="size-5 text-obsidian" aria-hidden />
            </span>
            <span className="font-display text-xl font-extrabold tracking-tight">
              Kebab<span className="text-gradient-ember"> X</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-500">
            Charcoal-grilled kebabs, loaded snack packs and share platters, carved to order in{" "}
            {STORE.suburb}. Halal certified, seven days a week — for one person or one hundred.
          </p>
          <p className="mt-4 flex items-center gap-1.5 text-sm text-zinc-400">
            <Star className="size-4 fill-gold text-gold" aria-hidden />
            <span className="font-semibold text-zinc-200 tabular">{STORE.rating}</span>
            <span className="text-zinc-600 tabular">from {STORE.reviews} reviews</span>
          </p>
        </div>

        {/* Link columns */}
        {COLUMNS.map((column) => (
          <nav key={column.heading} aria-label={column.heading} className="lg:col-span-2">
            <h2 className="eyebrow text-zinc-300">{column.heading}</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-zinc-400">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="transition-colors hover:text-ember">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        {/* Contact */}
        <div className="lg:col-span-4">
          <h2 className="eyebrow text-zinc-300">Find us</h2>
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
              <a href={telHref} className="transition-colors hover:text-ember">
                {STORE.phone}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-ember" aria-hidden />
              <a
                href={`mailto:${STORE.cateringEmail}`}
                className="transition-colors hover:text-ember"
              >
                {STORE.cateringEmail}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 size-4 shrink-0 text-ember" aria-hidden />
              {STORE.hours}
            </li>
          </ul>

          <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-zinc-600">
            <div>
              <dt className="inline">Pickup </dt>
              <dd className="inline text-zinc-400">{STORE.pickupEta}</dd>
            </div>
            <div>
              <dt className="inline">Delivery </dt>
              <dd className="inline text-zinc-400">{STORE.deliveryEta}</dd>
            </div>
            <div>
              <dt className="inline">Free over </dt>
              <dd className="inline text-zinc-400 tabular">${STORE.freeDeliveryOver.toFixed(0)}</dd>
            </div>
            <div>
              <dt className="inline">ABN </dt>
              <dd className="inline text-zinc-400 tabular">{STORE.abn}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="border-t border-white/8 px-4 py-6 text-center text-xs text-zinc-600 sm:px-6 lg:px-8">
        <p>
          © {new Date().getFullYear()} {STORE.name} {STORE.suburb}. All prices in AUD and include
          GST. Demo storefront — orders and catering enquiries are simulated locally and never sent
          anywhere.
        </p>
      </div>
    </footer>
  );
}

import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CATERING_PACKAGES } from "@/lib/content";
import { STORE } from "@/lib/data";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Prices, head counts and ETAs are set in mono. Numbers that a buyer is going
 * to compare or transcribe read as data rather than as marketing copy, and
 * tabular figures stop the layout jittering as a slider changes them.
 */
const jetbrains = JetBrains_Mono({
  variable: "--font-mono-jb",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${STORE.name} — Clayton | Kebabs, HSPs, Charcoal Grill & Office Catering`,
  description:
    "Elevated street food grilled to perfection at 300 Clayton Rd, Clayton VIC. Order pickup or delivery — signature doner kebabs, loaded halal snack packs, charcoal platters. Corporate catering from $18.50 per head with 30-day invoicing.",
  keywords: [
    "kebab Clayton",
    "HSP Clayton",
    "halal snack pack Melbourne",
    "doner kebab 3168",
    "Kebab X Clayton",
    "office catering Clayton",
    "corporate catering Melbourne south east",
    "halal catering Monash",
  ],
  openGraph: {
    title: `${STORE.name} — Clayton`,
    description:
      "Charcoal-grilled kebabs and halal snack packs in Clayton VIC. Pickup, delivery, and per-head office catering.",
    locale: "en_AU",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#09080a",
  colorScheme: "dark",
};

/**
 * Restaurant structured data. Catering buyers land here from search far more
 * often than from a link, and an entry with hours, price range and a rating
 * attached wins that click against three unmarked competitors.
 */
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: STORE.name,
  address: {
    "@type": "PostalAddress",
    streetAddress: "300 Clayton Rd",
    addressLocality: STORE.suburb,
    addressRegion: "VIC",
    postalCode: "3168",
    addressCountry: "AU",
  },
  telephone: STORE.phone,
  servesCuisine: ["Turkish", "Middle Eastern", "Halal"],
  priceRange: "$$",
  openingHours: "Mo-Su 11:00-23:00",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: STORE.rating,
    reviewCount: STORE.reviews,
  },
  makesOffer: CATERING_PACKAGES.map((pkg) => ({
    "@type": "Offer",
    name: `${pkg.name} catering`,
    description: pkg.pitch,
    price: pkg.perHead,
    priceCurrency: "AUD",
    eligibleQuantity: {
      "@type": "QuantitativeValue",
      minValue: pkg.minHeads,
      unitText: "person",
    },
  })),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-AU"
      className={`${jakarta.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="bg-obsidian flex min-h-full flex-col text-zinc-100">
        <a
          href="#menu"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-full focus:bg-ember focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-obsidian"
        >
          Skip to menu
        </a>
        {children}
        <script
          type="application/ld+json"
          // Serialised from a literal we control — no user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}

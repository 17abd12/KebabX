import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { STORE } from "@/lib/data";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${STORE.name} — Clayton | Kebabs, HSPs & Charcoal Grill`,
  description:
    "Elevated street food grilled to perfection at 300 Clayton Rd, Clayton VIC. Order pickup or delivery: signature doner kebabs, loaded halal snack packs, charcoal platters and fresh dips.",
  keywords: [
    "kebab Clayton",
    "HSP Clayton",
    "halal snack pack Melbourne",
    "doner kebab 3168",
    "Kebab X Clayton",
  ],
  openGraph: {
    title: `${STORE.name} — Clayton`,
    description: "Elevated street food. Grilled to perfection. Pickup & delivery in Clayton VIC.",
    locale: "en_AU",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-AU" className={`${jakarta.variable} h-full antialiased`}>
      <body className="bg-obsidian min-h-full flex flex-col text-zinc-100">
        <a
          href="#menu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ember focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-obsidian"
        >
          Skip to menu
        </a>
        {children}
      </body>
    </html>
  );
}

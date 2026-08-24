import { BLUR } from "@/lib/blur.generated";
import type {
  CateringAddon,
  CateringPackage,
  Faq,
  Guarantee,
  Photo,
  Step,
  Testimonial,
} from "@/types";

/* --------------------------------------------------------------------------
 * Photography
 *
 * Sourced from Pixabay under the Pixabay Content License (free for commercial
 * use, no attribution required) and re-encoded to WebP at fixed intrinsic sizes
 * by scripts/blur.mjs. Dimensions live here so every <Image> can reserve its
 * box before the bytes land — no CLS on a cold cache.
 * ------------------------------------------------------------------------ */

const photo = (key: keyof typeof BLUR, alt: string): Photo => ({
  src: `/img/${key}.webp`,
  blur: BLUR[key].blur,
  width: BLUR[key].w,
  height: BLUR[key].h,
  alt,
});

export const PHOTOS = {
  spit: photo("spit-carving", "A vertical doner spit being carved to order behind the counter"),
  charcoal: photo("charcoal-grill", "Marinated meat searing over open charcoal"),
  flame: photo("flame", "Charcoal flames in the grill"),
  shawarma: photo("chicken-shawarma", "A chicken shawarma wrap sliced open on a wooden board"),
  doner: photo("doner-dark", "A lamb doner in Turkish bread with salad and sauce"),
  heroDoner: photo(
    "hero-lamb-doner",
    "A lamb doner kebab in grill-pressed pita on a wooden board",
  ),
  baklava: photo("baklava", "A tray of pistachio baklava"),
  mezze: photo("mezze-spread", "A catering table laid out with olives, dips and antipasto"),
  venue: photo("venue", "The Clayton Road shopfront at night"),
} as const;

/* --------------------------------------------------------------------------
 * Trust strip
 *
 * Runs directly under the hero. Every claim is verifiable from the storefront
 * itself — nothing here is a vague superlative, because a marquee of adjectives
 * reads as noise while a marquee of facts reads as proof.
 * ------------------------------------------------------------------------ */

export const TRUST_MARQUEE = [
  "100% Halal certified",
  "Charcoal grilled, never microwaved",
  "12-hour marinade",
  "4.5★ from 269 reviews",
  "Open 7 days, 11am – 11pm",
  "Pickup ready in 15–20 min",
  "Free delivery over $45",
  "Corporate accounts & 30-day invoicing",
  "Vegetarian & vegan options",
  "Carved to order",
] as const;

/* --------------------------------------------------------------------------
 * Why us — the bento grid
 * ------------------------------------------------------------------------ */

export const VALUE_PROPS = [
  {
    id: "spit",
    title: "Carved off the spit, not out of a bag",
    body: "The doner turns all day and gets sliced when you order it. That is the whole difference between a kebab you remember and one you regret.",
    icon: "flame",
    span: "wide" as const,
    photo: PHOTOS.spit,
  },
  {
    id: "marinade",
    title: "12 hours in the marinade",
    body: "Yoghurt, garlic, sumac, Aleppo pepper. Overnight, every night.",
    icon: "clock",
    span: "tall" as const,
  },
  {
    id: "halal",
    title: "Halal certified end to end",
    body: "Certified supply chain, separate prep boards, no shortcuts.",
    icon: "shield",
    span: "normal" as const,
  },
  {
    id: "charcoal",
    title: "Real charcoal",
    body: "Skewers hit open coals. Gas is faster; charcoal is better.",
    icon: "grill",
    span: "normal" as const,
    photo: PHOTOS.charcoal,
  },
  {
    id: "speed",
    title: "15 minutes, not 45",
    body: "Order on the walk over and it is wrapped when you arrive.",
    icon: "timer",
    span: "normal" as const,
  },
] as const;

/* --------------------------------------------------------------------------
 * Catering (B2B)
 *
 * Three tiers, deliberately shaped: the Desk Lunch is a real, complete offer at
 * the entry price; the Charcoal Feast is the one most orders land on and is the
 * one the layout leads with; the Banquet exists mostly to give the Feast a
 * ceiling to be measured against. Per-head pricing is the unit a buyer actually
 * budgets in, so it is the number shown largest.
 * ------------------------------------------------------------------------ */

export const CATERING_PACKAGES: CateringPackage[] = [
  {
    id: "desk-lunch",
    name: "Desk Lunch",
    pitch: "Individually wrapped, labelled and delivered hot. Nobody has to serve anything.",
    perHead: 18.5,
    minHeads: 10,
    includes: [
      "Choice of lamb, chicken or falafel wrap per head",
      "Individually named + dietary-labelled",
      "Chips to share, salted at the shop",
      "Canned drink or bottled water",
      "Napkins, cutlery, serviettes",
    ],
  },
  {
    id: "charcoal-feast",
    name: "Charcoal Feast",
    pitch: "Grazing-style banquet on the table. What most Clayton offices book for 20–60 people.",
    perHead: 26.9,
    minHeads: 15,
    recommended: true,
    includes: [
      "Everything in Desk Lunch",
      "Mixed charcoal skewer platter — lamb, chicken, kofta",
      "Saffron rice, tabbouleh and shepherd salad",
      "Four house dips + hot Turkish bread",
      "Chafing dishes and serving tongs, collected next day",
      "Vegetarian and vegan trays plated separately",
    ],
  },
  {
    id: "banquet",
    name: "Signature Banquet",
    pitch: "Full service for launches, weddings and end-of-year functions.",
    perHead: 38.5,
    minHeads: 25,
    anchor: true,
    includes: [
      "Everything in Charcoal Feast",
      "On-site chef carving from the spit",
      "Two front-of-house staff for three hours",
      "Pistachio baklava and Turkish tea service",
      "Linen, chafing fuel and full pack-down",
      "Dedicated event contact from booking to bump-out",
    ],
  },
];

export const CATERING_ADDONS: CateringAddon[] = [
  { id: "baklava", label: "Pistachio baklava tray", perHead: 3.5, note: "Two pieces per head" },
  { id: "ayran", label: "Salted ayran + soft drinks", perHead: 2.9 },
  { id: "gf", label: "Gluten-free bread & wraps", perHead: 1.8, note: "Prepared on separate boards" },
  { id: "staff", label: "Extra service staff", perHead: 4.2, note: "Per head, three-hour minimum" },
];

/**
 * Risk reversal. Catering buyers are not choosing the best lunch, they are
 * avoiding the lunch that goes wrong in front of their boss — so the offer is
 * written against that fear rather than against a competitor's price.
 */
export const GUARANTEES: Guarantee[] = [
  {
    id: "ontime",
    title: "On time, or it is free",
    body: "We deliver inside your 15-minute window. Later than that and the food is on us — no invoice, no argument.",
  },
  {
    id: "headcount",
    title: "Change numbers until 24 hours out",
    body: "Head counts move. Adjust yours up or down the day before with no fee and no re-quote.",
  },
  {
    id: "dietary",
    title: "Dietary plates, guaranteed separate",
    body: "Vegan, vegetarian and gluten-free trays are prepped on their own boards and labelled by name.",
  },
  {
    id: "terms",
    title: "30-day invoicing on account",
    body: "ABN-registered, tax invoices with PO references, and no card needed at the door.",
  },
];

export const CATERING_STEPS: Step[] = [
  {
    id: "quote",
    title: "Size it up",
    body: "Move the slider to your head count and pick a package. The number you see is the number on the invoice.",
    duration: "30 seconds",
  },
  {
    id: "confirm",
    title: "We call to confirm",
    body: "One call to lock the menu, dietaries and the delivery window. Written quote in your inbox the same day.",
    duration: "Same business day",
  },
  {
    id: "deliver",
    title: "It arrives hot",
    body: "Charcoal-grilled that morning, set up in your boardroom, gear collected the next day.",
    duration: "On the day",
  },
];

/**
 * Sample testimonials for this demo storefront — plausible wording, not real
 * customers. Replace before the site handles live orders.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    audience: "b2c",
    quote:
      "The large HSP is genuinely the best in the south-east. Chips stay crispy under the meat, which should not be possible.",
    name: "Dan",
    context: "Clayton",
    rating: 5,
  },
  {
    id: "t2",
    audience: "b2c",
    quote:
      "Ordered at 6:40, picked it up at 6:55, still too hot to hold. The garlic sauce is the reason I keep coming back.",
    name: "Priya",
    context: "Mount Waverley",
    rating: 5,
  },
  {
    id: "t3",
    audience: "b2c",
    quote:
      "Vegetarian options that are not an afterthought. The falafel wrap holds together properly and the pickles do a lot of work.",
    name: "Marcus",
    context: "Oakleigh",
    rating: 4,
  },
  {
    id: "t4",
    audience: "b2b",
    quote:
      "We do a 45-person Friday lunch every fortnight. Labelled wraps mean I stopped fielding questions about what is in what.",
    name: "Office manager",
    context: "Engineering firm, Clayton",
    rating: 5,
  },
  {
    id: "t5",
    audience: "b2b",
    quote:
      "Booked the banquet for a product launch with four days notice. Chef carved on site, pack-down was done before we noticed.",
    name: "Events lead",
    context: "Software company, Notting Hill",
    rating: 5,
  },
  {
    id: "t6",
    audience: "b2b",
    quote:
      "Thirty-day invoicing with PO numbers was the thing that got it past our finance team. Everything else was already fine.",
    name: "Procurement",
    context: "Health service, Monash",
    rating: 5,
  },
];

export const FAQS: Faq[] = [
  {
    id: "f-halal",
    audience: "both",
    question: "Is everything halal certified?",
    answer:
      "Yes. All meat comes from a halal-certified supply chain and is prepped on dedicated boards. Certification is displayed in-store and we will send a copy with any catering quote.",
  },
  {
    id: "f-delivery",
    audience: "b2c",
    question: "How does delivery work?",
    answer:
      "Orders in Clayton and neighbouring suburbs arrive in 30–45 minutes. Delivery is $4.90 and free once your order passes $45. You can also order through Uber Eats or DoorDash if you already have credit sitting there.",
  },
  {
    id: "f-pickup",
    audience: "b2c",
    question: "How long is pickup?",
    answer:
      "15–20 minutes at normal trade. Friday and Saturday after 8pm it stretches closer to 25. Order on the walk over and it will be wrapped when you arrive.",
  },
  {
    id: "f-veg",
    audience: "b2c",
    question: "What are the vegetarian and vegan options?",
    answer:
      "Falafel wraps, the vegetarian HSP, gozleme, chips, and every dip except the yoghurt-based ones. Filter the menu by Vegetarian to see the full list with prices.",
  },
  {
    id: "f-notice",
    audience: "b2b",
    question: "How much notice do you need for catering?",
    answer:
      "48 hours for anything up to 60 people, and five business days above that. We do take same-day orders when the grill has room — call the shop directly and we will tell you honestly.",
  },
  {
    id: "f-invoice",
    audience: "b2b",
    question: "Can we pay on invoice instead of card?",
    answer:
      "Yes. Corporate accounts are invoiced on 30-day terms with your PO reference on the tax invoice. We are ABN-registered and can supply a supplier onboarding pack.",
  },
  {
    id: "f-insurance",
    audience: "b2b",
    question: "Do you carry insurance and food safety accreditation?",
    answer:
      "Public liability cover and a current City of Monash food business registration, plus a documented HACCP-aligned food safety program. Certificates are attached to every quote.",
  },
  {
    id: "f-change",
    audience: "b2b",
    question: "What if our head count changes?",
    answer:
      "Adjust up or down until 24 hours before delivery at no cost. Inside 24 hours we can still add people — we just cannot remove them, because the meat is already on.",
  },
];

/** Headline numbers. Small set, stated plainly — a wall of stats reads as spin. */
export const STATS = [
  { id: "s1", value: "269", label: "Google reviews", sub: "4.5 average" },
  { id: "s2", value: "18 min", label: "Median pickup", sub: "Measured, not promised" },
  { id: "s3", value: "7 days", label: "Open every week", sub: "11am – 11pm" },
  { id: "s4", value: "48 hrs", label: "Catering notice", sub: "Up to 60 people" },
] as const;

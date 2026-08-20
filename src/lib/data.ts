import type { Category, CustomizationGroup, MenuItem } from "@/types";

export const STORE = {
  name: "Kebab X",
  suburb: "Clayton",
  address: "300 Clayton Rd, Clayton VIC 3168",
  shortAddress: "300 Clayton Rd",
  region: "Clayton VIC",
  phone: "(03) 9544 0300",
  rating: 4.5,
  reviews: 269,
  hours: "11:00am – 11:00pm, 7 days",
  pickupEta: "15–20 mins",
  deliveryEta: "30–45 mins",
  pickupEtaMinutes: 18,
  deliveryEtaMinutes: 38,
  deliveryFee: 4.9,
  freeDeliveryOver: 45,
  /** GST is already inside Australian menu prices — surfaced as a component of the total. */
  gstRate: 0.1,
} as const;

export const CATEGORIES: Category[] = [
  {
    key: "kebabs",
    label: "Signature Kebabs",
    blurb: "Vertical-spit doner, carved to order and wrapped hot.",
  },
  {
    key: "hsp",
    label: "Halal Snack Packs",
    blurb: "Chips, cheese and the holy trinity — garlic, BBQ, chilli.",
  },
  {
    key: "platters",
    label: "Gourmet Platters & Skewers",
    blurb: "Charcoal skewers and share plates built for a table.",
  },
  {
    key: "sides",
    label: "Loaded Sides & Fresh Dips",
    blurb: "House dips whipped daily, chips fried to order.",
  },
  {
    key: "drinks",
    label: "Drinks & Desserts",
    blurb: "Pistachio baklava, cold cans and salted ayran.",
  },
];

/**
 * Placeholder photography. Every id below was checked to resolve on
 * images.unsplash.com — swap them for real store shots before launch.
 */
const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

/* ---------------------------------------------------------------------------
 * Reusable customization groups. Options are cloned per item so item-level
 * tweaks never mutate the shared templates.
 * ------------------------------------------------------------------------- */

const meatGroup: CustomizationGroup = {
  id: "meat",
  title: "Choose your meat",
  description: "Carved fresh from the spit.",
  type: "single",
  min: 1,
  options: [
    { id: "lamb", label: "Lamb Doner", price: 0, default: true, note: "Slow-roasted, 12 hr marinade" },
    { id: "chicken", label: "Chicken Doner", price: 0, note: "Lemon, oregano, garlic" },
    { id: "falafel", label: "Falafel", price: 0, note: "Vegetarian, chickpea & herb" },
    { id: "combo", label: "Lamb + Chicken Combo", price: 2.5, note: "Best of both" },
  ],
};

const breadGroup: CustomizationGroup = {
  id: "bread",
  title: "Bread & base",
  type: "single",
  min: 1,
  options: [
    { id: "pita", label: "Warm Pita", price: 0, default: true, note: "Grill-pressed" },
    { id: "turkish", label: "Fresh Turkish Bread", price: 1.0, note: "Baked in-house daily" },
    { id: "rice", label: "Rice Bowl", price: 2.0, note: "Gluten friendly — no bread" },
  ],
};

const saladGroup: CustomizationGroup = {
  id: "salads",
  title: "Salad & veggies",
  description: "All free. Load it up.",
  type: "multi",
  options: [
    { id: "lettuce", label: "Cos Lettuce", price: 0, default: true },
    { id: "tomato", label: "Vine Tomato", price: 0, default: true },
    { id: "onion", label: "Spanish Onion", price: 0, default: true },
    { id: "cucumber", label: "Lebanese Cucumber", price: 0 },
    { id: "pickles", label: "Pickled Chillies", price: 0 },
    { id: "tabouli", label: "House Tabouli", price: 1.5 },
  ],
};

const sauceGroup: CustomizationGroup = {
  id: "sauces",
  title: "Sauces",
  description: "Pick up to 3.",
  type: "multi",
  max: 3,
  options: [
    { id: "garlic", label: "Garlic Sauce", price: 0, default: true, note: "The house legend" },
    { id: "sweetchilli", label: "Sweet Chilli", price: 0 },
    { id: "sriracha", label: "Spicy Sriracha", price: 0, note: "Brings the heat" },
    { id: "bbq", label: "Smoky BBQ", price: 0 },
    { id: "tahini", label: "Homestyle Tahini", price: 0 },
    { id: "hummus", label: "Hummus Drizzle", price: 0.5 },
  ],
};

const addonGroup: CustomizationGroup = {
  id: "addons",
  title: "Add-ons",
  type: "multi",
  options: [
    { id: "cheese", label: "Extra Cheese", price: 2.0 },
    { id: "doublemeat", label: "Double Meat", price: 6.0, note: "Serious hunger only" },
    { id: "jalapenos", label: "Jalapeños", price: 1.0 },
    { id: "chipsinside", label: "Crispy Chips Inside", price: 2.5 },
    { id: "egg", label: "Fried Egg", price: 2.0 },
    { id: "saucetub", label: "Extra Sauce Tub", price: 1.0 },
  ],
};

const comboGroup: CustomizationGroup = {
  id: "addons",
  title: "Make it a combo",
  type: "multi",
  options: [
    { id: "chips", label: "Add Small Chips", price: 4.5 },
    { id: "baklava", label: "Add 1pc Baklava", price: 3.0 },
  ],
};

/** Clone a template group plus its options so per-item overrides stay local. */
const g = (
  group: CustomizationGroup,
  overrides: Partial<CustomizationGroup> = {},
): CustomizationGroup => ({
  ...group,
  ...overrides,
  options: (overrides.options ?? group.options).map((o) => ({ ...o })),
});

/** Re-flag which options start selected, leaving everything else intact. */
const defaults = (group: CustomizationGroup, ids: string[]) =>
  group.options.map((o) => ({ ...o, default: ids.includes(o.id) }));

export const MENU: MenuItem[] = [
  /* ---------------------------- Signature Kebabs --------------------------- */
  {
    id: "lamb-doner",
    name: "Lamb Doner Kebab",
    description:
      "Twelve-hour marinated lamb carved straight off the spit, packed into grill-pressed pita with crisp salad and garlic sauce.",
    price: 16.5,
    category: "kebabs",
    image: img("1529006557810-274b9b2fc783"),
    ingredients: [
      "Lamb doner",
      "Warm pita",
      "Cos lettuce",
      "Vine tomato",
      "Spanish onion",
      "Garlic sauce",
    ],
    tags: ["Halal Certified"],
    spice: 1,
    kj: 3120,
    featured: true,
    popular: true,
    customization: [g(meatGroup), g(breadGroup), g(saladGroup), g(sauceGroup), g(addonGroup)],
  },
  {
    id: "chicken-doner",
    name: "Chicken Doner Kebab",
    description:
      "Lemon-oregano chicken shaved thin, charred at the edges, finished with tabouli and a double hit of garlic.",
    price: 16.0,
    category: "kebabs",
    image: img("1626700051175-6818013e1d4f"),
    ingredients: ["Chicken doner", "Warm pita", "Tabouli", "Cucumber", "Garlic sauce", "Lemon"],
    tags: ["Halal Certified"],
    spice: 0,
    kj: 2870,
    popular: true,
    customization: [
      g(meatGroup, { options: defaults(meatGroup, ["chicken"]) }),
      g(breadGroup),
      g(saladGroup),
      g(sauceGroup),
      g(addonGroup),
    ],
  },
  {
    id: "mixed-doner",
    name: "Mixed Doner Kebab",
    description:
      "Lamb and chicken stacked together in Turkish bread with pickled chillies, tahini and a smoky BBQ finish.",
    price: 17.5,
    category: "kebabs",
    image: img("1561651823-34feb02250e4"),
    ingredients: [
      "Lamb doner",
      "Chicken doner",
      "Turkish bread",
      "Pickled chilli",
      "Tahini",
      "Smoky BBQ",
    ],
    tags: ["Halal Certified", "Spicy"],
    spice: 2,
    kj: 3480,
    featured: true,
    customization: [
      g(meatGroup, { options: defaults(meatGroup, ["combo"]) }),
      g(breadGroup, { options: defaults(breadGroup, ["turkish"]) }),
      g(saladGroup),
      g(sauceGroup, { options: defaults(sauceGroup, ["garlic", "bbq"]) }),
      g(addonGroup),
    ],
  },
  {
    id: "falafel-wrap",
    name: "Falafel & Halloumi Wrap",
    description:
      "Crunchy chickpea falafel with seared halloumi, pickled turnip and a heavy pour of homestyle tahini.",
    price: 15.0,
    category: "kebabs",
    image: img("1540189549336-e6e99c3679fe"),
    ingredients: ["Falafel", "Grilled halloumi", "Pickled turnip", "Rocket", "Tahini", "Warm pita"],
    tags: ["Vegetarian", "Halal Certified"],
    spice: 0,
    kj: 2410,
    customization: [
      g(meatGroup, {
        title: "Choose your filling",
        options: [
          { id: "falafel", label: "Falafel", price: 0, default: true, note: "Vegetarian" },
          { id: "falafel-halloumi", label: "Falafel + Halloumi", price: 2.0 },
          { id: "chicken", label: "Swap to Chicken Doner", price: 1.0 },
        ],
      }),
      g(breadGroup),
      g(saladGroup),
      g(sauceGroup, { options: defaults(sauceGroup, ["tahini"]) }),
      g(addonGroup),
    ],
  },

  /* ------------------------------ Snack Packs ------------------------------ */
  {
    id: "classic-hsp",
    name: "The Classic HSP",
    description:
      "Golden chips, melted cheese and a mountain of doner, hit with the holy trinity — garlic, BBQ and chilli.",
    price: 18.5,
    category: "hsp",
    image: img("1571091718767-18b5b1457add"),
    ingredients: [
      "Hand-cut chips",
      "Melted cheese",
      "Lamb doner",
      "Garlic sauce",
      "BBQ sauce",
      "Chilli sauce",
    ],
    tags: ["Halal Certified", "Spicy"],
    spice: 2,
    kj: 5240,
    featured: true,
    popular: true,
    customization: [
      g(meatGroup),
      g(sauceGroup, {
        title: "The holy trinity",
        description: "Classic is all three. Pick up to 3.",
        options: defaults(sauceGroup, ["garlic", "bbq", "sweetchilli"]),
      }),
      g(addonGroup),
    ],
  },
  {
    id: "mega-hsp",
    name: "Mega X HSP",
    description:
      "Beast mode — double meat, double cheese, jalapeños and a fried egg on top. Feeds one very brave human.",
    price: 24.9,
    category: "hsp",
    image: img("1550547660-d9450f859349"),
    ingredients: [
      "Double doner",
      "Double cheese",
      "Hand-cut chips",
      "Jalapeños",
      "Fried egg",
      "Trinity sauces",
    ],
    tags: ["Halal Certified", "Spicy"],
    spice: 3,
    kj: 7680,
    featured: true,
    customization: [
      g(meatGroup, { options: defaults(meatGroup, ["combo"]) }),
      g(sauceGroup, {
        title: "The holy trinity",
        options: defaults(sauceGroup, ["garlic", "bbq", "sriracha"]),
      }),
      g(addonGroup, { options: defaults(addonGroup, ["cheese", "jalapenos"]) }),
    ],
  },
  {
    id: "chicken-hsp",
    name: "Chicken Snack Pack",
    description:
      "Lighter, lemony chicken doner over crisp chips with garlic and sweet chilli. The everyday order.",
    price: 18.0,
    category: "hsp",
    image: img("1552611052-33e04de081de"),
    ingredients: ["Chicken doner", "Hand-cut chips", "Cheese", "Garlic sauce", "Sweet chilli"],
    tags: ["Halal Certified"],
    spice: 1,
    kj: 4780,
    customization: [
      g(meatGroup, { options: defaults(meatGroup, ["chicken"]) }),
      g(sauceGroup, { options: defaults(sauceGroup, ["garlic", "sweetchilli"]) }),
      g(addonGroup),
    ],
  },

  /* -------------------------- Platters & Skewers --------------------------- */
  {
    id: "mixed-grill-platter",
    name: "Mixed Grill Platter",
    description:
      "Lamb skewers, chicken shish and doner over saffron rice with grilled chilli, tomato and a trio of dips. Shares between two.",
    price: 38.9,
    category: "platters",
    image: img("1544025162-d76694265947"),
    ingredients: [
      "Lamb skewer",
      "Chicken shish",
      "Doner",
      "Saffron rice",
      "Grilled chilli",
      "Dip trio",
    ],
    tags: ["Halal Certified"],
    spice: 1,
    kj: 6420,
    featured: true,
    popular: true,
    customization: [
      g(meatGroup, {
        title: "Protein mix",
        description: "Built for two. Swap the whole board if you like.",
        options: [
          {
            id: "mixed",
            label: "House Mixed Grill",
            price: 0,
            default: true,
            note: "Lamb, chicken & doner",
          },
          { id: "lamb-heavy", label: "All Lamb", price: 3.0 },
          { id: "chicken-heavy", label: "All Chicken", price: 0 },
          { id: "veg", label: "Vegetarian Board", price: -2.0, note: "Falafel & halloumi" },
        ],
      }),
      g(breadGroup, {
        title: "Base",
        options: [
          { id: "rice", label: "Saffron Rice", price: 0, default: true },
          { id: "chips", label: "Hand-cut Chips", price: 0 },
          { id: "salad", label: "Garden Salad", price: 0, note: "Low carb" },
        ],
      }),
      g(sauceGroup),
      g(addonGroup),
    ],
  },
  {
    id: "chicken-shish-plate",
    name: "Charcoal Chicken Shish Plate",
    description:
      "Two skewers of char-grilled thigh fillet with smoked paprika, saffron rice, grilled veg and garlic yoghurt.",
    price: 26.5,
    category: "platters",
    image: img("1600891964092-4316c288032e"),
    ingredients: [
      "Chicken thigh skewers",
      "Smoked paprika",
      "Saffron rice",
      "Grilled capsicum",
      "Garlic yoghurt",
    ],
    tags: ["Halal Certified", "Gluten Free"],
    spice: 1,
    kj: 4120,
    customization: [
      g(breadGroup, {
        title: "Base",
        options: [
          { id: "rice", label: "Saffron Rice", price: 0, default: true },
          { id: "chips", label: "Hand-cut Chips", price: 0 },
          { id: "salad", label: "Garden Salad", price: 0 },
        ],
      }),
      g(sauceGroup),
      g(addonGroup, {
        options: [
          { id: "extraskewer", label: "Third Skewer", price: 7.5 },
          { id: "halloumi", label: "Grilled Halloumi", price: 4.0 },
          { id: "cheese", label: "Extra Cheese", price: 2.0 },
          { id: "saucetub", label: "Extra Sauce Tub", price: 1.0 },
        ],
      }),
    ],
  },

  /* ----------------------------- Sides & Dips ------------------------------ */
  {
    id: "loaded-chips",
    name: "Loaded Cheesy Chips",
    description:
      "Hand-cut chips under molten cheese, chilli oil, spring onion and a garlic drizzle. The table killer.",
    price: 12.5,
    category: "sides",
    image: img("1585032226651-759b368d7246"),
    ingredients: ["Hand-cut chips", "Mozzarella", "Chilli oil", "Spring onion", "Garlic drizzle"],
    tags: ["Vegetarian", "Spicy"],
    spice: 2,
    kj: 3340,
    popular: true,
    customization: [
      g(sauceGroup, { title: "Drizzle", description: "Pick up to 3." }),
      g(addonGroup, {
        options: [
          { id: "cheese", label: "Extra Cheese", price: 2.0 },
          { id: "doner", label: "Top with Doner", price: 5.5 },
          { id: "jalapenos", label: "Jalapeños", price: 1.0 },
          { id: "egg", label: "Fried Egg", price: 2.0 },
        ],
      }),
    ],
  },
  {
    id: "dip-trio",
    name: "Fresh Dip Trio & Pita",
    description:
      "Hummus, baba ghanoush and whipped garlic toum, whisked daily, with a stack of blistered pita.",
    price: 11.9,
    category: "sides",
    image: img("1541592106381-b31e9677c0e5"),
    ingredients: ["Hummus", "Baba ghanoush", "Garlic toum", "Olive oil", "Sumac", "Blistered pita"],
    tags: ["Vegetarian", "Vegan", "Halal Certified"],
    spice: 0,
    kj: 1980,
    customization: [
      g(sauceGroup, {
        title: "Choose your dips",
        description: "Three included. Pick up to 3.",
        max: 3,
        options: [
          { id: "hummus", label: "Hummus", price: 0, default: true },
          { id: "baba", label: "Baba Ghanoush", price: 0, default: true },
          { id: "toum", label: "Garlic Toum", price: 0, default: true },
          { id: "tzatziki", label: "Cucumber Tzatziki", price: 0 },
          { id: "muhammara", label: "Muhammara", price: 1.5, note: "Walnut & red pepper" },
        ],
      }),
      g(addonGroup, {
        options: [
          { id: "extrapita", label: "Extra Pita (2pc)", price: 2.5 },
          { id: "olives", label: "Marinated Olives", price: 3.5 },
          { id: "falafel", label: "4pc Falafel", price: 5.0 },
        ],
      }),
    ],
  },
  {
    id: "falafel-bites",
    name: "Crispy Falafel Bites",
    description:
      "Eight herb-flecked chickpea bites fried to order, dusted with sumac and served with tahini.",
    price: 10.5,
    category: "sides",
    image: img("1593560708920-61dd98c46a4e"),
    ingredients: ["Chickpea falafel", "Parsley", "Coriander", "Sumac", "Tahini"],
    tags: ["Vegetarian", "Vegan", "Halal Certified"],
    spice: 0,
    kj: 1740,
    customization: [
      g(sauceGroup, { title: "Dipping sauce", description: "Pick up to 3." }),
      g(addonGroup, {
        options: [
          { id: "double", label: "Make it 16pc", price: 8.0 },
          { id: "halloumi", label: "Add Halloumi", price: 4.0 },
        ],
      }),
    ],
  },

  /* -------------------------- Drinks & Desserts ---------------------------- */
  {
    id: "baklava",
    name: "Pistachio Baklava (4pc)",
    description:
      "Layered filo, crushed Antep pistachio and orange-blossom syrup. Cut fresh, never soggy.",
    price: 9.5,
    category: "drinks",
    image: img("1519676867240-f03562e64548"),
    ingredients: ["Filo pastry", "Antep pistachio", "Butter", "Orange blossom syrup"],
    tags: ["Vegetarian"],
    spice: 0,
    kj: 1620,
    popular: true,
    customization: [
      g(comboGroup, {
        title: "Make it bigger",
        options: [
          { id: "eightpc", label: "Upgrade to 8pc", price: 8.0 },
          { id: "icecream", label: "Add Vanilla Ice Cream", price: 3.5 },
          { id: "turkishtea", label: "Add Turkish Tea", price: 3.0 },
        ],
      }),
    ],
  },
  {
    id: "cold-drinks",
    name: "Cold Drinks & Ayran",
    description:
      "Ice-cold cans, Turkish salted ayran and sparkling water — straight out of the back fridge.",
    price: 4.0,
    category: "drinks",
    image: img("1517686469429-8bdb88b9f907"),
    ingredients: ["Soft drink cans", "Salted ayran", "Sparkling water"],
    tags: ["Vegetarian", "Halal Certified"],
    spice: 0,
    customization: [
      {
        id: "meat",
        title: "Choose your drink",
        type: "single",
        min: 1,
        options: [
          { id: "coke", label: "Coca-Cola 375ml", price: 0, default: true },
          { id: "cokezero", label: "Coke Zero 375ml", price: 0 },
          { id: "solo", label: "Solo 375ml", price: 0 },
          { id: "ayran", label: "Salted Ayran 300ml", price: 1.0, note: "Turkish yoghurt drink" },
        ],
      },
      g(comboGroup),
    ],
  },
];

export const DIETARY_FILTERS = ["Halal Certified", "Vegetarian", "Spicy"] as const;

export const SPICE_LABEL = ["Mild", "Mild+", "Medium Heat", "Fire"] as const;

export type OrderType = "pickup" | "delivery";

export type CategoryKey =
  | "kebabs"
  | "hsp"
  | "platters"
  | "sides"
  | "drinks";

export type DietaryTag = "Halal Certified" | "Vegetarian" | "Spicy" | "Vegan" | "Gluten Free";

export type SpiceLevel = 0 | 1 | 2 | 3;

export interface Category {
  key: CategoryKey;
  label: string;
  blurb: string;
}

/** A single selectable option inside a customization group. */
export interface CustomizationOption {
  id: string;
  label: string;
  /** Price delta in AUD. 0 for free options. */
  price: number;
  /** Marks the option preselected when the modal opens. */
  default?: boolean;
  /** Short hint shown under the label. */
  note?: string;
}

export type CustomizationGroupId =
  | "meat"
  | "bread"
  | "salads"
  | "sauces"
  | "addons"
  | "drink";

export interface CustomizationGroup {
  id: CustomizationGroupId;
  title: string;
  description?: string;
  /** "single" renders radios, "multi" renders toggles. */
  type: "single" | "multi";
  /** Minimum selections required before the item can be added. */
  min?: number;
  /** Maximum selections allowed (multi only). */
  max?: number;
  options: CustomizationOption[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  /** Base price in AUD. */
  price: number;
  category: CategoryKey;
  /**
   * Omitted when we have no photograph of this dish yet. The UI shows a branded
   * "photo coming soon" tile rather than borrowing a stock shot of some other
   * food — a pizza on the falafel card costs more trust than an empty tile.
   */
  image?: string;
  ingredients: string[];
  tags: DietaryTag[];
  spice: SpiceLevel;
  /** Kilojoules, shown as a small detail in the modal. */
  kj?: number;
  featured?: boolean;
  popular?: boolean;
  /** Groups offered for this item. Omitted groups are simply not shown. */
  customization: CustomizationGroup[];
}

/** A resolved selection: group id -> chosen option ids. */
export type Selections = Record<string, string[]>;

export interface CartItem {
  /** Stable line id — same item with different options is a separate line. */
  lineId: string;
  itemId: string;
  name: string;
  /** Mirrors MenuItem.image; absent when the dish has no photo yet. */
  image?: string;
  basePrice: number;
  quantity: number;
  selections: Selections;
  /** Flattened, human-readable option labels for display in the cart. */
  selectionLabels: string[];
  /** Unit price including all option deltas. */
  unitPrice: number;
  notes?: string;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
  suburb: string;
  notes: string;
}

export type OrderStage = "received" | "grilling" | "ready";

export interface PlacedOrder {
  reference: string;
  placedAt: number;
  orderType: OrderType;
  items: CartItem[];
  customer: CustomerDetails;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  etaMinutes: number;
}

export interface OrderState {
  orderType: OrderType;
  items: CartItem[];
  customer: CustomerDetails;
  lastOrder: PlacedOrder | null;
}

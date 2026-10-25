// Canonical catalogue content for AVS. Used to render marketing sections AND to
// seed the database. Prices are intentionally left "on request" (placeholders)
// so the owner sets real pricing from the admin panel before launch.

export type SampleSlab = {
  minQty: number;
  maxQty: number | null;
  pricePaise: number | null;
  savingsLabel?: string;
};

export type SampleProduct = {
  sku: string;
  name: string;
  shortDesc: string;
  packInfo: string;
  moq?: string;
  unit?: string;
  hsnCode?: string;
  gstRate?: number;
  badge?: "BESTSELLER" | "ECO";
  priceOnRequest?: boolean;
  specs?: Array<{ label: string; value: string }>;
  slabs?: SampleSlab[];
};

export type CategoryData = {
  slug: string;
  name: string;
  icon: string; // lucide icon key (see CategoryIcon)
  tagline: string;
  blurb: string;
  items: string[];
  products: SampleProduct[];
};

export const CATEGORIES: CategoryData[] = [
  {
    slug: "stationery",
    name: "Office Stationery",
    icon: "pen",
    tagline: "Pens, paper, files and every desk essential",
    blurb:
      "Paper, pens, files and desk essentials — in office-ready packs and bulk cartons.",
    items: ["Paper & notebooks", "Pens & markers", "Files & folders", "Desk accessories"],
    products: [
      {
        sku: "AVS-ST-0101",
        name: "A4 Copier Paper, 75 GSM",
        shortDesc: "Ream of 500 · MOQ 10",
        packInfo: "Ream of 500 · MOQ 10",
        moq: "10 reams",
        unit: "ream",
        hsnCode: "4802",
        gstRate: 12,
        badge: "BESTSELLER",
        priceOnRequest: true,
        specs: [
          { label: "Paper size", value: "A4 (210 × 297 mm)" },
          { label: "Weight", value: "75 GSM" },
          { label: "Sheets per ream", value: "500" },
          { label: "Reams per carton", value: "5" },
          { label: "HSN code", value: "4802" },
        ],
        slabs: [
          { minQty: 10, maxQty: 49, pricePaise: null },
          { minQty: 50, maxQty: 199, pricePaise: null, savingsLabel: "Better rate" },
          { minQty: 200, maxQty: null, pricePaise: null, savingsLabel: "Best quote — talk to us" },
        ],
      },
      {
        sku: "AVS-ST-0102",
        name: "Ball Pens, Blue",
        shortDesc: "Box of 50 · MOQ 5 boxes",
        packInfo: "Box of 50 · MOQ 5 boxes",
        moq: "5 boxes",
        unit: "box",
        gstRate: 12,
        priceOnRequest: true,
      },
      {
        sku: "AVS-ST-0103",
        name: "Spiral Notebooks, A5",
        shortDesc: "Pack of 10 · MOQ 5 packs",
        packInfo: "Pack of 10 · MOQ 5 packs",
        moq: "5 packs",
        unit: "pack",
        badge: "ECO",
        gstRate: 12,
        priceOnRequest: true,
      },
      {
        sku: "AVS-ST-0104",
        name: "Lever-Arch Box Files",
        shortDesc: "Pack of 10 · MOQ 2 packs",
        packInfo: "Pack of 10 · MOQ 2 packs",
        moq: "2 packs",
        unit: "pack",
        gstRate: 18,
        priceOnRequest: true,
      },
      {
        sku: "AVS-ST-0105",
        name: "Sticky Notes, 3 × 3 in",
        shortDesc: "12 pads · MOQ 5 packs",
        packInfo: "12 pads · MOQ 5 packs",
        moq: "5 packs",
        unit: "pack",
        gstRate: 18,
        priceOnRequest: true,
      },
      {
        sku: "AVS-ST-0106",
        name: "Stapler with Pins",
        shortDesc: "Set · MOQ 5 sets",
        packInfo: "Set · MOQ 5 sets",
        moq: "5 sets",
        unit: "set",
        gstRate: 18,
        priceOnRequest: true,
      },
      {
        sku: "AVS-ST-0107",
        name: "Whiteboard Markers",
        shortDesc: "Box of 10 · MOQ 5 boxes",
        packInfo: "Box of 10 · MOQ 5 boxes",
        moq: "5 boxes",
        unit: "box",
        gstRate: 12,
        priceOnRequest: true,
      },
      {
        sku: "AVS-ST-0108",
        name: "Toner Cartridges (Compatible)",
        shortDesc: "Compatible · Price on request",
        packInfo: "Each · Price on request",
        unit: "unit",
        gstRate: 18,
        priceOnRequest: true,
      },
    ],
  },
  {
    slug: "housekeeping",
    name: "Housekeeping",
    icon: "spray",
    tagline: "Cleaning chemicals, tissue, tools and hygiene",
    blurb: "Cleaning chemicals, tissue, tools and hygiene dispensers.",
    items: ["Cleaning chemicals", "Tissue & hygiene", "Mops & tools", "Garbage bags"],
    products: [
      { sku: "AVS-HK-0201", name: "Floor Cleaner Concentrate, 5 L", shortDesc: "Can of 5 L · MOQ 4", packInfo: "Can of 5 L · MOQ 4", unit: "can", gstRate: 18, priceOnRequest: true },
      { sku: "AVS-HK-0202", name: "2-Ply Facial Tissue", shortDesc: "Carton of 30 boxes · MOQ 2", packInfo: "Carton of 30 boxes · MOQ 2", unit: "carton", gstRate: 18, priceOnRequest: true },
      { sku: "AVS-HK-0203", name: "Microfibre Cleaning Cloths", shortDesc: "Pack of 20 · MOQ 5 packs", packInfo: "Pack of 20 · MOQ 5 packs", unit: "pack", badge: "ECO", gstRate: 12, priceOnRequest: true },
      { sku: "AVS-HK-0204", name: "Garbage Bags, 24 × 32 in", shortDesc: "Roll of 30 · MOQ 10 rolls", packInfo: "Roll of 30 · MOQ 10 rolls", unit: "roll", gstRate: 18, priceOnRequest: true },
      { sku: "AVS-HK-0205", name: "Hand Wash Refill, 5 L", shortDesc: "Can of 5 L · MOQ 4", packInfo: "Can of 5 L · MOQ 4", unit: "can", gstRate: 18, priceOnRequest: true },
      { sku: "AVS-HK-0206", name: "Kentucky Mop & Bucket Set", shortDesc: "Set · MOQ 2 sets", packInfo: "Set · MOQ 2 sets", unit: "set", gstRate: 18, priceOnRequest: true },
    ],
  },
  {
    slug: "pantry",
    name: "Pantry Supplies",
    icon: "coffee",
    tagline: "Tea, coffee, snacks, water and disposables",
    blurb: "Tea, coffee, snacks, water and pantry disposables.",
    items: ["Tea & coffee", "Snacks & biscuits", "Water & beverages", "Pantry disposables"],
    products: [
      { sku: "AVS-PT-0301", name: "Instant Coffee, 500 g", shortDesc: "Jar of 500 g · MOQ 6", packInfo: "Jar of 500 g · MOQ 6", unit: "jar", gstRate: 18, priceOnRequest: true, badge: "BESTSELLER" },
      { sku: "AVS-PT-0302", name: "Assorted Tea Bags", shortDesc: "Box of 100 · MOQ 10 boxes", packInfo: "Box of 100 · MOQ 10 boxes", unit: "box", gstRate: 5, priceOnRequest: true },
      { sku: "AVS-PT-0303", name: "Paper Cups, 150 ml", shortDesc: "Sleeve of 100 · MOQ 20", packInfo: "Sleeve of 100 · MOQ 20", unit: "sleeve", badge: "ECO", gstRate: 18, priceOnRequest: true },
      { sku: "AVS-PT-0304", name: "Packaged Drinking Water, 1 L", shortDesc: "Case of 12 · MOQ 10 cases", packInfo: "Case of 12 · MOQ 10 cases", unit: "case", gstRate: 18, priceOnRequest: true },
      { sku: "AVS-PT-0305", name: "Assorted Biscuits", shortDesc: "Carton · MOQ 4 cartons", packInfo: "Carton · MOQ 4 cartons", unit: "carton", gstRate: 18, priceOnRequest: true },
    ],
  },
  {
    slug: "gifting",
    name: "Corporate Gifting",
    icon: "gift",
    tagline: "Hampers, welcome kits and branded gifts",
    blurb: "Festive hampers, welcome kits and branded gifts.",
    items: ["Festive hampers", "Welcome kits", "Client gifts", "Branded merchandise"],
    products: [
      { sku: "AVS-GF-0401", name: "Diwali Gift Hamper", shortDesc: "Per hamper · MOQ 25", packInfo: "Per hamper · MOQ 25", unit: "hamper", gstRate: 18, priceOnRequest: true },
      { sku: "AVS-GF-0402", name: "New-Joiner Welcome Kit", shortDesc: "Per kit · MOQ 25", packInfo: "Per kit · MOQ 25", unit: "kit", gstRate: 18, priceOnRequest: true },
      { sku: "AVS-GF-0403", name: "Branded Steel Bottle & Diary Set", shortDesc: "Per set · MOQ 50", packInfo: "Per set · MOQ 50", unit: "set", gstRate: 18, priceOnRequest: true },
      { sku: "AVS-GF-0404", name: "Gourmet Dry-Fruit Box", shortDesc: "Per box · MOQ 25", packInfo: "Per box · MOQ 25", unit: "box", gstRate: 12, priceOnRequest: true },
    ],
  },
  {
    slug: "printing",
    name: "Printing",
    icon: "printer",
    tagline: "Visiting cards, letterheads and brochures",
    blurb: "Visiting cards, letterheads, brochures and ID cards.",
    items: ["Visiting cards", "Letterheads", "Brochures & flyers", "ID cards & lanyards"],
    products: [
      { sku: "AVS-PR-0501", name: "Visiting Cards, 350 GSM", shortDesc: "Box of 100 · MOQ 5 boxes", packInfo: "Box of 100 · MOQ 5 boxes", unit: "box", gstRate: 18, priceOnRequest: true },
      { sku: "AVS-PR-0502", name: "Letterheads, A4", shortDesc: "Pack of 100 · MOQ 5 packs", packInfo: "Pack of 100 · MOQ 5 packs", unit: "pack", gstRate: 18, priceOnRequest: true },
      { sku: "AVS-PR-0503", name: "Tri-Fold Brochures, A4", shortDesc: "Pack of 100 · MOQ 5 packs", packInfo: "Pack of 100 · MOQ 5 packs", unit: "pack", gstRate: 18, priceOnRequest: true },
      { sku: "AVS-PR-0504", name: "ID Cards & Lanyards", shortDesc: "Per set · MOQ 25", packInfo: "Per set · MOQ 25", unit: "set", gstRate: 18, priceOnRequest: true },
    ],
  },
  {
    slug: "facility-bulk",
    name: "Facility & Bulk",
    icon: "boxes",
    tagline: "Packaging, safety and bulk consumables",
    blurb: "Packaging, safety and bulk facility consumables.",
    items: ["Packaging material", "Safety & PPE", "Maintenance items", "Bulk consumables"],
    products: [
      { sku: "AVS-FB-0601", name: "Corrugated Cartons, Medium", shortDesc: "Bundle of 25 · MOQ 4", packInfo: "Bundle of 25 · MOQ 4", unit: "bundle", gstRate: 18, priceOnRequest: true },
      { sku: "AVS-FB-0602", name: "Nitrile Gloves", shortDesc: "Box of 100 · MOQ 10 boxes", packInfo: "Box of 100 · MOQ 10 boxes", unit: "box", gstRate: 18, priceOnRequest: true },
      { sku: "AVS-FB-0603", name: "Safety Helmets", shortDesc: "Each · MOQ 10", packInfo: "Each · MOQ 10", unit: "unit", gstRate: 18, priceOnRequest: true },
      { sku: "AVS-FB-0604", name: "Stretch Wrap Film", shortDesc: "Roll · MOQ 6 rolls", packInfo: "Roll · MOQ 6 rolls", unit: "roll", gstRate: 18, priceOnRequest: true },
    ],
  },
];

export function getCategory(slug: string): CategoryData | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

/*
 * Static storefront content: the hero slides and the silk collections.
 * Products, prices and stock are never here; they come from the season
 * catalogue in Supabase.
 */

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: { label: string; to: string };
  secondary?: { label: string; to: string };
  /** Which artwork the slide draws on its right-hand side. */
  art: "emblem" | "saree" | "mart";
}

export const heroSlides: HeroSlide[] = [
  {
    id: "welcome",
    eyebrow: "Welcome to Maragatha Mart",
    title: "Tradition Woven in Elegance",
    subtitle:
      "Silk sarees from Maragatha Silks and a carefully chosen range of everyday essentials, from Kayathar to your doorstep.",
    cta: { label: "Explore Silks", to: "/silks" },
    secondary: { label: "Shop All", to: "/shop" },
    art: "emblem",
  },
  {
    id: "silks",
    eyebrow: "Maragatha Silks",
    title: "Kanchipuram & Soft Silk Sarees",
    subtitle:
      "Rich zari borders, temple motifs and colours chosen for weddings, festivals and every celebration in between.",
    cta: { label: "View the Silk Collection", to: "/silks" },
    art: "saree",
  },
  {
    id: "mart",
    eyebrow: "One store, many needs",
    title: "Everything for Home & Family",
    subtitle:
      "Textiles, home, kitchen, gifting and festive essentials, picked with the same care as our silks.",
    cta: { label: "Start Shopping", to: "/shop" },
    secondary: { label: "Quick Order", to: "/quick-order" },
    art: "mart",
  },
];

/**
 * The colours a saree tile is drawn in. Each collection gets the palette it
 * is known for, so the tiles read as different silks without a photograph.
 */
export interface SareePalette {
  body: string;
  bodyShade: string;
  border: string;
  zari: string;
  butta: string;
}

export interface SilkCollection {
  slug: string;
  name: string;
  blurb: string;
  palette: SareePalette;
  /**
   * Words that place a catalogue product in this collection, matched against
   * the product's name and its category's name. The catalogue has no
   * "collection" column, so naming is the contract: a product called
   * "Kanchipuram Bridal Pattu" lands in both Kanchipuram and Wedding.
   */
  keywords: string[];
  /** A photograph, when the collection comes from the database. */
  image_url?: string | null;
}

/**
 * The built-in collections. The live list is the silk_collections table
 * (useSilkCollections); these are its fallback and supply the colours the
 * drawn saree uses when a collection has no photograph.
 */
export const silkCollections: SilkCollection[] = [
  {
    slug: "kanchipuram",
    name: "Kanchipuram Pattu",
    blurb: "Heavy mulberry silk with contrast korvai borders and pure zari pallus.",
    palette: { body: "#7A1F3D", bodyShade: "#5A1229", border: "#0A4A31", zari: "#D4AF37", butta: "#F4DE8E" },
    keywords: ["kanchi", "kanjeevaram", "kanjivaram", "pattu"],
  },
  {
    slug: "wedding",
    name: "Wedding Silks",
    blurb: "Muhurtham sarees in auspicious reds and golds, made to be remembered.",
    palette: { body: "#9E1B1B", bodyShade: "#701010", border: "#C9A227", zari: "#F4DE8E", butta: "#E9C866" },
    keywords: ["wedding", "bridal", "muhurtham", "muhurtam"],
  },
  {
    slug: "soft-silk",
    name: "Soft Silk",
    blurb: "Feather-light drapes for festivals, functions and long days.",
    palette: { body: "#0E5E6F", bodyShade: "#08414D", border: "#B0306A", zari: "#E9C866", butta: "#F7E7B4" },
    keywords: ["soft silk", "softsilk", "soft"],
  },
  {
    slug: "banarasi",
    name: "Banarasi Silk",
    blurb: "Intricate brocade and meenakari weaves from the looms of Varanasi.",
    palette: { body: "#3D1E6D", bodyShade: "#28124A", border: "#C9A227", zari: "#E9C866", butta: "#F4DE8E" },
    keywords: ["banarasi", "banaras", "benarasi"],
  },
  {
    slug: "silk-cotton",
    name: "Silk Cotton & Semi Silk",
    blurb: "The sheen of silk with the ease of cotton, for everyday elegance.",
    palette: { body: "#C98A1B", bodyShade: "#9C6A10", border: "#0E6B47", zari: "#F4DE8E", butta: "#FFF4D0" },
    keywords: ["silk cotton", "cotton silk", "semi silk", "semi-silk", "kora"],
  },
  {
    slug: "men",
    name: "Silk Dhotis & Veshtis",
    blurb: "Pure silk veshtis and angavastrams with fine zari borders.",
    palette: { body: "#F3EBD6", bodyShade: "#E2D5B5", border: "#C9A227", zari: "#B8901E", butta: "#E2D5B5" },
    keywords: ["dhoti", "veshti", "vesti", "angavastram", "men"],
  },
];

/** Words that mark a product as part of the silk house at all. */
export const SILK_KEYWORDS = [
  "silk",
  "saree",
  "sari",
  "pattu",
  "kanchi",
  "banarasi",
  "dhoti",
  "veshti",
  "vesti",
  "pavadai",
  "blouse",
];

import { SILK_KEYWORDS, type SilkCollection } from "../data/products";

interface Named {
  name: string;
  categories?: { name: string } | null;
}

function haystack(p: Named): string {
  return `${p.name} ${p.categories?.name ?? ""}`.toLowerCase();
}

/**
 * Whether a catalogue product belongs to the silk house. There is no flag for
 * it in the database: a product is a silk if its name or its category says so,
 * which is how staff already name sarees ("Kanchipuram Pattu – Maroon").
 * Putting silks in a category called "Silk Sarees" is enough.
 */
export function isSilkProduct(p: Named): boolean {
  const text = haystack(p);
  return SILK_KEYWORDS.some((k) => text.includes(k));
}

export function inCollection(p: Named, c: SilkCollection): boolean {
  const text = haystack(p);
  return c.keywords.some((k) => text.includes(k));
}

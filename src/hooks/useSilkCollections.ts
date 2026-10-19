import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { silkCollections as builtIn, type SilkCollection } from "../data/products";

export interface SilkCollectionRow {
  id: string;
  slug: string;
  name: string;
  blurb: string | null;
  image_url: string | null;
  keywords: string[];
  sort_order: number;
  is_active: boolean;
}

/**
 * Maragatha Silks' collections, from the silk_collections table.
 *
 * Rows keep the drawn-saree colours of the built-in collection with the same
 * slug (or the first one's), so a collection without a photo still has art.
 * If the table is empty or unreachable the built-in list is used, so the
 * silk band is never blank.
 */
export function useSilkCollections(includeInactive = false) {
  const [rows, setRows] = useState<SilkCollectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const refresh = useCallback(async () => {
    let query = supabase.from("silk_collections").select("*").order("sort_order").order("name");
    if (!includeInactive) query = query.eq("is_active", true);
    const { data, error } = await query;
    if (error) {
      console.error("Silk collections failed to load:", error);
      setFailed(true);
    } else {
      setRows((data ?? []) as SilkCollectionRow[]);
      setFailed(false);
    }
    setLoading(false);
  }, [includeInactive]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const collections: SilkCollection[] =
    !loading && (failed || rows.length === 0) && !includeInactive
      ? builtIn
      : rows.map((r) => ({
          slug: r.slug,
          name: r.name,
          blurb: r.blurb ?? "",
          keywords: r.keywords ?? [],
          image_url: r.image_url,
          palette: (builtIn.find((b) => b.slug === r.slug) ?? builtIn[0]).palette,
        }));

  return { collections, rows, loading, refresh };
}

import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export interface HeroSlideRow {
  id: string;
  image_url: string;
  eyebrow: string | null;
  title: string;
  subtitle: string | null;
  cta_label: string | null;
  cta_link: string | null;
  secondary_label: string | null;
  secondary_link: string | null;
  sort_order: number;
  is_active: boolean;
}

/**
 * The home page banner slides, from the hero_slides table.
 *
 * @param includeInactive  Admin Settings passes true to list hidden slides
 *                         too (RLS lets only admins see those).
 */
export function useHeroSlides(includeInactive = false) {
  const [slides, setSlides] = useState<HeroSlideRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    let query = supabase.from("hero_slides").select("*").order("sort_order").order("created_at");
    if (!includeInactive) query = query.eq("is_active", true);
    const { data, error } = await query;
    if (error) {
      console.error("Hero slides failed to load:", error);
      setError(error.message);
    } else {
      setSlides((data ?? []) as HeroSlideRow[]);
      setError(null);
    }
    setLoading(false);
  }, [includeInactive]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { slides, loading, error, refresh };
}

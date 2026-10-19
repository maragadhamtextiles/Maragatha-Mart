import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { setDefaultTitle } from "../lib/seo";

interface AppSettings {
  id: string;
  site_title: string;
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  font_family: string;
  base_font_size: string;
  button_style: string;
  card_style: string;
  hero_banners: string[] | null;
  enable_email_notifications?: boolean;
  enable_whatsapp_notifications?: boolean;
  enable_push_notifications?: boolean;
  // Business details printed on invoices and quotations.
  business_legal_name?: string | null;
  gstin?: string | null;
  business_address?: string | null;
  business_state?: string | null;
  business_phone?: string | null;
  business_email?: string | null;
  /** Print the GSTIN on invoices. Off by default. */
  gst_on_invoice?: boolean;
  /** Path in the private business-assets bucket; see lib/businessSignature. */
  signature_path?: string | null;
}

interface AppSettingsContextType {
  settings: AppSettings | null;
  loading: boolean;
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(
  undefined
);

/*
 * The previous storefront's defaults. A settings row still holding these was
 * never customised for this shop, so the emerald-and-gold palette in index.css
 * is left in charge rather than painted over with them.
 */
const LEGACY_COLORS = new Set(["#ff5722", "#ff0000", "#ffc107", "#8a2be2", "#0d1b2a"]);
const LEGACY_FONTS = new Set(["montserrat", "roboto", "bebas neue"]);
const isLegacyColor = (hex?: string | null) => !hex || LEGACY_COLORS.has(hex.trim().toLowerCase());

/*
 * The settings row was inherited from the previous storefront, so until the
 * owner re-enters them its business fields hold another company's phone,
 * email, address and GSTIN. Printing those on this shop's pages and invoices
 * would send customers (and tax records) to the wrong business, so they are
 * dropped on read. If the legal name was theirs, so are the GSTIN and the
 * signature, and those go too.
 */
const LEGACY_BUSINESS = /sound\s*wave|cracker|sivakasi|vembakottai|kananjampatti|9363515184|9789794518/i;

function withoutLegacyBusiness(s: AppSettings): AppSettings {
  const out = { ...s };
  const fields = ["business_phone", "business_email", "business_address", "business_legal_name"] as const;
  const legacyName = LEGACY_BUSINESS.test(s.business_legal_name ?? "");
  for (const f of fields) {
    if (LEGACY_BUSINESS.test(out[f] ?? "")) out[f] = null;
  }
  if (legacyName) {
    out.gstin = null;
    out.signature_path = null;
  }
  return out;
}

export function AppSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("app_settings")
        .select("*")
        .single();
      
      if (error && error.code !== "PGRST116") {
          console.error("Failed to fetch settings:", error);
      }
      
      if (data) {
        setSettings(withoutLegacyBusiness(data));
        applyTheme(data);
      } else {
        // Fallback or create default? 
        // We generally rely on migration to insert default row, but if missing:
        applyDefaultTheme();
      }
    } catch (e) {
      console.error(e);
      applyDefaultTheme();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    if (!settings) return;
    try {
      const { error } = await supabase
        .from("app_settings")
        .update(newSettings)
        .eq("id", settings.id);
      
      if (error) throw error;
      
      // Optimistic update
      const updated = { ...settings, ...newSettings };
      setSettings(updated);
      applyTheme(updated);
    } catch (err) {
      console.error("Failed to update settings:", err);
      throw err;
    }
  };

  const applyTheme = (s: AppSettings) => {
    try {
      const root = document.documentElement;
      

      // Helper to convert hex to rgb channels (Robust)
      const hexToRgb = (hex: string): string | null => {
        if (!hex) return null;
        hex = hex.trim();
        // Handle shorthand #fff
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => {
          return r + r + g + g + b + b;
        });

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
          ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(
              result[3],
              16
            )}`
          : null;
      };

      // Apply Colors with Fallbacks
      if (!isLegacyColor(s.primary_color)) {
          const rgb = hexToRgb(s.primary_color);
          if (rgb) {
            root.style.setProperty("--primary-orange", rgb);
            root.style.setProperty("--primary-red", rgb); // Map to Red too
          } else {
             // Fallback if invalid hex
             console.warn("Invalid Primary Color Hex");
          }
      }
      
      if (!isLegacyColor(s.secondary_color)) {
          const rgb = hexToRgb(s.secondary_color);
          if (rgb) root.style.setProperty("--secondary-purple", rgb);
      }
      
      if (!isLegacyColor(s.accent_color)) {
          const rgb = hexToRgb(s.accent_color);
          if (rgb) root.style.setProperty("--primary-yellow", rgb);
      }

      // Font Family
      if (s.font_family && !LEGACY_FONTS.has(s.font_family.replace(/['"]/g, "").trim().toLowerCase())) {
        root.style.setProperty("--font-montserrat", s.font_family);
        
        // Dynamic Font Loading (Google Fonts)
        const fontName = s.font_family.replace(/['"]/g, "").trim();
        const fontId = "dynamic-font-link";
        if (fontName !== "Montserrat" && fontName !== "sans-serif") {
           let link = document.getElementById(fontId) as HTMLLinkElement;
           if (!link) {
             link = document.createElement("link");
             link.id = fontId;
             link.rel = "stylesheet";
             document.head.appendChild(link);
           }
           // Basic mapping for known fonts or fallback to generic
           // 'Playfair Display' -> 'Playfair+Display'
           const query = fontName.replace(/ /g, "+");
           link.href = `https://fonts.googleapis.com/css2?family=${query}:wght@400;700&display=swap`;
        }
        
        // FORCE Body Font
        document.body.style.fontFamily = s.font_family;
      }
      
      // Button Style
      if (s.button_style) {
          const radii: Record<string, string> = {
              "rounded": "0.5rem",
              "pill": "9999px",
              "sharp": "0px"
          };
          root.style.setProperty("--btn-radius", radii[s.button_style] || "0.5rem");
      }
      
      // Card Style
      if (s.card_style) {
          const radii: Record<string, string> = {
              "rounded": "0.75rem",
              "sharp": "0px"
          };
          root.style.setProperty("--card-radius", radii[s.card_style] || "0.75rem");
      }
      
      // Site Title
      if (s.site_title && !/sound\s*wave|cracker/i.test(s.site_title)) {
          // Not over a page that has set its own title, such as a blog post.
          setDefaultTitle(s.site_title);
      }
      
      // Favicon
      if (s.favicon_url) {
          const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
          if (link) {
              link.href = s.favicon_url;
          }
      }
    } catch (e) {
      console.error("Error applying theme:", e);
    }
  };

  const applyDefaultTheme = () => {
      // Don't need to do anything as index.css has defaults, but good for safety
  };

  return (
    <AppSettingsContext.Provider
      value={{ settings, loading, updateSettings, refreshSettings: fetchSettings }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error("useAppSettings must be used within AppSettingsProvider");
  }
  return context;
}

/*
 * The shop's identity in one place. Anything that prints the name, the
 * domain or the tagline reads it from here, so a rename is one edit.
 *
 * Contact details (phone, email, address, GSTIN) are deliberately not here:
 * they live in `app_settings` and are edited from Admin Settings, so the shop
 * can change a number without a deploy. Components read them through
 * `useAppSettings()` and hide a line that has not been filled in rather than
 * show a made-up one.
 */
export const BRAND = {
  name: "Maragatha Mart",
  shortName: "Maragatha",
  /** The silk house inside the mart, as it appears on the emblem. */
  silkName: "Maragatha Silks",
  tagline: "Tradition Woven in Elegance",
  description:
    "Maragatha Mart — silk sarees, textiles and everyday essentials under one roof. Handpicked Kanchipuram and soft silk sarees, with home, kitchen, gifting and festive needs, delivered across India.",
  domain: "maragathamart.com",
  town: "Kayathar",
  /**
   * The shop's call and WhatsApp number. Admin Settings' business_phone,
   * when filled in, takes precedence; this is what shows until then.
   */
  phone: "+91 90806 55064",
  /** Social profiles. An empty link hides its icon rather than pointing nowhere. */
  social: {
    instagram: "",
    youtube: "",
  },
  logo: "/assets/img/logo/maragatha-monogram.png",
  logoFull: "/assets/img/logo/maragatha-logo.jpg",
  logoGold: "/assets/img/logo/maragatha-logo-gold.png",
  /** Placeholder shown when a product has no photograph. */
  productPlaceholder: "/assets/img/logo/logo-product.png",
} as const;

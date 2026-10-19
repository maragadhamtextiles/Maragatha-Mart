import { BRAND } from "../config/brand";

/**
 * Who the business is, as printed on invoices and quotations.
 *
 * Read from app_settings (Admin Settings → Business & GST). The fallbacks are
 * only the shop's name and domain from `BRAND`: no phone number or email is
 * ever made up here. A detail that has not been filled in comes back empty,
 * and every document that prints this block leaves that line out rather than
 * printing a number nobody answers.
 */

export interface BusinessDetails {
  name: string;
  address: string | null;
  state: string | null;
  /** Empty when Admin Settings has none. */
  phone: string;
  /** Empty when Admin Settings has none. */
  email: string;
  website: string;
  gstin: string | null;
  /** True when the GSTIN should be printed on invoices. */
  showGst: boolean;
}

export const DEFAULT_BUSINESS: BusinessDetails = {
  name: BRAND.name,
  address: null,
  state: null,
  phone: "",
  email: "",
  website: `www.${BRAND.domain}`,
  gstin: null,
  showGst: false,
};

export function businessFromSettings(settings: any): BusinessDetails {
  if (!settings) return DEFAULT_BUSINESS;
  const gstin = String(settings.gstin ?? "").trim() || null;
  return {
    name:
      String(settings.business_legal_name ?? "").trim() ||
      String(settings.site_title ?? "").trim() ||
      DEFAULT_BUSINESS.name,
    address: String(settings.business_address ?? "").trim() || null,
    state: String(settings.business_state ?? "").trim() || null,
    phone: String(settings.business_phone ?? "").trim() || DEFAULT_BUSINESS.phone,
    email: String(settings.business_email ?? "").trim() || DEFAULT_BUSINESS.email,
    website: DEFAULT_BUSINESS.website,
    gstin,
    // Both the switch and a number: "on" with nothing to print prints nothing.
    showGst: Boolean(settings.gst_on_invoice) && gstin !== null,
  };
}

/** Escapes text for the HTML invoice, which is built as a string. */
export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

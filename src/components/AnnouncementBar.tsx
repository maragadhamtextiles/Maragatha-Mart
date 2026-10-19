import { Phone, Mail, Instagram, Youtube } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useAppSettings } from "../context/AppSettingsContext";
import { BRAND } from "../config/brand";

/** "+91 98765 43210" or "9876543210" → "919876543210", the form wa.me wants. */
export function waNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits;
}

/** The number to show: Admin Settings first, the brand's own otherwise. */
export function useShopPhone(): string {
  const { settings } = useAppSettings();
  return settings?.business_phone?.trim() || BRAND.phone;
}

const iconLink = "hover:text-white transition-colors";

/**
 * The thin bar above the nav: call and WhatsApp on the left, email and the
 * social profiles on the right. On a phone only the number and WhatsApp fit,
 * so the rest waits for md.
 */
export function AnnouncementBar() {
  const { settings } = useAppSettings();
  const phone = useShopPhone();
  const email = settings?.business_email?.trim() || "";
  const tel = `tel:${phone.replace(/\s/g, "")}`;
  const whatsapp = `https://wa.me/${waNumber(phone)}`;
  const { instagram, youtube } = BRAND.social;

  return (
    <div className="bg-brand-emerald text-brand-gold-light text-xs sm:text-sm py-1.5 border-b border-brand-gold/30">
      <div className="container mx-auto px-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-5 min-w-0">
          <div className="flex items-center gap-2">
            <a href={tel} className={iconLink} aria-label={`Call ${phone}`}>
              <Phone className="w-4 h-4" />
            </a>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={iconLink} aria-label="Chat with us on WhatsApp">
              <FaWhatsapp className="w-4 h-4" />
            </a>
            <a href={tel} className={`${iconLink} font-semibold tracking-wide whitespace-nowrap`}>
              {phone}
            </a>
          </div>
          {email && (
            <a href={`mailto:${email}`} className={`hidden md:flex items-center gap-1.5 ${iconLink}`}>
              <Mail className="w-4 h-4" />
              <span className="truncate">{email}</span>
            </a>
          )}
        </div>

        <span className="hidden lg:block font-display italic tracking-wide truncate">{BRAND.tagline}</span>

        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={iconLink} aria-label="WhatsApp">
            <FaWhatsapp className="w-4 h-4" />
          </a>
          {instagram && (
            <a href={instagram} target="_blank" rel="noopener noreferrer" className={iconLink} aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
          )}
          {youtube && (
            <a href={youtube} target="_blank" rel="noopener noreferrer" className={iconLink} aria-label="YouTube">
              <Youtube className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

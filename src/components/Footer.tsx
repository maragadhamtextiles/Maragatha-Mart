import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Youtube } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { waNumber } from "./AnnouncementBar";
import { useAppSettings } from "../context/AppSettingsContext";
import { BRAND } from "../config/brand";

const linkClass = "text-white/70 hover:text-brand-gold transition-colors";

export function Footer() {
  const { settings } = useAppSettings();
  const phone = settings?.business_phone?.trim() || BRAND.phone;
  const email = settings?.business_email?.trim();
  const address = settings?.business_address?.trim();

  return (
    // Bottom padding on phones clears the fixed bottom nav (h-16).
    <footer className="bg-emerald-silk text-white/80 pb-16 sm:pb-0">
      <div className="zari-border" />
      <div className="container mx-auto px-4 sm:px-6 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-5">
              <img src={BRAND.logo} alt="" aria-hidden="true" className="h-16 w-auto" />
              <span>
                <span className="block font-heading text-xl tracking-wider text-zari">{BRAND.name}</span>
                <span className="block font-display italic text-brand-gold-light/80">{BRAND.tagline}</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/70">
              Silk sarees from {BRAND.silkName}, with textiles, home, kitchen and gifting essentials, chosen with care in{" "}
              {BRAND.town}.
            </p>
            <div className="flex items-center gap-4 mt-5">
              <a
                href={`https://wa.me/${waNumber(phone)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="p-2 rounded-full border border-brand-gold/40 text-brand-gold hover:bg-brand-gold hover:text-brand-emerald transition-colors"
              >
                <FaWhatsapp className="w-4 h-4" />
              </a>
              {BRAND.social.instagram && (
                <a
                  href={BRAND.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="p-2 rounded-full border border-brand-gold/40 text-brand-gold hover:bg-brand-gold hover:text-brand-emerald transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {BRAND.social.youtube && (
                <a
                  href={BRAND.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="p-2 rounded-full border border-brand-gold/40 text-brand-gold hover:bg-brand-gold hover:text-brand-emerald transition-colors"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-heading tracking-widest text-brand-gold mb-5">Shop</h3>
            <ul className="space-y-3">
              <li><Link to="/silks" className={linkClass}>{BRAND.silkName}</Link></li>
              <li><Link to="/shop" className={linkClass}>All Products</Link></li>
              <li><Link to="/quick-order" className={linkClass}>Quick Order</Link></li>
              <li><Link to="/monthly-installment" className={linkClass}>Savings Scheme</Link></li>
              <li><Link to="/wishlist" className={linkClass}>Wishlist</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading tracking-widest text-brand-gold mb-5">Help</h3>
            <ul className="space-y-3">
              <li><Link to="/track-order" className={linkClass}>Track Your Order</Link></li>
              <li><Link to="/payment" className={linkClass}>Payment Options</Link></li>
              <li><a href="/#faqs" className={linkClass}>FAQ</a></li>
              <li><Link to="/blog" className={linkClass}>Silk Journal</Link></li>
              <li><a href="/#about-us" className={linkClass}>About Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading tracking-widest text-brand-gold mb-5">Visit Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-brand-gold shrink-0" />
                <span className="whitespace-pre-line">{address || `${BRAND.name}, ${BRAND.town}, Tamil Nadu`}</span>
              </li>
              {phone && (
                <li className="flex gap-3">
                  <Phone className="w-4 h-4 mt-0.5 text-brand-gold shrink-0" />
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className={linkClass}>{phone}</a>
                </li>
              )}
              {email && (
                <li className="flex gap-3">
                  <Mail className="w-4 h-4 mt-0.5 text-brand-gold shrink-0" />
                  <a href={`mailto:${email}`} className={`${linkClass} break-all`}>{email}</a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-gold/25 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-white/60">
            © {new Date().getFullYear()} {BRAND.name} · {BRAND.domain}
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link to="/shipping-policy" className={linkClass}>Shipping</Link>
            <Link to="/cancellation-policy" className={linkClass}>Returns & Exchange</Link>
            <Link to="/privacy" className={linkClass}>Privacy</Link>
            <Link to="/terms" className={linkClass}>Terms</Link>
            <Link to="/sitemap" className={linkClass}>Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useAppSettings } from "../context/AppSettingsContext";
import { BRAND } from "../config/brand";
import { waNumber } from "./AnnouncementBar";

/**
 * Contact details are read from Admin Settings, never written here, so a
 * changed number is a settings edit, not a deploy. The map searches for the
 * address on file; with no address yet it searches for the town.
 */
export function ContactSection() {
  const { settings } = useAppSettings();
  const phone = settings?.business_phone?.trim() || BRAND.phone;
  const email = settings?.business_email?.trim();
  const address = settings?.business_address?.trim() || `${BRAND.name}, ${BRAND.town}, Tamil Nadu`;
  const mapQuery = encodeURIComponent(settings?.business_address?.trim() || `${BRAND.town}, Tamil Nadu`);

  const rows = [
    { icon: MapPin, title: "Visit Us", body: <span className="whitespace-pre-line">{address}</span> },
    phone && {
      icon: Phone,
      title: "Call or WhatsApp",
      body: (
        <span className="flex items-center gap-3">
          <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-primary-orange">{phone}</a>
          <a
            href={`https://wa.me/${waNumber(phone)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="text-primary-orange"
          >
            <FaWhatsapp className="w-5 h-5" />
          </a>
        </span>
      ),
    },
    email && {
      icon: Mail,
      title: "Email Us",
      body: <a href={`mailto:${email}`} className="hover:text-primary-orange break-all">{email}</a>,
    },
  ].filter(Boolean) as { icon: typeof MapPin; title: string; body: React.ReactNode }[];

  return (
    <section id="contact" className="py-14 md:py-20 bg-card/40">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="section-title mb-3">Contact Us</h2>
        <div className="ornament mb-4">✦</div>
        <p className="text-text/70 max-w-2xl mx-auto text-center mb-12">
          Looking for a particular saree, colour or product? Ask us. We're happy to help you find it.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-7"
          >
            {rows.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-emerald-silk ring-1 ring-primary-yellow/60">
                  <Icon className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <h3 className="font-heading tracking-wide text-lg mb-1">{title}</h3>
                  <div className="text-text/70">{body}</div>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl overflow-hidden border border-primary-yellow/40 min-h-[320px]"
          >
            <iframe
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full min-h-[320px]"
              title={`Map showing ${BRAND.name}`}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

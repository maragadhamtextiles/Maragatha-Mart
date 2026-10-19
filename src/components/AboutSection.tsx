import { motion } from "framer-motion";
import { Gem, HeartHandshake, Truck, BadgeIndianRupee } from "lucide-react";
import { Link } from "react-router-dom";
import { BRAND } from "../config/brand";

const PROMISES = [
  { icon: Gem, title: "Handpicked Quality", text: "Every saree and product chosen in person" },
  { icon: BadgeIndianRupee, title: "Honest Prices", text: "Fair pricing, clearly shown" },
  { icon: Truck, title: "Delivered to You", text: "Shipping across India, tracked" },
  { icon: HeartHandshake, title: "Family Service", text: "Friendly help before and after you buy" },
];

export function AboutSection() {
  return (
    <section className="py-14 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="uppercase tracking-[0.35em] text-xs text-primary-yellow mb-3">About us</p>
            <h2 className="font-heading text-3xl md:text-5xl leading-tight mb-3">{BRAND.name}</h2>
            <p className="font-display italic text-2xl text-primary-orange mb-6">{BRAND.tagline}</p>
            <p className="text-text/80 mb-4 leading-relaxed">
              <b>{BRAND.name}</b> began with silk. Our silk house, <b>{BRAND.silkName}</b>, brings Kanchipuram pattu, soft
              silks and wedding sarees to families in {BRAND.town} and beyond, each one chosen for its weave, its colour
              and the way it falls.
            </p>
            <p className="text-text/80 mb-4 leading-relaxed">
              Alongside the silks, the mart carries the things a home needs: textiles, kitchen and home essentials,
              gifting and festive items, picked with the same care and priced honestly.
            </p>
            <p className="text-text/80 mb-8 leading-relaxed italic">
              One store for the moments you celebrate and the days in between.
            </p>
            <div className="grid grid-cols-2 gap-5">
              {PROMISES.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary-yellow/15">
                    <Icon className="w-5 h-5 text-primary-yellow" />
                  </div>
                  <div>
                    <h3 className="font-montserrat font-bold mb-0.5">{title}</h3>
                    <p className="text-sm text-text/60">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute -inset-3 rounded-3xl border border-primary-yellow/50 rotate-2" aria-hidden="true" />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={BRAND.logoFull}
                alt={`${BRAND.name} — ${BRAND.silkName}, ${BRAND.town}`}
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
            <Link
              to="/silks"
              className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap btn-primary shadow-xl"
            >
              Visit {BRAND.silkName}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

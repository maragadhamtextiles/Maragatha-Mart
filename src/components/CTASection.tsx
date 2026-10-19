import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { silkCollections } from "../data/products";
import { SareeArt } from "./SareeArt";
import { BRAND } from "../config/brand";

/**
 * Both buttons share one size, weight and border width so they sit level.
 */
const CTA_BUTTON =
  "inline-flex items-center justify-center w-full sm:w-auto min-w-[14rem] px-8 py-4 text-base font-montserrat font-bold rounded-lg border transition-all duration-300";

export function CTASection() {
  return (
    <section className="py-14 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-emerald-silk text-[#F7E7B4] rounded-3xl px-5 py-12 md:px-12 md:py-16 relative overflow-hidden grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,40rem)_1fr] items-center gap-8"
        >
          <SareeArt
            palette={silkCollections[1].palette}
            className="hidden lg:block w-full max-w-[13rem] mx-auto -rotate-6 drop-shadow-2xl"
          />

          <div className="relative flex flex-col items-center text-center">
            <img src={BRAND.logo} alt="" aria-hidden="true" className="h-14 w-auto mb-5" />
            <h2 className="font-heading text-3xl md:text-5xl mb-4">
              <span className="text-zari">Dressed for Every Occasion</span>
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl">
              Weddings, festivals, temple days and family functions: find the saree for the moment, and everything else
              for the home, in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full sm:w-auto">
              <Link to="/silks" className={`${CTA_BUTTON} btn-primary`}>
                Shop Silk Sarees
              </Link>
              <Link
                to="/quick-order"
                className={`${CTA_BUTTON} border-brand-gold/70 text-brand-gold-light hover:bg-brand-gold/10`}
              >
                Quick Order
              </Link>
            </div>
          </div>

          <SareeArt
            palette={silkCollections[0].palette}
            className="hidden lg:block w-full max-w-[13rem] mx-auto rotate-6 drop-shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
}

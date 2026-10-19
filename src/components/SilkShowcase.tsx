import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { useSilkCollections } from "../hooks/useSilkCollections";
import { isSilkProduct } from "../lib/silk";
import { CollectionTile } from "./CollectionTile";
import { SilkProductCard } from "./SilkProductCard";
import { BRAND } from "../config/brand";

/**
 * The silk house on the home page: its own emerald band so it reads as a
 * separate shop inside the mart. Collections and their photographs come from
 * the silk_collections table; the newest silk products follow once the
 * catalogue has some.
 */
export function SilkShowcase() {
  const { products } = useProducts();
  const { collections } = useSilkCollections();
  const featured = useMemo(
    () => products.filter((p) => p.is_active !== false && isSilkProduct(p)).slice(0, 4),
    [products]
  );

  return (
    <section className="bg-emerald-silk text-[#F7E7B4] relative">
      <div className="zari-border" />
      <div className="container mx-auto px-4 sm:px-6 py-14 md:py-20">
        <div className="text-center mb-10 md:mb-14">
          <p className="uppercase tracking-[0.35em] text-xs text-brand-gold mb-3">A shop within the shop</p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl">
            <span className="text-zari">{BRAND.silkName}</span>
          </h2>
          <p className="font-display italic text-xl md:text-2xl text-brand-gold-light/90 mt-3">{BRAND.tagline}</p>
          <div className="ornament mt-5">✦</div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-5">
          {collections.map((c, i) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <Link to={`/silks?c=${c.slug}`} className="group block" aria-label={c.name}>
                <CollectionTile collection={c} />
              </Link>
            </motion.div>
          ))}
        </div>

        {featured.length > 0 && (
          <div className="mt-12 md:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 text-text">
            {featured.map((p) => (
              <SilkProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <div className="text-center mt-10 md:mt-14">
          <Link to="/silks" className="btn-primary inline-flex items-center gap-2">
            Enter {BRAND.silkName} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      <div className="zari-border rotate-180" />
    </section>
  );
}

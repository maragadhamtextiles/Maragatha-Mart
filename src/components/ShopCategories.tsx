import { motion } from "framer-motion";
import {
  ArrowRight,
  Loader2,
  Gem,
  Shirt,
  Home,
  CookingPot,
  Gift,
  Sparkles,
  Baby,
  Flower2,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCategories } from "../hooks/useCategories";
import { useProducts } from "../hooks/useProducts";

/**
 * Categories, their order and their pictures all come from the categories
 * table. A category without a picture gets an icon picked from its name.
 */
const ICONS: [RegExp, LucideIcon][] = [
  [/silk|saree|sari|pattu|banarasi/i, Gem],
  [/dhoti|veshti|shirt|cloth|textile|dress|wear|fabric|kurti|chudi/i, Shirt],
  [/kitchen|cook|vessel|utensil|steel|brass/i, CookingPot],
  [/gift|hamper|combo|return/i, Gift],
  [/kid|baby|child/i, Baby],
  [/pooja|puja|pooja|festive|lamp|vilakku/i, Flower2],
  [/home|decor|bed|furnish|towel/i, Home],
  [/new|offer|best|trend/i, Sparkles],
];

function iconFor(name: string): LucideIcon {
  return ICONS.find(([re]) => re.test(name))?.[1] ?? ShoppingBag;
}

export function ShopCategories() {
  const { categories, loading: categoriesLoading } = useCategories();
  const { products } = useProducts();

  const getCategoryProductCount = (categoryId: string) =>
    products.filter((p) => p.category_id === categoryId).length;

  if (categoriesLoading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-orange" />
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-14 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="section-title mb-3">Shop by Category</h2>
        <div className="ornament mb-4">✦</div>
        <div className="flex justify-center mb-10">
          <Link
            to="/shop"
            className="flex items-center gap-2 text-primary-orange hover:text-primary-red transition-colors font-semibold"
          >
            <span>View everything</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {/* Flex rather than grid so a part-filled last row sits centred. */}
        <div className="flex flex-wrap justify-center gap-y-6 md:gap-y-8">
          {categories.map((category, i) => {
            const Icon = iconFor(category.name);
            // A full link (an upload in the product-images bucket) or a path
            // from the site root (a picture shipped in /assets). A bare file
            // name is from the old catalogue, whose pictures no longer exist.
            const picture =
              category.image_url && /^((https?:)?\/\/|\/)/i.test(category.image_url) ? category.image_url : null;
            const count = getCategoryProductCount(category.id);
            return (
              <motion.div
                key={category.id}
                className="w-1/3 sm:w-1/4 lg:w-1/6 px-1.5 md:px-3"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i, 8) * 0.04 }}
              >
                <Link
                  to={`/shop?category=${encodeURIComponent(category.name.toLowerCase())}`}
                  className="group flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full p-[3px] bg-gradient-to-br from-[#E9C866] via-[#C9A227] to-[#9A7417] shadow-md group-hover:shadow-primary-yellow/40 group-hover:shadow-lg transition-shadow">
                    <div className="w-full h-full rounded-full bg-emerald-silk flex items-center justify-center overflow-hidden">
                      {picture ? (
                        <img src={picture} alt="" className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <Icon
                          className="w-8 h-8 md:w-10 md:h-10 text-brand-gold transition-transform duration-500 group-hover:scale-110"
                          strokeWidth={1.4}
                        />
                      )}
                    </div>
                  </div>
                  <h3 className="mt-3 font-semibold text-xs sm:text-sm leading-tight line-clamp-2 group-hover:text-primary-orange transition-colors">
                    {category.name}
                  </h3>
                  {count > 0 && <span className="text-[11px] text-text/50 mt-0.5">{count} items</span>}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

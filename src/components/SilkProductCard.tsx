import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingBag, Check } from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore } from "../store/cartStore";
import { productImageUrl } from "../lib/productImage";
import { WishlistButton } from "./WishlistButton";
import type { ProductWithCategory } from "../hooks/useProducts";

/**
 * A saree is bought by looking at it, so the card is mostly picture: a tall
 * 3:4 frame like a draped saree, with the price and one button underneath.
 * Quantity steppers belong to the general shop; nobody orders six of a saree.
 */
export function SilkProductCard({ product }: { product: ProductWithCategory }) {
  const { addToCart, items } = useCartStore();
  const inCart = items.some((i) => i.id === product.id);
  const soldOut = product.stock !== undefined && product.stock <= 0;
  const image = product.image_url
    ? productImageUrl(product.image_url.split(",")[0])
    : productImageUrl(null);
  const hasDiscount =
    product.actual_price > product.offer_price && (product.discount_percentage ?? 0) > 0;

  const add = () => {
    if (soldOut) return;
    // addToCart takes the catalogue row as the rest of the shop passes it.
    addToCart(product as never, 1);
    toast.success(`${product.name} added to your cart`, { id: `bag-${product.id}` });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group flex flex-col rounded-xl overflow-hidden bg-card border border-card-border/40 hover:border-primary-yellow/70 hover:shadow-xl hover:shadow-primary-yellow/10 transition-all"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-brand-emerald">
        <Link to={`/product/${product.id}`} aria-label={product.name}>
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        <div className="absolute top-2 right-2">
          <WishlistButton
            product={{ id: product.id, name: product.name, image: product.image_url, offer_price: product.offer_price }}
          />
        </div>
        {hasDiscount && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold bg-brand-gold text-brand-emerald">
            {product.discount_percentage}% off
          </span>
        )}
        {soldOut && (
          <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
            <span className="px-3 py-1 rounded border border-brand-gold text-brand-gold-light text-sm tracking-widest uppercase">
              Sold out
            </span>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <p className="text-[11px] uppercase tracking-[0.2em] text-primary-yellow mb-1 truncate">
          {product.categories?.name ?? "Maragatha Silks"}
        </p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display text-lg sm:text-xl font-semibold leading-snug line-clamp-2 hover:text-primary-orange transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-bold text-lg text-primary-orange">₹{product.offer_price.toLocaleString("en-IN")}</span>
          {hasDiscount && (
            <span className="text-sm text-text/50 line-through">₹{product.actual_price.toLocaleString("en-IN")}</span>
          )}
        </div>
        <button
          onClick={add}
          disabled={soldOut}
          className="mt-auto pt-3 w-full"
        >
          <span
            className={`flex items-center justify-center gap-2 w-full py-2 rounded-lg text-sm font-semibold transition-colors ${
              soldOut
                ? "bg-card-border/30 text-text/40 cursor-not-allowed"
                : inCart
                ? "bg-primary-yellow/15 text-primary-orange border border-primary-yellow/60"
                : "btn-primary !py-2 !px-3"
            }`}
          >
            {inCart ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            {soldOut ? "Sold out" : inCart ? "In your cart — add another" : "Add to cart"}
          </span>
        </button>
      </div>
    </motion.article>
  );
}

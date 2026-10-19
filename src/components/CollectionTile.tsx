import { SareeArt } from "./SareeArt";
import type { SilkCollection } from "../data/products";

/**
 * One silk collection as a portrait card: the photograph (4:5, like a draped
 * saree) with the name over a dark fade at the foot, framed in gold. Without
 * a photograph it draws the collection's saree instead.
 */
export function CollectionTile({
  collection,
  active = false,
  count,
  showBlurb = false,
}: {
  collection: SilkCollection;
  active?: boolean;
  /** Products in the collection; shown when given. */
  count?: number;
  showBlurb?: boolean;
}) {
  return (
    <div
      className={`group relative aspect-[4/5] rounded-2xl overflow-hidden ring-1 transition-all duration-300 ${
        active ? "ring-2 ring-brand-gold shadow-xl shadow-brand-gold/20" : "ring-brand-gold/40 group-hover:ring-brand-gold"
      } hover:ring-brand-gold hover:shadow-xl hover:shadow-black/30`}
    >
      {collection.image_url ? (
        <img
          src={collection.image_url}
          alt={collection.name}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-emerald-silk flex items-center justify-center p-6">
          <SareeArt palette={collection.palette} className="h-full w-auto drop-shadow-xl" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" aria-hidden="true" />
      <div className="absolute inset-2 rounded-xl border border-brand-gold/40 pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 text-left">
        <h3 className="font-heading text-sm sm:text-base lg:text-lg leading-tight text-white tracking-wide">{collection.name}</h3>
        {showBlurb && collection.blurb && (
          <p className="hidden sm:block text-xs text-white/75 mt-1 line-clamp-2">{collection.blurb}</p>
        )}
        {count !== undefined && (
          <p className="text-[11px] sm:text-xs text-brand-gold-light mt-1">
            {count ? `${count} sarees` : "Arriving soon"}
          </p>
        )}
      </div>
    </div>
  );
}

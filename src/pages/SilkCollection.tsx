import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Sparkles, Truck, PackageCheck, Phone, ArrowRight } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { useAppSettings } from "../context/AppSettingsContext";
import { isSilkProduct, inCollection } from "../lib/silk";
import { SareeArt } from "../components/SareeArt";
import { CollectionTile } from "../components/CollectionTile";
import { useSilkCollections } from "../hooks/useSilkCollections";
import { SilkProductCard } from "../components/SilkProductCard";
import { BRAND } from "../config/brand";
import { usePageMeta } from "../lib/seo";
import { SITE_URL } from "../lib/site";

const CARE_TIPS = [
  {
    title: "Fold, then refold",
    text: "Change the folds every few months so the zari never creases along the same line.",
  },
  {
    title: "Wrap in cotton or muslin",
    text: "Silk needs to breathe. Plastic covers trap moisture and dull the sheen.",
  },
  {
    title: "Dry clean the first wash",
    text: "Pure silk and zari are best dry cleaned; a mild cold rinse suits soft silks later.",
  },
  {
    title: "Keep perfume off the zari",
    text: "Spray before you drape. Alcohol and moisture tarnish metallic thread.",
  },
];

/**
 * Maragatha Silks: the silk house inside the mart, with a page of its own.
 *
 * Which products appear is decided by name, not by a database flag (see
 * lib/silk.ts), and the collection filter lives in the URL (?c=kanchipuram) so
 * a collection can be shared on WhatsApp as a link.
 */
export function SilkCollection() {
  const { products, loading } = useProducts();
  const { settings } = useAppSettings();
  const [params, setParams] = useSearchParams();
  const active = params.get("c");
  const { collections: silkCollections } = useSilkCollections();
  const activeCollection = silkCollections.find((c) => c.slug === active) ?? null;

  usePageMeta({
    title: activeCollection
      ? `${activeCollection.name} | ${BRAND.silkName}`
      : `${BRAND.silkName} — Silk Sarees | ${BRAND.name}`,
    description: activeCollection
      ? `${activeCollection.name} from ${BRAND.silkName}, ${BRAND.town}. ${activeCollection.blurb}`
      : `Kanchipuram, soft silk, wedding and Banarasi sarees from ${BRAND.silkName}, the silk house of ${BRAND.name}.`,
    image: `${SITE_URL}/assets/img/logo/maragatha-og.jpg`,
  });

  const silks = useMemo(() => products.filter((p) => p.is_active !== false && isSilkProduct(p)), [products]);
  const shown = useMemo(
    () => (activeCollection ? silks.filter((p) => inCollection(p, activeCollection)) : silks),
    [silks, activeCollection]
  );
  const counts = useMemo(
    () => Object.fromEntries(silkCollections.map((c) => [c.slug, silks.filter((p) => inCollection(p, c)).length])),
    [silks, silkCollections]
  );

  const choose = (slug: string | null) => {
    setParams(slug ? { c: slug } : {}, { replace: true });
    document.getElementById("silk-products")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const phone = settings?.business_phone?.trim() || BRAND.phone;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-emerald-silk text-[#F7E7B4] relative overflow-hidden">
        <div className="zari-border" />
        <div className="container mx-auto px-4 sm:px-6 py-14 md:py-20 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <img src={BRAND.logo} alt="" aria-hidden="true" className="h-16 md:h-20 w-auto mb-6" />
            <p className="uppercase tracking-[0.35em] text-xs md:text-sm text-brand-gold mb-3">The silk house of {BRAND.name}</p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl leading-tight mb-4">
              <span className="text-zari">{BRAND.silkName}</span>
            </h1>
            <p className="font-display italic text-2xl md:text-3xl text-brand-gold-light mb-6">{BRAND.tagline}</p>
            <p className="text-white/80 max-w-xl leading-relaxed mb-8">
              Kanchipuram pattu with temple borders, soft silks light enough for a full day of celebration, and wedding
              silks chosen to be remembered. Every saree is picked by hand and checked before it leaves our store in{" "}
              {BRAND.town}.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => choose(null)} className="btn-primary">
                Browse all silks
              </button>
              {phone && (
                <a
                  href={`https://wa.me/${phone.replace(/\D/g, "").replace(/^(?!91)(\d{10})$/, "91$1")}?text=${encodeURIComponent(
                    "Hello Maragatha Silks, I'd like to see your latest silk sarees."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-brand-gold/70 text-brand-gold-light hover:bg-brand-gold/10 transition-colors font-semibold"
                >
                  <Phone className="w-4 h-4" /> Ask about a saree
                </a>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative h-80 sm:h-[26rem] hidden sm:block"
            aria-hidden="true"
          >
            {/* Three collections fanned out: their photographs when they have
                them, their drawn sarees when they do not. */}
            {[
              { c: silkCollections[2], cls: "left-0 top-12 -rotate-6" },
              { c: silkCollections[1], cls: "right-0 top-8 rotate-6" },
              { c: silkCollections[0], cls: "left-1/2 -translate-x-1/2 top-0 z-10" },
            ]
              .filter((x) => x.c)
              .map(({ c, cls }) =>
                c.image_url ? (
                  <div key={c.slug} className={`absolute w-[44%] aspect-[4/5] rounded-t-full rounded-b-2xl overflow-hidden ring-2 ring-brand-gold/80 shadow-2xl shadow-black/40 ${cls}`}>
                    <img src={c.image_url} alt="" className="w-full h-full object-cover object-top" />
                  </div>
                ) : (
                  <SareeArt key={c.slug} palette={c.palette} className={`absolute w-1/2 drop-shadow-2xl ${cls}`} />
                )
              )}
          </motion.div>
        </div>
        <div className="zari-border rotate-180" />
      </section>

      {/* Collections */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="section-title mb-3">Shop by Collection</h2>
          <div className="ornament mb-10">✦</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {silkCollections.map((c, i) => (
              <motion.button
                key={c.slug}
                onClick={() => choose(c.slug)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                aria-pressed={active === c.slug}
                className="group text-left"
              >
                <CollectionTile
                  collection={c}
                  active={active === c.slug}
                  count={counts[c.slug] ?? 0}
                  showBlurb
                />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="silk-products" className="py-12 md:py-16 bg-card/40 scroll-mt-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="font-heading text-2xl md:text-3xl tracking-wide">
                {activeCollection ? activeCollection.name : "All Silk Sarees"}
              </h2>
              {activeCollection && <p className="text-text/70 mt-1">{activeCollection.blurb}</p>}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
              <button
                onClick={() => choose(null)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm border transition-colors ${
                  !activeCollection
                    ? "bg-primary-orange text-white border-primary-orange"
                    : "border-card-border hover:border-primary-yellow"
                }`}
              >
                All
              </button>
              {silkCollections.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => choose(c.slug)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-sm border transition-colors ${
                    active === c.slug
                      ? "bg-primary-orange text-white border-primary-orange"
                      : "border-card-border hover:border-primary-yellow"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary-orange" />
            </div>
          ) : shown.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {shown.map((p) => (
                <SilkProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-6 rounded-2xl border border-dashed border-primary-yellow/50 bg-background">
              <Sparkles className="w-10 h-10 mx-auto text-primary-yellow mb-4" />
              <h3 className="font-heading text-xl mb-2">New weaves are on their way</h3>
              <p className="text-text/70 max-w-md mx-auto mb-6">
                {activeCollection
                  ? `Our ${activeCollection.name} sarees are being photographed for the website.`
                  : "Our silk sarees are being photographed for the website."}{" "}
                {phone ? "Message us and we'll share the latest arrivals with you." : "Please visit our store to see the full range."}
              </p>
              <Link to="/shop" className="inline-flex items-center gap-2 text-primary-orange font-semibold hover:underline">
                Meanwhile, explore the rest of the store <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Promises */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 grid sm:grid-cols-3 gap-6">
          {[
            { icon: Sparkles, title: "Handpicked weaves", text: "Every saree is chosen in person for its weave, colour and finish." },
            { icon: PackageCheck, title: "Checked & packed with care", text: "Folded in tissue and boxed so it reaches you as it left us." },
            { icon: Truck, title: "Delivered across India", text: "Order online and track it to your door with your order number." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4 items-start p-5 rounded-xl bg-card border border-card-border/40">
              <div className="p-3 rounded-full bg-primary-yellow/15 text-primary-yellow">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading tracking-wide mb-1">{title}</h3>
                <p className="text-sm text-text/70">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Care */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="rounded-3xl bg-emerald-silk text-[#F7E7B4] p-6 sm:p-10 md:p-14">
            <h2 className="font-heading text-2xl md:text-3xl text-center mb-2">
              <span className="text-zari">Caring for your silk</span>
            </h2>
            <p className="text-center font-display italic text-xl text-brand-gold-light/90 mb-10">
              A good silk saree outlives the occasion it was bought for.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {CARE_TIPS.map((t, i) => (
                <div key={t.title} className="border-t border-brand-gold/40 pt-4">
                  <span className="font-heading text-brand-gold text-sm">0{i + 1}</span>
                  <h3 className="font-heading text-lg mt-1 mb-2 text-white">{t.title}</h3>
                  <p className="text-sm text-white/75 leading-relaxed">{t.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

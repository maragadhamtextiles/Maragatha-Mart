import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, Shirt, Gift, CookingPot } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { heroSlides as fallbackSlides, silkCollections, type HeroSlide } from "../data/products";
import { useHeroSlides, type HeroSlideRow } from "../hooks/useHeroSlides";
import { SareeArt } from "./SareeArt";
import { BRAND } from "../config/brand";

/** One shape for both sources: a hero_slides row, or a drawn fallback slide. */
interface Slide {
  id: string;
  image?: string;
  art?: HeroSlide["art"];
  eyebrow?: string | null;
  title: string;
  subtitle?: string | null;
  cta?: { label: string; to: string } | null;
  secondary?: { label: string; to: string } | null;
}

function fromRow(r: HeroSlideRow): Slide {
  return {
    id: r.id,
    image: r.image_url,
    eyebrow: r.eyebrow,
    title: r.title,
    subtitle: r.subtitle,
    cta: r.cta_label && r.cta_link ? { label: r.cta_label, to: r.cta_link } : null,
    secondary: r.secondary_label && r.secondary_link ? { label: r.secondary_label, to: r.secondary_link } : null,
  };
}

function fromFallback(s: HeroSlide): Slide {
  return { ...s, art: s.art };
}

/** Internal paths route in the app; anything else is an ordinary link. */
function SlideLink({ to, className, children }: { to: string; className: string; children: React.ReactNode }) {
  return to.startsWith("/") ? (
    <Link to={to} className={className}>{children}</Link>
  ) : (
    <a href={to} className={className} target="_blank" rel="noopener noreferrer">{children}</a>
  );
}

function DrawnArt({ art }: { art: HeroSlide["art"] }) {
  if (art === "emblem") {
    return <img src={BRAND.logoGold} alt={`${BRAND.name} emblem`} className="w-full max-w-md mx-auto drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]" />;
  }
  if (art === "saree") {
    return (
      <div className="relative h-full w-full max-w-md mx-auto" aria-hidden="true">
        <SareeArt palette={silkCollections[3].palette} className="absolute left-0 top-8 w-1/2 -rotate-6 drop-shadow-2xl" />
        <SareeArt palette={silkCollections[1].palette} className="absolute right-0 top-6 w-1/2 rotate-6 drop-shadow-2xl" />
        <SareeArt palette={silkCollections[0].palette} className="absolute left-1/4 top-0 w-1/2 drop-shadow-2xl" />
      </div>
    );
  }
  const tiles = [
    { icon: Shirt, label: "Textiles" },
    { icon: Home, label: "Home" },
    { icon: CookingPot, label: "Kitchen" },
    { icon: Gift, label: "Gifting" },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto" aria-hidden="true">
      {tiles.map(({ icon: Icon, label }) => (
        <div key={label} className="aspect-square rounded-2xl border border-brand-gold/50 bg-white/5 flex flex-col items-center justify-center gap-3">
          <Icon className="w-12 h-12 text-brand-gold" strokeWidth={1.3} />
          <span className="font-heading tracking-widest text-sm text-brand-gold-light">{label}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * The photo in a temple-arch frame: a gold hairline offset behind it, the
 * picture in a rounded-top arch, and a soft gold glow. Sarees are portraits,
 * so the frame is 4:5 rather than a wide crop that would cut the drape.
 */
function ArchPhoto({ src, alt, eager }: { src: string; alt: string; eager: boolean }) {
  return (
    <div className="relative w-full max-w-[22rem] lg:max-w-[25rem] mx-auto">
      <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-t-full rounded-b-3xl border border-brand-gold/60" aria-hidden="true" />
      <div className="absolute -inset-6 rounded-full bg-brand-gold/10 blur-3xl" aria-hidden="true" />
      <div className="relative aspect-[4/5] rounded-t-full rounded-b-3xl overflow-hidden ring-2 ring-brand-gold/80 shadow-2xl shadow-black/40">
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className="w-full h-full object-cover object-top"
        />
      </div>
    </div>
  );
}

function SlideBody({ slide, first }: { slide: Slide; first: boolean }) {
  const Heading = first ? "h1" : "h2";
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="text-center md:text-left"
    >
      {slide.eyebrow && (
        <p className="uppercase tracking-[0.35em] text-[11px] sm:text-xs text-brand-gold mb-4">{slide.eyebrow}</p>
      )}
      <Heading className="font-heading text-4xl sm:text-5xl lg:text-6xl leading-tight mb-5">
        <span className="text-zari">{slide.title}</span>
      </Heading>
      {slide.subtitle && (
        <p className="text-white/85 text-base sm:text-lg max-w-xl mx-auto md:mx-0 mb-8 leading-relaxed">{slide.subtitle}</p>
      )}
      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
        {slide.cta && (
          <SlideLink to={slide.cta.to} className="btn-primary">{slide.cta.label}</SlideLink>
        )}
        {slide.secondary && (
          <SlideLink
            to={slide.secondary.to}
            className="px-6 py-3 rounded-lg border border-brand-gold/70 text-brand-gold-light font-semibold hover:bg-brand-gold/10 transition-colors"
          >
            {slide.secondary.label}
          </SlideLink>
        )}
      </div>
    </motion.div>
  );
}

/**
 * The home page banner. Slides come from the hero_slides table (Admin
 * Settings → Homepage); the drawn brand slides show only if none is active,
 * so the first screen is never empty.
 */
export function HeroSlider() {
  const { slides: rows, loading } = useHeroSlides();
  const slides: Slide[] = rows.length ? rows.map(fromRow) : fallbackSlides.map(fromFallback);

  if (loading) {
    // Hold the banner's space so the page does not jump when slides arrive.
    return <div className="bg-emerald-silk min-h-[560px] md:min-h-[600px]" aria-busy="true" />;
  }

  return (
    <div className="relative bg-emerald-silk">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 6500, disableOnInteraction: false }}
        loop={slides.length > 1}
        className="hero-slider w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id} className="bg-emerald-silk relative overflow-hidden">
            {/* Phones: the photo fills the slide behind an emerald fade. */}
            {slide.image && (
              <div className="md:hidden absolute inset-0" aria-hidden="true">
                <img src={slide.image} alt="" className="w-full h-full object-cover object-top" loading={index === 0 ? "eager" : "lazy"} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#002816] via-[#003620]/85 to-[#003620]/30" />
              </div>
            )}
            <div className="relative">
              <div className="zari-border" />
              {/* On a phone the photo shows through the top of the slide, so
                  the words start below the faces. */}
              <div className={`container mx-auto px-5 sm:px-8 ${slide.image ? "pt-56" : "pt-12"} pb-12 md:py-16 lg:py-20 grid md:grid-cols-[1.1fr_0.9fr] gap-10 items-center min-h-[560px] md:min-h-[600px]`}>
                <SlideBody slide={slide} first={index === 0} />
                <div className="hidden md:flex items-center justify-center">
                  {slide.image ? (
                    <ArchPhoto src={slide.image} alt={slide.title} eager={index === 0} />
                  ) : (
                    <div className="h-96 w-full flex items-center"><DrawnArt art={slide.art ?? "emblem"} /></div>
                  )}
                </div>
              </div>
              <div className="zari-border rotate-180" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style>{`
        .hero-slider { --swiper-theme-color: #C9A227; --swiper-navigation-size: 28px; }
        .hero-slider .swiper-pagination-bullet { background: #F4DE8E; opacity: .5; }
        .hero-slider .swiper-pagination-bullet-active { opacity: 1; width: 22px; border-radius: 4px; }
        @media (max-width: 767px) {
          .hero-slider .swiper-button-next,
          .hero-slider .swiper-button-prev { display: none; }
        }
      `}</style>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  NavLink,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Sparkles,
  ShoppingCart,
  Heart,
  Menu,
  X,
  Sun,
  Moon,
  Home,
  User,
  GalleryThumbnails,
  HeartHandshake,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useTheme } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppSettingsProvider } from "./context/AppSettingsContext";
import { SeasonProvider } from "./context/SeasonContext";
import { AnnouncementBar } from "./components/AnnouncementBar";
import { MarqueeText } from "./components/MarqueeText";
import { HeroSlider } from "./components/HeroSlider";

import { AboutSection } from "./components/AboutSection";
import { HowItWorks } from "./components/HowItWorks";
import { ShopCategories } from "./components/ShopCategories";
import { SilkShowcase } from "./components/SilkShowcase";
import { SilkCollection } from "./pages/SilkCollection";
import { BRAND } from "./config/brand";
import { TrendingProducts } from "./components/TrendingProducts";
import { CTASection } from "./components/CTASection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { Cart } from "./components/Cart";
import { UserMenu } from "./components/UserMenu";
import { QuickPurchase } from "./pages/QuickPurchase";
import { Shop } from "./pages/Shop";
import { ProductDetails } from "./pages/ProductDetails";
import { Dashboard } from "./pages/Dashboard";
import { Orders } from "./pages/Orders";
import { MyOrders } from "./pages/MyOrders";
import { StockManagement } from "./pages/StockManagement";
import { ComboPacks } from "./pages/ComboPacks";
import { Wishlist } from "./pages/Wishlist";
import { useWishlistStore } from "./store/wishlistStore";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Profile } from "./pages/Profile";
import { MonthlyInstallment } from "./pages/MonthlyInstallment";
import { useCartStore } from "./store/cartStore";
import CancellationPolicy from "./pages/CancellationPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import PrivacyPolicy from "./pages/privacy";
import TermsOfService from "./pages/terms";
import { BlogSection } from "./components/BlogSection";
import { FAQSection } from "./components/FAQSection";
import { BlogPost } from "./pages/BlogPost";
import { Blog } from "./pages/Blog";
import { Users } from "./pages/Users";
import { Analytics } from "./pages/Analytics";
import { AdminSettings } from "./pages/AdminSettings";
import { Sitemap } from "./pages/Sitemap";
import { NotFound } from "./pages/NotFound";
import QuickPurchaseButton from "./components/QuickButton";
import { TrackOrder } from "./pages/TrackOrder";
import { Payment } from "./pages/Payment";
import { Expenses } from "./pages/Expenses";
import { Customers } from "./pages/Customers";
import { UpdatePassword } from "./pages/UpdatePassword";
import { Vendors } from "./pages/Vendors";
import { VendorDetails } from "./pages/VendorDetails";
import { Seasons } from "./pages/Seasons";
import { Purchasing } from "./pages/Purchasing";

// Role ranking so a superadmin satisfies requiredRole="admin".
const ROLE_RANK: Record<string, number> = {
  customer: 0,
  admin: 1,
  superadmin: 2,
};

const ProtectedRoute = ({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: string;
}) => {
  const { user, loading, userRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole) {
    // The profile (and therefore the role) can arrive after `loading` clears,
    // so wait rather than bouncing an admin who is still resolving.
    if (!userRole) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      );
    }

    const have = ROLE_RANK[userRole.name] ?? 0;
    const need = ROLE_RANK[requiredRole] ?? 0;
    if (have < need) {
      return <Navigate to="/" />;
    }
  }

  return <>{children}</>;
};

function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700 flex justify-around items-center h-16 sm:hidden shadow-md z-50">
      <button
        onClick={() => navigate("/")}
        className="flex flex-col items-center text-sm focus:outline-none"
      >
        <Home
          className={`w-5 h-5 ${
            isActive("/")
              ? "text-primary-orange"
              : "text-gray-600 dark:text-gray-400"
          }`}
        />
        <span
          className={`text-xs ${
            isActive("/")
              ? "text-primary-orange"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          Home
        </span>
      </button>
      <button
        onClick={() => navigate("/quick-order")}
        className="flex flex-col items-center text-sm focus:outline-none"
      >
        <ShoppingCart
          className={`w-5 h-5 ${
            isActive("/quick-order")
              ? "text-primary-orange"
              : "text-gray-600 dark:text-gray-400"
          }`}
        />
        <span
          className={`text-xs ${
            isActive("/quick-order")
              ? "text-primary-orange"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          Quick
        </span>
      </button>
      <button
        onClick={() => navigate("/shop")}
        className="flex flex-col items-center text-sm focus:outline-none"
      >
        <GalleryThumbnails
          className={`w-5 h-5 ${
            isActive("/shop")
              ? "text-primary-orange"
              : "text-gray-600 dark:text-gray-400"
          }`}
        />
        <span
          className={`text-xs ${
            isActive("/shop")
              ? "text-primary-orange"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          Shop
        </span>
      </button>
      <button
        onClick={() => navigate("/monthly-installment")}
        className="flex flex-col items-center text-sm focus:outline-none"
      >
        <HeartHandshake
          className={`w-5 h-5 ${
            isActive("/monthly-installment")
              ? "text-primary-orange"
              : "text-gray-600 dark:text-gray-400"
          }`}
        />
        <span
          className={`text-xs ${
            isActive("/monthly-installment")
              ? "text-primary-orange"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          Savings
        </span>
      </button>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return null;
}

import { usePageTracking } from "./hooks/usePageTracking";
import { useCanonicalUrl } from "./lib/seo";
import { useForegroundPush } from "./hooks/useForegroundPush";

export function AppContent() {
  usePageTracking();
  useCanonicalUrl();
  useForegroundPush();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalQuantity, items, isCartOpen, openCart, closeCart } = useCartStore();
  const wishlistCount = useWishlistStore((state) => state.items.length);

  const handleMenuItemClick = () => {
    setIsMobileMenuOpen(false);
  };


  const [priceListLoading, setPriceListLoading] = useState(false);

  /**
   * Builds the current price list from the live catalogue and downloads it.
   *
   * It used to fetch a signed URL for a PDF someone had exported and uploaded
   * by hand, so the link showed last year's prices until that was redone.
   */
  const handleDownloadPriceList = async () => {
    if (priceListLoading) return;
    setPriceListLoading(true);
    const pending = toast.loading("Preparing the latest price list…");
    try {
      const { downloadLatestPriceListPdf } = await import(
        "./lib/latestPriceList"
      );
      await downloadLatestPriceListPdf();
      toast.success("Price list downloaded", { id: pending });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not build the price list",
        { id: pending }
      );
    } finally {
      setPriceListLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <MarqueeText />

      {/* Navigation */}
      {/* Solid, not glass: over the emerald sections a translucent bar left
          the green links unreadable. */}
      <nav className="w-full z-50 px-4 py-1 sticky top-0 bg-background/95 backdrop-blur-md border-b border-primary-yellow/40 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 py-1" aria-label={`${BRAND.name} home`}>
            <img
              src={BRAND.logo}
              alt=""
              aria-hidden="true"
              className="h-12 sm:h-14 w-auto"
            />
            <span className="leading-tight">
              <span className="block font-heading text-base sm:text-xl tracking-[0.12em] text-primary-orange">
                {BRAND.name.toUpperCase()}
              </span>
              <span className="hidden sm:block font-display italic text-sm text-primary-yellow">
                {BRAND.tagline}
              </span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `font-montserrat font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? "text-primary-orange"
                    : "text-primary hover:text-primary-orange"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/quick-order"
              className={({ isActive }) =>
                `font-montserrat font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? "text-primary-orange"
                    : "text-primary hover:text-primary-orange"
                }`
              }
            >
              Quick Order
            </NavLink>
            <NavLink
              to="/silks"
              className={({ isActive }) =>
                `font-heading tracking-wider transition-colors cursor-pointer ${
                  isActive
                    ? "text-primary-yellow"
                    : "text-primary-yellow/90 hover:text-primary-orange"
                }`
              }
            >
              Silks
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `font-montserrat font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? "text-primary-orange"
                    : "text-primary hover:text-primary-orange"
                }`
              }
            >
              Shop
            </NavLink>
            <NavLink
              to="/monthly-installment"
              title="Monthly savings scheme"
              className={({ isActive }) =>
                `font-montserrat font-semibold transition-colors relative shining-text cursor-pointer ${
                  isActive
                    ? "text-primary-orange"
                    : "text-primary hover:text-primary-orange"
                }`
              }
            >
              Savings Scheme
            </NavLink>
            {/* Open to everyone: a guest tracks with the order number and
                the phone they ordered with. It used to be reachable only
                from the footer and the post-checkout screen. */}
            <NavLink
              to="/track-order"
              className={({ isActive }) =>
                `font-montserrat font-semibold transition-colors ${
                  isActive
                    ? "text-primary-orange"
                    : "text-primary hover:text-primary-orange"
                }`
              }
            >
              Track Order
            </NavLink>
            <button
              onClick={handleDownloadPriceList}
              disabled={priceListLoading}
              title="Download the current price list"
              className="font-montserrat font-semibold transition-colors cursor-pointer px-3 py-1 rounded hover:bg-card/60 text-primary disabled:opacity-60 disabled:cursor-wait"
            >
              {priceListLoading ? "Preparing…" : "Price List"}
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {/* Below xl this lives in the menu instead — the header row is
                tight on a phone, and the theme is a setting rather than
                something you reach for as often as the cart. */}
            <button
              onClick={toggleTheme}
              className="theme-toggle hidden xl:inline-block"
              id="theme-toggle"
              aria-label={
                theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {theme === "dark" ? (
                <Sun className="w-6 h-6 text-primary-yellow hover:text-primary-yellow/50" />
              ) : (
                <Moon className="w-6 h-6 text-primary-orange hover:text-primary-orange/50" />
              )}
            </button>
            <UserMenu />
            {/* Saved for later, next to the cart it empties into. */}
            <Link
              to="/wishlist"
              className="relative"
              aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} saved` : ""}`}
              title="Wishlist"
            >
              <Heart className="w-6 h-6 text-primary-orange hover:text-primary-orange/50 transition-colors" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <div className="relative">
              <button
                onClick={openCart}
                className="relative"
                id="cart-button"
                aria-label={`Cart${items.length ? `, ${items.length} items` : ""}`}
              >
                <ShoppingCart className="w-6 h-6 text-primary-orange hover:text-primary-orange/50 cursor-pointer transition-colors" />
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </button>
            </div>
            {/* Mobile Menu Toggle.

                This was `hidden sm:flex xl:hidden`, so it disappeared below
                640px — every phone. The menu behind it, Track Order and Price
                List included, could not be opened there at all. */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex xl:hidden"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-primary-orange hover:text-primary-orange/50 cursor-pointer transition-colors" />
              ) : (
                <Menu className="w-6 h-6 text-primary-orange hover:text-primary-orange/50 cursor-pointer transition-colors" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Menu */}
        <div
          className={`xl:hidden absolute left-0 right-0 top-full bg-background border-t border-card-border/10 shadow-lg transition-all duration-300 max-h-[calc(100vh-6rem)] overflow-y-auto ${
            isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div className="container mx-auto py-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="px-4 py-2 font-montserrat font-semibold text-primary hover:text-primary-orange transition-colors cursor-pointer"
                onClick={handleMenuItemClick}
              >
                Home
              </Link>
              <Link
                to="/quick-order"
                className="px-4 py-2 font-montserrat font-semibold text-primary hover:text-primary-orange transition-colors cursor-pointer"
                onClick={handleMenuItemClick}
              >
                Quick Order
              </Link>
              <Link
                to="/silks"
                className="px-4 py-2 font-heading tracking-wider text-primary-yellow hover:text-primary-orange transition-colors cursor-pointer"
                onClick={handleMenuItemClick}
              >
                {BRAND.silkName}
              </Link>
              <Link
                to="/shop"
                className="px-4 py-2 font-montserrat font-semibold text-primary hover:text-primary-orange transition-colors cursor-pointer"
                onClick={handleMenuItemClick}
              >
                Shop All
              </Link>
              <Link
                title="Monthly savings scheme"
                to="/monthly-installment"
                className="px-4 py-2 font-montserrat font-semibold text-primary hover:text-primary-orange transition-colors cursor-pointer"
                onClick={handleMenuItemClick}
              >
                Savings Scheme
              </Link>
              <Link
                to="/track-order"
                className="px-4 py-2 font-montserrat font-semibold text-primary hover:text-primary-orange transition-colors"
                onClick={handleMenuItemClick}
              >
                Track Order
              </Link>
              <Link
                to="/wishlist"
                className="px-4 py-2 font-montserrat font-semibold text-primary hover:text-primary-orange transition-colors"
                onClick={handleMenuItemClick}
              >
                Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ""}
              </Link>
              <button
                onClick={() => {
                  handleDownloadPriceList();
                  setIsMobileMenuOpen(false);
                }}
                disabled={priceListLoading}
                className="px-4 py-2 font-montserrat font-semibold text-primary hover:text-primary-orange text-left disabled:opacity-60 disabled:cursor-wait"
              >
                {priceListLoading ? "Preparing…" : "Price List"}
              </button>

              {/* The theme, moved off the header on small screens. The menu
                  deliberately stays open: this changes the page behind it, and
                  closing would hide the thing you just changed. */}
              <button
                onClick={toggleTheme}
                id="theme-toggle-mobile"
                className="flex items-center gap-2 px-4 py-2 font-montserrat font-semibold text-primary hover:text-primary-orange transition-colors border-t border-card-border/10 pt-4 text-left"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="w-5 h-5 text-primary-yellow" />
                    Light mode
                  </>
                ) : (
                  <>
                    <Moon className="w-5 h-5 text-primary-orange" />
                    Dark mode
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
      <ScrollToTop />

      {/* Main Content */}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSlider />
              <div id="silks" className="scroll-mt-10">
                <SilkShowcase />
              </div>
              <div id="categories" className="scroll-mt-28">
                <ShopCategories />
              </div>
              <div id="trending" className="scroll-mt-10">
                <TrendingProducts />
              </div>
              <div id="about-us" className="scroll-mt-10">
                <AboutSection />
              </div>
              <CTASection />
              <HowItWorks />
              <div id="faqs" className="scroll-mt-10">
                <FAQSection />
              </div>
              <div id="blog" className="scroll-mt-16">
                <BlogSection />
              </div>
              <div id="contact-us" className="scroll-mt-10">
                <ContactSection />
              </div>
            </>
          }
        />
        <Route path="/quick-order" element={<QuickPurchase />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/silks" element={<SilkCollection />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
        <Route path="/monthly-installment" element={<MonthlyInstallment />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myorders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stock"
          element={
            <ProtectedRoute>
              <StockManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/combo-packs"
          element={
            <ProtectedRoute requiredRole="admin">
              <ComboPacks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute requiredRole="admin">
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route path="/cancellation-policy" element={<CancellationPolicy />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/sitemap" element={<Sitemap />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/payment" element={<Payment />} />
        <Route
          path="/expenses"
          element={
            <ProtectedRoute requiredRole="admin">
              <Expenses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute requiredRole="admin">
              <Customers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendors"
          element={
            <ProtectedRoute requiredRole="admin">
              <Vendors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendors/:id"
          element={
            <ProtectedRoute requiredRole="admin">
              <VendorDetails />
            </ProtectedRoute>
          }
        />
        {/* The standalone price-comparison prototype kept its data in
            localStorage and could not feed purchasing. Real comparison now
            lives on the Purchasing page, backed by the saved vendor price
            lists; the old link redirects there. */}
        <Route path="/price-comparing" element={<Navigate to="/purchasing" replace />} />
        <Route
          path="/seasons"
          element={
            <ProtectedRoute requiredRole="admin">
              <Seasons />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchasing"
          element={
            <ProtectedRoute requiredRole="admin">
              <Purchasing />
            </ProtectedRoute>
          }
        />

        <Route path="/update-password" element={<UpdatePassword />} />
      </Routes>
      <Footer />
      <Cart isOpen={isCartOpen} onClose={closeCart} />
      <QuickPurchaseButton />
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppSettingsProvider>
          <SeasonProvider>
            <AppContent />
          </SeasonProvider>
        </AppSettingsProvider>
      </AuthProvider>
    </Router>
  );
}

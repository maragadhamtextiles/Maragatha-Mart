import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Zap } from "lucide-react";

/**
 * The floating shortcut to the one-page order form. Drawn in the brand's
 * emerald and gold rather than shipped as a picture, so it matches the theme
 * in both light and dark mode. It bounces for the first minute only.
 */
const QuickPurchaseButton: React.FC = () => {
  const [animate, setAnimate] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const isQuickPurchasePage = location.pathname === "/quick-order";

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(false), 60000);
    return () => clearTimeout(timer);
  }, []);

  if (isQuickPurchasePage) return null;

  return (
    <button
      onClick={() => navigate("/quick-order")}
      className={`hidden md:flex fixed bottom-4 right-4 z-50 items-center gap-2 pl-3 pr-5 py-3 rounded-full bg-brand-emerald text-brand-gold-light border border-brand-gold shadow-xl shadow-black/30 hover:scale-105 transition-transform ${
        animate ? "animate-bounce" : ""
      }`}
      aria-label="Quick order"
    >
      <span className="w-8 h-8 rounded-full bg-brand-gold text-brand-emerald flex items-center justify-center">
        <Zap className="w-4 h-4" />
      </span>
      <span className="font-heading tracking-widest text-sm">Quick Order</span>
    </button>
  );
};

export default QuickPurchaseButton;

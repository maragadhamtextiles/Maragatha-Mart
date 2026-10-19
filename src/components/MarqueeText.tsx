import { useState, useEffect } from "react";

// Plain text, not HTML: these were once rendered with dangerouslySetInnerHTML
// for the sake of a <b> tag.
const messages = [
  "✦ New arrivals at Maragatha Silks — Kanchipuram & soft silk sarees",
  "✦ Wedding and festive silks, handpicked for you",
  "✦ Textiles, home, kitchen & gifting essentials under one roof",
  "✦ Delivery across India — track your order anytime",
];

export function MarqueeText() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // A phone cannot fit the scrolling line, so it shows one message at a time.
  useEffect(() => {
    if (!isMobile) return;
    const interval = setInterval(() => {
      setCurrentMessageIndex((i) => (i + 1) % messages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isMobile]);

  return (
    <div className="bg-gradient-to-r from-[#9A7417] via-[#C9A227] to-[#9A7417] text-brand-emerald font-semibold py-1 overflow-hidden">
      {isMobile ? (
        <div key={currentMessageIndex} className="text-center animate-fadeInOut text-xs px-3 truncate">
          {messages[currentMessageIndex]}
        </div>
      ) : (
        <div className="whitespace-nowrap flex animate-marquee text-sm">
          {messages.map((message) => (
            <span key={message} className="mx-8">
              {message}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

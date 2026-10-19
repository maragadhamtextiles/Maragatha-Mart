import { motion } from "framer-motion";
import { ShoppingBag, MessageCircle, CreditCard, Truck } from "lucide-react";

const steps = [
  { icon: ShoppingBag, title: "Choose", description: "Browse silks and essentials, and add what you like to your cart." },
  { icon: MessageCircle, title: "We Confirm", description: "We check stock and confirm your order by phone or WhatsApp." },
  { icon: CreditCard, title: "Pay Securely", description: "UPI, Google Pay, bank transfer and more." },
  { icon: Truck, title: "Delivered", description: "Packed with care and delivered. Track it with your order number." },
];

export const HowItWorks = () => {
  return (
    <section className="py-14 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="section-title mb-3">How It Works</h2>
        <div className="ornament mb-12">✦</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12 }}
                className="card text-center"
              >
                <div className="mb-4 flex justify-center">
                  <div className="relative w-16 h-16 rounded-full bg-emerald-silk flex items-center justify-center ring-2 ring-primary-yellow/70">
                    <Icon className="w-7 h-7 text-brand-gold" />
                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-brand-gold text-brand-emerald text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>
                </div>
                <h3 className="font-heading text-lg tracking-wide mb-2">{step.title}</h3>
                <p className="text-sm text-text/70">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

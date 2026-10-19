import React from "react";
import { Link } from "react-router-dom";
import { BRAND } from "../config/brand";
import { POLICY_LAST_UPDATED, PolicyContact, PolicySection } from "./privacy";

const linkClass = "text-primary-orange underline hover:text-primary-orange/80";

const TermsOfUse: React.FC = () => {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-card rounded-2xl p-8 shadow-lg">
          <h1 className="text-4xl font-heading text-primary-orange mb-6">Terms of Use</h1>
          <p className="text-sm text-text/60 mb-8">Last Updated: {POLICY_LAST_UPDATED}</p>

          <div className="space-y-8">
            <PolicySection title="About These Terms">
              <p>
                These terms apply when you use{" "}
                <Link to="/" className={linkClass}>
                  {BRAND.domain}
                </Link>{" "}
                or buy from {BRAND.name}, a store in {BRAND.town}, Tamil Nadu, selling silk sarees through{" "}
                {BRAND.silkName}, along with textiles and everyday home, kitchen, gifting and festive items. By
                using the website or placing an order, you agree to them. If you do not agree, please do not use
                the website.
              </p>
            </PolicySection>

            <PolicySection title="Using the Website">
              <ul className="list-disc list-inside space-y-2">
                <li>You must be 18 or older, or use the website with a parent or guardian.</li>
                <li>
                  If you create an account, keep your password private. You are responsible for orders placed
                  from your account.
                </li>
                <li>
                  Please do not misuse the website: no attempts to break in, scrape it, disrupt it or place
                  orders in someone else's name without their permission.
                </li>
              </ul>
            </PolicySection>

            <PolicySection title="Products, Colours and Handloom Character">
              <ul className="list-disc list-inside space-y-2">
                <li>
                  We describe and photograph every product as accurately as we can. Colours on a screen can
                  differ from the fabric in daylight, and slight differences in shade are not a defect.
                </li>
                <li>
                  Handloom and hand-finished sarees carry small irregularities in weave, colour and zari. These
                  are the mark of hand work, not faults.
                </li>
                <li>
                  Where we state the fibre, zari type or a certification such as the Silk Mark, it is as
                  declared by us or by the weaver. Please ask us if you need more detail before you buy.
                </li>
                <li>Stock is limited, especially for handloom pieces, and may sell out without notice.</li>
              </ul>
            </PolicySection>

            <PolicySection title="Prices and Orders">
              <ul className="list-disc list-inside space-y-2">
                <li>Prices are in Indian Rupees. The price that applies is the one confirmed when you place the order.</li>
                <li>
                  An order is accepted when we confirm it. We may decline or cancel an order if an item is out
                  of stock, if a price was shown in error, or if payment is not received; any amount paid is then
                  refunded in full.
                </li>
                <li>
                  You can track an order on the{" "}
                  <Link to="/track-order" className={linkClass}>
                    Track Order
                  </Link>{" "}
                  page using its order number and your phone number.
                </li>
              </ul>
            </PolicySection>

            <PolicySection title="Payment">
              <p>
                Payment is made through the methods shown at checkout. You agree that the payment details you give
                are yours, or that you are authorised to use them.
              </p>
            </PolicySection>

            <PolicySection title="Delivery, Cancellation and Returns">
              <p>
                Delivery is covered by our{" "}
                <Link to="/shipping-policy" className={linkClass}>
                  Shipping &amp; Delivery Policy
                </Link>
                , and cancellations, returns and exchanges by our{" "}
                <Link to="/cancellation-policy" className={linkClass}>
                  Cancellation, Return &amp; Exchange Policy
                </Link>
                . Both form part of these terms.
              </p>
            </PolicySection>

            <PolicySection title="Content and Trademarks">
              <p>
                The text, photographs, designs and logos on this website belong to {BRAND.name} or are used with
                permission. Please do not copy or reuse them without our written consent.
              </p>
            </PolicySection>

            <PolicySection title="Limitation of Liability">
              <p>
                To the extent the law allows, our liability for any order is limited to the amount you paid for
                it. We are not liable for indirect losses, or for delays caused by events outside our reasonable
                control such as severe weather, strikes or disruption to delivery services. Nothing in these
                terms limits your rights as a consumer under Indian law.
              </p>
            </PolicySection>

            <PolicySection title="Governing Law">
              <p>
                These terms are governed by the laws of India. Any dispute will be subject to the jurisdiction of
                the courts with authority over {BRAND.town}, Thoothukudi District, Tamil Nadu. We would always
                rather resolve a concern directly, so please contact us first.
              </p>
            </PolicySection>

            <PolicySection title="Changes to These Terms">
              <p>
                We may update these terms from time to time. The version on this page when you place an order is
                the one that applies to it.
              </p>
            </PolicySection>

            <PolicySection title="Contact Us">
              <PolicyContact />
            </PolicySection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;

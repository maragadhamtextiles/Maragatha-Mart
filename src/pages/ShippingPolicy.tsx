import React from "react";
import { Link } from "react-router-dom";
import { BRAND } from "../config/brand";
import { POLICY_LAST_UPDATED, PolicyContact, PolicySection } from "./privacy";

const linkClass = "text-primary-orange underline hover:text-primary-orange/80";

const ShippingPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-card rounded-2xl p-8 shadow-lg">
          <h1 className="text-4xl font-heading text-primary-orange mb-6">Shipping &amp; Delivery Policy</h1>
          <p className="text-sm text-text/60 mb-8">Last Updated: {POLICY_LAST_UPDATED}</p>

          <div className="space-y-8">
            <PolicySection title="Placing an Order">
              <p>
                You can order with an account or as a guest. Please give a phone number that will be answered on
                the day of delivery, and a complete address with a landmark and pincode, so your parcel reaches
                you without delay.
              </p>
            </PolicySection>

            <PolicySection title="Where We Deliver">
              <p>
                {BRAND.name} ships from {BRAND.town}, Tamil Nadu, to addresses within India. We do not ship
                internationally at present. If your pincode cannot be served by our delivery partners, we will
                contact you before dispatch and refund anything you have paid.
              </p>
            </PolicySection>

            <PolicySection title="Dispatch and Delivery Time">
              <p>
                We confirm your order and share an estimated delivery time when we do. Delivery time depends on
                your location and on the items ordered: ready stock is dispatched first, while sarees that need
                finishing take longer. During festival and wedding seasons, delivery partners are busier and
                parcels can take a little longer than usual.
              </p>
            </PolicySection>

            <PolicySection title="Delivery Charges">
              <p>
                Delivery charges, where they apply, depend on your location and the size and weight of the order.
                Any charge is shown or confirmed with you before your order is dispatched.
              </p>
            </PolicySection>

            <PolicySection title="Packing">
              <p>
                Silk sarees are folded and packed flat in protective wrapping so they arrive without damage or
                moisture. Larger orders may be sent in more than one parcel. Every order is sent with an invoice.
              </p>
            </PolicySection>

            <PolicySection title="Tracking Your Order">
              <p>
                Track any order on the{" "}
                <Link to="/track-order" className={linkClass}>
                  Track Order
                </Link>{" "}
                page with your order number (or its last four digits) and the phone number used for the order.
                You can also download an order summary there.
              </p>
            </PolicySection>

            <PolicySection title="When Your Parcel Arrives">
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Please check that the parcel is sealed and undamaged before accepting it. If it is visibly
                  damaged or tampered with, note this with the delivery person or refuse the parcel, and tell us
                  straight away.
                </li>
                <li>
                  We recommend recording a short video while you open the parcel. It makes any claim for a
                  damaged, missing or wrong item quick to settle.
                </li>
                <li>
                  Report a damaged, missing or wrong item within 48 hours of delivery. See our{" "}
                  <Link to="/cancellation-policy" className={linkClass}>
                    Cancellation, Return &amp; Exchange Policy
                  </Link>
                  .
                </li>
              </ul>
            </PolicySection>

            <PolicySection title="Undelivered Parcels">
              <p>
                If a parcel comes back to us because the address was incomplete or nobody was available after
                repeated attempts, we will contact you to arrange delivery again. Re-delivery charges may apply.
              </p>
            </PolicySection>

            <PolicySection title="Questions About Delivery">
              <p>If you have not received your invoice, or have a question about a delivery, please contact us:</p>
              <PolicyContact />
            </PolicySection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;

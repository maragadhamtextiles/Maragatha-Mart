import React from "react";
import { Link } from "react-router-dom";
import { POLICY_LAST_UPDATED, PolicyContact, PolicySection } from "./privacy";

/*
 * Return terms for a textile and general-goods store. A saree that has been
 * altered in any way — a blouse piece cut, falls and pico stitched — cannot be
 * sold again, so those are excluded; everything else may come back unused
 * within RETURN_WINDOW_DAYS of delivery.
 */
const RETURN_WINDOW_DAYS = 7;
const DAMAGE_REPORT_HOURS = 48;

const linkClass = "text-primary-orange underline hover:text-primary-orange/80";

const CancellationPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-card rounded-2xl p-8 shadow-lg">
          <h1 className="text-4xl font-heading text-primary-orange mb-6">
            Cancellation, Return &amp; Exchange Policy
          </h1>
          <p className="text-sm text-text/60 mb-8">Last Updated: {POLICY_LAST_UPDATED}</p>

          <div className="space-y-8">
            <PolicySection title="Cancelling an Order">
              <ul className="list-disc list-inside space-y-2">
                <li>You can cancel an order at no cost at any time before it is dispatched. Contact us with your order number.</li>
                <li>
                  Once an order has been dispatched it cannot be cancelled, but eligible items can be returned
                  as described below.
                </li>
                <li>
                  Orders for customised items, or sarees that have already been sent for falls, pico or blouse
                  stitching at your request, cannot be cancelled once that work has started.
                </li>
              </ul>
            </PolicySection>

            <PolicySection title={`Returns and Exchanges Within ${RETURN_WINDOW_DAYS} Days`}>
              <p>
                You may return or exchange an item within <strong>{RETURN_WINDOW_DAYS} days of delivery</strong>{" "}
                if it is:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>unused, unwashed and not altered in any way;</li>
                <li>with all original tags, labels and any Silk Mark label still attached and intact;</li>
                <li>with its blouse piece uncut and still attached, where the saree came with one;</li>
                <li>in its original packaging, together with the invoice.</li>
              </ul>
              <p>
                Exchanges for a different colour or design depend on stock. If what you want is not available, we
                will refund the item instead.
              </p>
            </PolicySection>

            <PolicySection title="Items That Cannot Be Returned">
              <ul className="list-disc list-inside space-y-2">
                <li>Sarees whose blouse piece has been cut or separated.</li>
                <li>Sarees with falls, pico, tassels or any other finishing done after purchase.</li>
                <li>Stitched blouses, tailored or made-to-measure items, and any customised order.</li>
                <li>Items that have been worn, washed, dry cleaned or perfumed.</li>
                <li>Innerwear, and opened personal-care, food or other consumable items, for reasons of hygiene.</li>
                <li>Items clearly marked as non-returnable on the product page.</li>
              </ul>
            </PolicySection>

            <PolicySection title="Damaged, Defective or Wrong Items">
              <p>
                If an item arrives damaged, has a genuine manufacturing defect, or is not what you ordered, tell
                us within <strong>{DAMAGE_REPORT_HOURS} hours of delivery</strong> with your order number and
                photographs (an unboxing video helps a great deal). We will replace the item or refund it in full,
                including any delivery charge, and arrange the return at our cost.
              </p>
              <p>
                Small irregularities in weave, colour or zari are a natural feature of handloom and hand-finished
                sarees, and slight shade differences from screen to fabric are expected. These are not treated as
                defects.
              </p>
            </PolicySection>

            <PolicySection title="How to Return an Item">
              <ol className="list-decimal list-inside space-y-2">
                <li>Contact us within the return window with your order number and the item you want to return.</li>
                <li>We confirm whether the item is eligible and tell you how to send it back.</li>
                <li>Pack the item securely in its original packaging, with the tags and invoice.</li>
                <li>Once the item reaches us and passes inspection, we process the exchange or refund.</li>
              </ol>
              <p>
                For returns that are not due to our error, the cost of sending the item back is yours, and the
                original delivery charge is not refunded.
              </p>
            </PolicySection>

            <PolicySection title="Refunds">
              <p>
                Approved refunds are made to the original payment method once the returned item has been received
                and checked. We will let you know when it has been sent; banks and payment apps can take a few
                working days to show it.
              </p>
            </PolicySection>

            <PolicySection title="Need Help?">
              <p>
                For a cancellation, return or exchange, please contact us. You can check the status of your order
                at any time on the{" "}
                <Link to="/track-order" className={linkClass}>
                  Track Order
                </Link>{" "}
                page.
              </p>
              <PolicyContact />
            </PolicySection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicy;

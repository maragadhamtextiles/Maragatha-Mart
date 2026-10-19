import React from "react";
import { Link } from "react-router-dom";
import { BRAND } from "../config/brand";
import { useAppSettings } from "../context/AppSettingsContext";

/*
 * The policy pages share two pieces: a titled section and the contact block.
 * They live here, beside the privacy policy, rather than in components/,
 * because nothing outside the four policy pages uses them.
 */

export const POLICY_LAST_UPDATED = "October 2026";

export const PolicySection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <section>
    <h2 className="text-2xl font-montserrat font-bold text-primary-orange mb-4">{title}</h2>
    <div className="bg-card/30 p-6 rounded-lg text-text/80 space-y-4">{children}</div>
  </section>
);

/**
 * How to reach the shop, from Admin Settings. Contact details are never
 * written into the page: a number that changes would otherwise stay wrong on
 * every policy until the next deploy. A line that has not been filled in is
 * left out, and the home page's contact section is always offered.
 */
export const PolicyContact: React.FC = () => {
  const { settings } = useAppSettings();
  const name = settings?.business_legal_name || BRAND.name;
  const address = settings?.business_address;
  const phone = settings?.business_phone;
  const email = settings?.business_email;

  return (
    <div className="space-y-2">
      <p>
        <strong>{name}</strong>
      </p>
      {address && <p className="whitespace-pre-line">{address}</p>}
      {phone && (
        <p>
          Phone:{" "}
          <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="text-primary-orange underline">
            {phone}
          </a>
        </p>
      )}
      {email && (
        <p>
          Email:{" "}
          <a href={`mailto:${email}`} className="text-primary-orange underline">
            {email}
          </a>
        </p>
      )}
      <p>
        You can also use the contact details in the{" "}
        <Link to="/#contact-us" className="text-primary-orange underline hover:text-primary-orange/80">
          Contact section of our home page
        </Link>
        .
      </p>
    </div>
  );
};

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-card rounded-2xl p-8 shadow-lg">
          <h1 className="text-4xl font-heading text-primary-orange mb-6">Privacy Policy</h1>
          <p className="text-sm text-text/60 mb-8">Last Updated: {POLICY_LAST_UPDATED}</p>

          <div className="space-y-8">
            <PolicySection title="Introduction">
              <p>
                <strong>{BRAND.name}</strong> (including {BRAND.silkName}) is a store in {BRAND.town}, Tamil
                Nadu, selling silk sarees, textiles and everyday essentials ("we", "our", "us"). This policy
                explains what personal information we collect when you visit{" "}
                <Link to="/" className="text-primary-orange underline hover:text-primary-orange/80">
                  {BRAND.domain}
                </Link>{" "}
                or order from us, why we collect it, and the choices you have.
              </p>
              <p>
                We collect only what we need to take, deliver and support your order. We do not sell your
                personal information to anyone.
              </p>
            </PolicySection>

            <PolicySection title="Information We Collect">
              <p>
                <strong>Details you give us.</strong> Your name, phone number, delivery address and, if you
                create an account, your email address. You can place an order as a guest; we then keep only
                what is needed to deliver it and to let you track it.
              </p>
              <p>
                <strong>Order details.</strong> What you ordered, the amounts, the delivery status and any
                notes you add, together with messages you send us about the order.
              </p>
              <p>
                <strong>Payment details.</strong> Payments are made through UPI and the other methods listed
                at checkout. We may record a payment reference so we can match a payment to an order. We do
                not see or store your card number, UPI PIN or banking password.
              </p>
              <p>
                <strong>Technical information.</strong> Basic information your browser sends, such as device
                type, browser and pages visited, which helps us keep the site working and secure.
              </p>
            </PolicySection>

            <PolicySection title="How We Use Your Information">
              <ul className="list-disc list-inside space-y-2">
                <li>To confirm, pack, deliver and support your order, and to issue invoices.</li>
                <li>To let you track an order using its order number and your phone number.</li>
                <li>To contact you about your order, a return or an exchange.</li>
                <li>
                  To send you offers or new-arrival updates, only if you have chosen to receive them. You can
                  stop these at any time.
                </li>
                <li>To keep the website secure and prevent misuse.</li>
                <li>To keep the business and tax records the law requires.</li>
              </ul>
            </PolicySection>

            <PolicySection title="Cookies and Local Storage">
              <p>
                The site stores small pieces of information in your browser, such as your cart, wishlist and
                sign-in session, so they are still there when you come back. You can clear them through your
                browser settings; the site will still work, but your cart will be emptied.
              </p>
            </PolicySection>

            <PolicySection title="Notifications">
              <p>
                If you allow notifications in your browser, we use them only to tell you about your orders
                and, where you have agreed, about offers. You can turn them off at any time in your browser
                or phone settings.
              </p>
            </PolicySection>

            <PolicySection title="Who We Share It With">
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Delivery partners</strong>, who receive your name, phone number and address so they
                  can deliver your parcel.
                </li>
                <li>
                  <strong>Payment providers</strong>, who process your payment under their own privacy terms.
                </li>
                <li>
                  <strong>Service providers</strong> that host our website, database and notifications on our
                  behalf, under obligations to protect your information.
                </li>
                <li>
                  <strong>Authorities</strong>, where we are required to by law.
                </li>
              </ul>
            </PolicySection>

            <PolicySection title="How Long We Keep It">
              <p>
                We keep order and invoice records for as long as tax and accounting law requires. Account
                details are kept while your account is active. Marketing preferences are removed as soon as
                you opt out.
              </p>
            </PolicySection>

            <PolicySection title="Your Choices and Rights">
              <ul className="list-disc list-inside space-y-2">
                <li>You can see and update your account details from your profile.</li>
                <li>
                  You can ask us for a copy of the personal information we hold about you, ask us to correct
                  it, or ask us to delete it where we are not required to keep it.
                </li>
                <li>You can opt out of offers and notifications at any time.</li>
              </ul>
              <p>
                We handle personal information in line with the Information Technology Act, 2000 and the
                Digital Personal Data Protection Act, 2023, as they apply to us.
              </p>
            </PolicySection>

            <PolicySection title="Security">
              <p>
                We use reasonable technical and organisational measures to protect your information, and
                access to customer details is limited to the staff who need it to serve you. No system is
                completely secure, so please keep your password private and tell us if you suspect misuse of
                your account.
              </p>
            </PolicySection>

            <PolicySection title="Children">
              <p>
                Our website is meant for adults. We do not knowingly collect personal information from
                children. If you believe a child has given us their details, please contact us and we will
                delete them.
              </p>
            </PolicySection>

            <PolicySection title="Changes to This Policy">
              <p>
                We may update this policy from time to time. The date at the top of this page shows when it
                last changed.
              </p>
            </PolicySection>

            <PolicySection title="Contact Us">
              <p>For any question about your personal information, please contact us:</p>
              <PolicyContact />
            </PolicySection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

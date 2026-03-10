import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="font-display text-4xl md:text-5xl text-brown mb-2">Terms of Use</h1>
          <p className="font-serif text-brown/80 mb-1">Light of India</p>
          <p className="font-serif text-brown/80 mb-1">Operated by Cafe Brasserie Red B.V.</p>
          <p className="text-brown/60 font-serif mb-8">Last updated: 10 March 2026</p>

          <p className="font-serif text-brown/80 mb-12">
            These Terms of Use apply to the use of the Light of India website and services,
            including online orders, reservations, menus, newsletters, and other usual restaurant
            website functions.
          </p>

          <div className="prose prose-brown max-w-none font-serif text-brown/80 space-y-8">
            <section>
              <h2 className="font-display text-2xl text-brown mb-4">1. Business details</h2>
              <ul className="list-none pl-0 space-y-1">
                <li><strong>Restaurant name:</strong> Light of India</li>
                <li><strong>Legal entity:</strong> Cafe Brasserie Red B.V.</li>
                <li><strong>KvK number:</strong> 59859784</li>
                <li><strong>VAT number:</strong> 853671084B01</li>
                <li><strong>Address:</strong> Kortekade 1, 3062 GK Rotterdam, The Netherlands</li>
                <li>
                  <strong>Email:</strong>{" "}
                  <a href="mailto:Zafar@LightofIndia.nl" className="text-secondary hover:underline">
                    Zafar@LightofIndia.nl
                  </a>
                </li>
                <li>
                  <strong>Phone:</strong>{" "}
                  <a href="tel:+31638215615" className="text-secondary hover:underline">
                    0638 215 615
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl text-brown mb-4">2. Use of the website</h2>
              <p>
                By using this website, placing an order, making a reservation, or subscribing to our
                newsletter, you agree to these Terms of Use.
              </p>
              <p>You agree to use the website lawfully and not to misuse it.</p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-brown mb-4">3. Reservations</h2>
              <p>
                Reservations made through our website or by phone/email are subject to availability.
                We may contact you to confirm or adjust a booking if necessary.
              </p>
              <p>
                We ask that you provide correct contact details and inform us in time if you need to
                cancel or change your reservation.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-brown mb-4">4. Online orders</h2>
              <p>
                If online ordering is available, all orders are subject to acceptance by Light of
                India. We reserve the right to refuse or cancel an order in case of:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Incorrect information</li>
                <li>Product unavailability</li>
                <li>Pricing or technical errors</li>
                <li>Suspected fraud or misuse</li>
                <li>Circumstances beyond our control</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl text-brown mb-4">5. Prices and payments</h2>
              <p>
                All prices shown on the website are in euros and include VAT unless stated otherwise.
              </p>
              <p>
                Payments may be processed through a third-party payment provider such as Mollie. An
                order is only complete after successful payment, if payment in advance is required.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-brown mb-4">6. Menus and availability</h2>
              <p>
                We do our best to ensure that menus, descriptions, and prices on the website are
                accurate. However, dishes, ingredients, prices, and availability may change at any
                time.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-brown mb-4">7. Allergies and dietary requirements</h2>
              <p>
                We try to provide clear information about our food. However, we cannot guarantee that
                dishes are fully free from allergens or cross-contamination.
              </p>
              <p>
                Customers with allergies or dietary requirements should contact us directly before
                ordering.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-brown mb-4">8. Newsletter and offers</h2>
              <p>
                If you sign up for newsletters or promotional emails, you agree to receive restaurant
                news and offers from us. You may unsubscribe at any time.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-brown mb-4">9. Intellectual property</h2>
              <p>
                All content on this website, including text, logos, branding, images, menus, and
                design, belongs to Light of India or is used with permission. You may not copy or
                reuse website content without written permission, except where allowed by law.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-brown mb-4">10. Website availability</h2>
              <p>
                We try to keep the website available and up to date, but we do not guarantee
                uninterrupted access or that the website will always be free of errors.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-brown mb-4">11. Liability</h2>
              <p>
                We aim to provide our services with reasonable care. However, to the extent permitted
                by law, we are not liable for indirect loss, website interruptions, or issues caused
                by third-party providers, technical failures, or incorrect information supplied by
                users.
              </p>
              <p>
                Nothing in these Terms excludes rights that cannot be excluded under Dutch law.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-brown mb-4">12. Privacy</h2>
              <p>
                Our use of personal data is described in our{" "}
                <a href="/privacy" className="text-secondary hover:underline">
                  Privacy Policy
                </a>.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-brown mb-4">13. Changes</h2>
              <p>
                We may update these Terms of Use at any time. The latest version will always be
                published on the website.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-brown mb-4">14. Governing law</h2>
              <p>
                These Terms of Use are governed by the laws of the Netherlands. Any disputes will be
                submitted to the competent court in the Netherlands, unless mandatory law provides
                otherwise.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;

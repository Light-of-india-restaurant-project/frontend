import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="font-display text-4xl md:text-5xl text-brown mb-2">Privacy Policy</h1>
          <p className="font-serif text-brown/80 mb-1">Light of India</p>
          <p className="font-serif text-brown/80 mb-1">Operated by Cafe Brasserie Red B.V.</p>
          <p className="text-brown/60 font-serif mb-8">Last updated: 10 March 2026</p>

          <p className="font-serif text-brown/80 mb-12">
            Light of India, located at Kortekade 1, 3062 GK Rotterdam, The Netherlands, respects
            your privacy. In this Privacy Policy, we explain what personal data we collect, why we
            collect it, and how we use it when you visit our website, place an online order, make a
            reservation, or sign up for newsletters and offers.
          </p>

          <div className="prose prose-brown max-w-none font-serif text-brown/80 space-y-8">
            <section>
              <h2 className="font-display text-2xl text-brown mb-4">1. Who we are</h2>
              <ul className="list-none pl-0 space-y-1">
                <li><strong>Restaurant name:</strong> Light of India</li>
                <li><strong>Legal entity:</strong> Cafe Brasserie Red B.V.</li>
                <li><strong>KvK number:</strong> 59859784</li>
                <li><strong>RSIN:</strong> 853671084</li>
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
              <h2 className="font-display text-2xl text-brown mb-4">2. What personal data we collect</h2>
              <p>We may collect the following personal data:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Address details for delivery or billing</li>
                <li>Reservation details</li>
                <li>Order details</li>
                <li>Payment-related information</li>
                <li>IP address</li>
                <li>Browser and device information</li>
                <li>Information you provide via contact forms</li>
                <li>Newsletter preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl text-brown mb-4">3. How we collect your data</h2>
              <p>We collect personal data when you:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Visit our website</li>
                <li>Make a reservation</li>
                <li>Place an online order</li>
                <li>Contact us by email, phone, or contact form</li>
                <li>Subscribe to our newsletter or offers</li>
                <li>Make a payment through the website</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl text-brown mb-4">4. Why we use your data</h2>
              <p>We use your personal data to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Process and manage reservations</li>
                <li>Process online orders and deliveries</li>
                <li>Handle payments</li>
                <li>Contact you about your order or reservation</li>
                <li>Respond to questions or requests</li>
                <li>Send newsletters and promotional offers if you have subscribed</li>
                <li>Improve our website and services</li>
                <li>Meet legal and tax obligations</li>
                <li>Prevent fraud and misuse</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl text-brown mb-4">5. Legal basis for processing</h2>
              <p>We process your personal data based on:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Performance of a contract</strong>, such as fulfilling an order or reservation</li>
                <li><strong>Legal obligations</strong></li>
                <li><strong>Your consent</strong>, for example for newsletters</li>
                <li><strong>Our legitimate interest</strong> in operating and improving our restaurant and website</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl text-brown mb-4">6. Payments</h2>
              <p>
                Payments made through our website may be processed by a third-party payment provider,
                such as Mollie. We do not store full payment card details on our own servers.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-brown mb-4">7. Sharing your data</h2>
              <p>
                We may share your personal data with third parties where necessary, such as:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Payment providers</li>
                <li>Website hosting and technical service providers</li>
                <li>Reservation or ordering system providers</li>
                <li>Delivery service providers</li>
                <li>Accountants or authorities where legally required</li>
              </ul>
              <p>We do not sell your personal data.</p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-brown mb-4">8. Newsletter and marketing</h2>
              <p>
                If you subscribe to our newsletter or offers, we may send you updates, promotions,
                and restaurant news by email. You can unsubscribe at any time using the unsubscribe
                link in the email or by contacting us.
              </p>
            </section>

            <section>
              <h2 id="cookies" className="font-display text-2xl text-brown mb-4">9. Cookies</h2>
              <p>Our website may use cookies for:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Basic website functionality</li>
                <li>Remembering preferences</li>
                <li>Website analytics</li>
                <li>Marketing, where applicable</li>
              </ul>
              <p>
                Where required by law, we will ask for your consent before placing non-essential cookies.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-brown mb-4">10. Retention period</h2>
              <p>
                We keep personal data only as long as necessary for the purposes described in this
                Privacy Policy, unless a longer period is required by law.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-brown mb-4">11. Your rights</h2>
              <p>Under applicable privacy law, you may have the right to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Request access to your personal data</li>
                <li>Correct inaccurate personal data</li>
                <li>Request deletion of your data</li>
                <li>Restrict or object to processing</li>
                <li>Withdraw consent at any time</li>
                <li>Lodge a complaint with the Dutch Data Protection Authority</li>
              </ul>
              <p>
                To exercise any of these rights, please contact us at{" "}
                <a href="mailto:Zafar@LightofIndia.nl" className="text-secondary hover:underline">
                  Zafar@LightofIndia.nl
                </a>.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-brown mb-4">12. Security</h2>
              <p>
                We take reasonable technical and organizational measures to protect your personal data
                against loss, misuse, or unauthorized access.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-brown mb-4">13. Third-party links</h2>
              <p>
                Our website may include links to third-party websites or services. We are not
                responsible for their privacy practices.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-brown mb-4">14. Changes to this Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. The latest version will always
                be published on our website.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;

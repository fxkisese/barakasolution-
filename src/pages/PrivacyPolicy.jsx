import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
    return (
        <div className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-12">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-400 mb-3">Legal</p>
                <h1 className="font-heading font-light text-[clamp(2rem,4vw,3rem)] text-obsidian leading-tight">
                    Privacy Policy
                </h1>
                <p className="mt-4 text-stone-500 text-sm">Last updated: September 2026</p>
                <div className="mt-6 h-px w-16 bg-obsidian/20" />
            </div>

            <div className="space-y-10 text-stone-600 text-sm">

                <section>
                    <p className="leading-relaxed">
                        Baraka Solutions ("<strong>we</strong>", "<strong>us</strong>", "<strong>our</strong>") is committed to protecting your personal information and your right to privacy. This Privacy Policy explains what information we collect, how we use it, and what rights you have in relation to it.
                    </p>
                    <p className="mt-3 leading-relaxed">
                        By using our website at{" "}
                        <a href="https://www.luxecraftsfurniture.com" className="underline underline-offset-2 text-obsidian">
                            luxecraftsfurniture.com
                        </a>{" "}
                        you agree to the terms of this policy.
                    </p>
                </section>

                <section>
                    <h2 className="font-heading text-xl text-obsidian mb-3">1. Information we collect</h2>
                    <p className="leading-relaxed mb-3">We collect information you provide directly to us, including:</p>
                    <ul className="list-disc pl-5 space-y-2 text-stone-500">
                        <li>Your name, email address, and phone number when you fill in a contact or inquiry form.</li>
                        <li>Your delivery address when you place an order.</li>
                        <li>Your email address if you sign up to our newsletter or exclusive offers list.</li>
                        <li>Account information (email and password) if you create an account on our site.</li>
                    </ul>
                    <p className="mt-4 leading-relaxed">
                        We also collect certain information automatically when you visit, including your IP address, browser type, device type, pages visited, and how you arrived at the site (e.g. via a social media ad). This information is collected using cookies and similar tracking technologies — see Section 5 below and our full{" "}
                        <Link to="/cookies" className="underline underline-offset-2 text-obsidian">Cookie Policy</Link>.
                    </p>
                </section>

                <section>
                    <h2 className="font-heading text-xl text-obsidian mb-3">2. How we use your information</h2>
                    <p className="leading-relaxed mb-3">We use the information we collect to:</p>
                    <ul className="list-disc pl-5 space-y-2 text-stone-500">
                        <li>Process and fulfil your orders and service requests.</li>
                        <li>Respond to your inquiries and provide customer support.</li>
                        <li>Send you order updates and delivery information.</li>
                        <li>Send you marketing communications about new products or special offers — only with your consent, and you can opt out at any time.</li>
                        <li>Improve our website, products, and services.</li>
                        <li>Understand how visitors interact with our site (analytics).</li>
                        <li>Measure the effectiveness of our advertising on platforms such as Facebook and Instagram.</li>
                        <li>Comply with legal obligations.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-heading text-xl text-obsidian mb-3">3. Legal basis for processing</h2>
                    <p className="leading-relaxed">
                        We process your personal data where we have a legitimate interest in operating our business, where it is necessary to perform a contract with you (e.g. fulfilling your order), where you have given your consent (e.g. newsletter sign-up, analytics and advertising cookies), or where we are required to do so by law.
                    </p>
                </section>

                <section>
                    <h2 className="font-heading text-xl text-obsidian mb-3">4. Sharing your information</h2>
                    <p className="leading-relaxed mb-3">
                        We do not sell your personal information. We may share it with trusted third parties only where necessary:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-stone-500">
                        <li><strong>Supabase</strong> — our database and authentication provider. Data is stored on secure servers.</li>
                        <li><strong>Google Analytics</strong> — aggregated, anonymised website usage data. No personally identifiable information is sent.</li>
                        <li><strong>Meta (Facebook/Instagram)</strong> — event data (e.g. page views, purchases) to measure ad effectiveness. Only sent if you have accepted advertising cookies.</li>
                        <li><strong>WhatsApp / Meta Platforms</strong> — when you initiate an order via WhatsApp, your message and contact details are handled by WhatsApp's service.</li>
                    </ul>
                    <p className="mt-4 text-stone-500 leading-relaxed">
                        All third parties are required to protect your data in accordance with applicable law.
                    </p>
                </section>

                <section>
                    <h2 className="font-heading text-xl text-obsidian mb-3">5. Cookies and tracking technologies</h2>
                    <p className="leading-relaxed">
                        We use cookies and similar technologies to keep our website functioning, to understand how it is used, and to improve our advertising. You can manage your preferences at any time using our cookie consent tool.
                    </p>
                    <p className="mt-3 leading-relaxed">
                        For a full list of cookies we use, their purpose, and their duration, please see our{" "}
                        <Link to="/cookies" className="underline underline-offset-2 text-obsidian">Cookie Policy</Link>.
                    </p>
                    <p className="mt-3 leading-relaxed">
                        <strong>Google Analytics 4:</strong> We use GA4 in Consent Mode — analytics cookies are only placed after you accept analytics cookies. We do not enable Google Signals or advertising features within GA4.
                    </p>
                    <p className="mt-3 leading-relaxed">
                        <strong>Meta Pixel:</strong> The Meta Pixel only loads after you accept advertising cookies. It helps us measure whether visitors who click our Facebook or Instagram ads take actions on this website (such as viewing a product or making an inquiry).
                    </p>
                </section>

                <section>
                    <h2 className="font-heading text-xl text-obsidian mb-3">6. Data retention</h2>
                    <p className="leading-relaxed">
                        We keep your personal information for as long as necessary to fulfil the purposes described in this policy, or as required by law. Inquiry and order data is retained for up to 3 years. Analytics data in Google Analytics is retained for 14 months. You may request deletion at any time (see Section 8).
                    </p>
                </section>

                <section>
                    <h2 className="font-heading text-xl text-obsidian mb-3">7. Data security</h2>
                    <p className="leading-relaxed">
                        We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. Our database is managed by Supabase, which uses industry-standard encryption and security practices. Access to personal data is restricted to authorised personnel only.
                    </p>
                </section>

                <section>
                    <h2 className="font-heading text-xl text-obsidian mb-3">8. Your rights</h2>
                    <p className="leading-relaxed mb-3">Depending on your location, you may have the right to:</p>
                    <ul className="list-disc pl-5 space-y-2 text-stone-500">
                        <li>Access the personal data we hold about you.</li>
                        <li>Request correction of inaccurate data.</li>
                        <li>Request deletion of your data.</li>
                        <li>Object to or restrict certain processing.</li>
                        <li>Withdraw consent at any time (this does not affect processing already carried out).</li>
                        <li>Manage cookie preferences via our consent tool.</li>
                    </ul>
                    <p className="mt-4 leading-relaxed">
                        To exercise any of these rights, contact us via our{" "}
                        <Link to="/contact" className="underline underline-offset-2 text-obsidian">Contact page</Link>.
                    </p>
                </section>

                <section>
                    <h2 className="font-heading text-xl text-obsidian mb-3">9. Children's privacy</h2>
                    <p className="leading-relaxed">
                        Our website is not directed at children under 16 years of age. We do not knowingly collect personal information from children. If you believe a child has provided us with their data, please contact us and we will delete it promptly.
                    </p>
                </section>

                <section>
                    <h2 className="font-heading text-xl text-obsidian mb-3">10. Changes to this policy</h2>
                    <p className="leading-relaxed">
                        We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date at the top. We encourage you to review this policy periodically.
                    </p>
                </section>

                <section>
                    <h2 className="font-heading text-xl text-obsidian mb-3">11. Contact us</h2>
                    <p className="leading-relaxed">
                        If you have any questions about this Privacy Policy or how we handle your data, please visit our{" "}
                        <Link to="/contact" className="underline underline-offset-2 text-obsidian">Contact page</Link>{" "}
                        or call us on{" "}
                        <a href="tel:+254797624196" className="underline underline-offset-2 text-obsidian">+254 797 624196</a>.
                    </p>
                </section>

            </div>
        </div>
    );
}

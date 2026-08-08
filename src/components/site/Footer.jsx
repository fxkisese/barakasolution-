import { Instagram, Facebook, Twitter, MapPin, Phone, Mail } from "lucide-react";

const SHOP_LINKS = [
    { label: "New Arrivals", href: "#arrivals" },
    { label: "Collections", href: "#collections" },
    { label: "Shop by Category", href: "#shop" },
    { label: "Journal", href: "#blog" },
];

const CATEGORY_LINKS = [
    { label: "Furniture", href: "#shop" },
    { label: "Lighting", href: "#shop" },
    { label: "Decor", href: "#shop" },
    { label: "Plants & Planters", href: "#shop" },
];

export default function Footer() {
    return (
        <footer id="contact" className="scroll-mt-24 bg-obsidian text-silk">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    {/* Brand */}
                    <div className="md:col-span-4">
                        <p className="font-heading text-2xl tracking-[0.16em] uppercase">
                            Luxe Craft Furniture
                        </p>
                        <p className="mt-5 text-silk/60 text-sm leading-relaxed max-w-xs">
                            A design decoration store based in Nairobi, Kenya — specialising in
                            furniture, decor, home accessories and more. Durable. Stylish. Affordable.
                        </p>
                        <div className="mt-6 flex gap-3">
                            {[
                                { Icon: Instagram, label: "Instagram" },
                                { Icon: Facebook, label: "Facebook" },
                                { Icon: Twitter, label: "Twitter" },
                            ].map(({ Icon, label }) => (
                                <a
                                    key={label}
                                    href="#top"
                                    aria-label={label}
                                    className="grid place-items-center w-10 h-10 border border-silk/15 text-silk/70 hover:bg-white hover:border-white hover:text-obsidian transition-colors"
                                >
                                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Shop links */}
                    <div className="md:col-span-2">
                        <h4 className="font-mono-price text-[11px] uppercase tracking-[0.2em] text-clay">Shop</h4>
                        <ul className="mt-5 space-y-3">
                            {SHOP_LINKS.map((l) => (
                                <li key={l.label}>
                                    <a href={l.href} className="text-silk/70 text-sm hover:text-silk transition-colors">
                                        {l.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div className="md:col-span-2">
                        <h4 className="font-mono-price text-[11px] uppercase tracking-[0.2em] text-clay">Categories</h4>
                        <ul className="mt-5 space-y-3">
                            {CATEGORY_LINKS.map((l) => (
                                <li key={l.label}>
                                    <a href={l.href} className="text-silk/70 text-sm hover:text-silk transition-colors">
                                        {l.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="md:col-span-4">
                        <h4 className="font-mono-price text-[11px] uppercase tracking-[0.2em] text-clay">Contact</h4>
                        <ul className="mt-5 space-y-4 text-sm text-silk/70">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 mt-0.5 text-silk/70 shrink-0" strokeWidth={1.5} />
                                <span>Nairobi, Kenya</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone className="w-4 h-4 mt-0.5 text-silk/70 shrink-0" strokeWidth={1.5} />
                                <a href="tel:+254700000000" className="hover:text-silk transition-colors">+254 700 000 000</a>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail className="w-4 h-4 mt-0.5 text-silk/70 shrink-0" strokeWidth={1.5} />
                                <a href="mailto:hello@luxecraftfurniture.com" className="hover:text-silk transition-colors">hello@luxecraftfurniture.com</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-silk/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-silk/40 text-xs">
                        © {new Date().getFullYear()} Luxe Craft Furniture. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-silk/40 text-xs">
                        <a href="#top" className="hover:text-silk transition-colors">Privacy Policy</a>
                        <a href="#top" className="hover:text-silk transition-colors">Terms of Service</a>
                        <a href="#top" className="hover:text-silk transition-colors">Shipping</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
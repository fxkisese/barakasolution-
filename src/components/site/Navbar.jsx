import { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { NAV_LINKS } from "@/lib/siteData";
import { useCart } from "@/lib/CartContext";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const { openCart, cartCount } = useCart();

    return (
        <header className="sticky top-0 z-50 bg-white border-b hairline">
            <nav className="mx-auto max-w-[1400px] px-6 lg:px-12 h-20 flex items-center justify-between">
                <a
                    href="#top"
                    className="font-body font-semibold text-lg md:text-xl tracking-[0.2em] text-obsidian uppercase"
                >
                    Luxe Craft Furniture
                </a>

                <div className="flex items-center gap-5">
                    <button
                        onClick={openCart}
                        aria-label="Cart"
                        className="relative grid place-items-center w-10 h-10 text-obsidian hover:text-obsidian/70 transition-colors"
                    >
                        <ShoppingBag className="w-5 h-5" strokeWidth={1.4} />
                        {cartCount > 0 && (
                            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-obsidian text-[10px] text-white">
                                {cartCount}
                            </span>
                        )}
                    </button>
                    <a
                        href="#collections"
                        className="hidden sm:inline-flex items-center justify-center h-10 px-4 text-obsidian text-[12px] uppercase tracking-[0.2em] font-medium hover:text-obsidian/70 transition-colors"
                    >
                        Discover
                    </a>
                    <button
                        aria-label="Menu"
                        onClick={() => setOpen((v) => !v)}
                        className="grid place-items-center w-10 h-10 text-obsidian hover:text-obsidian/70 transition-colors"
                    >
                        {open ? <X className="w-6 h-6" strokeWidth={1.4} /> : <Menu className="w-6 h-6" strokeWidth={1.4} />}
                    </button>
                </div>
            </nav>

            {/* Mobile drawer */}
            <div
                className={`overflow-hidden bg-silk border-t hairline transition-[max-height] duration-500 ease-out ${open ? "max-h-40" : "max-h-0"
                    }`}
            >
                <ul className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 px-6 py-5">
                    {NAV_LINKS.map((l) => (
                        <li key={l.href}>
                            <a
                                href={l.href}
                                onClick={() => setOpen(false)}
                                className="font-body text-sm uppercase tracking-[0.18em] text-obsidian hover:text-obsidian/70 transition-colors duration-300"
                            >
                                {l.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </header>
    );
}
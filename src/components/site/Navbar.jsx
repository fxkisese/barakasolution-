import { useState } from "react";
import { Menu, X, Search, ShoppingCart, Facebook, Instagram, Youtube, ChevronDown } from "lucide-react";
import { MEGA_MENU_LINKS } from "@/lib/siteData";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import SearchDialog from "./SearchDialog";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const { openCart, cartCount } = useCart();
    const { isAuthenticated } = useAuth();

    const topBarButton = "rounded-full border border-silk/30 px-5 py-1.5 flex items-center gap-2 text-[11px] font-bold tracking-wider hover:bg-silk hover:text-obsidian transition-colors h-10 text-silk whitespace-nowrap";


    return (
        <header className="sticky top-0 z-50 bg-obsidian border-b border-silk/10">
            {/* TOP TIER (Desktop) */}
            <div className="hidden xl:flex items-center justify-between px-8 py-5 max-w-[1600px] mx-auto">
                <div className="flex items-center gap-8">
                    <a href="/" className="flex items-center shrink-0">
                        <img src="/logo.png" alt="Luxe Craft Furniture" className="h-12 w-auto object-contain" />
                    </a>
                    
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSearchOpen(true)} className={`${topBarButton} w-56 justify-between text-silk/70 font-normal bg-transparent`}>
                            <span>Search for...</span> <Search size={16} className="text-silk shrink-0" />
                        </button>
                        {isAuthenticated ? (
                            <a href="/admin" className={topBarButton}>DASHBOARD</a>
                        ) : (
                            <a href="/login" className={topBarButton}>LOGIN / REGISTER</a>
                        )}
                        <button onClick={openCart} className={topBarButton}>
                            CART <ShoppingCart size={14} /> 
                            {cartCount > 0 && <span className="ml-1 bg-silk text-obsidian text-[10px] px-1.5 rounded-full font-bold">{cartCount}</span>}
                        </button>
                        <a href="/about" className={topBarButton}>OUR STORES</a>
                        <a href="/services" className={topBarButton}>B2B SERVICES</a>
                    </div>
                </div>

                <div className="flex items-center gap-5 shrink-0 pl-4">
                    <div className="text-[14px] text-silk font-medium tracking-wide">
                        info@barakasolutions.com | +254 797 624196
                    </div>
                    <div className="flex items-center gap-2 text-white">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="bg-[#3b5998] p-1.5 rounded-full hover:opacity-80 transition-opacity">
                            <Facebook size={14} fill="currentColor" />
                        </a>
                        <a href="https://instagram.com/barakasolutions" target="_blank" rel="noreferrer" className="bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-1.5 rounded-full hover:opacity-80 transition-opacity">
                            <Instagram size={14} />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noreferrer" className="bg-[#ff0000] p-1.5 rounded-full hover:opacity-80 transition-opacity">
                            <Youtube size={14} fill="currentColor" />
                        </a>
                    </div>
                </div>
            </div>

            {/* TOP TIER (Mobile/Tablet) */}
            <div className="xl:hidden flex items-center justify-between px-5 py-4">
                <a href="/" className="flex items-center">
                    <img src="/logo.png" alt="Luxe Craft Furniture" className="h-10 w-auto object-contain" />
                </a>
                <div className="flex items-center gap-4">
                    <button onClick={() => setSearchOpen(true)} className="p-2 hover:opacity-70">
                        <Search size={22} className="text-silk" />
                    </button>
                    <button onClick={openCart} className="p-2 relative hover:opacity-70">
                        <ShoppingCart size={22} className="text-silk" />
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                {cartCount}
                            </span>
                        )}
                    </button>
                    <button onClick={() => setOpen(!open)} className="p-2 hover:opacity-70">
                        {open ? <X size={26} className="text-silk" /> : <Menu size={26} className="text-silk" />}
                    </button>
                </div>
            </div>

            {/* BOTTOM TIER (Categories) - Desktop */}
            <nav className="hidden xl:block border-t border-silk/10 bg-obsidian">
                <div className="max-w-[1600px] mx-auto px-8 py-5 flex overflow-x-auto items-center gap-x-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {MEGA_MENU_LINKS.map(link => (
                        <a 
                            key={link.label} 
                            href={link.href}
                            className={`flex items-center gap-1 text-[13px] font-bold tracking-wider hover:opacity-60 transition-opacity whitespace-nowrap shrink-0 ${link.isRed ? 'text-red-500' : 'text-silk'}`}
                        >
                            {link.label} 
                            {link.hasDropdown && <ChevronDown size={14} className="opacity-60 shrink-0" strokeWidth={3} />}
                        </a>
                    ))}
                </div>
            </nav>

            {/* MOBILE DRAWER */}
            <div className={`xl:hidden overflow-hidden bg-obsidian border-t border-silk/10 transition-[max-height] duration-500 ease-in-out ${open ? "max-h-[85vh] overflow-y-auto shadow-2xl" : "max-h-0"}`}>
                <div className="p-6 flex flex-col gap-6">
                    {/* Utilities */}
                    <div className="flex flex-col gap-3 pb-6 border-b border-silk/10">
                        {isAuthenticated ? (
                            <a href="/admin" className={`${topBarButton} w-full justify-center`}>DASHBOARD</a>
                        ) : (
                            <a href="/login" className={`${topBarButton} w-full justify-center`}>LOGIN / REGISTER</a>
                        )}
                        <a href="/about" className={`${topBarButton} w-full justify-center`}>OUR STORES</a>
                        <a href="/services" className={`${topBarButton} w-full justify-center`}>B2B SERVICES</a>
                    </div>
                    
                    {/* Navigation Links */}
                    <ul className="flex flex-col gap-5 py-2">
                        {MEGA_MENU_LINKS.map(link => (
                            <li key={link.label}>
                                <a 
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    className={`flex items-center justify-between text-sm font-bold tracking-wider ${link.isRed ? 'text-red-500' : 'text-silk'}`}
                                >
                                    {link.label} {link.hasDropdown && <ChevronDown size={18} className="opacity-50" />}
                                </a>
                            </li>
                        ))}
                    </ul>
                    
                    {/* Contact Info */}
                    <div className="pt-6 border-t border-silk/10 text-center flex flex-col gap-4 pb-12">
                        <div className="text-[13px] text-silk font-medium">
                            info@barakasolutions.com <br/> +254 797 624196
                        </div>
                        <div className="flex items-center justify-center gap-4 text-white">
                            <a href="#" className="bg-[#3b5998] p-2 rounded-full"><Facebook size={16} fill="currentColor" /></a>
                            <a href="#" className="bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-2 rounded-full"><Instagram size={16} /></a>
                            <a href="#" className="bg-[#ff0000] p-2 rounded-full"><Youtube size={16} fill="currentColor" /></a>
                        </div>
                    </div>
                </div>
            </div>

            <SearchDialog open={searchOpen} setOpen={setSearchOpen} />
        </header>
    );
}
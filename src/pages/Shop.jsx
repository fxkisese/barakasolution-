import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ShoppingBag, Eye } from "lucide-react";
import { supabase } from "@/api/supabaseClient";
import { Image } from "@/components/ui/image";
import { formatPrice } from "@/lib/siteData";
import { useCart } from "@/lib/CartContext";
import ProductModal from "@/components/site/ProductModal";

export default function Shop() {
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addToCart } = useCart();

    useEffect(() => {
        async function fetchProducts() {
            const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
            if (data) setAllProducts(data);
            setLoading(false);
        }
        fetchProducts();
    }, []);

    const categories = ["All", ...Array.from(new Set(allProducts.map(p => p.category).filter(Boolean)))];

    const filteredProducts = allProducts.filter(product => {
        const matchesCategory = activeCategory === "All" || product.category === activeCategory;
        const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="py-12 md:py-20 max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <p className="text-[11px] uppercase tracking-[0.35em] text-[#D4AF37] font-semibold mb-3">Our Collection</p>
                    <h1 className="font-heading font-light text-4xl md:text-5xl text-[#1A1A1A]">Shop All Products</h1>
                </div>
                <div className="relative w-full md:w-72">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-[#7C7C7C]" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="block w-full pl-10 pr-4 py-3 border border-[#EAEAEA] focus:border-[#1A1A1A] outline-none bg-white text-sm transition-colors"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Filters */}
                <div className="w-full md:w-56 flex-shrink-0">
                    <div className="sticky top-24">
                        <div className="flex items-center gap-2 mb-5 text-[#1A1A1A]">
                            <Filter className="w-4 h-4" />
                            <h3 className="text-[12px] uppercase tracking-[0.2em] font-medium">Categories</h3>
                        </div>
                        <ul className="space-y-1">
                            {categories.map((category) => (
                                <li key={category}>
                                    <button
                                        onClick={() => setActiveCategory(category)}
                                        className={`w-full text-left px-3 py-2.5 text-sm transition-colors ${
                                            activeCategory === category
                                                ? "bg-[#1A1A1A] text-white"
                                                : "text-[#7C7C7C] hover:text-[#1A1A1A] hover:bg-[#F4F0EB]"
                                        }`}
                                    >
                                        {category}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="flex-grow">
                    {loading ? (
                        <div className="flex justify-center py-24">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-10 h-10 border-2 border-[#1A1A1A] border-t-[#D4AF37] rounded-full animate-spin" />
                                <p className="text-[11px] uppercase tracking-[0.3em] text-[#7C7C7C]">Loading collection...</p>
                            </div>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-24">
                            <ShoppingBag className="w-12 h-12 text-[#EAEAEA] mx-auto mb-4" />
                            <h3 className="font-heading text-xl text-[#1A1A1A]">No products found</h3>
                            <p className="text-[#7C7C7C] mt-2 text-sm">Try adjusting your search or filter criteria.</p>
                            <button
                                onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                                className="mt-6 text-[12px] uppercase tracking-[0.2em] text-[#1A1A1A] underline underline-offset-4"
                            >
                                Clear filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map((product, index) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.04 }}
                                    key={product.id || product.name}
                                    className="group cursor-pointer"
                                    onClick={() => { setSelectedProduct(product); setIsModalOpen(true); }}
                                >
                                    <div className="relative aspect-[4/5] overflow-hidden bg-[#F4F0EB]">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            fittingType="fill"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                                        <div className="absolute bottom-0 inset-x-0 flex translate-y-full group-hover:translate-y-0 transition-transform duration-400">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                                className="flex-1 bg-[#1A1A1A]/95 text-white text-[11px] uppercase tracking-[0.18em] flex items-center justify-center gap-2 py-3.5 hover:bg-[#D4AF37] transition-colors border-r border-white/10"
                                            >
                                                <ShoppingBag className="w-3.5 h-3.5" strokeWidth={1.8} /> Add
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); setIsModalOpen(true); }}
                                                className="flex-1 bg-[#1A1A1A]/95 text-white text-[11px] uppercase tracking-[0.18em] flex items-center justify-center gap-2 py-3.5 hover:bg-white hover:text-[#1A1A1A] transition-colors"
                                            >
                                                <Eye className="w-3.5 h-3.5" strokeWidth={1.8} /> View
                                            </button>
                                        </div>
                                        {product.badge && (
                                            <span className="absolute top-3 right-3 text-[9px] uppercase tracking-[0.2em] bg-[#D4AF37] text-white px-2.5 py-1 rounded-full font-medium">
                                                {product.badge}
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#7C7C7C] mb-1">{product.category}</p>
                                        <h3 className="font-heading text-[#1A1A1A] text-lg leading-snug group-hover:text-[#D4AF37] transition-colors">{product.name}</h3>
                                        <p className="font-mono-price text-sm text-[#1A1A1A] mt-1.5">{formatPrice(product.price || 0)}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <ProductModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} product={selectedProduct} />
        </div>
    );
}

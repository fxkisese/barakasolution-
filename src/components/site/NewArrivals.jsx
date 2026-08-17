import { useState, useEffect } from "react";
import { ArrowUpRight, Plus, MessageCircle, ShoppingBag, Eye, Sparkles } from "lucide-react";
import { Image } from "@/components/ui/image";
import { formatPrice } from "@/lib/siteData";
import { supabase } from "@/api/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { sendAddToCartWhatsApp, sendProductInquiryWhatsApp } from "@/utils/whatsapp";
import { useCart } from "@/lib/CartContext";
import ProductModal from "./ProductModal";

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }
};

function ProductCard({ product, large = false, onOpen }) {
    const { addToCart } = useCart();
    const [hovered, setHovered] = useState(false);

    return (
        <motion.article
            variants={itemVariants}
            className="group cursor-pointer relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => onOpen(product)}
        >
            <div className={`relative overflow-hidden bg-[#F4F0EB] ${large ? "aspect-[3/4]" : "aspect-[4/5]"} rounded-none`}>
                <Image
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                    fittingType="fill"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute top-0 inset-x-0 flex items-start justify-between p-4">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-white/80 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full">
                        {(product.category || 'Furniture').toUpperCase()}
                    </span>
                    {product.badge && (
                        <span className="text-[9px] uppercase tracking-[0.2em] bg-[#D4AF37] text-white px-2.5 py-1 rounded-full font-medium shadow-lg">
                            {product.badge}
                        </span>
                    )}
                </div>

                <AnimatePresence>
                    {hovered && (
                        <motion.div
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute bottom-0 inset-x-0 flex"
                        >
                            <button
                                onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                className="flex-1 bg-[#1A1A1A]/95 backdrop-blur-md text-white text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 py-4 hover:bg-[#D4AF37] transition-colors duration-300 border-r border-white/10"
                            >
                                <ShoppingBag className="w-3.5 h-3.5" strokeWidth={1.8} />
                                Add to Cart
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onOpen(product); }}
                                className="flex-1 bg-[#1A1A1A]/95 backdrop-blur-md text-white text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 py-4 hover:bg-white hover:text-[#1A1A1A] transition-colors duration-300"
                            >
                                <Eye className="w-3.5 h-3.5" strokeWidth={1.8} />
                                Quick View
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {hovered && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.3 }}
                            className="absolute bottom-14 left-4"
                        >
                            <span className="font-mono text-white text-xl font-semibold drop-shadow-xl">
                                {formatPrice(product.price || 0)}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-4 flex items-start justify-between gap-4 px-0.5">
                <div>
                    <h3 className={`font-heading text-[#1A1A1A] leading-snug group-hover:text-[#D4AF37] transition-colors duration-300 ${large ? "text-2xl" : "text-lg"}`}>
                        {product.name}
                    </h3>
                    <p className="text-[#7C7C7C] text-xs uppercase tracking-[0.2em] mt-1.5 font-medium">{product.category || 'Furniture'}</p>
                </div>
                <div className="text-right flex-shrink-0 pt-1">
                    <p className="font-mono-price text-sm text-[#1A1A1A] font-semibold">{formatPrice(product.price || 0)}</p>
                </div>
            </div>

            <div className="mt-3 h-px bg-[#EAEAEA] overflow-hidden">
                <motion.div
                    className="h-full bg-[#D4AF37]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hovered ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    style={{ transformOrigin: "left" }}
                />
            </div>
        </motion.article>
    );
}

export default function NewArrivals() {
    const [liveProducts, setLiveProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openProductModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    useEffect(() => {
        async function fetchProducts() {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(8);

            if (data && !error) {
                setLiveProducts(data);
            }
            setLoading(false);
        }
        fetchProducts();
    }, []);

    if (!loading && liveProducts.length === 0) return null;

    const heroProduct = liveProducts[0];
    const stackProducts = liveProducts.slice(1, 3);
    const remainingProducts = liveProducts.slice(3);

    return (
        <section id="arrivals" className="scroll-mt-24 bg-[#FAFAF8] py-24 md:py-36">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-12">

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16"
                >
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-4 mb-5">
                            <div className="w-8 h-px bg-[#D4AF37]" />
                            <p className="text-[11px] uppercase tracking-[0.35em] text-[#D4AF37] font-semibold">New In</p>
                        </div>
                        <h2 className="font-heading font-light text-[#1A1A1A] text-[clamp(2rem,4vw,3.25rem)] leading-[1.1] tracking-tight">
                            Curated arrivals,<br />
                            <span className="italic font-light text-[#7C7C7C]">crafted to last</span>
                        </h2>
                    </div>
                    <a
                        href="/shop"
                        className="hidden md:inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-[#1A1A1A] hover:text-[#D4AF37] transition-colors duration-300 group self-end pb-1"
                    >
                        View All Products
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" strokeWidth={1.6} />
                    </a>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center py-24">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-10 h-10 border-2 border-[#1A1A1A] border-t-[#D4AF37] rounded-full animate-spin" />
                            <p className="text-[11px] uppercase tracking-[0.3em] text-[#7C7C7C]">Loading collection...</p>
                        </div>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-80px" }}
                        className="space-y-6"
                    >
                        {/* Top row: Hero card (2 cols) + 2 stacked cards */}
                        {heroProduct && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <ProductCard product={heroProduct} large={true} onOpen={openProductModal} />
                                </div>
                                <div className="flex flex-col gap-6">
                                    {stackProducts.map((p) => (
                                        <div key={p.id || p.name} className="flex-1">
                                            <ProductCard product={p} onOpen={openProductModal} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Bottom row: remaining products in 4 columns */}
                        {remainingProducts.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {remainingProducts.map((p) => (
                                    <ProductCard key={p.id || p.name} product={p} onOpen={openProductModal} />
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Mobile CTA */}
                <div className="mt-14 flex justify-center md:hidden">
                    <a
                        href="/shop"
                        className="inline-flex items-center gap-2 h-12 px-8 border border-[#1A1A1A] text-[#1A1A1A] text-[12px] uppercase tracking-[0.2em] hover:bg-[#1A1A1A] hover:text-white transition-colors duration-300"
                    >
                        View All Products
                        <ArrowUpRight className="w-4 h-4" strokeWidth={1.6} />
                    </a>
                </div>
            </div>

            <ProductModal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                product={selectedProduct}
            />
        </section>
    );
}
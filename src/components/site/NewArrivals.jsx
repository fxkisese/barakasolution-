import { useState, useEffect } from "react";
import { ArrowUpRight, Plus, MessageCircle, ShoppingBag } from "lucide-react";
import { Image } from "@/components/ui/image";
import { formatPrice } from "@/lib/siteData";
import { supabase } from "@/api/supabaseClient";
import { motion } from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { sendAddToCartWhatsApp, sendProductInquiryWhatsApp } from "@/utils/whatsapp";
import { useCart } from "@/lib/CartContext";

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function NewArrivals() {
    const [liveProducts, setLiveProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addToCart } = useCart();

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
                .limit(6);
            
            if (data && !error) {
                setLiveProducts(data);
            }
            setLoading(false);
        }
        fetchProducts();
    }, []);

    if (!loading && liveProducts.length === 0) return null; // Hide if empty

    return (
        <section id="arrivals" className="scroll-mt-24 bg-silk py-24 md:py-32">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-3xl"
                >
                    <p className="text-[12px] uppercase tracking-[0.3em] text-obsidian">New In</p>
                    <h2 className="mt-5 font-heading font-light text-obsidian text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight">
                        We hope you enjoy our selection of all new arrivals
                    </h2>
                </motion.div>

                {loading ? (
                    <div className="mt-14 flex justify-center py-12">
                        <div className="w-8 h-8 border-2 border-obsidian border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-100px" }}
                        className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14"
                    >
                        {liveProducts.map((p) => (
                            <motion.article variants={itemVariants} key={p.id || p.name} className="group cursor-pointer" onClick={() => openProductModal(p)}>
                                <div className="relative overflow-hidden aspect-[4/5] bg-secondary rounded-sm">
                                    <Image
                                        src={p.image}
                                        alt={p.name}
                                        className="w-full h-full transition-transform duration-1000 ease-out group-hover:scale-105"
                                        fittingType="fill"
                                    />
                                    
                                    {/* Top protective gradient for text legibility */}
                                    <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/40 to-transparent opacity-70" />
                                    
                                    <div className="absolute bottom-0 inset-x-0 flex h-12 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                                            className="flex-1 bg-obsidian/95 backdrop-blur-sm text-silk text-[12px] uppercase tracking-[0.18em] flex items-center justify-center gap-2 hover:bg-obsidian transition-colors border-r border-silk/20"
                                        >
                                            <ShoppingBag className="w-4 h-4" strokeWidth={1.6} /> Quick Add
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); openProductModal(p); }}
                                            className="flex-1 bg-obsidian/95 backdrop-blur-sm text-silk text-[12px] uppercase tracking-[0.18em] flex items-center justify-center gap-2 hover:bg-obsidian transition-colors"
                                        >
                                            <Plus className="w-4 h-4" strokeWidth={1.6} /> View
                                        </button>
                                    </div>
                                    
                                    <span className="absolute top-4 left-4 font-mono-price text-[10px] uppercase tracking-[0.2em] text-white drop-shadow-md">
                                        /{(p.category || 'FURNITURE').toUpperCase()}
                                    </span>
                                    
                                    {p.badge && (
                                        <span className="absolute top-4 right-4 bg-obsidian text-silk text-[10px] uppercase tracking-[0.15em] px-2 py-1 shadow-sm">
                                            {p.badge}
                                        </span>
                                    )}
                                </div>
                                <div className="mt-5 flex items-start justify-between gap-4 px-1">
                                    <div>
                                        <h3 className="font-heading text-xl text-obsidian leading-snug group-hover:opacity-70 transition-opacity">{p.name}</h3>
                                        <p className="text-basalt text-sm mt-1.5">{p.category}</p>
                                    </div>
                                    <p className="font-mono-price text-sm text-obsidian whitespace-nowrap pt-1">
                                        {formatPrice(p.price || 0)}
                                    </p>
                                </div>
                            </motion.article>
                        ))}
                    </motion.div>
                )}

                <div className="mt-16 flex justify-center md:justify-end">
                    <a
                        href="#shop"
                        className="inline-flex items-center gap-2 h-12 px-7 bg-secondary text-basalt text-[13px] uppercase tracking-[0.15em] hover:bg-obsidian hover:text-silk transition-colors duration-300"
                    >
                        More Products
                        <ArrowUpRight className="w-4 h-4" strokeWidth={1.6} />
                    </a>
                </div>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-silk border-none">
                        {selectedProduct && (
                            <div className="flex flex-col md:flex-row md:h-[500px]">
                                {/* Image Section */}
                                <div className="relative w-full md:w-1/2 h-64 md:h-full bg-secondary">
                                    <Image
                                        src={selectedProduct.image}
                                        alt={selectedProduct.name}
                                        className="w-full h-full object-cover"
                                        fittingType="fill"
                                    />
                                    <span className="absolute top-6 left-6 bg-obsidian text-silk text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 shadow-sm">
                                        {selectedProduct.category || 'FURNITURE'}
                                    </span>
                                </div>
                                {/* Details Section */}
                                <div className="flex flex-col justify-center w-full md:w-1/2 p-8 md:p-14 bg-silk">
                                    <DialogHeader className="text-left space-y-4 mb-2">
                                        <DialogTitle className="font-heading font-light text-3xl text-obsidian leading-tight">
                                            {selectedProduct.name}
                                        </DialogTitle>
                                        <p className="font-mono-price text-2xl text-obsidian">
                                            {formatPrice(selectedProduct.price || 0)}
                                        </p>
                                    </DialogHeader>
                                    
                                    <p className="text-basalt text-sm leading-relaxed mb-8">
                                        This piece embodies the Luxe Craft Furniture commitment to quality materials and timeless design. Perfect for elevating any modern space with a touch of understated elegance.
                                    </p>

                                    <div className="flex flex-col gap-3">
                                        <button 
                                            onClick={() => {
                                                addToCart(selectedProduct);
                                                setIsModalOpen(false);
                                            }}
                                            className="w-full h-14 bg-obsidian text-silk text-[13px] uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:bg-obsidian/90 transition-colors"
                                        >
                                            <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                                            Add to Cart
                                        </button>
                                        <button 
                                            onClick={() => sendProductInquiryWhatsApp(selectedProduct)}
                                            className="w-full h-14 border border-obsidian text-obsidian text-[13px] uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:bg-obsidian/5 transition-colors"
                                        >
                                            <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
                                            Inquire via WhatsApp
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </section>
    );
}
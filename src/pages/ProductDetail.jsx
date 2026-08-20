import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Truck, MessageCircle, ShoppingBag } from "lucide-react";
import { supabase } from "@/api/supabaseClient";
import { formatPrice } from "@/lib/siteData";
import { sendProductInquiryWhatsApp } from "@/utils/whatsapp";
import { useCart } from "@/lib/CartContext";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProduct() {
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .eq("id", id)
                .single();

            if (data && !error) {
                setProduct(data);
            } else {
                // Product not found — redirect to shop
                navigate("/shop", { replace: true });
            }
            setLoading(false);
        }
        fetchProduct();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-obsidian border-t-[#D4AF37] rounded-full animate-spin" />
                    <p className="text-[11px] uppercase tracking-[0.3em] text-basalt">Loading product…</p>
                </div>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/shop" className="inline-flex items-center text-sm text-basalt hover:text-obsidian mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Shop
            </Link>

            <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
                {/* Product Image */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative aspect-square md:aspect-[4/5] rounded-2xl overflow-hidden bg-secondary"
                >
                    {product.image && (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="object-cover w-full h-full"
                        />
                    )}
                </motion.div>

                {/* Product Info */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col justify-center"
                >
                    {product.category && (
                        <div className="mb-2 text-sm font-medium tracking-wider text-basalt uppercase">
                            {product.category}
                        </div>
                    )}
                    <h1 className="font-heading font-light text-4xl md:text-5xl text-obsidian mb-4">{product.name}</h1>
                    <div className="font-mono-price text-2xl text-obsidian mb-8">
                        {formatPrice(product.price || 0)}
                    </div>

                    {product.description && (
                        <p className="text-basalt leading-relaxed mb-8">{product.description}</p>
                    )}

                    <div className="grid grid-cols-2 gap-4 mb-10 border-y border-border py-6">
                        <div className="flex items-center text-sm text-basalt">
                            <Truck className="w-5 h-5 mr-3 text-basalt/60" />
                            Delivery &amp; Installation Available
                        </div>
                        <div className="flex items-center text-sm text-basalt">
                            <Shield className="w-5 h-5 mr-3 text-basalt/60" />
                            Quality Guaranteed
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => addToCart(product)}
                            className="flex items-center justify-center w-full bg-obsidian hover:bg-obsidian/90 text-silk px-8 py-4 font-medium transition-colors text-[13px] uppercase tracking-[0.15em]"
                        >
                            <ShoppingBag className="w-5 h-5 mr-3" strokeWidth={1.5} />
                            Add to Cart
                        </button>
                        <button
                            onClick={() => sendProductInquiryWhatsApp(product)}
                            className="flex items-center justify-center w-full border border-obsidian text-obsidian px-8 py-4 font-medium hover:bg-obsidian/5 transition-colors text-[13px] uppercase tracking-[0.15em]"
                        >
                            <MessageCircle className="w-5 h-5 mr-3" strokeWidth={1.5} />
                            Inquire via WhatsApp
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

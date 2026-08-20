import { useRef, useState } from "react";
import { MessageCircle, ShoppingBag, ZoomIn } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Image } from "@/components/ui/image";
import { formatPrice } from "@/lib/siteData";
import { sendProductInquiryWhatsApp } from "@/utils/whatsapp";
import { useCart } from "@/lib/CartContext";

const ZOOM_SCALE = 2.2;

export default function ProductModal({ isOpen, setIsOpen, product }) {
    const { addToCart } = useCart();
    const imgRef = useRef(null);
    const [zoomed, setZoomed] = useState(false);
    const [origin, setOrigin] = useState("50% 50%");

    if (!product) return null;

    // Mouse move — update transform-origin to follow the cursor
    const handleMouseMove = (e) => {
        const rect = imgRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setOrigin(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
    };

    const handleMouseEnter = () => setZoomed(true);
    const handleMouseLeave = () => {
        setZoomed(false);
        setOrigin("50% 50%");
    };

    // Touch — toggle zoom at center
    const handleTap = () => {
        setZoomed((prev) => !prev);
        setOrigin("50% 50%");
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-silk border-none">
                <div className="flex flex-col md:flex-row md:h-[500px]">
                    {/* Image Section with Zoom */}
                    <div
                        ref={imgRef}
                        className="relative w-full md:w-1/2 h-64 md:h-full bg-secondary overflow-hidden cursor-zoom-in select-none"
                        onMouseMove={handleMouseMove}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={handleTap}
                        style={{ cursor: zoomed ? "zoom-out" : "zoom-in" }}
                    >
                        <Image
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover pointer-events-none"
                            fittingType="fill"
                            style={{
                                transform: zoomed ? `scale(${ZOOM_SCALE})` : "scale(1)",
                                transformOrigin: origin,
                                transition: zoomed
                                    ? "transform 0.15s ease-out"
                                    : "transform 0.3s ease-out",
                                willChange: "transform",
                            }}
                        />

                        {/* Category badge */}
                        <span className="absolute top-6 left-6 bg-obsidian text-silk text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 shadow-sm z-10 pointer-events-none">
                            {product.category || "FURNITURE"}
                        </span>

                        {/* Zoom hint — fades out when zoomed */}
                        <span
                            className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 text-silk/80 text-[10px] uppercase tracking-widest pointer-events-none transition-opacity duration-300"
                            style={{ opacity: zoomed ? 0 : 1 }}
                        >
                            <ZoomIn className="w-3.5 h-3.5" strokeWidth={1.8} />
                            Hover to zoom
                        </span>
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col justify-center w-full md:w-1/2 p-8 md:p-14 bg-silk">
                        <DialogHeader className="text-left space-y-4 mb-2">
                            <DialogTitle className="font-heading font-light text-3xl text-obsidian leading-tight">
                                {product.name}
                            </DialogTitle>
                            <p className="font-mono-price text-2xl text-obsidian">
                                {formatPrice(product.price || 0)}
                            </p>
                        </DialogHeader>

                        <p className="text-basalt text-sm leading-relaxed mb-8">
                            This piece embodies the Luxe Craft Furniture commitment to quality
                            materials and timeless design. Perfect for elevating any modern space
                            with a touch of understated elegance.
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => {
                                    addToCart(product);
                                    setIsOpen(false);
                                }}
                                className="w-full h-14 bg-obsidian text-silk text-[13px] uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:bg-obsidian/90 transition-colors"
                            >
                                <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                                Add to Cart
                            </button>
                            <button
                                onClick={() => sendProductInquiryWhatsApp(product)}
                                className="w-full h-14 border border-obsidian text-obsidian text-[13px] uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:bg-obsidian/5 transition-colors"
                            >
                                <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
                                Inquire via WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

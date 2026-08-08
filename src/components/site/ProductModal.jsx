import { MessageCircle, ShoppingBag } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Image } from "@/components/ui/image";
import { formatPrice } from "@/lib/siteData";
import { sendProductInquiryWhatsApp } from "@/utils/whatsapp";
import { useCart } from "@/lib/CartContext";

export default function ProductModal({ isOpen, setIsOpen, product }) {
    const { addToCart } = useCart();

    if (!product) return null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-silk border-none">
                <div className="flex flex-col md:flex-row md:h-[500px]">
                    {/* Image Section */}
                    <div className="relative w-full md:w-1/2 h-64 md:h-full bg-secondary">
                        <Image
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            fittingType="fill"
                        />
                        <span className="absolute top-6 left-6 bg-obsidian text-silk text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 shadow-sm">
                            {product.category || 'FURNITURE'}
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
                            This piece embodies the Luxe Craft Furniture commitment to quality materials and timeless design. Perfect for elevating any modern space with a touch of understated elegance.
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

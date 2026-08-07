import { useState } from "react";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/lib/CartContext";
import { formatPrice } from "@/lib/siteData";
import CheckoutModal from "./CheckoutModal";
import { Image } from "@/components/ui/image";

export default function CartDrawer() {
    const { isCartOpen, closeCart, cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    return (
        <>
            <Sheet open={isCartOpen} onOpenChange={(open) => !open && closeCart()}>
                <SheetContent side="right" className="w-full sm:max-w-md flex flex-col bg-silk p-0 border-l-0 sm:border-l">
                    <SheetHeader className="p-6 border-b hairline flex-shrink-0">
                        <SheetTitle className="font-heading font-light text-2xl text-obsidian flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5" /> Your Cart
                        </SheetTitle>
                    </SheetHeader>
                    
                    <div className="flex-1 overflow-y-auto p-6">
                        {cartItems.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-basalt gap-4">
                                <ShoppingBag className="w-12 h-12 opacity-20" />
                                <p className="uppercase tracking-widest text-sm">Your cart is empty</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 items-center">
                                        <div className="w-20 h-24 bg-secondary flex-shrink-0 overflow-hidden rounded-sm">
                                            <Image src={item.image} alt={item.name} className="w-full h-full object-cover" fittingType="fill" />
                                        </div>
                                        <div className="flex-1 flex flex-col">
                                            <h4 className="font-heading text-lg text-obsidian leading-snug line-clamp-1">{item.name}</h4>
                                            <p className="font-mono-price text-sm text-basalt mt-1">{formatPrice(item.price || 0)}</p>
                                            <div className="flex items-center gap-3 mt-3">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center bg-secondary hover:bg-obsidian hover:text-silk transition-colors rounded-sm">
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="font-mono-price text-sm">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center bg-secondary hover:bg-obsidian hover:text-silk transition-colors rounded-sm">
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="p-2 text-basalt hover:text-red-500 transition-colors">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {cartItems.length > 0 && (
                        <div className="p-6 border-t hairline flex-shrink-0 bg-silk">
                            <div className="flex justify-between items-center mb-6">
                                <span className="uppercase tracking-widest text-sm text-basalt">Subtotal</span>
                                <span className="font-mono-price text-xl text-obsidian">{formatPrice(cartTotal)}</span>
                            </div>
                            <button 
                                onClick={() => {
                                    closeCart();
                                    setIsCheckoutOpen(true);
                                }}
                                className="w-full h-14 bg-obsidian text-silk text-[13px] uppercase tracking-[0.15em] hover:bg-obsidian/90 transition-colors"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            <CheckoutModal open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen} />
        </>
    );
}

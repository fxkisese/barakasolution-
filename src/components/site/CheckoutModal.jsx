import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCart } from "@/lib/CartContext";
import { formatPrice } from "@/lib/siteData";
import { sendCartCheckoutWhatsApp } from "@/utils/whatsapp";
import { trackBeginCheckout, trackPurchase, trackWhatsAppClick } from "@/utils/analytics";
import DeliveryCalculator from "@/components/site/DeliveryCalculator";

export default function CheckoutModal({ open, onOpenChange }) {
    const { cartItems, cartTotal, clearCart } = useCart();
    const [step, setStep] = useState(1);

    // Form state
    const [details, setDetails] = useState({
        name: "",
        phone: "",
        address: ""
    });

    // Delivery quote from the calculator: { fee, distanceKm, isFree, nearestBranch } | null
    const [deliveryQuote, setDeliveryQuote] = useState(null);

    const grandTotal = cartTotal + (deliveryQuote?.fee ?? 0);

    const handleNext = (e) => {
        e.preventDefault();
        if (step === 1) {
            trackBeginCheckout(cartItems, cartTotal);
            setStep(2);
        }
    };

    const handleComplete = (e) => {
        e.preventDefault();
        trackPurchase(cartItems, grandTotal);
        trackWhatsAppClick('checkout');
        sendCartCheckoutWhatsApp(cartItems, cartTotal, details, deliveryQuote);
        clearCart();
        setDeliveryQuote(null);
        setStep(1);
        onOpenChange(false);
    };

    const handleClose = (v) => {
        if (!v) {
            setStep(1);
            setDeliveryQuote(null);
        }
        onOpenChange(v);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-silk border-none max-h-[95dvh] overflow-y-auto">
                <div className="p-6">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="font-heading font-light text-2xl text-obsidian">
                            {step === 1 ? "Delivery Details" : "Order Summary"}
                        </DialogTitle>
                    </DialogHeader>

                    {/* ── Step 1: Delivery details + location picker ─────── */}
                    {step === 1 ? (
                        <form onSubmit={handleNext} className="flex flex-col gap-5">
                            {/* Name */}
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-basalt mb-2">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    value={details.name}
                                    onChange={e => setDetails({ ...details, name: e.target.value })}
                                    className="w-full h-12 px-4 bg-white border hairline outline-none focus:border-obsidian transition-colors rounded-sm"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-basalt mb-2">Phone Number</label>
                                <input
                                    required
                                    type="tel"
                                    value={details.phone}
                                    onChange={e => setDetails({ ...details, phone: e.target.value })}
                                    className="w-full h-12 px-4 bg-white border hairline outline-none focus:border-obsidian transition-colors rounded-sm"
                                />
                            </div>

                            {/* Address (text note — coordinates come from the map) */}
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-basalt mb-2">Address Notes <span className="normal-case text-stone-400">(optional)</span></label>
                                <textarea
                                    value={details.address}
                                    onChange={e => setDetails({ ...details, address: e.target.value })}
                                    placeholder="Building name, floor, landmark…"
                                    rows={2}
                                    className="w-full p-4 bg-white border hairline outline-none focus:border-obsidian transition-colors rounded-sm resize-none text-sm"
                                />
                            </div>

                            {/* Delivery calculator (map + address search) */}
                            <div className="border-t border-stone-100 pt-5">
                                <DeliveryCalculator onQuoteReady={setDeliveryQuote} />
                            </div>

                            <button
                                type="submit"
                                className="w-full h-12 bg-obsidian text-silk text-[12px] uppercase tracking-[0.15em] mt-1 hover:bg-obsidian/90 transition-colors disabled:opacity-40"
                            >
                                Continue to Payment
                            </button>
                        </form>

                    ) : (
                        /* ── Step 2: Order summary + payment ─────────────── */
                        <form onSubmit={handleComplete} className="flex flex-col gap-6">
                            {/* Order breakdown */}
                            <div className="p-4 bg-secondary/50 rounded-sm space-y-2">
                                {/* Cart items summary */}
                                {cartItems.length > 0 && (
                                    <div className="pb-2 mb-2 border-b border-stone-200 space-y-1">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="flex justify-between text-xs text-basalt">
                                                <span className="truncate max-w-[200px]">{item.quantity}× {item.name}</span>
                                                <span className="font-mono-price shrink-0">{formatPrice((item.price || 0) * item.quantity)}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Subtotal */}
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-basalt">Subtotal</span>
                                    <span className="font-mono-price text-obsidian">{formatPrice(cartTotal)}</span>
                                </div>

                                {/* Delivery fee line */}
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-basalt">Delivery</span>
                                    <span className={`font-mono-price ${deliveryQuote?.isFree ? 'text-emerald-600' : 'text-obsidian'}`}>
                                        {deliveryQuote
                                            ? deliveryQuote.isFree
                                                ? 'FREE'
                                                : formatPrice(deliveryQuote.fee)
                                            : '—'
                                        }
                                    </span>
                                </div>
                                {deliveryQuote && !deliveryQuote.isFree && (
                                    <p className="text-[10px] text-stone-400">
                                        {deliveryQuote.distanceKm} km from {deliveryQuote.nearestBranch?.shortName || deliveryQuote.nearestBranch?.name}
                                    </p>
                                )}

                                {/* Divider + Grand Total */}
                                <div className="border-t border-stone-200 pt-2 mt-1 flex justify-between items-center">
                                    <span className="text-sm font-semibold text-obsidian">Grand Total</span>
                                    <span className="font-mono-price text-lg text-obsidian">{formatPrice(grandTotal)}</span>
                                </div>

                                <p className="text-xs text-basalt mt-1">Your order will be confirmed via WhatsApp with our team.</p>
                            </div>

                            {/* Payment method */}
                            <div className="border hairline p-4 rounded-sm">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="radio" name="payment" defaultChecked className="w-4 h-4 accent-obsidian" />
                                    <span className="font-body text-obsidian">Pay via M-Pesa / Card Link</span>
                                </label>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex-1 h-12 border hairline text-obsidian text-[12px] uppercase tracking-[0.15em] hover:bg-black/5 transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] h-12 bg-[#25D366] text-white text-[12px] uppercase tracking-[0.15em] hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2"
                                >
                                    Complete Order
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

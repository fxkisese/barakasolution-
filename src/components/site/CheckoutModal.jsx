import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCart } from "@/lib/CartContext";
import { formatPrice } from "@/lib/siteData";
import { sendCartCheckoutWhatsApp } from "@/utils/whatsapp";

export default function CheckoutModal({ open, onOpenChange }) {
    const { cartItems, cartTotal, clearCart } = useCart();
    const [step, setStep] = useState(1);
    
    // Form state
    const [details, setDetails] = useState({
        name: "",
        phone: "",
        address: ""
    });

    const handleNext = (e) => {
        e.preventDefault();
        if (step === 1) setStep(2);
    };

    const handleComplete = (e) => {
        e.preventDefault();
        sendCartCheckoutWhatsApp(cartItems, cartTotal, details);
        clearCart();
        setStep(1); // Reset
        onOpenChange(false); // Close modal
    };

    return (
        <Dialog open={open} onOpenChange={(v) => {
            if(!v) setStep(1); // reset on close
            onOpenChange(v);
        }}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-silk border-none">
                <div className="p-6">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="font-heading font-light text-2xl text-obsidian">
                            {step === 1 ? "Delivery Details" : "Payment"}
                        </DialogTitle>
                    </DialogHeader>

                    {step === 1 ? (
                        <form onSubmit={handleNext} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-basalt mb-2">Full Name</label>
                                <input required type="text" value={details.name} onChange={e => setDetails({...details, name: e.target.value})} className="w-full h-12 px-4 bg-white border hairline outline-none focus:border-obsidian transition-colors rounded-sm" />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-basalt mb-2">Phone Number</label>
                                <input required type="tel" value={details.phone} onChange={e => setDetails({...details, phone: e.target.value})} className="w-full h-12 px-4 bg-white border hairline outline-none focus:border-obsidian transition-colors rounded-sm" />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-basalt mb-2">Delivery Address</label>
                                <textarea required value={details.address} onChange={e => setDetails({...details, address: e.target.value})} className="w-full h-24 p-4 bg-white border hairline outline-none focus:border-obsidian transition-colors rounded-sm resize-none"></textarea>
                            </div>
                            <button type="submit" className="w-full h-12 bg-obsidian text-silk text-[12px] uppercase tracking-[0.15em] mt-2 hover:bg-obsidian/90 transition-colors">
                                Continue to Payment
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleComplete} className="flex flex-col gap-6">
                            <div className="p-4 bg-secondary/50 rounded-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-basalt">Order Total</span>
                                    <span className="font-mono-price text-lg text-obsidian">{formatPrice(cartTotal)}</span>
                                </div>
                                <p className="text-xs text-basalt mt-2">Your order will be completed via WhatsApp with our support team.</p>
                            </div>
                            
                            <div className="border hairline p-4 rounded-sm">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="radio" name="payment" defaultChecked className="w-4 h-4 accent-obsidian" />
                                    <span className="font-body text-obsidian">Pay via M-Pesa / Card Link</span>
                                </label>
                            </div>

                            <div className="flex gap-3">
                                <button type="button" onClick={() => setStep(1)} className="flex-1 h-12 border hairline text-obsidian text-[12px] uppercase tracking-[0.15em] hover:bg-black/5 transition-colors">
                                    Back
                                </button>
                                <button type="submit" className="flex-[2] h-12 bg-[#25D366] text-white text-[12px] uppercase tracking-[0.15em] hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2">
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

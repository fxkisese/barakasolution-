import { useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { toast } from "sonner";
import { Send, CheckCircle2 } from "lucide-react";

export default function ContactForm() {
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [aiReply, setAiReply] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAiReply("");

        try {
            const { data, error } = await supabase.functions.invoke('handle-inquiry', {
                body: {
                    source: 'website',
                    customer_name: name,
                    customer_contact: contact,
                    message: message
                }
            });

            if (error) throw error;

            if (data?.status === 'auto_handled' && data?.ai_reply) {
                setAiReply(data.ai_reply);
                setSuccess(true);
            } else {
                setSuccess(true);
                toast.success("Inquiry sent successfully. Our team will get back to you shortly!");
            }
        } catch (err) {
            toast.error("Failed to send inquiry: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-24 bg-white border-t border-[#EAEBED]">
            <div className="max-w-3xl mx-auto px-6">
                <div className="text-center mb-12">
                    <span className="text-xs tracking-[0.18em] text-[#C9A84C] uppercase font-bold mb-3 block">Got a question?</span>
                    <h2 className="font-heading text-3xl md:text-4xl text-[#1A1816]">Contact Us</h2>
                    <p className="mt-4 text-[#7C7568]">Need help finding the right furniture or have a question about delivery? Send us a message.</p>
                </div>

                {success ? (
                    <div className="bg-[#FDF5E6] rounded-2xl p-8 text-center border border-[#EAEBED]">
                        <CheckCircle2 className="w-12 h-12 text-[#C9A84C] mx-auto mb-4" />
                        <h3 className="font-heading text-xl text-[#1A1816] mb-2">Message Sent!</h3>
                        {aiReply ? (
                            <p className="text-[#5F6368]">{aiReply}</p>
                        ) : (
                            <p className="text-[#5F6368]">Thank you for reaching out. Our team will review your inquiry and get back to you shortly.</p>
                        )}
                        <button 
                            onClick={() => { setSuccess(false); setMessage(""); setAiReply(""); }}
                            className="mt-6 text-sm font-semibold text-[#C9A84C] hover:text-[#B8902A] transition-colors"
                        >
                            Send another message
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-[#7C7568] font-bold mb-2">Your Name</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full h-12 px-4 rounded-lg bg-[#FAF9F7] border border-[#E4E2DD] focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] outline-none transition-all text-[#1A1816]"
                                    placeholder="Jane Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-[#7C7568] font-bold mb-2">Phone or Email</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                    className="w-full h-12 px-4 rounded-lg bg-[#FAF9F7] border border-[#E4E2DD] focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] outline-none transition-all text-[#1A1816]"
                                    placeholder="07XX XXX XXX or name@email.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-[#7C7568] font-bold mb-2">Message</label>
                            <textarea 
                                required 
                                rows={4}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full p-4 rounded-lg bg-[#FAF9F7] border border-[#E4E2DD] focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] outline-none transition-all text-[#1A1816] resize-y"
                                placeholder="How can we help you today?"
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full h-12 bg-[#1A1816] text-white font-medium rounded-lg hover:bg-[#2C2A28] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? "Sending..." : (
                                <>
                                    Send Inquiry <Send className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
}

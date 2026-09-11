import { useState, useEffect } from "react";
import { X, Tag, ArrowRight, Check, Sparkles, Gift } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { trackFormSubmit } from "@/utils/analytics";

const STORAGE_KEY = "baraka_signup_banner_dismissed";

const OFFERS = [
    { icon: Gift,     label: "500 KES Off",     desc: "Your first order"              },
    { icon: Tag,      label: "Free Delivery",   desc: "On orders above 15,000 KES"    },
    { icon: Sparkles, label: "Early Access",    desc: "New arrivals & flash sales"     },
];

export default function SignupBanner() {
    const [visible, setVisible] = useState(false);
    const [email, setEmail]     = useState("");
    const [done, setDone]       = useState(false);
    const [error, setError]     = useState("");

    // Show after 2 s, but only if the user hasn't dismissed it before
    useEffect(() => {
        const dismissed = sessionStorage.getItem(STORAGE_KEY);
        if (dismissed) return;
        const t = setTimeout(() => setVisible(true), 2000);
        return () => clearTimeout(t);
    }, []);

    const dismiss = () => {
        sessionStorage.setItem(STORAGE_KEY, "1");
        setVisible(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email.trim()) { setError("Please enter your email address."); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        setError("");
        setDone(true);
        trackFormSubmit('signup_banner');
        // Auto-close after 2.5 s on success
        setTimeout(() => dismiss(), 2500);
    };

    return (
        <AnimatePresence>
            {visible && (
                <>
                    {/* ── Backdrop ── */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        onClick={dismiss}
                        className="fixed inset-0 z-[900] bg-obsidian/70 backdrop-blur-[3px]"
                        aria-hidden="true"
                    />

                    {/* ── Panel ── */}
                    <motion.div
                        key="panel"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Exclusive offers – sign up"
                        initial={{ opacity: 0, y: 40, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0,  scale: 1    }}
                        exit={{   opacity: 0, y: 30,  scale: 0.97 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-x-4 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-[901] w-full sm:max-w-[680px] overflow-hidden rounded-t-2xl sm:rounded-2xl shadow-2xl"
                    >
                        {/* ── Top image / offer strip ── */}
                        <div
                            className="relative h-48 sm:h-56 flex flex-col items-center justify-center text-center px-6 overflow-hidden"
                            style={{
                                background: "linear-gradient(135deg, #1A1A1A 0%, #2d2d2d 60%, #1A1A1A 100%)",
                            }}
                        >
                            {/* decorative radial glow */}
                            <div
                                className="pointer-events-none absolute inset-0"
                                style={{
                                    background:
                                        "radial-gradient(ellipse 70% 60% at 50% 110%, rgba(212,175,140,0.18) 0%, transparent 70%)",
                                }}
                            />

                            {/* floating label */}
                            <span className="relative z-10 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.28em] text-amber-300/80 font-medium mb-3">
                                <Sparkles className="w-3 h-3" />
                                Member Exclusives
                            </span>

                            <h2
                                className="relative z-10 font-heading font-light text-silk leading-tight"
                                style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}
                            >
                                Curated Deals,<br />
                                <span className="italic">Made for You</span>
                            </h2>

                            <p className="relative z-10 mt-3 text-silk/60 text-xs sm:text-sm max-w-sm leading-relaxed">
                                Sign up and be the first to know about new arrivals, promos&nbsp;&amp;&nbsp;exclusive discounts.
                            </p>

                            {/* decorative line */}
                            <div className="relative z-10 mt-4 h-px w-12 bg-amber-300/50 mx-auto" />
                        </div>

                        {/* ── Offer pills ── */}
                        <div className="flex divide-x divide-stone-200/60 bg-stone-50 border-b border-stone-200">
                            {OFFERS.map(({ icon: Icon, label, desc }) => (
                                <div
                                    key={label}
                                    className="flex-1 flex flex-col items-center text-center gap-1 py-4 px-2"
                                >
                                    <div className="w-8 h-8 rounded-full bg-obsidian flex items-center justify-center mb-1">
                                        <Icon className="w-4 h-4 text-amber-300" strokeWidth={1.5} />
                                    </div>
                                    <span className="text-obsidian font-semibold text-[11px] sm:text-xs uppercase tracking-wider leading-tight">
                                        {label}
                                    </span>
                                    <span className="text-stone-500 text-[10px] sm:text-[11px] leading-tight">{desc}</span>
                                </div>
                            ))}
                        </div>

                        {/* ── Sign-up form ── */}
                        <div className="bg-white px-6 sm:px-8 py-6">
                            <AnimatePresence mode="wait">
                                {done ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center gap-2 py-2 text-center"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                            <Check className="w-5 h-5 text-emerald-600" strokeWidth={2.5} />
                                        </div>
                                        <p className="text-obsidian font-medium text-sm">You're in! Welcome to Baraka Solutions.</p>
                                        <p className="text-stone-400 text-xs">Check your inbox for your discount code.</p>
                                    </motion.div>
                                ) : (
                                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <p className="text-center text-obsidian text-sm font-medium mb-4">
                                            Sign up for exclusive member benefits
                                        </p>

                                        <form onSubmit={handleSubmit} noValidate>
                                            <div className="flex items-stretch gap-0 border border-stone-300 focus-within:border-obsidian transition-colors duration-200">
                                                <input
                                                    id="signup-banner-email"
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                                                    placeholder="Your email address"
                                                    className="flex-1 min-w-0 h-12 px-4 text-sm text-obsidian placeholder:text-stone-400 bg-transparent outline-none"
                                                    aria-label="Email address"
                                                    autoComplete="email"
                                                />
                                                <button
                                                    type="submit"
                                                    id="signup-banner-submit"
                                                    className="group inline-flex items-center gap-2 h-12 px-5 bg-obsidian text-silk text-[11px] uppercase tracking-[0.2em] hover:bg-stone-800 transition-colors duration-200 shrink-0"
                                                >
                                                    Join
                                                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
                                                </button>
                                            </div>
                                            {error && (
                                                <p className="mt-1.5 text-red-500 text-xs">{error}</p>
                                            )}
                                        </form>

                                        {/* Optional dismiss */}
                                        <div className="mt-4 flex items-center justify-between">
                                            <p className="text-stone-400 text-[10px]">No spam. Unsubscribe anytime.</p>
                                            <button
                                                id="signup-banner-skip"
                                                onClick={dismiss}
                                                className="text-stone-400 hover:text-obsidian text-[10px] underline underline-offset-2 transition-colors"
                                            >
                                                No thanks, I'll pay full price
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* ── Close button ── */}
                        <button
                            id="signup-banner-close"
                            onClick={dismiss}
                            aria-label="Close banner"
                            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-silk/80 hover:text-silk transition-colors duration-200"
                        >
                            <X className="w-4 h-4" strokeWidth={2} />
                        </button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

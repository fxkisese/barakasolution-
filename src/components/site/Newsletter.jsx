import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export default function Newsletter() {
    const [email, setEmail] = useState("");
    const [done, setDone] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        if (!email) return;
        setDone(true);
    };

    return (
        <section className="relative bg-obsidian text-silk overflow-hidden">
            {/* warm radial accent */}
            <div
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                    background:
                        "radial-gradient(60% 80% at 50% 120%, rgba(255,255,255,0.06) 0%, rgba(26,26,26,0) 70%)",
                }}
            />
            <div className="relative mx-auto max-w-[960px] px-6 py-24 md:py-36 text-center">
                <h2 className="font-heading font-light text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight text-balance">
                    Exclusive offers, unique gift ideas, and personalised tips for shopping on Decor.
                </h2>
                <div className="mx-auto mt-6 h-px w-16 bg-white" />
                <p className="mt-8 text-silk/80 text-lg md:text-xl font-medium">
                    Sign up to take 500 KES off your first order
                </p>

                {done ? (
                    <p
                        aria-live="polite"
                        className="mt-10 inline-flex items-center gap-2 text-white text-sm uppercase tracking-[0.15em]"
                    >
                        <Check className="w-4 h-4" strokeWidth={2} /> Welcome to Luxe Craft Furniture
                    </p>
                ) : (
                    <form
                        onSubmit={submit}
                        className="mt-10 mx-auto max-w-[440px] flex items-stretch bg-silk"
                    >
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your email address"
                            className="flex-1 min-w-0 px-5 h-14 bg-transparent text-obsidian placeholder:text-basalt/60 text-sm outline-none"
                        />
                        <button
                            type="submit"
                            className="group inline-flex items-center gap-2 h-14 px-6 bg-white text-obsidian text-[12px] uppercase tracking-[0.18em] hover:bg-obsidian hover:text-silk transition-colors"
                        >
                            Subscribe
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={1.6} />
                        </button>
                    </form>
                )}
                <p className="mt-5 text-silk/40 text-xs">No spam. Unsubscribe anytime.</p>
            </div>
        </section>
    );
}
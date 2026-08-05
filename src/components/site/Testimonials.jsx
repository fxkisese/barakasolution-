import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/siteData";

function Stars({ n }) {
    return (
        <div className="flex gap-1" aria-label={`${n} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className={`w-4 h-4 ${i < n ? "text-obsidian fill-obsidian" : "text-obsidian/20"}`}
                    strokeWidth={1.4}
                />
            ))}
        </div>
    );
}

export default function Testimonials() {
    const [featured, ...rest] = TESTIMONIALS;

    return (
        <section id="testimonials" className="scroll-mt-24 bg-neutral-100 py-24 md:py-36">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
                <div className="text-center max-w-2xl mx-auto">
                    <p className="text-[12px] uppercase tracking-[0.3em] text-obsidian">Word of Mouth</p>
                    <h2 className="mt-5 font-heading font-light text-obsidian text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight">
                        What our customers are saying about us
                    </h2>
                </div>

                {/* Oversized pull quote */}
                <figure className="mt-20 max-w-5xl mx-auto text-center">
                    <span className="font-heading text-obsidian text-7xl leading-none block">“</span>
                    <blockquote className="font-heading font-light italic text-obsidian text-[clamp(1.6rem,3.5vw,3rem)] leading-[1.15] text-balance -mt-4">
                        {featured.quote}
                    </blockquote>
                    <figcaption className="mt-8 flex flex-col items-center gap-2">
                        <Stars n={featured.rating} />
                        <p className="font-mono-price text-xs uppercase tracking-[0.2em] text-obsidian">
                            {featured.name} · {featured.location}
                        </p>
                    </figcaption>
                </figure>

                {/* Supporting quotes */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-px bg-obsidian/10">
                    {rest.map((t) => (
                        <figure key={t.name} className="bg-neutral-100 p-8 md:p-10">
                            <Stars n={t.rating} />
                            <blockquote className="mt-5 font-heading text-obsidian text-xl md:text-2xl leading-snug">
                                “{t.quote}”
                            </blockquote>
                            <figcaption className="mt-6 font-mono-price text-[11px] uppercase tracking-[0.2em] text-basalt">
                                {t.name} — {t.location}
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
}
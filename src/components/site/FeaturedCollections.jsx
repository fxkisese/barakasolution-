import { ArrowUpRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { CATEGORIES } from "@/lib/siteData";

export default function FeaturedCollections() {
    return (
        <section id="collections" className="scroll-mt-24 bg-silk py-24 md:py-32">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
                    <div>
                        <p className="text-[12px] uppercase tracking-[0.3em] text-obsidian">
                            Curated Collections
                        </p>
                        <h2 className="mt-5 font-heading font-light text-obsidian text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight">
                            Shop by category
                        </h2>
                    </div>
                    <a
                        href="#shop"
                        className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-basalt hover:text-obsidian transition-colors"
                    >
                        View All <ArrowUpRight className="w-4 h-4" strokeWidth={1.6} />
                    </a>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {CATEGORIES.map((cat, i) => (
                        <a
                            key={cat.name}
                            href="#shop"
                            className={`group relative overflow-hidden bg-secondary ${
                                i === 0 ? "col-span-2 row-span-2" : ""
                            }`}
                            style={{ aspectRatio: i === 0 ? "auto" : "3/4" }}
                        >
                            <Image
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-full transition-transform duration-700 group-hover:scale-105"
                                fittingType="fill"
                                style={i === 0 ? { minHeight: "480px" } : {}}
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-obsidian/10 to-transparent" />

                            {/* Label */}
                            <div className="absolute bottom-0 left-0 p-5 md:p-6">
                                <p className="font-mono-price text-silk/70 text-[10px] uppercase tracking-[0.25em] mb-1">
                                    {cat.tag}
                                </p>
                                <h3 className="font-heading text-silk text-xl md:text-2xl leading-tight">
                                    {cat.name}
                                </h3>
                                <p className="text-silk/70 text-xs mt-1 hidden md:block">
                                    {cat.blurb}
                                </p>
                            </div>

                            {/* Hover arrow */}
                            <div className="absolute top-4 right-4 w-9 h-9 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <ArrowUpRight className="w-4 h-4 text-silk" strokeWidth={1.6} />
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}

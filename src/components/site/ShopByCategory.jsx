import { useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { supabase } from "@/api/supabaseClient";

export default function ShopByCategory() {
    const [categories, setCategories] = useState([]);
    const [active, setActive] = useState("All");

    useEffect(() => {
        async function fetchCategories() {
            const { data } = await supabase.from('products').select('category, image');
            if (data) {
                // Group by category and pick the first image for each
                const catMap = {};
                data.forEach(p => {
                    if (p.category && !catMap[p.category]) {
                        catMap[p.category] = p.image;
                    }
                });
                const formatted = Object.keys(catMap).map(name => ({
                    name,
                    image: catMap[name],
                    tag: 'Category'
                }));
                setCategories(formatted);
            }
        }
        fetchCategories();
    }, []);

    const FILTERS = ["All", ...categories.map((c) => c.name)];
    const visible = active === "All" ? categories : categories.filter((c) => c.name === active);

    if (categories.length === 0) return null; // Hide completely if no categories exist

    return (
        <section id="shop" className="scroll-mt-24 bg-silk py-24 md:py-32">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-6 border-b hairline">
                    <h2 className="font-heading font-light text-obsidian text-[clamp(2rem,4vw,3rem)] leading-tight">
                        Shop By Category
                    </h2>

                    <div className="flex flex-wrap gap-2">
                        {FILTERS.map((f) => (
                            <button
                                key={f}
                                onClick={() => setActive(f)}
                                className={`h-10 px-4 text-[12px] uppercase tracking-[0.14em] transition-colors duration-300 ${active === f
                                        ? "bg-obsidian text-silk"
                                        : "text-basalt hover:text-obsidian"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div
                    className={`mt-12 grid gap-4 ${active === "All"
                            ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
                            : "grid-cols-1 max-w-xl mx-auto"
                        }`}
                >
                    {visible.map((c) => (
                        <a key={c.name} href="#arrivals" className="group relative block overflow-hidden aspect-[4/5]">
                            <Image
                                src={c.image}
                                alt={c.name}
                                className="w-full h-full transition-transform duration-700 group-hover:scale-105"
                                fittingType="fill"
                            />
                            <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/30 transition-colors duration-500" />
                            <div className="absolute bottom-0 inset-x-0 p-4 flex items-end justify-between">
                                <div>
                                    <p className="font-heading text-silk text-xl mt-0.5">{c.name}</p>
                                </div>
                                <ArrowUpRight className="w-5 h-5 text-silk opacity-0 group-hover:opacity-100 transition-opacity duration-500" strokeWidth={1.4} />
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
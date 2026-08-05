import { Truck, MapPin, Headphones } from "lucide-react";
import { FEATURES } from "@/lib/siteData";

const ICONS = { truck: Truck, map: MapPin, headset: Headphones };

export default function Features() {
    return (
        <section className="bg-obsidian text-silk">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-16 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-silk/10">
                    {FEATURES.map((f) => {
                        const Icon = ICONS[f.icon];
                        return (
                            <div key={f.title} className="flex items-start gap-5 py-8 md:py-0 md:px-8 first:md:pl-0 last:md:pr-0">
                                <Icon className="w-8 h-8 text-silk shrink-0" strokeWidth={1.3} />
                                <div>
                                    <h3 className="font-heading text-xl md:text-2xl">{f.title}</h3>
                                    <p className="mt-2 text-silk/65 text-sm leading-relaxed max-w-xs">{f.body}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

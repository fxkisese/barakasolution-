import { Instagram } from "lucide-react";
import { motion } from "framer-motion";

export default function InstagramFeed() {
    return (
        <section className="bg-silk py-24 md:py-32 border-t border-obsidian/10">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-12 text-center">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-2xl mx-auto mb-14"
                >
                    <div className="flex justify-center mb-6">
                        <div className="w-12 h-12 rounded-full bg-obsidian flex items-center justify-center text-silk">
                            <Instagram className="w-6 h-6" />
                        </div>
                    </div>
                    <h2 className="font-heading font-light text-obsidian text-4xl leading-tight mb-4">
                        Join Our Community
                    </h2>
                    <p className="text-basalt text-base font-body">
                        Follow <a href="https://instagram.com/luxecraft_furniture" target="_blank" rel="noreferrer" className="text-obsidian font-medium hover:underline">@luxecraft_furniture</a> for the latest arrivals, design inspiration, and a behind-the-scenes look at our craft.
                    </p>
                </motion.div>

                {/* Widget Placeholder */}
                <div className="w-full min-h-[400px] bg-secondary border border-obsidian/10 rounded-sm flex items-center justify-center p-8">
                    <div className="text-center">
                        <p className="text-basalt text-sm uppercase tracking-[0.15em] mb-2">Instagram Feed Widget Placeholder</p>
                        <p className="text-obsidian text-xs">Drop your Elfsight or custom widget embed code inside the `InstagramFeed.jsx` file.</p>
                        
                        {/* 
                            =========================================================
                            PASTE YOUR INSTAGRAM WIDGET CODE BELOW THIS COMMENT
                            =========================================================
                        */}
                        <div id="instagram-widget-container" className="mt-8 w-full">
                            {/* Example: <div class="elfsight-app-xxxx-xxxx-xxxx-xxxx"></div> */}
                        </div>
                        {/* ========================================================= */}
                    </div>
                </div>
            </div>
        </section>
    );
}

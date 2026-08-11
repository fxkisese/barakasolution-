import { Video } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function TiktokFeed() {
    useEffect(() => {
        // Load the TikTok script dynamically when the component mounts
        const scriptId = "tiktok-embed-script";
        if (!document.getElementById(scriptId)) {
            const script = document.createElement("script");
            script.id = scriptId;
            script.src = "https://www.tiktok.com/embed.js";
            script.async = true;
            document.body.appendChild(script);
        } else {
             // If script is already loaded but we navigated back, we might need to tell TikTok to render again.
             // Usually tiktok embed script handles it, or you might need window.tiktokEmbed.load() or similar.
             // We'll just let the script do its thing since it's a SPA.
        }
    }, []);

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
                            <Video className="w-6 h-6" />
                        </div>
                    </div>
                    <h2 className="font-heading font-light text-obsidian text-4xl leading-tight mb-4">
                        Watch Us on TikTok
                    </h2>
                    <p className="text-basalt text-base font-body">
                        Follow <a href="https://www.tiktok.com/@barakasolutions" target="_blank" rel="noreferrer" className="text-obsidian font-medium hover:underline">@barakasolutions</a> for our latest content and more.
                    </p>
                </motion.div>

                <div className="w-full min-h-[400px] flex items-center justify-center pt-8">
                    <div className="w-full flex justify-center">
                        <blockquote 
                            className="tiktok-embed" 
                            cite="https://www.tiktok.com/@barakasolutions" 
                            data-unique-id="barakasolutions" 
                            data-embed-from="embed_page" 
                            data-embed-type="creator" 
                            style={{ maxWidth: '780px', minWidth: '288px' }}
                        > 
                            <section> 
                                <a target="_blank" href="https://www.tiktok.com/@barakasolutions?refer=creator_embed" rel="noreferrer">@barakasolutions</a> 
                            </section> 
                        </blockquote> 
                    </div>
                </div>
            </div>
        </section>
    );
}

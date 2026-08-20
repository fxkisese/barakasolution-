import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { supabase } from "@/api/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

export default function Hero() {
    const [slides, setSlides] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        async function fetchSlides() {
            const { data } = await supabase.from('hero_slides').select('*').order('created_at', { ascending: false });
            if (data && data.length > 0) {
                setSlides(data);
            }
        }
        fetchSlides();
    }, []);

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const currentSlide = slides[currentIndex] || null;
    const hasSlides = slides.length > 0;

    // Simple parser to allow italicizing parts of the title by wrapping them in asterisks like *Stylish.*
    const renderTitle = (text) => {
        if (!text) return null;
        const parts = text.split('\n').map((line, i) => (
            <span key={i} className="block">
                {line.split('*').map((chunk, j) =>
                    j % 2 === 1 ? <span key={j} className="italic font-normal">{chunk}</span> : chunk
                )}
            </span>
        ));
        return parts;
    };

    return (
        <section id="top" className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-obsidian">
            {/* Only render slide images when admin has uploaded them */}
            {hasSlides && (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide.id}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        className="absolute inset-0 w-full h-full"
                    >
                        <Image
                            src={currentSlide.image}
                            alt="Hero background"
                            className="block absolute inset-0 w-full h-full"
                            style={{ display: 'block' }}
                            fittingType="fill"
                        />
                    </motion.div>
                </AnimatePresence>
            )}

            {/* Gradient overlays — shown always (darker when no image) */}
            {/* Gradient: on mobile full dark overlay so text is readable; on md+ fade right */}
            <div className={`absolute inset-0 z-10 ${hasSlides ? 'bg-gradient-to-b from-obsidian/70 via-obsidian/50 to-obsidian/80 md:bg-gradient-to-r md:from-obsidian/90 md:via-obsidian/60 md:to-obsidian/30' : 'bg-obsidian/80'}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent z-10" />

            <div className="relative z-20 h-full mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 flex flex-col justify-end md:justify-center pb-16 pt-28 md:py-32">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={hasSlides ? `content-${currentSlide.id}` : 'default-content'}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-4xl mt-auto"
                    >
                        {/* Eyebrow */}
                        <p className="text-silk/90 text-[12px] md:text-[13px] uppercase tracking-[0.3em] max-w-md mb-6">
                            {hasSlides ? currentSlide.subtitle : "Discover the perfect design for your home or next project"}
                        </p>

                        {/* Headline */}
                        <h1 className="font-heading font-light text-silk leading-[0.95] text-[clamp(3.2rem,8vw,6.5rem)] md:text-[clamp(3.5rem,10vw,8.5rem)]">
                            {hasSlides ? renderTitle(currentSlide.title) : (
                                <>
                                    <span className="block">Durable.</span>
                                    <span className="block italic font-normal">Stylish.</span>
                                    <span className="block">Affordable.</span>
                                </>
                            )}
                        </h1>

                        <p className="mt-8 text-silk/85 text-base md:text-lg max-w-xl leading-relaxed">
                            {hasSlides ? currentSlide.description : "A design decoration store based in Nairobi, Kenya — specialising in furniture, decor, home accessories and more."}
                        </p>

                        <div className="mt-10 flex flex-wrap items-center gap-6">
                            <Link
                                to="/shop"
                                className="group inline-flex items-center gap-3 h-14 px-8 bg-white text-obsidian text-[13px] uppercase tracking-[0.18em] hover:bg-obsidian hover:text-silk transition-colors duration-300"
                            >
                                Discover Now
                                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.6} />
                            </Link>
                            <span className="font-mono-price text-silk/60 text-xs uppercase tracking-[0.2em] hidden sm:inline-block">
                                Est. Nairobi · Curated Living
                            </span>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Dots indicator — only when multiple admin slides exist */}
                {slides.length > 1 && (
                    <div className="absolute bottom-12 left-6 lg:left-12 flex gap-3 z-30">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-1 transition-all duration-300 ${idx === currentIndex ? 'w-10 bg-white' : 'w-4 bg-white/30 hover:bg-white/50'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { supabase } from "@/api/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_SLIDE = {
    id: 'default',
    image: "https://media.base44.com/images/public/6a6d9931404d2ed792b9761d/8bf6ece01_generated_40ce79b9.png",
    subtitle: "Discover the perfect design for your home or next project",
    title: "Durable.\nStylish. Affordable.",
    description: "A design decoration store based in Nairobi, Kenya — specialising in furniture, decor, home accessories and more.",
};

export default function Hero() {
    const [slides, setSlides] = useState([DEFAULT_SLIDE]);
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

    const currentSlide = slides[currentIndex];

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
        <section id="top" className="relative h-screen min-h-[640px] w-full overflow-hidden bg-obsidian">
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
                        className="absolute inset-0 w-full h-full object-cover"
                        fittingType="fill"
                    />
                </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-r from-obsidian/80 via-obsidian/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 to-transparent z-10" />

            <div className="relative z-20 h-full mx-auto max-w-[1400px] px-6 lg:px-12 flex flex-col justify-center py-28 md:py-32">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`content-${currentSlide.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-4xl mt-auto"
                    >
                        {/* Eyebrow */}
                        {currentSlide.subtitle && (
                            <p className="text-silk/90 text-[12px] md:text-[13px] uppercase tracking-[0.3em] max-w-md mb-6">
                                {currentSlide.subtitle}
                            </p>
                        )}

                        {/* Headline */}
                        <h1 className="font-heading font-light text-silk leading-[0.95] text-[clamp(3.2rem,8vw,6.5rem)] md:text-[clamp(3.5rem,10vw,8.5rem)]">
                            {renderTitle(currentSlide.title)}
                        </h1>
                        
                        {currentSlide.description && (
                            <p className="mt-8 text-silk/85 text-base md:text-lg max-w-xl leading-relaxed">
                                {currentSlide.description}
                            </p>
                        )}

                        <div className="mt-10 flex flex-wrap items-center gap-6">
                            <a
                                href="#collections"
                                className="group inline-flex items-center gap-3 h-14 px-8 bg-white text-obsidian text-[13px] uppercase tracking-[0.18em] hover:bg-obsidian hover:text-silk transition-colors duration-300"
                            >
                                Discover Now
                                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.6} />
                            </a>
                            <span className="font-mono-price text-silk/60 text-xs uppercase tracking-[0.2em] hidden sm:inline-block">
                                Est. Nairobi · Curated Living
                            </span>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Dots indicator */}
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
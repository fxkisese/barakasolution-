import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/api/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

/** Returns true if the URL looks like a video file */
function isVideoUrl(url) {
    if (!url) return false;
    return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

/** Fullscreen background video with autoplay, loop, muted */
function HeroVideo({ src, key: _key }) {
    const videoRef = useRef(null);

    useEffect(() => {
        const vid = videoRef.current;
        if (!vid) return;
        vid.load();
        vid.play().catch(() => {/* autoplay blocked — silently ignore */});
    }, [src]);

    return (
        <video
            ref={videoRef}
            key={src}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
            }}
        >
            <source src={src} />
        </video>
    );
}

export default function Hero() {
    const [slides, setSlides] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        async function fetchSlides() {
            const { data } = await supabase
                .from('hero_slides')
                .select('*')
                .order('created_at', { ascending: false });
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
        }, 8000); // slightly longer for video slides
        return () => clearInterval(timer);
    }, [slides.length]);

    const currentSlide = slides[currentIndex] || null;
    const hasSlides = slides.length > 0;

    // Determine media type of current slide
    const videoSrc = currentSlide?.video_url || null;
    const imageSrc = currentSlide?.image || currentSlide?.image_url || null;
    const isVideo = !!videoSrc;

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

            {/* ── Media layer (video or image) ── */}
            {hasSlides && (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide.id}
                        initial={{ opacity: 0, scale: isVideo ? 1 : 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: isVideo ? 0.8 : 1.2, ease: "easeInOut" }}
                        className="absolute inset-0 w-full h-full"
                    >
                        {isVideo ? (
                            <HeroVideo src={videoSrc} />
                        ) : imageSrc ? (
                            <img
                                src={imageSrc}
                                alt="Hero background"
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                }}
                            />
                        ) : null}
                    </motion.div>
                </AnimatePresence>
            )}

            {/* ── Gradient overlays ── */}
            <div className={`absolute inset-0 z-10 ${hasSlides ? 'bg-gradient-to-b from-obsidian/70 via-obsidian/50 to-obsidian/80 md:bg-gradient-to-r md:from-obsidian/90 md:via-obsidian/60 md:to-obsidian/30' : 'bg-obsidian/80'}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent z-10" />

            {/* ── Video indicator badge ── */}
            {isVideo && (
                <div className="absolute top-6 right-6 z-30 flex items-center gap-2 bg-black/40 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-white/70 text-[10px] uppercase tracking-widest font-medium">Live</span>
                </div>
            )}

            {/* ── Text content ── */}
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

                {/* Dots indicator — only when multiple slides */}
                {slides.length > 1 && (
                    <div className="absolute bottom-12 left-6 lg:left-12 flex gap-3 z-30">
                        {slides.map((slide, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                aria-label={`Go to slide ${idx + 1}`}
                                className={`h-1 transition-all duration-300 ${idx === currentIndex ? 'w-10 bg-white' : 'w-4 bg-white/30 hover:bg-white/50'}`}
                            >
                                {/* Show small video icon on video slides */}
                                {isVideoUrl(slide.video_url) && (
                                    <span className="sr-only">Video</span>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
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

/**
 * Fullscreen background video — autoplay, loop, muted, playsInline.
 * Uses direct src on <video> (not <source>) for maximum browser compatibility.
 * Re-triggers play when src changes.
 */
function HeroVideo({ src, poster }) {
    const videoRef = useRef(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const vid = videoRef.current;
        if (!vid || !src) return;
        setError(false);

        // Reset and reload whenever the src changes
        vid.pause();
        vid.removeAttribute('src');
        vid.load();

        vid.src = src;
        vid.load();

        const tryPlay = () => {
            vid.play().catch((e) => {
                console.warn('[HeroVideo] Autoplay failed:', e.message);
                // Some browsers need a user gesture — attempt on first interaction
                const resume = () => {
                    vid.play().catch(() => {});
                    document.removeEventListener('click', resume);
                    document.removeEventListener('touchstart', resume);
                };
                document.addEventListener('click', resume, { once: true });
                document.addEventListener('touchstart', resume, { once: true });
            });
        };

        if (vid.readyState >= 3) {
            tryPlay();
        } else {
            vid.addEventListener('canplay', tryPlay, { once: true });
        }

        return () => {
            vid.removeEventListener('canplay', tryPlay);
        };
    }, [src]);

    if (error) return null; // fall through to image fallback

    return (
        <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={poster || undefined}
            onError={() => setError(true)}
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
            }}
        />
    );
}

export default function Hero() {
    const [slides, setSlides] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dbHasVideoCol, setDbHasVideoCol] = useState(true);

    useEffect(() => {
        async function fetchSlides() {
            const { data, error } = await supabase
                .from('hero_slides')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('[Hero] Failed to load slides:', error.message);
                return;
            }
            if (data && data.length > 0) {
                // Check if video_url column exists (it's present in returned rows)
                const hasCol = 'video_url' in (data[0] || {});
                setDbHasVideoCol(hasCol);
                setSlides(data);
            }
        }
        fetchSlides();
    }, []);

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % slides.length);
        }, 8000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const currentSlide = slides[currentIndex] || null;
    const hasSlides = slides.length > 0;

    // Resolve video and image from whichever field is populated
    const videoSrc = dbHasVideoCol
        ? (currentSlide?.video_url || null)
        : null;
    const imageSrc = currentSlide?.image || currentSlide?.image_url || null;
    const isVideo = !!videoSrc && isVideoUrl(videoSrc);

    const renderTitle = (text) => {
        if (!text) return null;
        return text.split('\n').map((line, i) => (
            <span key={i} className="block">
                {line.split('*').map((chunk, j) =>
                    j % 2 === 1
                        ? <span key={j} className="italic font-normal">{chunk}</span>
                        : chunk
                )}
            </span>
        ));
    };

    return (
        <section id="top" className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-obsidian">

            {/* ── Media layer ── */}
            {hasSlides && (
                // Use a plain div with CSS transition instead of framer-motion
                // because AnimatePresence unmounts+remounts the video, killing playback
                <div className="absolute inset-0 w-full h-full">
                    {isVideo ? (
                        // Key forces React to create a fresh HeroVideo when slide changes
                        <HeroVideo
                            key={`video-${currentSlide.id}`}
                            src={videoSrc}
                            poster={imageSrc || undefined}
                        />
                    ) : imageSrc ? (
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={`img-${currentSlide.id}`}
                                src={imageSrc}
                                alt="Hero background"
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.2, ease: "easeInOut" }}
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                }}
                            />
                        </AnimatePresence>
                    ) : null}
                </div>
            )}

            {/* ── Gradient overlays ── */}
            <div className={`absolute inset-0 z-10 ${
                hasSlides
                    ? 'bg-gradient-to-b from-obsidian/70 via-obsidian/50 to-obsidian/80 md:bg-gradient-to-r md:from-obsidian/90 md:via-obsidian/60 md:to-obsidian/30'
                    : 'bg-obsidian/80'
            }`} />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent z-10" />

            {/* ── Video playing badge ── */}
            {isVideo && (
                <div className="absolute top-6 right-6 z-30 flex items-center gap-2 bg-black/40 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-white/70 text-[10px] uppercase tracking-widest font-medium">Video</span>
                </div>
            )}

            {/* ── DB migration warning (dev only) ── */}
            {!dbHasVideoCol && import.meta.env.DEV && (
                <div className="absolute bottom-0 left-0 right-0 z-50 bg-amber-500 text-black text-xs font-mono px-4 py-2 text-center">
                    ⚠️ Run in Supabase SQL editor: <strong>ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS video_url text;</strong>
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
                        <p className="text-silk/90 text-[12px] md:text-[13px] uppercase tracking-[0.3em] max-w-md mb-6">
                            {hasSlides ? currentSlide.subtitle : "Discover the perfect design for your home or next project"}
                        </p>

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
                            {hasSlides
                                ? currentSlide.description
                                : "A design decoration store based in Nairobi, Kenya — specialising in furniture, decor, home accessories and more."}
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

                {/* Slide dots */}
                {slides.length > 1 && (
                    <div className="absolute bottom-12 left-6 lg:left-12 flex gap-3 z-30">
                        {slides.map((slide, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                aria-label={`Go to slide ${idx + 1}`}
                                className={`h-1 transition-all duration-300 ${
                                    idx === currentIndex ? 'w-10 bg-white' : 'w-4 bg-white/30 hover:bg-white/50'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
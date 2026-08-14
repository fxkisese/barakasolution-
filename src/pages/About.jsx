import { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Users, MapPin, Trophy } from "lucide-react";
import TiktokFeed from "@/components/site/TiktokFeed";
import InstagramFeed from "@/components/site/InstagramFeed";

export default function About() {
    const [slides, setSlides] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const fetchSlides = async () => {
            const { data } = await supabase
                .from("about_slides")
                .select("*")
                .eq("active", true)
                .order("order", { ascending: true });
            if (data && data.length > 0) {
                setSlides(data);
            }
        };
        fetchSlides();
    }, []);

    useEffect(() => {
        if (slides.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [slides]);

    return (
        <>
            <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
            >
                <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6">About Luxe Craft Furniture</h1>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                    Elevating spaces with premium furniture and decor. We blend modern elegance with structural integrity to deliver unmatched aesthetic solutions for residential and commercial projects.
                </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative aspect-square md:aspect-auto md:h-[500px] rounded-2xl overflow-hidden shadow-2xl bg-slate-100"
                >
                    {slides.length > 0 ? (
                        <AnimatePresence mode="popLayout">
                            <motion.img
                                key={currentSlide}
                                src={slides[currentSlide].image_url}
                                alt="About Luxe Craft Furniture"
                                className="absolute inset-0 object-cover w-full h-full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1 }}
                            />
                        </AnimatePresence>
                    ) : (
                        <img
                            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                            alt="Luxe Craft installation"
                            className="object-cover w-full h-full"
                        />
                    )}
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    <h2 className="text-3xl font-serif text-slate-900">Our Story</h2>
                    <p className="text-slate-600 leading-relaxed">
                        What started as a passion for precision has grown into a leading name in bespoke furniture collections. With over 300 successful projects, Luxe Craft Furniture is synonymous with quality, reliability, and breathtaking design.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        Our team of experts handles everything from elegant sofas to custom oak dining tables, ensuring that every piece not only meets but exceeds expectations. We believe in transforming ordinary spaces into extraordinary experiences.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-6 pt-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-900">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-medium text-slate-900">300+</h4>
                                <p className="text-sm text-slate-500">Projects Completed</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-900">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-medium text-slate-900">Expert Team</h4>
                                <p className="text-sm text-slate-500">Dedicated Installers</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white mb-24"
            >
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-serif mb-4">Our Locations</h2>
                    <p className="text-slate-300 max-w-2xl mx-auto">
                        Visit us at one of our branches to experience our quality firsthand and consult with our experts.
                    </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-slate-800 p-8 rounded-2xl flex flex-col items-center text-center">
                        <MapPin className="w-10 h-10 text-white mb-4" />
                        <h3 className="text-xl font-medium mb-2">Kyumbi Branch</h3>
                        <p className="text-slate-400 mb-4">Our flagship showroom featuring our latest collections and full consultation services.</p>
                        <p className="text-sm font-medium text-slate-300">Open Mon-Sat, 8am - 5pm</p>
                    </div>
                    <div className="bg-slate-800 p-8 rounded-2xl flex flex-col items-center text-center">
                        <Building2 className="w-10 h-10 text-white mb-4" />
                        <h3 className="text-xl font-medium mb-2">Whitehouse Footbridge</h3>
                        <p className="text-slate-400 mb-4">Conveniently located for quick orders, pickups, and discussing custom installations.</p>
                        <p className="text-sm font-medium text-slate-300">Open Mon-Sat, 8am - 6pm</p>
                    </div>
                </div>
            </motion.div>
        </div>
        <TiktokFeed />
        <InstagramFeed />
        </>
    );
}

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X } from "lucide-react";
import { supabase } from "@/api/supabaseClient";
import { Image } from "@/components/ui/image";

export default function Gallery() {
    const [galleryImages, setGalleryImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        async function fetchGallery() {
            // Pull gallery images from the products table (or a dedicated gallery table if it exists)
            const { data: galleryData } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
            if (galleryData && galleryData.length > 0) {
                setGalleryImages(galleryData);
            } else {
                // Fallback: pull all product images as gallery items
                const { data: products } = await supabase.from('products').select('id, name, image, category').order('created_at', { ascending: false });
                if (products) {
                    setGalleryImages(products.map(p => ({
                        id: p.id,
                        src: p.image,
                        title: p.name,
                        category: p.category || 'General',
                    })));
                }
            }
            setLoading(false);
        }
        fetchGallery();
    }, []);

    const categories = ["All", ...Array.from(new Set(galleryImages.map(img => img.category).filter(Boolean)))];
    const filteredImages = filter === "All" ? galleryImages : galleryImages.filter(img => img.category === filter);

    return (
        <div className="py-12 md:py-20 max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
                <p className="text-[11px] uppercase tracking-[0.35em] text-[#D4AF37] font-semibold mb-4">Gallery</p>
                <h1 className="font-heading font-light text-4xl md:text-5xl text-[#1A1A1A] mb-5">Our Portfolio</h1>
                <p className="text-[#7C7C7C] max-w-xl mx-auto text-sm leading-relaxed">
                    A showcase of our curated furniture and home decor pieces. Browse through our collection for inspiration.
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-5 py-2 text-[12px] uppercase tracking-[0.15em] transition-colors ${
                            filter === cat
                                ? "bg-[#1A1A1A] text-white"
                                : "border border-[#EAEAEA] text-[#7C7C7C] hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-24">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-2 border-[#1A1A1A] border-t-[#D4AF37] rounded-full animate-spin" />
                        <p className="text-[11px] uppercase tracking-[0.3em] text-[#7C7C7C]">Loading gallery...</p>
                    </div>
                </div>
            ) : filteredImages.length === 0 ? (
                <div className="text-center py-24 text-[#7C7C7C]">
                    <p className="text-sm uppercase tracking-[0.2em]">No images in this category</p>
                </div>
            ) : (
                /* Gallery Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredImages.map((image, index) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.35, delay: index * 0.04 }}
                            key={image.id}
                            className="group relative aspect-square overflow-hidden bg-[#F4F0EB] cursor-pointer"
                            onClick={() => setSelectedImage(image)}
                        >
                            <Image
                                src={image.src || image.image}
                                alt={image.title || image.name}
                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                                fittingType="fill"
                            />
                            <div className="absolute inset-0 bg-[#1A1A1A]/0 group-hover:bg-[#1A1A1A]/40 transition-colors duration-300 flex items-center justify-center">
                                <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-8 h-8" />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#1A1A1A]/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <p className="text-white font-heading text-lg">{image.title || image.name}</p>
                                <p className="text-white/70 text-xs uppercase tracking-[0.15em] mt-0.5">{image.category}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/95 p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            className="absolute top-6 right-6 text-white hover:text-[#D4AF37] transition-colors"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X className="w-8 h-8" />
                        </button>
                        <div
                            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedImage.src || selectedImage.image}
                                alt={selectedImage.title || selectedImage.name}
                                className="max-w-full max-h-[85vh] object-contain shadow-2xl"
                            />
                            <div className="text-center mt-4">
                                <h3 className="text-white font-heading text-xl">{selectedImage.title || selectedImage.name}</h3>
                                <p className="text-white/50 text-xs uppercase tracking-[0.2em] mt-1">{selectedImage.category}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

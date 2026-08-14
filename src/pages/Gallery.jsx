import { useState } from "react";
import { motion } from "framer-motion";
import { Maximize2, X } from "lucide-react";

const galleryImages = [
    { id: 1, category: "Bathroom", src: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Frameless Shower Setup" },
    { id: 2, category: "Commercial", src: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Office Glass Partitions" },
    { id: 3, category: "Living Room", src: "https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Custom Round Mirror" },
    { id: 4, category: "Bathroom", src: "https://images.unsplash.com/photo-1609590623253-125086d49861?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "LED Vanity Mirror" },
    { id: 5, category: "Commercial", src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Meeting Room Enclosure" },
    { id: 6, category: "Living Room", src: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Glass Coffee Table" },
    { id: 7, category: "Custom", src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Gym Mirror Wall" },
    { id: 8, category: "Bathroom", src: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Corner Shower Cubicle" },
];

const categories = ["All", "Bathroom", "Living Room", "Commercial", "Custom"];

export default function Gallery() {
    const [filter, setFilter] = useState("All");
    const [selectedImage, setSelectedImage] = useState(null);

    const filteredImages = filter === "All" 
        ? galleryImages 
        : galleryImages.filter(img => img.category === filter);

    return (
        <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6">Our Portfolio</h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    A showcase of our finest glass installations and mirror works. Browse through our completed projects to find inspiration for your next upgrade.
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                            filter === cat 
                                ? "bg-slate-900 text-white" 
                                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredImages.map((image, index) => (
                    <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        key={image.id}
                        className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 cursor-pointer"
                        onClick={() => setSelectedImage(image)}
                    >
                        <img 
                            src={image.src} 
                            alt={image.title} 
                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors duration-300 flex items-center justify-center">
                            <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-8 h-8" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <p className="text-white font-medium">{image.title}</p>
                            <p className="text-white/80 text-sm">{image.category}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 p-4" onClick={() => setSelectedImage(null)}>
                    <button 
                        className="absolute top-6 right-6 text-white hover:text-slate-300 transition-colors"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X className="w-8 h-8" />
                    </button>
                    <div 
                        className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img 
                            src={selectedImage.src} 
                            alt={selectedImage.title} 
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        />
                        <div className="text-center mt-4">
                            <h3 className="text-white text-xl font-medium">{selectedImage.title}</h3>
                            <p className="text-slate-400">{selectedImage.category}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Shield, Truck, MessageCircle } from "lucide-react";

// Mock Product Data
const products = {
    "1": { name: "LED Vanity Mirror", category: "Mirrors", price: "KES 15,000", image: "https://images.unsplash.com/photo-1609590623253-125086d49861?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", description: "Modern LED backlit vanity mirror perfect for bathrooms. Features touch sensor for dimming and color temperature adjustment.", specs: ["Dimensions: 600mm x 800mm", "Glass Thickness: 5mm Copper-free", "Lighting: Dimmable LED Strip", "Installation: Wall-mounted"] },
    "2": { name: "Frameless Shower Enclosure", category: "Shower Cubicles", price: "KES 45,000", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", description: "Premium frameless shower enclosure using toughened safety glass. Enhances the sense of space in any bathroom.", specs: ["Glass: 8mm Clear Toughened Safety Glass", "Fittings: Stainless Steel / Chrome", "Customizable Dimensions", "Easy-clean coating optional"] },
    "3": { name: "Tinted Glass Partition", category: "Glass Partitions", price: "KES 30,000", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", description: "Elegant tinted glass partition for office or home spaces. Offers semi-privacy while maintaining an open feel.", specs: ["Glass: 10mm Toughened Tinted", "Color Options: Grey, Bronze", "Hardware: Floor-to-ceiling channels", "Sound insulation properties"] },
    "4": { name: "Round Decorative Mirror", category: "Mirrors", price: "KES 8,500", image: "https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", description: "Sleek round mirror with a slim metallic frame. Perfect for entryways, living rooms, or vanity areas.", specs: ["Diameter: 800mm", "Frame: Aluminum", "Finish: Matte Black / Gold", "Ready to hang"] },
    "5": { name: "Custom Glass Coffee Table", category: "Custom Pieces", price: "KES 25,000", image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", description: "Bespoke glass coffee table with a minimalist design. Heavy-duty construction for durability.", specs: ["Top: 12mm Tempered Glass", "Base: Custom metal or wood", "Dimensions: Made to order", "Beveled edges"] },
    "6": { name: "Arch Bathroom Mirror", category: "Mirrors", price: "KES 12,000", image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", description: "Trendy arch-shaped mirror that adds character to any space. Can be ordered with or without LED backlighting.", specs: ["Dimensions: 500mm x 900mm", "Shape: Arch/Pill", "Edge: Polished or Framed", "Anti-fog option available"] }
};

export default function ProductDetail() {
    const { id } = useParams();
    const product = products[id] || products["1"]; // Fallback to 1 if not found for mock

    const orderMessage = encodeURIComponent(`Hi Luxe Craft Furniture, I'm interested in ordering the ${product.name} priced at ${product.price}. Please provide more details.`);
    const whatsappUrl = `https://wa.me/254700000000?text=${orderMessage}`; // Replace with actual number

    return (
        <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/shop" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Shop
            </Link>

            <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
                {/* Product Image */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative aspect-square md:aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100"
                >
                    <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-full h-full"
                    />
                </motion.div>

                {/* Product Info */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col justify-center"
                >
                    <div className="mb-2 text-sm font-medium tracking-wider text-slate-500 uppercase">
                        {product.category}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4">{product.name}</h1>
                    <div className="text-2xl font-medium text-slate-900 mb-8">{product.price}</div>
                    
                    <p className="text-slate-600 leading-relaxed mb-8">
                        {product.description}
                    </p>

                    <div className="space-y-4 mb-10">
                        <h3 className="font-medium text-slate-900 text-lg">Specifications:</h3>
                        <ul className="space-y-2">
                            {product.specs.map((spec, i) => (
                                <li key={i} className="flex items-start text-slate-600">
                                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                                    {spec}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-10 border-y border-slate-100 py-6">
                        <div className="flex items-center text-sm text-slate-600">
                            <Truck className="w-5 h-5 mr-3 text-slate-400" />
                            Delivery & Installation Available
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                            <Shield className="w-5 h-5 mr-3 text-slate-400" />
                            Quality Guaranteed
                        </div>
                    </div>

                    <a 
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-medium transition-colors text-lg"
                    >
                        <MessageCircle className="w-6 h-6 mr-3" />
                        Order via WhatsApp
                    </a>
                    <p className="text-center text-sm text-slate-500 mt-4">
                        We customize dimensions based on your specific requirements.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

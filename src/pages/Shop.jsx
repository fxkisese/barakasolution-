import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

// Mock Data for the Shop
const categories = ["All", "Mirrors", "Glass Partitions", "Shower Cubicles", "Custom Pieces"];

const products = [
    { id: 1, name: "LED Vanity Mirror", category: "Mirrors", price: "KES 15,000", image: "https://images.unsplash.com/photo-1609590623253-125086d49861?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { id: 2, name: "Frameless Shower Enclosure", category: "Shower Cubicles", price: "KES 45,000", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { id: 3, name: "Tinted Glass Partition", category: "Glass Partitions", price: "KES 30,000", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { id: 4, name: "Round Decorative Mirror", category: "Mirrors", price: "KES 8,500", image: "https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { id: 5, name: "Custom Glass Coffee Table", category: "Custom Pieces", price: "KES 25,000", image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { id: 6, name: "Arch Bathroom Mirror", category: "Mirrors", price: "KES 12,000", image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
];

export default function Shop() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProducts = products.filter(product => {
        const matchesCategory = activeCategory === "All" || product.category === activeCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-serif text-slate-900 mb-4">Our Collection</h1>
                    <p className="text-slate-600 max-w-xl">Browse our extensive catalog of premium glass and mirror products. From functional enclosures to decorative masterpieces.</p>
                </div>
                
                <div className="relative w-full md:w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-slate-900 focus:border-slate-900 bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Filters */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
                        <div className="flex items-center gap-2 mb-6 text-slate-900 font-medium">
                            <Filter className="w-5 h-5" />
                            <h3>Categories</h3>
                        </div>
                        <ul className="space-y-3">
                            {categories.map((category) => (
                                <li key={category}>
                                    <button
                                        onClick={() => setActiveCategory(category)}
                                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                            activeCategory === category
                                                ? "bg-slate-900 text-white"
                                                : "text-slate-600 hover:bg-slate-50"
                                        }`}
                                    >
                                        {category}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="flex-grow">
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900">No products found</h3>
                            <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
                            <button 
                                onClick={() => {setSearchQuery(""); setActiveCategory("All");}}
                                className="mt-4 text-slate-900 underline underline-offset-4"
                            >
                                Clear filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product, index) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    key={product.id}
                                    className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
                                >
                                    <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-slate-100">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                    </Link>
                                    <div className="p-5">
                                        <div className="text-xs text-slate-500 mb-1 font-medium tracking-wider uppercase">{product.category}</div>
                                        <Link to={`/product/${product.id}`}>
                                            <h3 className="text-lg font-medium text-slate-900 group-hover:text-slate-700 transition-colors">{product.name}</h3>
                                        </Link>
                                        <div className="mt-4 flex items-center justify-between">
                                            <span className="text-lg font-semibold text-slate-900">{product.price}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

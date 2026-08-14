import { motion } from "framer-motion";
import { Calendar, User, ArrowRight } from "lucide-react";

export default function Blog() {
    const posts = [
        {
            id: 1,
            title: "5 Ways to Make a Small Bathroom Look Bigger with Mirrors",
            excerpt: "Discover how strategic placement of mirrors can completely transform the perception of space in your bathroom.",
            category: "Styling Tips",
            date: "Aug 12, 2026",
            author: "Luxe Craft Team",
            image: "https://images.unsplash.com/photo-1609590623253-125086d49861?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 2,
            title: "The Rise of LED Smart Mirrors in Modern Homes",
            excerpt: "Why everyone is upgrading from traditional mirrors to smart LED mirrors. Exploring the benefits of built-in lighting and demisters.",
            category: "New Trends",
            date: "Jul 28, 2026",
            author: "Interior Expert",
            image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 3,
            title: "Frameless vs. Framed Shower Cubicles: Which is Better?",
            excerpt: "A comprehensive guide to help you choose the right shower enclosure for your bathroom renovation project.",
            category: "Guides",
            date: "Jul 15, 2026",
            author: "Luxe Craft Team",
            image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 4,
            title: "How to Clean and Maintain Your Glass Partitions",
            excerpt: "Keep your office or home glass partitions looking crystal clear with these professional maintenance tips.",
            category: "Maintenance",
            date: "Jun 30, 2026",
            author: "Luxe Craft Team",
            image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
    ];

    return (
        <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-silk">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6">News & Inspiration</h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Expert tips, interior design inspiration, and the latest updates from the Luxe Craft Furniture team.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                {posts.map((post, index) => (
                    <motion.article 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        key={post.id} 
                        className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col"
                    >
                        <div className="relative aspect-video overflow-hidden bg-slate-100">
                            <img 
                                src={post.image} 
                                alt={post.title} 
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute top-4 left-4">
                                <span className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-medium text-slate-900 shadow-sm">
                                    {post.category}
                                </span>
                            </div>
                        </div>
                        <div className="p-8 flex-grow flex flex-col">
                            <div className="flex items-center text-sm text-slate-500 mb-4 gap-4">
                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1.5" />
                                    {post.date}
                                </div>
                                <div className="flex items-center">
                                    <User className="w-4 h-4 mr-1.5" />
                                    {post.author}
                                </div>
                            </div>
                            <h2 className="text-2xl font-serif text-slate-900 mb-4 group-hover:text-slate-600 transition-colors line-clamp-2">
                                {post.title}
                            </h2>
                            <p className="text-slate-600 mb-8 flex-grow line-clamp-3">
                                {post.excerpt}
                            </p>
                            <a 
                                href="#" 
                                className="inline-flex items-center font-medium text-slate-900 hover:text-slate-600 transition-colors mt-auto"
                            >
                                Read Article <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </motion.article>
                ))}
            </div>
            
            <div className="mt-16 text-center">
                <button className="px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-full font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                    Load More Articles
                </button>
            </div>
        </div>
    );
}

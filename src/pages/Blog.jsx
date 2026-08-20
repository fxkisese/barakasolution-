import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight } from "lucide-react";
import { supabase } from "@/api/supabaseClient";

export default function Blog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            const { data } = await supabase
                .from("blog_posts")
                .select("*")
                .order("created_at", { ascending: false });
            if (data) setPosts(data);
            setLoading(false);
        }
        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-obsidian border-t-[#D4AF37] rounded-full animate-spin" />
                    <p className="text-[11px] uppercase tracking-[0.3em] text-basalt">Loading articles…</p>
                </div>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="py-24 md:py-36 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-silk text-center">
                <h1 className="font-heading font-light text-4xl md:text-5xl text-obsidian mb-6">News &amp; Inspiration</h1>
                <p className="text-basalt text-lg max-w-xl mx-auto">
                    No articles yet — check back soon for design tips, styling guides, and updates from the team.
                </p>
            </div>
        );
    }

    return (
        <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-silk">
            <div className="text-center mb-16">
                <h1 className="font-heading font-light text-4xl md:text-5xl text-obsidian mb-6">News &amp; Inspiration</h1>
                <p className="text-lg text-basalt max-w-2xl mx-auto">
                    Expert tips, interior design inspiration, and the latest updates from the team.
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
                        className="group bg-white overflow-hidden shadow-sm border border-border flex flex-col"
                    >
                        {post.image && (
                            <div className="relative aspect-video overflow-hidden bg-secondary">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                                />
                                {post.category && (
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-obsidian shadow-sm">
                                            {post.category}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="p-8 flex-grow flex flex-col">
                            <div className="flex items-center text-sm text-basalt mb-4 gap-4">
                                {post.date && (
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-1.5" />
                                        {post.date}
                                    </div>
                                )}
                                {post.author && (
                                    <div className="flex items-center">
                                        <User className="w-4 h-4 mr-1.5" />
                                        {post.author}
                                    </div>
                                )}
                            </div>
                            <h2 className="font-heading font-light text-2xl text-obsidian mb-4 group-hover:text-basalt transition-colors line-clamp-2">
                                {post.title}
                            </h2>
                            {post.excerpt && (
                                <p className="text-basalt mb-8 flex-grow line-clamp-3">{post.excerpt}</p>
                            )}
                        </div>
                    </motion.article>
                ))}
            </div>
        </div>
    );
}

import { useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { supabase } from "@/api/supabaseClient";

export default function Blog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            const { data } = await supabase
                .from('blog_posts')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(3);
            if (data) setPosts(data);
            setLoading(false);
        }
        fetchPosts();
    }, []);

    // Hide entirely if no admin blog posts
    if (!loading && posts.length === 0) return null;

    return (
        <section id="blog" className="scroll-mt-24 bg-silk py-24 md:py-32">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
                <div className="max-w-3xl">
                    <p className="text-[12px] uppercase tracking-[0.3em] text-obsidian">Journal</p>
                    <h2 className="mt-5 font-heading font-light text-obsidian text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight">
                        Stay up to date with home decor and design news
                    </h2>
                </div>

                {loading ? (
                    <div className="mt-14 flex justify-center py-12">
                        <div className="w-8 h-8 border-2 border-obsidian border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <article key={post.id || post.title} className="group border hairline bg-card flex flex-col">
                                <a href="#blog" className="block overflow-hidden aspect-[4/3]">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full transition-transform duration-700 group-hover:scale-105"
                                        fittingType="fill"
                                    />
                                </a>
                                <div className="p-7 flex flex-col flex-1">
                                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.15em] text-basalt/80">
                                        <span>{post.category}</span>
                                        <span>{post.date || new Date(post.created_at).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                    </div>
                                    <h3 className="mt-4 font-heading text-xl text-obsidian leading-snug">{post.title}</h3>
                                    <p className="mt-3 text-basalt text-sm leading-relaxed flex-1">{post.excerpt}</p>
                                    <a
                                        href="#blog"
                                        className="mt-6 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.18em] text-obsidian hover:opacity-60 transition-colors"
                                    >
                                        Read More
                                        <ArrowUpRight className="w-4 h-4" strokeWidth={1.6} />
                                    </a>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                <div className="mt-14 flex justify-center">
                    <a
                        href="#blog"
                        className="inline-flex items-center gap-2 h-12 px-7 bg-secondary text-basalt text-[13px] uppercase tracking-[0.15em] hover:bg-obsidian hover:text-silk transition-colors duration-300"
                    >
                        Visit Our Blog
                        <ArrowUpRight className="w-4 h-4" strokeWidth={1.6} />
                    </a>
                </div>
            </div>
        </section>
    );
}

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

export default function TestimonialsPage() {
    const testimonials = [
        {
            name: "Sarah Mwangi",
            role: "Homeowner",
            content: "Baraka Solutions completely transformed my bathroom. The frameless shower cubicle they installed is not only beautiful but incredibly sturdy. Their team was professional and cleaned up perfectly after the job.",
            rating: 5
        },
        {
            name: "David Ochieng",
            role: "Interior Designer",
            content: "As a designer, I need partners I can trust. Baraka Solutions has been my go-to for custom mirrors and glass partitions for over two years. Their attention to detail and ability to execute complex custom designs is unmatched in Nairobi.",
            rating: 5
        },
        {
            name: "Amina Hassan",
            role: "Boutique Owner",
            content: "The custom LED mirrors installed in my boutique have become a major talking point for my customers. Excellent quality and the lighting is perfect. Highly recommend!",
            rating: 5
        },
        {
            name: "Kevin Mutua",
            role: "Gym Manager",
            content: "We needed a full wall of mirrors for our new gym branch. The team from Baraka handled the large-scale installation seamlessly. Safe, perfectly aligned, and delivered exactly on time.",
            rating: 5
        },
        {
            name: "Grace Kariuki",
            role: "Office Manager",
            content: "We hired Baraka to partition our open-plan office. The frosted glass solution they provided gave us the privacy we needed without losing natural light. Great service from start to finish.",
            rating: 4
        },
        {
            name: "James Njoroge",
            role: "Homeowner",
            content: "I ordered a custom glass coffee table. The finishing on the edges is flawless. You can really tell they take pride in their craftsmanship. Will definitely order from them again.",
            rating: 5
        }
    ];

    return (
        <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-50/50">
            <div className="text-center mb-16">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-slate-900 text-white text-sm font-medium mb-6"
                >
                    <Star className="w-4 h-4 mr-2 fill-current text-yellow-400" />
                    Over 300+ Successful Projects
                </motion.div>
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-serif text-slate-900 mb-6"
                >
                    What Our Clients Say
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-slate-600 max-w-2xl mx-auto"
                >
                    Don't just take our word for it. Read about the experiences of homeowners and businesses who have chosen Baraka Solutions.
                </motion.p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        key={index}
                        className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative"
                    >
                        <Quote className="absolute top-8 right-8 w-10 h-10 text-slate-100" />
                        <div className="flex gap-1 mb-6 relative z-10">
                            {[...Array(5)].map((_, i) => (
                                <Star 
                                    key={i} 
                                    className={`w-5 h-5 ${i < testimonial.rating ? 'fill-current text-yellow-400' : 'text-slate-200'}`} 
                                />
                            ))}
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-8 relative z-10">
                            "{testimonial.content}"
                        </p>
                        <div className="mt-auto">
                            <h4 className="font-medium text-slate-900">{testimonial.name}</h4>
                            <p className="text-sm text-slate-500">{testimonial.role}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
            
            <div className="mt-20 text-center">
                <a 
                    href="/contact"
                    className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors font-medium text-lg"
                >
                    Start Your Project
                </a>
            </div>
        </div>
    );
}

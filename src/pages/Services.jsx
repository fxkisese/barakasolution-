import { motion } from "framer-motion";
import { Wrench, Truck, ShieldCheck, PenTool, ArrowRight, MessageCircle } from "lucide-react";

const services = [
    {
        icon: PenTool,
        title: "Custom Design Solutions",
        description: "From bespoke shelving units to custom-cut glass coffee tables, we bring your unique vision to life with precision craftsmanship and flawless finishes.",
    },
    {
        icon: Wrench,
        title: "Professional Installation",
        description: "Our expert team provides safe, precise installation for all pieces — from frameless shower cubicles and partitions to large wall mirrors and wardrobes.",
    },
    {
        icon: Truck,
        title: "Safe Delivery",
        description: "Specialized delivery covering Nairobi, Kyumbi, and surrounding areas. Every item is packed and handled to arrive in perfect condition.",
    },
    {
        icon: ShieldCheck,
        title: "Consultation & Measurement",
        description: "On-site consultation and accurate measurement services to ensure every piece fits your space perfectly — before a single cut is made.",
    },
];

const process = [
    { step: "01", title: "Consultation", body: "We discuss your vision, space, and budget in detail — in-store or on-site." },
    { step: "02", title: "Design & Quote", body: "We provide a detailed quote and technical drawings for your approval." },
    { step: "03", title: "Crafting", body: "Our team fabricates your pieces with precision in our Kyumbi workshop." },
    { step: "04", title: "Delivery & Install", body: "We deliver and professionally install everything, leaving your space ready to enjoy." },
];

export default function Services() {
    return (
        <div className="bg-silk">
            {/* Hero */}
            <section className="py-24 md:py-36 max-w-[1400px] mx-auto px-6 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-8 h-px bg-[#D4AF37]" />
                        <p className="text-[11px] uppercase tracking-[0.35em] text-[#D4AF37] font-semibold">What We Offer</p>
                    </div>
                    <h1 className="font-heading font-light text-obsidian text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] mb-6">
                        End-to-end service,<br />
                        <span className="italic font-normal text-basalt">from concept to install</span>
                    </h1>
                    <p className="text-basalt text-lg leading-relaxed max-w-xl">
                        Beyond supplying premium furniture and décor, Baraka Solutions offers a complete service — ensuring your project is executed flawlessly from the first sketch to the final installation.
                    </p>
                </motion.div>
            </section>

            {/* Services Grid */}
            <section className="pb-24 md:pb-32 max-w-[1400px] mx-auto px-6 lg:px-12">
                <div className="grid md:grid-cols-2 gap-6">
                    {services.map((s, i) => (
                        <motion.div
                            key={s.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: i * 0.1 }}
                            className="group bg-white border border-border p-10 hover:border-obsidian/30 transition-colors duration-300"
                        >
                            <div className="w-14 h-14 bg-obsidian text-silk flex items-center justify-center mb-8 group-hover:bg-[#D4AF37] transition-colors duration-300">
                                <s.icon className="w-6 h-6" strokeWidth={1.5} />
                            </div>
                            <h3 className="font-heading font-light text-2xl text-obsidian mb-4">{s.title}</h3>
                            <p className="text-basalt leading-relaxed text-sm">{s.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Process */}
            <section className="bg-obsidian py-24 md:py-32">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <p className="text-[11px] uppercase tracking-[0.35em] text-[#D4AF37] font-semibold mb-4">How It Works</p>
                        <h2 className="font-heading font-light text-silk text-[clamp(2rem,4vw,3.5rem)] leading-tight">
                            Our process
                        </h2>
                    </motion.div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {process.map((p, i) => (
                            <motion.div
                                key={p.step}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.12 }}
                            >
                                <p className="font-mono-price text-[#D4AF37] text-4xl mb-4">{p.step}</p>
                                <h4 className="font-heading text-silk text-xl mb-3">{p.title}</h4>
                                <p className="text-silk/60 text-sm leading-relaxed">{p.body}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 md:py-32 max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-2xl mx-auto"
                >
                    <h2 className="font-heading font-light text-obsidian text-[clamp(2rem,4vw,3rem)] mb-6">
                        Have a project in mind?
                    </h2>
                    <p className="text-basalt mb-10 leading-relaxed">
                        Whether it's a unique architectural feature or a full interior fit-out, our team is ready to bring it to life — with precision and care.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <a
                            href="/contact"
                            className="inline-flex items-center gap-3 h-14 px-8 bg-obsidian text-silk text-[13px] uppercase tracking-[0.18em] hover:bg-obsidian/80 transition-colors"
                        >
                            Discuss Your Project <ArrowRight className="w-4 h-4" strokeWidth={1.6} />
                        </a>
                        <a
                            href="https://wa.me/254797624196"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-3 h-14 px-8 border border-obsidian text-obsidian text-[13px] uppercase tracking-[0.18em] hover:bg-obsidian/5 transition-colors"
                        >
                            <MessageCircle className="w-4 h-4" strokeWidth={1.6} /> WhatsApp Us
                        </a>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}

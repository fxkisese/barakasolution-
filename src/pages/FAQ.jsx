import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, MessageCircle } from "lucide-react";

const faqs = [
    {
        question: "How long does a custom order take?",
        answer: "Custom orders typically take 3 to 7 working days depending on complexity, materials, and finishing required. We'll give you an exact timeline during your consultation.",
    },
    {
        question: "Do you offer delivery and installation?",
        answer: "Yes — we offer safe delivery and professional installation across Nairobi and surrounding areas. For major pieces like wardrobes, shower cubicles, or large mirrors, our expert team ensures secure and precise fitting.",
    },
    {
        question: "What are your payment terms?",
        answer: "We require a 60% deposit before commencing any custom work, with the remaining 40% payable upon delivery or completion. We accept M-PESA, bank transfers, and cash.",
    },
    {
        question: "Do your products come with a warranty?",
        answer: "Yes. We offer a 1-year warranty on installation workmanship and LED lighting components for our smart mirrors. Glass breakage after safe installation is not covered under warranty.",
    },
    {
        question: "Can I visit your showroom?",
        answer: "Absolutely. Visit our main branch at Kyumbi or our pickup point at Whitehouse Footbridge. Our team is always ready to guide you through physical samples and product catalogs.",
    },
    {
        question: "Do you handle large commercial projects?",
        answer: "Yes, we regularly handle commercial contracts — office glass partitions, storefronts, gym mirror walls, and full interior fit-outs. Contact us to discuss your commercial requirements.",
    },
    {
        question: "How do I place an order?",
        answer: "You can order directly through our online shop, visit one of our branches in person, or reach out via WhatsApp or the contact form and we'll guide you through the process.",
    },
];

function FAQItem({ faq, index }) {
    const [open, setOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06 }}
            className="border-b border-border last:border-0"
        >
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between py-6 text-left gap-4 group"
            >
                <span className="font-heading font-light text-lg text-obsidian group-hover:text-[#D4AF37] transition-colors duration-300">
                    {faq.question}
                </span>
                <span className="w-7 h-7 flex items-center justify-center border border-obsidian/20 shrink-0 group-hover:border-[#D4AF37] group-hover:text-[#D4AF37] transition-colors duration-300">
                    {open
                        ? <Minus className="w-3.5 h-3.5" strokeWidth={2} />
                        : <Plus className="w-3.5 h-3.5" strokeWidth={2} />
                    }
                </span>
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <p className="text-basalt leading-relaxed text-sm pb-6 max-w-2xl">
                            {faq.answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function FAQ() {
    return (
        <div className="bg-silk">
            <section className="py-24 md:py-36 max-w-[1400px] mx-auto px-6 lg:px-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-16 max-w-2xl"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-8 h-px bg-[#D4AF37]" />
                        <p className="text-[11px] uppercase tracking-[0.35em] text-[#D4AF37] font-semibold">FAQ</p>
                    </div>
                    <h1 className="font-heading font-light text-obsidian text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] mb-5">
                        Frequently asked<br />
                        <span className="italic font-normal text-basalt">questions</span>
                    </h1>
                    <p className="text-basalt leading-relaxed text-lg">
                        Find answers to common questions about our products, ordering, delivery, and after-sales support.
                    </p>
                </motion.div>

                {/* Accordion */}
                <div className="max-w-3xl">
                    {faqs.map((faq, i) => (
                        <FAQItem key={i} faq={faq} index={i} />
                    ))}
                </div>

                {/* Still have questions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 max-w-xl"
                >
                    <div className="border border-border p-10">
                        <h3 className="font-heading font-light text-2xl text-obsidian mb-3">Still have questions?</h3>
                        <p className="text-basalt text-sm leading-relaxed mb-8">
                            Our team is always happy to help. Reach out via WhatsApp for the fastest response, or send us a message and we'll get back to you promptly.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <a
                                href="https://wa.me/254797624196"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 h-12 px-6 bg-obsidian text-silk text-[12px] uppercase tracking-[0.18em] hover:bg-obsidian/80 transition-colors"
                            >
                                <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                                Chat on WhatsApp
                            </a>
                            <a
                                href="/contact"
                                className="inline-flex items-center gap-2 h-12 px-6 border border-obsidian text-obsidian text-[12px] uppercase tracking-[0.18em] hover:bg-obsidian/5 transition-colors"
                            >
                                Contact Form
                            </a>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}

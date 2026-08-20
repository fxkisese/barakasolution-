import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import ContactForm from "@/components/site/ContactForm";

const contactDetails = [
    {
        icon: Phone,
        label: "Phone & WhatsApp",
        lines: ["+254 797 624 196"],
    },
    {
        icon: Mail,
        label: "Email",
        lines: ["info@barakasolutions.com"],
    },
    {
        icon: Clock,
        label: "Business Hours",
        lines: ["Mon – Sat: 8:00 AM – 6:00 PM", "Sunday: Closed"],
    },
];

const branches = [
    { name: "Whitehouse Footbridge", desc: "Main showroom and full consultation services.", href: "#" },
    { name: "Kyumbi Branch", desc: "Quick orders and convenient pickups.", href: "#" },
];

export default function Contact() {
    return (
        <div className="bg-silk">
            {/* Header */}
            <section className="py-24 md:py-32 max-w-[1400px] mx-auto px-6 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-2xl mb-16"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-8 h-px bg-[#D4AF37]" />
                        <p className="text-[11px] uppercase tracking-[0.35em] text-[#D4AF37] font-semibold">Get in Touch</p>
                    </div>
                    <h1 className="font-heading font-light text-obsidian text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] mb-5">
                        Let's talk about<br />
                        <span className="italic font-normal text-basalt">your project</span>
                    </h1>
                    <p className="text-basalt leading-relaxed text-lg">
                        Have a question, need a quote, or want to discuss a custom order? Reach out — we respond quickly and love talking design.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left: Info + Branches */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="lg:col-span-1 flex flex-col gap-6"
                    >
                        {/* Contact Details */}
                        <div className="bg-white border border-border p-8 space-y-8">
                            <h3 className="font-heading font-light text-xl text-obsidian">Contact Information</h3>
                            {contactDetails.map((item) => (
                                <div key={item.label} className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-obsidian flex items-center justify-center shrink-0">
                                        <item.icon className="w-4 h-4 text-silk" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p className="text-[11px] uppercase tracking-[0.2em] text-basalt mb-1">{item.label}</p>
                                        {item.lines.map((line) => (
                                            <p key={line} className="text-obsidian text-sm font-medium">{line}</p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Branches */}
                        <div className="bg-obsidian p-8">
                            <h3 className="font-heading font-light text-silk text-xl mb-6">Our Branches</h3>
                            <div className="space-y-4">
                                {branches.map((b) => (
                                    <a
                                        key={b.name}
                                        href={b.href}
                                        className="flex items-start gap-4 p-4 border border-silk/10 hover:border-silk/40 hover:bg-silk/5 transition-all group cursor-pointer text-left w-full"
                                    >
                                        <MapPin className="w-5 h-5 text-[#D4AF37] mt-0.5 shrink-0 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                                        <div>
                                            <p className="text-silk text-sm font-medium group-hover:text-white transition-colors">{b.name}</p>
                                            <p className="text-silk/50 text-xs mt-1 group-hover:text-silk/70 transition-colors">{b.desc}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                            <a
                                href="https://wa.me/254797624196"
                                target="_blank"
                                rel="noreferrer"
                                className="mt-8 w-full flex items-center justify-center gap-2 h-12 border border-silk/20 text-silk text-[12px] uppercase tracking-[0.18em] hover:bg-silk/10 transition-colors"
                            >
                                <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                                Chat on WhatsApp
                            </a>
                        </div>
                    </motion.div>

                    {/* Right: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white border border-border p-8 md:p-12 h-full">
                            <h3 className="font-heading font-light text-2xl text-obsidian mb-8">Send Us a Message</h3>
                            <ContactForm />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Map */}
            <section className="h-[420px] w-full">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d249.30022267662716!2d36.8858403!3d-1.2922645!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f138feb2484ab%3A0x55ec80639e353241!2sLeader%20Glaziers%20and%20Hardware!5e0!3m2!1sen!2ske!4v1786226108284!5m2!1sen!2ske"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Baraka Solutions location"
                />
            </section>
        </div>
    );
}

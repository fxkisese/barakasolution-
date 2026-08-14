import { motion } from "framer-motion";
import { Wrench, Truck, ShieldCheck, PenTool } from "lucide-react";

export default function Services() {
    const services = [
        {
            icon: <PenTool className="w-8 h-8" />,
            title: "Custom Glass Solutions",
            description: "From custom-cut mirrors to bespoke glass coffee tables, we bring your unique vision to life. Our precision cutting and polishing ensure a flawless finish for any custom requirement."
        },
        {
            icon: <Wrench className="w-8 h-8" />,
            title: "Professional Installation",
            description: "Our expert team provides safe and precise installation for all our products, including frameless shower cubicles, office partitions, and large wall mirrors, ensuring longevity and safety."
        },
        {
            icon: <Truck className="w-8 h-8" />,
            title: "Safe Delivery",
            description: "We understand the fragility of glass. Our specialized delivery team ensures your order reaches you in perfect condition, covering Nairobi, Kyumbi, and surrounding areas."
        },
        {
            icon: <ShieldCheck className="w-8 h-8" />,
            title: "Consultation & Measurement",
            description: "Not sure what fits? We offer on-site consultation and accurate measurement services to guarantee that your glass partitions or mirrors fit perfectly into your space."
        }
    ];

    return (
        <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-serif text-slate-900 mb-6"
                >
                    Our Services
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-slate-600 max-w-2xl mx-auto"
                >
                    Beyond supplying premium glass and mirrors, Baraka Solutions offers end-to-end services to ensure your project is completed flawlessly from concept to installation.
                </motion.p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-20">
                {services.map((service, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        key={index}
                        className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                    >
                        <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-6">
                            {service.icon}
                        </div>
                        <h3 className="text-2xl font-medium text-slate-900 mb-4">{service.title}</h3>
                        <p className="text-slate-600 leading-relaxed">
                            {service.description}
                        </p>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-slate-50 rounded-3xl p-8 md:p-12 text-center"
            >
                <h2 className="text-3xl font-serif text-slate-900 mb-4">Have a Custom Project in Mind?</h2>
                <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                    Whether it's a unique architectural feature or a specific mirror design for your boutique, our team is ready to help you execute it perfectly.
                </p>
                <a 
                    href="/contact"
                    className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors font-medium"
                >
                    Discuss Your Project
                </a>
            </motion.div>
        </div>
    );
}

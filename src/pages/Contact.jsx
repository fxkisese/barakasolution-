import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import ContactForm from "@/components/site/ContactForm";

export default function Contact() {
    return (
        <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6">Contact Us</h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Have a question, need a quote, or want to discuss a custom project? Get in touch with our team today.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-12 mb-20">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-1 space-y-8"
                >
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="text-xl font-medium text-slate-900 mb-6">Contact Information</h3>
                        
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <Phone className="w-6 h-6 text-slate-900 mt-1 mr-4" />
                                <div>
                                    <p className="font-medium text-slate-900">Phone & WhatsApp</p>
                                    <p className="text-slate-600 mt-1">+254 700 000 000</p>
                                    <p className="text-slate-600">+254 711 111 111</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <Mail className="w-6 h-6 text-slate-900 mt-1 mr-4" />
                                <div>
                                    <p className="font-medium text-slate-900">Email</p>
                                    <p className="text-slate-600 mt-1">info@luxecraftfurniture.com</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Clock className="w-6 h-6 text-slate-900 mt-1 mr-4" />
                                <div>
                                    <p className="font-medium text-slate-900">Business Hours</p>
                                    <p className="text-slate-600 mt-1">Mon - Sat: 8:00 AM - 6:00 PM</p>
                                    <p className="text-slate-600">Sunday: Closed</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 text-white p-8 rounded-2xl">
                        <h3 className="text-xl font-medium mb-6">Our Branches</h3>
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <MapPin className="w-6 h-6 text-slate-300 mt-1 mr-4" />
                                <div>
                                    <p className="font-medium">Kyumbi Branch</p>
                                    <p className="text-slate-400 mt-1 text-sm">Main showroom and consultation center.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <MapPin className="w-6 h-6 text-slate-300 mt-1 mr-4" />
                                <div>
                                    <p className="font-medium">Whitehouse Footbridge</p>
                                    <p className="text-slate-400 mt-1 text-sm">Quick orders and pickups.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2"
                >
                    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100 h-full">
                        <h3 className="text-2xl font-serif text-slate-900 mb-6">Send us a Message</h3>
                        <ContactForm />
                    </div>
                </motion.div>
            </div>

            {/* Map Section */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl overflow-hidden shadow-sm border border-slate-100 bg-slate-100 h-[400px] relative flex items-center justify-center"
            >
                {/* Placeholder for actual Google Map iframe */}
                <div className="text-center p-6">
                    <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">Interactive Map Integration Here</p>
                    <p className="text-sm text-slate-500 mt-2">(Replace with actual Google Maps embed iframe pointing to Kyumbi/Whitehouse locations)</p>
                </div>
            </motion.div>
        </div>
    );
}
